const sites = {
  andrewthomashill: {
    title: 'Andrew Thomas Hill - Technologist',
    intro: ['This is the website of Andrew Hill,', 'Technology Lead for Random Studio.'],
    url: 'https://andrewthomashill.co.uk/',
    assetBaseUrl: 'https://assets.andrewthomashill.co.uk/data/',
  },
  klavierworks: {
    title: 'Klavierworks - Creative Technology',
    intro: ['This is the website of Klavierworks,', 'a creative technology consultancy.'],
    url: 'https://klavier.works/',
    assetBaseUrl: 'https://assets.klavier.works/data/',
  },
};

type SiteKey = keyof typeof sites;

const key = (import.meta.env.SITE_VARIANT ?? 'andrewthomashill') as SiteKey;

if (!(key in sites)) {
  throw new Error(`Unknown SITE_VARIANT "${key}". Expected one of: ${Object.keys(sites).join(', ')}`);
}

export default sites[key];
