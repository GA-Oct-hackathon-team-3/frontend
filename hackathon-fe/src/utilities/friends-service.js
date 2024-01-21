import { WEB_BASE_URL } from './constants';
import sendRequest from './send-request';
import { getToken } from './users-service';

export async function retrieveFriends() {
  return await sendRequest(`${WEB_BASE_URL}/friends`, 'GET', null);
}

export async function showFriend(id) {
  return await sendRequest(`${WEB_BASE_URL}/friends/${id}`, 'GET', null);
}

export async function createFriend(friendData) {
  return await sendRequest(
    `${WEB_BASE_URL}/friends/create`,
    'POST',
    friendData
  );
}

export async function updateFriend(id, friendInput) {
  return await sendRequest(
    `${WEB_BASE_URL}/friends/${id}/update`,
    'PUT',
    friendInput
  );
}

export async function deleteFriend(id) {
  return await sendRequest(
    `${WEB_BASE_URL}/friends/${id}/delete`,
    'DELETE',
    null
  );
}

export async function uploadPhoto(id, file) {
  try {
    const formData = new FormData();
    formData.append('photo', file);
    const token = await getToken();

    const response = await fetch(`${WEB_BASE_URL}/friends/${id}/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (response.status === 200) return response;
    else throw new Error(`Error uploading photo: ${response.status}`);
  } catch (error) {
    throw error;
  }
}

export async function getBirthdays() {
  return await sendRequest(`${WEB_BASE_URL}/friends/birthdays`, 'GET', null);
}

export async function updateFriendNotification(friendIds) {
  return await sendRequest(
    `${WEB_BASE_URL}/friends/update-notification-inclusion`,
    'PUT',
    { friendIds }
  );
}

export async function getFavorites(id) {
  const response = await sendRequest(
    `${WEB_BASE_URL}/friends/${id}/favorites`,
    'GET',
    null
  );
  return response.favorites;
}

export async function getRecommendations(id, data) {
  return await sendRequest(
    `${WEB_BASE_URL}/friends/${id}/generate-gift`,
    'POST',
    data
  );
}

export async function addToFavorites(friendId, recData) {
  return await sendRequest(
    `${WEB_BASE_URL}/friends/${friendId}/favorites`,
    'POST',
    recData
  );
}

export async function removeFromFavorites(friendId, recId) {
  return await sendRequest(
    `${WEB_BASE_URL}/friends/${friendId}/favorites/${recId}`,
    'DELETE'
  );
}
