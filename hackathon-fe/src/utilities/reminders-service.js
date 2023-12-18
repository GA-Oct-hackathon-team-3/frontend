import { WEB_BASE_URL } from './constants';
import sendRequest from './send-request';

export async function getNotifications() {
    return await sendRequest(WEB_BASE_URL + '/notifications', 'GET', null);
}