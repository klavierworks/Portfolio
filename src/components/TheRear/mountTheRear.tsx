import { createRoot } from 'react-dom/client';
import TheRear from './TheRear';

type TheRearElements = {
  closeLink: HTMLElement;
  overlay: HTMLElement;
  rear: HTMLElement;
  returnControl: HTMLElement;
  returnLink: HTMLElement;
  status: HTMLElement;
};

export const mountTheRear = ({ rear, ...props }: TheRearElements) => {
  // Set per site at build time, as client code can't read SITE_VARIANT
  const assetBaseUrl = rear.dataset.assetBaseUrl;
  if (!assetBaseUrl) {
    throw new Error('TheRear needs data-asset-base-url on [data-rear]');
  }
  createRoot(rear).render(<TheRear assetBaseUrl={assetBaseUrl} {...props} />);
};
