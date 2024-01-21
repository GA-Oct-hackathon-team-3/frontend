import { WEB_BASE_URL } from './constants';
import sendRequest from './send-request';

export function register(userData) {
  return sendRequest(`${WEB_BASE_URL}/users`, 'POST', userData);
}

export function verifyEmail(token) {
  return sendRequest(`${WEB_BASE_URL}/users/verify-email`, 'POST', { token });
}

export function resendEmail(email, token) {
  return sendRequest(`${WEB_BASE_URL}/users/resend-email`, 'POST', { email, token });
}

export function getPasswordResetEmail(formData) {
  return sendRequest(`${WEB_BASE_URL}/users/forgot-password`, 'POST', formData);
}

export function resetPassword(passwordData, token) {
  return sendRequest(`${WEB_BASE_URL}/users/reset-password`, 'POST', {
    ...passwordData,
    token,
  });
}

export function login(credentials) {
  return sendRequest(`${WEB_BASE_URL}/users/login`, 'POST', credentials);
}

export async function refreshTokens(device, token) {
  try {
    const response = await fetch(`${WEB_BASE_URL}/users/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ device }), // include whether web or mobile is making call
      credentials: 'include',
    });

    // if server responds that either token are missing, run logout
    if (response.status === 403) await logout();

    // if success...
    if (response.status === 200) {
      const data = await response.json();
      // return new token and set in localstorage
      localStorage.setItem('token', data.accessToken);
      return data.accessToken;
    }
  } catch (error) {
    console.error('Refresh token error: ', error);
  }
}

export async function logout() {
  try {
    // call to backend to handle refresh token
    const response = await fetch(`${WEB_BASE_URL}/users/logout`, {
      method: 'GET',
      credentials: 'include',
    });

    if (response.status === 200 || response.status === 204) {
      if (localStorage.getItem('token')) {
        localStorage.removeItem('token');
        return response.json();
      }
    }

    return;
  } catch (error) {
    console.error('Logout error: ', error);
  }
}

export function googleLogin(credentials) {
  return sendRequest(`${WEB_BASE_URL}/googleSignin`, 'POST', credentials);
}

export function checkToken() {
  return sendRequest(`${WEB_BASE_URL}/check-token`);
}

export function deleteUser(user) {
  return sendRequest(`${WEB_BASE_URL}/users`, 'DELETE', user);
}

export function confirmDeleteUser(token) {
  return sendRequest(`${WEB_BASE_URL}/users/confirm-delete`, 'POST', token);
}

export function updatePassword(formInput) {
  return sendRequest(`${WEB_BASE_URL}/users/password`, 'PUT', formInput);
}
