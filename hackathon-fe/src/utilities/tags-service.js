import sendRequest from "./send-request";
const BASE_URL = "http://localhost:3010/api/";

export async function addTag(id, tag) {
  const friend = await sendRequest(
    BASE_URL + `friends/${id}/tags`,
    "POST",
    tag
  );
  return friend;
}

export async function getTags() {
  const friend = await sendRequest(BASE_URL + `tags`, "GET", null);
  return friend;
}

export async function removeTag(id, tagId) {
  const friend = await sendRequest(
    BASE_URL + `friends/${id}/tags/${tagId}`,
    "DELETE",
    null
  );
  return friend;
}