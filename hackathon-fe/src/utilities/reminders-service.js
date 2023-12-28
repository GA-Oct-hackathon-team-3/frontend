import { WEB_BASE_URL } from './constants';
import sendRequest from './send-request';

export async function getReminders () {
    return await sendRequest(WEB_BASE_URL + '/reminders', 'GET', null);
}

export async function markAsRead (reminderIds) {
    return await sendRequest(WEB_BASE_URL + '/reminders/read', 'PUT', { reminderIds });
}

export async function deleteReminder (id) {
    return await sendRequest(WEB_BASE_URL + `/reminders/${id}/delete`, 'DELETE');
}