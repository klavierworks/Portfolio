import { lazy, Suspense, useCallback, useEffect, useState } from 'react';

const Ff8 = lazy(() => import('ff8').then(({ Ff8 }) => ({ default: Ff8 })));

const ASSET_BASE_URL = 'https://pub-39d91795b685449d997592b64671328c.r2.dev/data/';
const START_FIELD = 'eccway12';
const OVERLAY_FADE_MILLISECONDS = 600;

type TheRearProps = {
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

const TheRear = ({ closeLink, overlay, returnControl, returnLink, status }: TheRearProps) => {
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
      <Ff8
        assetBaseUrl={ASSET_BASE_URL}
        hasIntroTransition
        isActive={isActive}
        onExited={handleExited}
        onReady={handleReady}
        startField={START_FIELD}
      />
    </Suspense>
  );
};

export default TheRear;
