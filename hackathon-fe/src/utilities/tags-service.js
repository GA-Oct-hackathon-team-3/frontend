import sendRequest from "./send-request";
const BASE_URL = "http://localhost:3010/api/friends";

export async function addTag(id, tag) {
  const friend = await sendRequest(BASE_URL + `/${id}/tags`, "POST", tag);
  return friend;
}
