import { handleStats } from './stats';

// Bindings declared in each site's wrangler.<site>.jsonc
interface Env {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
  PLAUSIBLE_DOMAIN: string;
}

// Static files from the Astro build are served before this runs, so only paths
// with no matching file reach it
export default {
  fetch: async (request: Request, env: Env) => {
    if (new URL(request.url).pathname === '/stats') {
      return handleStats(request, env.PLAUSIBLE_DOMAIN);
    }

    return env.ASSETS.fetch(request);
  },
};
