import { getToken } from './users-service';

// configures and executes fetch requests

export default async function sendRequest(url, method = 'GET', payload = null) {
  try {
    // defines fetch options with method, default GET if none is provided
    const options = { method };

    // configures payload if provided
    if (payload) {
      options.headers = { 'Content-Type': 'application/json' };
      options.body = JSON.stringify(payload);
    }

    // retrieves the token
    // if token is expired, getToken calls refresh and then returns the new token
    const token = await getToken();

    // if the token retrieval is sucessful, set auth header on options
    if (token) {
      options.headers = options.headers || {};
      options.headers.Authorization = `Bearer ${token}`;
    }

    // executes request
    const res = await fetch(url, options);

    // returns response
    if (res.ok) return res.json();

    // throw error if unsuccessful
    throw new Error('Bad Request');
  } catch (error) {
    throw error;
  }
}
