import * as usersAPI from "./users-api";

export async function register(userData) {
  const userDataReturned = await usersAPI.register(userData);
  console.log("userDataReturned", userDataReturned);
  const token = userDataReturned.accessToken;
  console.log("token in user service after userData", token);
  localStorage.setItem("token", token);
  return getUser();
}

export function getToken() {
  const token = localStorage.getItem("token");
  console.log("token in getToken", token);
  if (!token) return null;
  console.log("token in getToken2", token);
  const payload = JSON.parse(atob(token.split(".")[1]));
  if (payload.exp < Date.now() / 1000) {
    localStorage.removeItem("token");
    return null;
  }
  return token;
}

export async function login(credentials) {
  const res = await usersAPI.login(credentials);
  localStorage.setItem("token", res.accessToken);
  return getUser();
}

export function getUser() {
  const token = getToken();
  let userData;
  if (token) {
    const payload = JSON.parse(atob(token.split(".")[1]));
    userData = {
      username: payload.username,
      id: payload.id,
      firstName: payload.firstName,
      lastName: payload.lastName
    };
  }
  return token ? userData : null;
}

export function logOut() {
  localStorage.removeItem("token");
}
