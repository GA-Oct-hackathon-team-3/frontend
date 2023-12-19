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

export async function getBirthdays () {
    const friends = await sendRequest(BASE_URL + '/birthdays', "GET", null);
    return friends;
}

export async function updateFriendNotification (friendIds) {
    return await sendRequest(`${BASE_URL}/update-notification-inclusion`, 'PUT', { friendIds });
}

export async function getFavorites(id){
  const response = await sendRequest(`${BASE_URL}/${id}/favorites`, "GET", null);
  return response.favorites;
}

export async function getRecommendations(id, data){
  const response = await sendRequest(`${BASE_URL}/${id}/generate-gift`, "POST", data);
  return response;
}

export async function addToFavorites(friendId, recData){
  const response = await sendRequest(`${BASE_URL}/${friendId}/favorites`, "POST", recData);
  return response;
}

export async function removeFromFavorites(friendId, recId){
  const response = await sendRequest(`${BASE_URL}/${friendId}/favorites/${recId}`, "DELETE");
  return response;
}