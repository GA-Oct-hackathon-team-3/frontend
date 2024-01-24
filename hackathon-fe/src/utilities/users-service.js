import * as usersAPI from './users-api';

export async function register(userData) {
  return await usersAPI.register(userData);
}

export async function verifyEmail(token) {
  return await usersAPI.verifyEmail(token);
}

export async function resendEmail(email, token) {
  return await usersAPI.resendEmail(email, token);
}

export async function getPasswordResetEmail(formData) {
  return await usersAPI.getPasswordResetEmail(formData);
}

export async function resetPassword(passwordData, token) {
  return await usersAPI.resetPassword(passwordData, token);
}

export async function getToken() {
  // get token from local storage
  const token = localStorage.getItem('token');
  // if no token, log user out
  if (!token) return logOut();
  // parse token
  const payload = JSON.parse(atob(token.split('.')[1]));
  // if token is expired, refresh the token and return the new token
  if (payload.exp < Date.now() / 1000) return await refreshTokens('web', token);
  // else return the token
  else return token;
}

export async function refreshTokens(device, token) {
  return await usersAPI.refreshTokens(device, token);
}

export async function logOut() {
  return await usersAPI.logout();
}

export async function deleteUser() {
  const token = getToken();
  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.id;
    const response = await usersAPI.deleteUser(userId);

    return response;
  }

  return null;
}

export async function confirmDeleteUser(confirmToken) {
  const token = getToken();
  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.id;
    const response = await usersAPI.confirmDeleteUser({
      confirmationToken: confirmToken,
    });

    return response;
  }

  return null;
}

export async function updatePassword(formInput) {
  return await usersAPI.updatePassword(formInput);
}
