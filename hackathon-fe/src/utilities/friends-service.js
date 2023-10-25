import sendRequest from './send-request';
const BASE_URL = 'http://localhost:3010/api/friends';

export async function retrieveFriends () {
    const friends = await sendRequest(BASE_URL, 'GET', null);
    return friends;
}
