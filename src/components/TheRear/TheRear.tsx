import { lazy, Suspense, useCallback, useEffect, useState } from 'react';

const FF8World = lazy(() => import('ff8').then(({ FF8World }) => ({ default: FF8World })));

const START_FIELD = 'ffbrdg1';
const OVERLAY_FADE_MILLISECONDS = 600;

type TheRearProps = {
  assetBaseUrl: string;
  closeLink: HTMLElement;
  overlay: HTMLElement;
  returnControl: HTMLElement;
  returnLink: HTMLElement;
  status: HTMLElement;
};

const fadeOverlayChildren = (overlay: HTMLElement, keyframes: Keyframe[]) =>
  Promise.all(
    [...overlay.children].map(
      (child) =>
        child.animate(keyframes, { duration: OVERLAY_FADE_MILLISECONDS, easing: 'ease-out', fill: 'forwards' })
          .finished,
    ),
  );

const fadeOutOverlay = async (overlay: HTMLElement) => {
  const animations = await fadeOverlayChildren(overlay, [{ opacity: 1 }, { opacity: 0 }]);
  overlay.hidden = true;
  animations.forEach((animation) => animation.cancel());
};

const fadeInOverlay = async (overlay: HTMLElement) => {
  overlay.hidden = false;
  const animations = await fadeOverlayChildren(overlay, [{ opacity: 0 }, { opacity: 1 }]);
  animations.forEach((animation) => animation.cancel());
};

const TheRear = ({ assetBaseUrl, closeLink, overlay, returnControl, returnLink, status }: TheRearProps) => {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleReady = useCallback(() => {
    status.dataset.state = 'ready';
    setHasLoaded(true);
  }, [status]);

  const handleExited = useCallback(async () => {
    await fadeInOverlay(overlay);
    setIsTransitioning(false);
  }, [overlay]);

  useEffect(() => {
    returnControl.hidden = !isActive || isTransitioning;
  }, [isActive, isTransitioning, returnControl]);

  useEffect(() => {
    if (!hasLoaded || isActive || isTransitioning) {
      return;
    }
    const handleClose = async (event: MouseEvent) => {
      event.preventDefault();
      setIsTransitioning(true);
      await fadeOutOverlay(overlay);
      setIsActive(true);
      setIsTransitioning(false);
    };
    closeLink.addEventListener('click', handleClose, { once: true });
    return () => closeLink.removeEventListener('click', handleClose);
  }, [closeLink, hasLoaded, isActive, isTransitioning, overlay]);

  useEffect(() => {
    if (!isActive || isTransitioning) {
      return;
    }
    const handleReturn = (event: MouseEvent) => {
      event.preventDefault();
      setIsTransitioning(true);
      setIsActive(false);
    };
    returnLink.addEventListener('click', handleReturn, { once: true });
    return () => returnLink.removeEventListener('click', handleReturn);
  }, [isActive, isTransitioning, returnLink]);

  return (
    <Suspense fallback={null}>
      <FF8World
        assetBaseUrl={assetBaseUrl}
        hasIntroTransition
        isActive={isActive}
        onExited={handleExited}
        onReady={handleReady}
        shouldSyncUrl
        initialParty={[0, 1, 3]}
        initialProgress={4019}
        startField={START_FIELD}
      />
    </Suspense>
  );
};

export default TheRear;
