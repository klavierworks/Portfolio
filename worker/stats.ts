const json = (status: number, body: Record<string, string>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

// Proxies events to Plausible, recorded against the given Plausible site
export const handleStats = async (request: Request, domain: string) => {
  // Only allow POST requests
  if (request.method !== 'POST') {
    return json(405, { error: 'Method Not Allowed' });
  }

  // Parse the incoming request body
  let requestBody: PlausibleEvent;
  try {
    requestBody = await request.json();
  } catch (error) {
    return json(400, { error: 'Invalid JSON body' });
  }

  // Validate the required fields for Plausible event API
  const { name, url, referrer, props } = requestBody;

  if (!name || !url) {
    return json(400, { error: 'Missing required fields: name, url' });
  }

  // Construct the payload for Plausible
  const plausiblePayload = {
    domain,
    name,
    url,
    referrer,
    props,
  };

  const userAgent = request.headers.get('user-agent');
  // Cloudflare puts the visitor's IP in CF-Connecting-IP
  const clientIp = request.headers.get('cf-connecting-ip');

  try {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('User-Agent', userAgent ?? 'unknown');
    headers.append('X-Forwarded-For', clientIp ?? 'unknown');

    // Send the request to Plausible API
    const response = await fetch('https://plausible.io/api/event', {
      method: 'POST',
      headers,
      body: JSON.stringify(plausiblePayload),
    });

    // If the response is not successful, return the error
    if (!response.ok) {
      console.log('Failed')
      return json(response.status, { error: 'Failed to send event to Plausible' });
    }

    // Return a successful response
    console.log('Success')
    return json(200, { message: 'Event successfully sent to Plausible' });
  } catch (error) {
    console.error('error', error)

    return json(500, { error: 'Internal Server Error' });
  }
};

// Interface for Plausible Event API data
interface PlausibleEvent {
  name: string;
  url: string;
  referrer?: string;
  screen_width?: number;
  props?: Record<string, unknown>;
}
