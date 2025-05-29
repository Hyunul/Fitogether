import React from "react";
import { useNotifications } from "../contexts/NotificationContext";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

const NotificationList: React.FC = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
  } = useNotifications();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "CHALLENGE_INVITE":
      case "CHALLENGE_COMPLETE":
        return "🎯";
      case "FOLLOW":
        return "👥";
      case "LIKE":
        return "❤️";
      case "COMMENT":
        return "💬";
      default:
        return "📢";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">알림</h2>
        <div className="space-x-2">
          <button
            onClick={markAllAsRead}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            모두 읽음
          </button>
          <button
            onClick={deleteAllNotifications}
            className="text-sm text-red-600 hover:text-red-800"
          >
            모두 삭제
          </button>
        </div>
      </div>

      {notifications.length === 0 ? (
        <p className="text-gray-500 text-center py-4">알림이 없습니다.</p>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`p-3 rounded-lg ${
                notification.isRead ? "bg-gray-50" : "bg-blue-50"
              }`}
            >
              <div className="flex items-start space-x-3">
                <span className="text-2xl">
                  {getNotificationIcon(notification.type)}
                </span>
                <div className="flex-1">
                  <p className="text-sm">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDistanceToNow(new Date(notification.createdAt), {
                      addSuffix: true,
                      locale: ko,
                    })}
                  </p>
                </div>
                <div className="flex space-x-2">
                  {!notification.isRead && (
                    <button
                      onClick={() => markAsRead(notification._id)}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      읽음
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification._id)}
                    className="text-xs text-red-600 hover:text-red-800"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationList;
