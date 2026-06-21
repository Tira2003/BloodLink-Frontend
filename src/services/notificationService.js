import { apiFetch } from './api';

export const notificationService = {
  // Notifications
  async createNotification(userId, title, message, type, relatedId, actionUrl) {
    return apiFetch('/api/notifications', {
      method: 'POST',
      body: JSON.stringify({
        userId,
        title,
        message,
        type,
        relatedId,
        actionUrl,
      }),
    });
  },

  async getNotification(id) {
    return apiFetch(`/api/notifications/${id}`);
  },

  async getNotificationsByUser(userId) {
    return apiFetch(`/api/notifications/user/${userId}`);
  },

  async getUnreadNotifications(userId) {
    return apiFetch(`/api/notifications/user/${userId}/unread`);
  },

  async getNotificationsByType(userId, type) {
    return apiFetch(`/api/notifications/user/${userId}/type/${type}`);
  },

  async markAsRead(id) {
    return apiFetch(`/api/notifications/${id}/read`, {
      method: 'PUT',
    });
  },

  async markAllAsRead(userId) {
    return apiFetch(`/api/notifications/user/${userId}/read-all`, {
      method: 'PUT',
    });
  },

  async getUnreadCount(userId) {
    return apiFetch(`/api/notifications/user/${userId}/unread-count`);
  },

  async deleteNotification(id) {
    return apiFetch(`/api/notifications/${id}`, {
      method: 'DELETE',
    });
  },

  async getNotificationHistory(userId, startDate, endDate) {
    let url = `/api/notifications/user/${userId}/history`;
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (params.toString()) url += `?${params.toString()}`;
    return apiFetch(url);
  },

  // Preferences
  async createPreference(userId) {
    return apiFetch(`/api/notifications/preferences?userId=${userId}`, {
      method: 'POST',
    });
  },

  async getPreference(userId) {
    return apiFetch(`/api/notifications/preferences/user/${userId}`);
  },

  async updatePreference(userId, preferences) {
    return apiFetch(`/api/notifications/preferences/user/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });
  },
};
