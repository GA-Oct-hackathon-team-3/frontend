import { WEB_BASE_URL } from "./constants";
import sendRequest from "./send-request";
const BASE_URL = `${WEB_BASE_URL}/`;

export function register(userData) {
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

export async function verifyEmail(token) {
  return sendRequest(`${BASE_URL}users/verify`, "POST", { token });
}

export async function resendEmail(){
  return sendRequest(`${BASE_URL}users/resend`);
}