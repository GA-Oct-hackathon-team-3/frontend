import sendRequest from './send-request';
const BASE_URL = 'http://localhost:3010/api/friends';

export async function retrieveFriends () {
    const friends = await sendRequest(BASE_URL, 'GET', null);
    return friends;
}

export async function showFriend (id) {
    const friend = await sendRequest(BASE_URL + `/${id}`, 'GET', null);
    return friend;
}