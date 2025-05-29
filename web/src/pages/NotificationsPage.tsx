import React from "react";
import NotificationList from "../components/NotificationList";

const NotificationsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">알림</h1>
      <NotificationList />
    </div>
  );
};

export default NotificationsPage;
