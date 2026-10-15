export const logPageView = () =>
  fetch('/stats', {
    method: 'POST',
    body: JSON.stringify({
      name: 'pageview',
      url: window.location.href,
      referrer: document.referrer || null,
      screen_width: window.innerWidth,
    }),
  });

export const logClicks = () =>
  document.addEventListener('click', (event) => {
    const anchor = (event.target as HTMLElement)?.closest('a') as HTMLAnchorElement;

    if (!anchor) {
      return;
    }
    const url = anchor.getAttribute('href');

    if (!url) {
      return;
    }

    // Is URL external
    if (url.startsWith(window.location.origin)) {
      return;
    }

    fetch('/stats', {
      method: 'POST',
      body: JSON.stringify({
        name: 'outbound_link_click',
        url: window.location.href,
        referrer: document.referrer || null,
        screen_width: window.innerWidth,
        props: {
          link_url: url
        }
      }),
    });
  })
