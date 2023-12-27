import { WEB_BASE_URL } from './constants';
import sendRequest from './send-request';
const BASE_URL = `${WEB_BASE_URL}/`;

export function register(userData) {
  return sendRequest(`${BASE_URL}users`, 'POST', userData);
}

export function verifyEmail(token) {
    return sendRequest(`${BASE_URL}users/verify-email`, 'POST', { token });
}

export function resendEmail(email, token) {
    return sendRequest(`${BASE_URL}users/resend-email`, 'POST', { email, token });
}

export function login(credentials) {
  return sendRequest(`${BASE_URL}users/login`, 'POST', credentials);
}

export function googleLogin(credentials) {
  return sendRequest(`${BASE_URL}googleSignin`, 'POST', credentials);
}

export function checkToken() {
  return sendRequest(`${BASE_URL}check-token`);
}

export function deleteUser(user) {
  return sendRequest(`${BASE_URL}users`, 'DELETE', user);
}

export function confirmDeleteUser(token) {
  return sendRequest(`${BASE_URL}users/confirm-delete`, 'POST', token);
}

export function updatePassword(formInput) {
  return sendRequest(`${BASE_URL}users/password`, 'PUT', formInput);
}
