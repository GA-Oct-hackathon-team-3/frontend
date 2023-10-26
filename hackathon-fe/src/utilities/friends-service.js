import sendRequest from "./send-request";
const BASE_URL = "http://localhost:3010/api/friends";

export async function retrieveFriends() {
  const friends = await sendRequest(BASE_URL, "GET", null);
  return friends;
}

export async function showFriend(id) {
  const friend = await sendRequest(`${BASE_URL}/${id}`, "GET", null);
  return friend;
}

export async function createFriend(friendData) {
  const newFriend = await sendRequest(`${BASE_URL}/create`, "POST", friendData);
  return newFriend;
}

export async function updateFriend(id, friendInput) {
    const response = await sendRequest(`${BASE_URL}/${id}/update`, "PUT", friendInput);
    return response;
}


export async function getFavorites(id){
  const response = await sendRequest(`${BASE_URL}/${id}/favorites`, "GET", null);
  return response.favorites;
}
