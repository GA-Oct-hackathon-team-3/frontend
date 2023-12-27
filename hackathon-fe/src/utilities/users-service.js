import * as usersAPI from './users-api';

export async function register(userData) {
  return await usersAPI.register(userData);
}

export async function verifyEmail (token) {
    return await usersAPI.verifyEmail(token);
}

export async function resendEmail () {
    return await usersAPI.resendEmail();
}

export function getToken() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  const payload = JSON.parse(atob(token.split('.')[1]));
  if (payload.exp < Date.now() / 1000) {
    localStorage.removeItem('token');
    return null;
  }
  return token;
}

export async function login(credentials) {
  const res = await usersAPI.login(credentials);
  localStorage.setItem('token', res.accessToken);
  return getUser();
}

export function getUser() {
  const token = getToken();
  let userData;
  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    userData = {
      username: payload.username,
      id: payload.id,
      firstName: payload.firstName,
      lastName: payload.lastName,
    };
  }
  return token ? userData : null;
}

export function logOut() {
  localStorage.removeItem('token');
}

export async function deleteUser() {
  const token = getToken();
  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.id;
    const response = await usersAPI.deleteUser(userId);

    console.log(response, 'THIS IS THE RESPONSE DELETE USER');
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
  const response = await usersAPI.updatePassword(formInput);
  return response;
}
