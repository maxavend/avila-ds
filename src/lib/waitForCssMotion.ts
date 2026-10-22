/**
 * Waits for this element's finite CSS motion, without owning component state.
 * Call the returned cancellation function whenever a visual cycle is replaced.
 */
export function waitForCssMotion(
  element: Element | null,
  onComplete: () => void,
  accepts: (animation: Animation) => boolean = () => true,
): () => void {
  let cancelled = false;
  let completed = false;
  let frame: number | undefined;

  const complete = () => {
    if (cancelled || completed) return;
    completed = true;
    onComplete();
  };

  const inspect = () => {
    if (cancelled || completed) return;
    if (!element?.isConnected || typeof element.getAnimations !== 'function') {
      complete();
      return;
    }

    const animations = element.getAnimations().filter((animation) => {
      const isCss = animation instanceof CSSAnimation || animation instanceof CSSTransition;
      const endTime = animation.effect?.getComputedTiming().endTime;
      return isCss
        && animation.playState !== 'finished'
        && animation.playState !== 'idle'
        && animation.playState !== 'paused'
        && typeof endTime === 'number'
        && Number.isFinite(endTime)
        && accepts(animation);
    });

    if (animations.length === 0) {
      complete();
      return;
    }

    // Cancellation may replace an animation. Re-read the same element after all
    // current effects settle, so a surviving/replacement transition can finish.
    void Promise.allSettled(animations.map((animation) => animation.finished)).then(() => {
      if (!cancelled) inspect();
    });
  };

  // Query after React has committed the outgoing attributes and CSS can resolve.
  frame = window.requestAnimationFrame(inspect);

  return () => {
    cancelled = true;
    if (frame !== undefined) window.cancelAnimationFrame(frame);
    frame = undefined;
  };
}
