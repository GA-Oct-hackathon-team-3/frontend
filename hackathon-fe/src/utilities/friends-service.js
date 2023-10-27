import { WEB_BASE_URL } from "./constants";
import sendRequest from "./send-request";
import { getToken } from "./users-service";

const BASE_URL = `${WEB_BASE_URL}/friends`;

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

export async function uploadPhoto(id, file) {
    const formData = new FormData();
    formData.append('photo', file);
    const token = getToken();

    const response = await fetch(`${BASE_URL}/${id}/upload`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    if (response.status === 200) return response;
}


export async function getFavorites(id){
  const response = await sendRequest(`${BASE_URL}/${id}/favorites`, "GET", null);
  return response.favorites;
}

export async function getRecommendations(id, data){
  const response = await sendRequest(`${BASE_URL}/${id}/generate-gift`, "POST", data);
  return response;
}