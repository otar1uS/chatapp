import { notificationsState } from "../store/slices/authSlice";

export const unreadNotificationsFunc = (
  notifications: notificationsState[]
) => {
  return notifications.filter((n) => n.isRead === false);
};
