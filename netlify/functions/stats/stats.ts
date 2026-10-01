import { type Handler } from '@netlify/functions'

// Plausible site for each host this function is deployed behind
const PLAUSIBLE_DOMAINS: Record<string, string> = {
  'andrewthomashill.co.uk': 'andrewthomashill.co.uk',
  'www.andrewthomashill.co.uk': 'andrewthomashill.co.uk',
  'klavier.works': 'klavier.works',
  'www.klavier.works': 'klavier.works',
};

// Netlify serverless function for proxying events to Plausible
export const handler: Handler = async (event) => {
  // Extract the request method and body
  const method = event.httpMethod;

  // Only allow POST requests
  if (method !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  // Parse the incoming request body
  let requestBody: PlausibleEvent;
  try {
    requestBody = JSON.parse(event.body ?? '');
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON body' }),
    };
  }

  // Validate the required fields for Plausible event API
  const { name, url, referrer, props } = requestBody;

  if (!name || !url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing required fields: name, url' }),
    };
  }

  const domain = PLAUSIBLE_DOMAINS[event.headers.host ?? ''];

  if (!domain) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Unknown host' }),
    };
  }

  // Construct the payload for Plausible
  const plausiblePayload = {
    domain,
    name,
    url,
    referrer,
    props,
  };

  const userAgent = event.headers['user-agent'];
  const xForwardedFor = event.headers['x-forwarded-for'];

  try {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('User-Agent', userAgent ?? 'unknown');
    headers.append('X-Forwarded-For', xForwardedFor ?? 'unknown');

    // Send the request to Plausible API
    const response = await fetch('https://plausible.io/api/event', {
      method: 'POST',
      headers,
      body: JSON.stringify(plausiblePayload),
    });

    // If the response is not successful, return the error
    if (!response.ok) {
      console.log('Failed')
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Failed to send event to Plausible' }),
      };
    }

    // Return a successful response
    console.log('Success')
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Event successfully sent to Plausible' }),
    };
  } catch (error) {
    console.error('error', error)

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
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
