import React, { useState } from "react";
import { FaRegMessage } from "react-icons/fa6";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { unreadNotificationsFunc } from "../../utils/unreadNotifications";
import moment from "moment";
import {
  markAllNotificationsAsRead,
  markNotificationRead,
} from "../../store/slices/authSlice";

const Notification: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { notifications, allUsers } = useAppSelector((state) => state.auth);

  const dispatch = useAppDispatch();

  const unreadNotifications = unreadNotificationsFunc(notifications);

  const modifiedNotifications = notifications.map((n) => {
    const senderName = allUsers?.find(
      (user) => user._id === n?.senderId
    )?.username;

    return {
      ...n,
      senderName,
    };
  });

  return (
    <div className="notification">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="notifications-icon cursor-pointer"
      >
        <FaRegMessage className="w-6 h-6" />

        {unreadNotifications?.length === 0 ? null : (
          <span className="notification-count">
            <span>{unreadNotifications?.length}</span>
          </span>
        )}
      </div>

      {isOpen ? (
        <div className="notifications-box">
          <div className="notifications-header">
            <h3>Notifications</h3>
            <div
              className="mark-as-read"
              onClick={() => dispatch(markAllNotificationsAsRead())}
            >
              Mark all as read
            </div>
          </div>
          {modifiedNotifications?.length === 0 ? (
            <span className="notification">No notifications yet..</span>
          ) : null}
          {modifiedNotifications &&
            modifiedNotifications.map((n, index) => {
              return (
                <div
                  key={index}
                  className={n?.isRead ? "notification" : "notification not-read"}
                  onClick={() =>
                    dispatch(
                      markNotificationRead({ senderId: n.senderId, notif: n })
                    )
                  }
                >
                  <span>{`${n?.senderName} sent you a new message`}</span>
                  <span className="notification-time">
                    {moment(n?.date).calendar()}
                  </span>
                </div>
              );
            })}
        </div>
      ) : null}
    </div>
  );
};

export default Notification;
