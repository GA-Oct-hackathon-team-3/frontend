import sendRequest from "./send-request";
const BASE_URL = "http://localhost:3010/api/";

export function register(userData) {
  console.log("userData at userApi", userData);
  return sendRequest(`${BASE_URL}users`, "POST", userData);
}

export function login(credentials) {
  return sendRequest(`${BASE_URL}users/login`, "POST", credentials);
}

export function googleLogin(credentials) {
  return sendRequest(`${BASE_URL}googleSignin`, "POST", credentials);
}

export function checkToken() {
  return sendRequest(`${BASE_URL}check-token`);
}
