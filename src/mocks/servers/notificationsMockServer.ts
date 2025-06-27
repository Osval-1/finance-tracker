import type { Notification } from "../data/notificationsData";
import { dummyNotifications } from "../data/notificationsData";

// Helper function to simulate network delay
const delay = (ms: number = 300): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Mock database state
let notificationDatabase: Notification[] = [...dummyNotifications];
let nextNotificationId = notificationDatabase.length + 1;

// Helper function to generate new notification ID
const generateNotificationId = (): string => `notif-${nextNotificationId++}`;

export interface NotificationsResponse {
  success: boolean;
  notifications: Notification[];
  totalCount: number;
  unreadCount: number;
}

export const mockNotificationsAPI = {
  /**
   * Get all notifications
   */
  getNotifications: async (filters?: {
    isRead?: boolean;
    type?: string;
    limit?: number;
    offset?: number;
  }): Promise<NotificationsResponse> => {
    await delay();

    let filteredNotifications = [...notificationDatabase];

    if (filters) {
      if (filters.isRead !== undefined) {
        filteredNotifications = filteredNotifications.filter(
          (n) => n.isRead === filters.isRead
        );
      }
      if (filters.type) {
        filteredNotifications = filteredNotifications.filter(
          (n) => n.type === filters.type
        );
      }
    }

    // Sort by timestamp (newest first)
    filteredNotifications.sort((a, b) => {
      const timeA = new Date(
        a.timestamp.replace(/ hours? ago| days? ago| weeks? ago/, "")
      );
      const timeB = new Date(
        b.timestamp.replace(/ hours? ago| days? ago| weeks? ago/, "")
      );
      return timeB.getTime() - timeA.getTime();
    });

    const totalCount = filteredNotifications.length;
    const unreadCount = notificationDatabase.filter((n) => !n.isRead).length;

    // Apply pagination if specified
    if (filters?.limit) {
      const offset = filters.offset || 0;
      filteredNotifications = filteredNotifications.slice(
        offset,
        offset + filters.limit
      );
    }

    return {
      success: true,
      notifications: filteredNotifications,
      totalCount,
      unreadCount,
    };
  },

  /**
   * Mark notification as read
   */
  markAsRead: async (
    notificationId: string
  ): Promise<{
    success: boolean;
    message: string;
  }> => {
    await delay(200);

    const notificationIndex = notificationDatabase.findIndex(
      (n) => n.id === notificationId
    );

    if (notificationIndex === -1) {
      throw new Error("Notification not found");
    }

    notificationDatabase[notificationIndex] = {
      ...notificationDatabase[notificationIndex],
      isRead: true,
    };

    return {
      success: true,
      message: "Notification marked as read",
    };
  },

  /**
   * Mark notification as unread
   */
  markAsUnread: async (
    notificationId: string
  ): Promise<{
    success: boolean;
    message: string;
  }> => {
    await delay(200);

    const notificationIndex = notificationDatabase.findIndex(
      (n) => n.id === notificationId
    );

    if (notificationIndex === -1) {
      throw new Error("Notification not found");
    }

    notificationDatabase[notificationIndex] = {
      ...notificationDatabase[notificationIndex],
      isRead: false,
    };

    return {
      success: true,
      message: "Notification marked as unread",
    };
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async (): Promise<{
    success: boolean;
    message: string;
  }> => {
    await delay(300);

    notificationDatabase = notificationDatabase.map((notification) => ({
      ...notification,
      isRead: true,
    }));

    return {
      success: true,
      message: "All notifications marked as read",
    };
  },

  /**
   * Delete a notification
   */
  deleteNotification: async (
    notificationId: string
  ): Promise<{
    success: boolean;
    message: string;
  }> => {
    await delay(250);

    const notificationIndex = notificationDatabase.findIndex(
      (n) => n.id === notificationId
    );

    if (notificationIndex === -1) {
      throw new Error("Notification not found");
    }

    notificationDatabase.splice(notificationIndex, 1);

    return {
      success: true,
      message: "Notification deleted successfully",
    };
  },

  /**
   * Clear all read notifications
   */
  clearAllRead: async (): Promise<{
    success: boolean;
    message: string;
  }> => {
    await delay(350);

    const initialCount = notificationDatabase.length;
    notificationDatabase = notificationDatabase.filter((n) => !n.isRead);
    const deletedCount = initialCount - notificationDatabase.length;

    return {
      success: true,
      message: `${deletedCount} read notifications cleared`,
    };
  },

  /**
   * Create a new notification (for system use)
   */
  createNotification: async (
    payload: Omit<Notification, "id">
  ): Promise<{
    success: boolean;
    notification: Notification;
    message: string;
  }> => {
    await delay(250);

    const newNotification: Notification = {
      id: generateNotificationId(),
      ...payload,
    };

    notificationDatabase.unshift(newNotification); // Add to beginning

    return {
      success: true,
      notification: newNotification,
      message: "Notification created successfully",
    };
  },

  /**
   * Get notification settings (placeholder for future use)
   */
  getNotificationSettings: async (): Promise<{
    success: boolean;
    settings: {
      emailNotifications: boolean;
      pushNotifications: boolean;
      budgetAlerts: boolean;
      transactionAlerts: boolean;
      goalReminders: boolean;
      securityAlerts: boolean;
    };
  }> => {
    await delay(200);

    return {
      success: true,
      settings: {
        emailNotifications: true,
        pushNotifications: true,
        budgetAlerts: true,
        transactionAlerts: true,
        goalReminders: true,
        securityAlerts: true,
      },
    };
  },
};

export default mockNotificationsAPI;
