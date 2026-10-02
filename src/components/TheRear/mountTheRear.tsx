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
  createRoot(rear).render(<TheRear {...props} />);
};
