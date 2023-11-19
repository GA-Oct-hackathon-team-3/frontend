import { WEB_BASE_URL } from "./constants";
import sendRequest from "./send-request";
const BASE_URL = `${WEB_BASE_URL}/`;

export async function getTags() {
  const friend = await sendRequest(BASE_URL + `tags`, "GET", null);
  return friend;
}

export async function updateTags (id, tags) {
    const response = await sendRequest(`${BASE_URL}friends/${id}/tags`, 'POST', tags);
    return response;
}

export async function getSuggestions (query) {
    const suggestions = await sendRequest(`${BASE_URL}tags/suggestions?search=${query}`, 'GET', null);
    return suggestions;
}
