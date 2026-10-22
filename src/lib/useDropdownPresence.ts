import * as React from 'react';
import { waitForCssMotion } from './waitForCssMotion';

type TransitionStatus = 'starting' | 'ending' | undefined;

type DropdownPresence = {
  isMounted: boolean;
  isClosing: boolean;
  transitionStatus: TransitionStatus;
  surfaceRef: React.RefObject<HTMLDivElement | null>;
};

/**
 * Coordina el ciclo de montaje de una superficie flotante con su transición CSS.
 * El estado abierto sigue siendo la fuente de verdad; el montaje solo persiste
 * mientras el navegador informa que la salida continúa ejecutándose.
 */
export const useDropdownPresence = (isOpen: boolean): DropdownPresence => {
  const [isMounted, setIsMounted] = React.useState(isOpen);
  const [transitionStatus, setTransitionStatus] = React.useState<TransitionStatus>(
    isOpen ? 'starting' : undefined,
  );
  const surfaceRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    let cancelled = false;

    if (isOpen) {
      if (!isMounted) {
        const frameId = window.requestAnimationFrame(() => {
          if (cancelled) return;
          setIsMounted(true);
          setTransitionStatus('starting');
        });

        return () => {
          cancelled = true;
          window.cancelAnimationFrame(frameId);
        };
      }

      const frameId = window.requestAnimationFrame(() => {
        if (!cancelled) setTransitionStatus(undefined);
      });

      return () => {
        cancelled = true;
        window.cancelAnimationFrame(frameId);
      };
    }

    if (!isMounted) return undefined;

    return waitForCssMotion(surfaceRef.current, () => {
      setIsMounted(false);
      setTransitionStatus(undefined);
    });
  }, [isOpen, isMounted]);

  return {
    isMounted,
    isClosing: isMounted && !isOpen,
    transitionStatus,
    surfaceRef,
  };
};
