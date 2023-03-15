import React from "react";
import { useState, memo } from "react";
import "./notification.css";
import FriendNotification from "../friendNotification/FriendNotification";
import MessageNotification from "../messageNotification/MessageNotification";
import NewFeedNotification from "../newFeedNotification/NewFeedNotification";
import { useTranslation } from "react-i18next";

function Notification({ type }) {
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();
  const Noti = () => {
    if (type === "friend") {
      return (
        <div className="notiContainer">
          <FriendNotification onIsLoading={setIsLoading}></FriendNotification>
        </div>
      );
    } else if (type === "messenger") {
      return (
        <div className="notiContainer">
          <MessageNotification onIsLoading={setIsLoading}></MessageNotification>
        </div>
      );
    } else if (type === "newfeed") {
      return (
        <div className="notiContainer">
          <NewFeedNotification onIsLoading={setIsLoading}></NewFeedNotification>
        </div>
      );
    }
    if (isLoading) {
      return <div className="notiContainer">{t("General.loading")}</div>;
    }
  };

  return <Noti></Noti>;
}

export default memo(Notification);
