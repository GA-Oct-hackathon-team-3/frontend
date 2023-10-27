import { WEB_BASE_URL } from "./constants";
import sendRequest from "./send-request";

export function getProfile() {
    return sendRequest(`${WEB_BASE_URL}/users/profile/all`, "GET", null);
}

export function updateUserProfile(userData) {
    return sendRequest(`${WEB_BASE_URL}/users/`, "PUT", userData);
}