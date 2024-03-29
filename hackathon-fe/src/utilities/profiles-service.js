import { WEB_BASE_URL } from './constants';
import { getToken } from './users-service';
import sendRequest from './send-request';

export async function getProfile() {
  return await sendRequest(`${WEB_BASE_URL}/users/profile`, 'GET', null);
}

export async function updateUserProfile(profileInput, interests) {
  // combine interests and other profile info into userData for submission
  if (interests) profileInput.interests = interests;
  const userData = { ...profileInput };
  return await sendRequest(`${WEB_BASE_URL}/users/profile`, 'PUT', userData);
}

export async function uploadPhoto(file) {
  try {
    const formData = new FormData();
    formData.append('photo', file);
    const token = await getToken();

    const response = await fetch(`${WEB_BASE_URL}/users/profile/upload`, {
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
