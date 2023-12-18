import { WEB_BASE_URL } from './constants';
import sendRequest from './send-request';

export async function getNotifications() {
    return await sendRequest(WEB_BASE_URL + '/notifications', 'GET', null);
}

export async function markAsRead (notificationIds) {
    return await sendRequest(WEB_BASE_URL + '/notifications/read', 'PUT', { notificationIds });
}

export async function deleteNotification (id) {
    return await sendRequest(WEB_BASE_URL + `/notifications/${id}/delete`, 'DELETE');
}