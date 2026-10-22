import * as React from 'react';
import { Icon } from '../DataDisplay/Icon/Icon';
import { waitForCssMotion } from '../../lib/waitForCssMotion';

type IconSwapSlot = 'current' | 'previous';

type IconIdentity =
  | { kind: 'value'; value: unknown }
  | {
      kind: 'element';
      type: React.ReactElement['type'];
      key: React.Key | null;
      name?: unknown;
    };

type IconSwapLayer = {
  id: number;
  identity: IconIdentity;
  value: React.ReactNode;
};

type IconSwapState = {
  current: IconSwapLayer;
  previous: IconSwapLayer | null;
  cycleId: number;
};

interface IconSwapProps {
  value: React.ReactNode;
  renderIcon: (value: React.ReactNode, slot: IconSwapSlot) => React.ReactElement | null;
  style?: React.CSSProperties;
}

function getIdentity(value: React.ReactNode): IconIdentity {
  if (!React.isValidElement(value)) return { kind: 'value', value };

  return {
    kind: 'element',
    type: value.type,
    key: value.key,
    ...(value.type === Icon
      ? { name: (value.props as { name?: unknown }).name }
      : {}),
  };
}

function sameIdentity(left: IconIdentity, right: IconIdentity) {
  if (left.kind !== right.kind) return false;
  if (left.kind === 'value' && right.kind === 'value') return Object.is(left.value, right.value);
  if (left.kind !== 'element' || right.kind !== 'element') return false;
  return Object.is(left.type, right.type)
    && left.key === right.key
    && (left.type !== Icon || Object.is(left.name, right.name));
}

function isOpacityTransition(animation: Animation) {
  return animation instanceof CSSTransition && animation.transitionProperty === 'opacity';
}

/**
 * Private crossfade primitive shared by the two toggle button contracts.
 * Identity changes create at most one outgoing layer; same-identity prop
 * changes update the current layer in place.
 */
export function IconSwap({ value, renderIcon, style }: IconSwapProps) {
  const valueIdentity = getIdentity(value);
  const [state, setState] = React.useState<IconSwapState>(() => ({
    current: { id: 0, identity: valueIdentity, value },
    previous: null,
    cycleId: 0,
  }));
  const rootRef = React.useRef<HTMLSpanElement>(null);

  // Adjust during render so an identity change is committed as one visual
  // update and same-identity props never start a swap.
  if (!sameIdentity(state.current.identity, valueIdentity)) {
    const reusesOutgoing = state.previous !== null && sameIdentity(state.previous.identity, valueIdentity);
    const cycleId = state.cycleId + 1;
    setState({
      current: reusesOutgoing
        ? { ...state.previous!, value }
        : { id: cycleId, identity: valueIdentity, value },
      previous: state.current,
      cycleId,
    });
  } else if (state.current.value !== value) {
    setState({ ...state, current: { ...state.current, value } });
  }

  React.useEffect(() => {
    const previous = state.previous;
    if (!previous) return undefined;

    const cycleId = state.cycleId;
    const outgoing = rootRef.current?.querySelector<Element>(':scope > [data-icon="previous"]') ?? null;
    return waitForCssMotion(outgoing, () => {
      setState(current => (
        current.cycleId === cycleId
        && current.previous !== null
        && sameIdentity(current.previous.identity, previous.identity)
          ? { ...current, previous: null }
          : current
      ));
    }, isOpacityTransition);
  }, [state.cycleId, state.previous]);

  const layers = state.previous ? [state.previous, state.current] : [state.current];

  return (
    <span ref={rootRef} className="t-icon-swap" data-state={state.previous ? 'swap' : 'current'} style={style} aria-hidden="true">
      {layers.map((layer, index) => {
        const slot: IconSwapSlot = index === layers.length - 1 ? 'current' : 'previous';
        const rendered = renderIcon(layer.value, slot);
        return rendered
          ? (
              <span key={layer.id} className="t-icon" data-icon={slot} inert={slot === 'previous' ? true : undefined}>
                {rendered}
              </span>
            )
          : null;
      })}
    </span>
  );
}
