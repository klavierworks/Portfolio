import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './TheRear.module.css';

const Ff8 = lazy(() => import('ff8').then(({ Ff8 }) => ({ default: Ff8 })));

const ASSET_BASE_URL = '/data/';
const START_FIELD = 'eccway12';

type TheRearProps = {
  overlayId: string;
};

const waitForPageLoad = () =>
  new Promise<void>((resolve) => {
    if (document.readyState === 'complete') {
      resolve();
      return;
    }
    window.addEventListener('load', () => resolve(), { once: true });
  });

const fadeOutOverlay = async (overlay: HTMLElement) => {
  overlay.classList.add('isFading');
  const transitions = overlay
    .getAnimations({ subtree: true })
    .filter((animation) => animation instanceof CSSTransition);
  await Promise.all(transitions.map((transition) => transition.finished));
  overlay.classList.add('isHidden');
};

const TheRear = ({ overlayId }: TheRearProps) => {
  const [overlay, setOverlay] = useState<HTMLElement | null>(null);
  const [hasPageLoaded, setHasPageLoaded] = useState(false);
  const [hasGameLoaded, setHasGameLoaded] = useState(false);
  const [shouldEnter, setShouldEnter] = useState(false);

  useEffect(() => {
    setOverlay(document.getElementById(overlayId));
  }, [overlayId]);

  useEffect(() => {
    waitForPageLoad().then(() => setHasPageLoaded(true));
  }, []);

  const handleReady = useCallback(() => setHasGameLoaded(true), []);

  const handleClose = async () => {
    if (!overlay) {
      return;
    }
    await fadeOutOverlay(overlay);
    setShouldEnter(true);
  };

  const status = hasGameLoaded ? (
    <button className={styles.close} type="button" onClick={handleClose}>
      Close
    </button>
  ) : (
    <span>Loading</span>
  );

  return (
    <>
      <div className={styles.rear}>
        {hasPageLoaded && (
          <Suspense fallback={null}>
            <Ff8
              assetBaseUrl={ASSET_BASE_URL}
              onReady={handleReady}
              shouldEnter={shouldEnter}
              startField={START_FIELD}
            />
          </Suspense>
        )}
      </div>
      {overlay && createPortal(<div className={styles.status}>{status}</div>, overlay)}
    </>
  );
};

export default TheRear;
