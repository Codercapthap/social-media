import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./messageNotification.css";
import { useTranslation } from "react-i18next";

export default function MessageNotification() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const currentUser = useSelector((state) => {
    return state.User.currentUser;
  });
  const conversations = useSelector((state) => {
    return state.Conversations.conversations;
  });
  const { t } = useTranslation();

  return (
    <>
      {conversations.length === 0 && (
        <p style={{ textAlign: "center" }}>{t("Notification.nothing")}</p>
      )}
      {conversations.map((conversation) => {
        return (
          conversation.lastMessage && (
            <div className="messageNoti" key={conversation.lastMessage?._id}>
              <Link
                className={`messageNotiItem ${
                  conversation.lastMessage?.isReaded === 1 ||
                  conversation.lastMessage?.sender.uid === currentUser.uid
                    ? ""
                    : "notRead"
                }`}
                to={`/messenger`}
                state={{
                  conversation: conversation,
                }}
              >
                <img
                  src={
                    conversation.otherUser.photoURL ||
                    PF + "person/noAvatar.webp"
                  }
                  alt=""
                  className="messageNotiItemImg"
                />
                <div className="messageNotiItemText">
                  <span className="messageNotiItemName">
                    {conversation.otherUser.displayName}
                  </span>
                  <span className="messageNotiItemDesc">
                    {conversation.lastMessage?.text}
                  </span>
                  {conversation.lastMessage?.isReaded === 0 &&
                    conversation.lastMessage?.sender.uid !==
                      currentUser.uid && (
                      <span className="messageNotiItemNew"></span>
                    )}
                </div>
              </Link>
            </div>
          )
        );
      })}
    </>
  );
}
