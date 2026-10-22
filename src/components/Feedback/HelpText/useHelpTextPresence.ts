import * as React from 'react';
import { waitForCssMotion } from '../../../lib/waitForCssMotion';
import type { HelpTextState } from './HelpText';

type HelpTextSnapshot = {
  children: React.ReactNode;
  state: HelpTextState;
  hasIcon: boolean;
};

export interface UseHelpTextPresenceOptions {
  /** Whether the current help text belongs to the visible state. */
  open: boolean;
  /** Current help text content. */
  children: React.ReactNode;
  /** Current semantic state for the help text. */
  state: HelpTextState;
  /** Whether the current help text includes its state icon. */
  hasIcon?: boolean;
}

export interface HelpTextPresence {
  /** Content to render for the current or outgoing visual cycle. */
  children: React.ReactNode;
  /** State to render for the current or outgoing visual cycle. */
  state: HelpTextState;
  /** Icon visibility for the current or outgoing visual cycle. */
  hasIcon: boolean;
  /** True while content should remain mounted for a closing transition. */
  isMounted: boolean;
  /** Callback ref for the element carrying `ds-disclosure-text`. */
  disclosureRef: (element: HTMLDivElement | null) => void;
}

/**
 * Keeps a help message mounted until its finite CSS disclosure transition
 * finishes. The current prop owns the open state and semantic state; the
 * snapshot is used only while that state is closing.
 */
export const useHelpTextPresence = ({
  open,
  children,
  state,
  hasIcon = true,
}: UseHelpTextPresenceOptions): HelpTextPresence => {
  const disclosureElementRef = React.useRef<HTMLDivElement>(null);
  const wasOpenRef = React.useRef(open);
  const cancelWaitRef = React.useRef<(() => void) | undefined>(undefined);
  const [snapshot, setSnapshot] = React.useState<HelpTextSnapshot>({ children, state, hasIcon });
  const [previousOpen, setPreviousOpen] = React.useState(open);
  const [isExiting, setIsExiting] = React.useState(false);

  if (open) {
    if (!previousOpen) {
      setPreviousOpen(true);
      setIsExiting(false);
    }
    if (snapshot.children !== children || snapshot.state !== state || snapshot.hasIcon !== hasIcon) {
      setSnapshot({ children, state, hasIcon });
    }
  } else if (previousOpen) {
    setPreviousOpen(false);
    setIsExiting(true);
  }

  const disclosureRef = React.useCallback((element: HTMLDivElement | null) => {
    disclosureElementRef.current = element;
  }, []);

  React.useLayoutEffect(() => {
    cancelWaitRef.current?.();
    cancelWaitRef.current = undefined;

    if (open) {
      wasOpenRef.current = true;
      return undefined;
    }

    if (!wasOpenRef.current) return undefined;

    wasOpenRef.current = false;

    const cancelWait = waitForCssMotion(disclosureElementRef.current, () => {
      setIsExiting(false);
      cancelWaitRef.current = undefined;
    });
    cancelWaitRef.current = cancelWait;

    return () => {
      if (cancelWaitRef.current === cancelWait) {
        cancelWait();
        cancelWaitRef.current = undefined;
      }
    };
  }, [open]);

  const isMounted = open || isExiting;
  const renderedSnapshot = open ? { children, state, hasIcon } : snapshot;

  return {
    children: renderedSnapshot.children,
    state: renderedSnapshot.state,
    hasIcon: renderedSnapshot.hasIcon,
    isMounted,
    disclosureRef,
  };
};
