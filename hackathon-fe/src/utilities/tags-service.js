import { WEB_BASE_URL } from './constants';
import sendRequest from './send-request';

export async function getTags() {
  return await sendRequest(`${WEB_BASE_URL}/tags`, 'GET', null);
}

export async function updateTags(id, tags) {
  return await sendRequest(`${WEB_BASE_URL}/friends/${id}/tags`, 'POST', tags);
}

export async function getSuggestions(query) {
  return await sendRequest(
    `${WEB_BASE_URL}/tags/suggestions?search=${query}`,
    'GET',
    null
  );
}
