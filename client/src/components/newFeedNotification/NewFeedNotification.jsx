import React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { User } from "../../services/User.service";
import { Link } from "react-router-dom";
import { Notification } from "../../services/Notification.service";
import "./newFeedNotification.css";
import {
  deleteAllNotifications,
  readNotification,
  readNotifications,
} from "../../store/Actions/NotificationAction";
import InfiniteScroll from "react-infinite-scroller";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function NewFeedNotification() {
  const [hasMore, setHasMore] = useState(true);
  const [number, setNumber] = useState(10);
  const [notiToRender, setNotiToRender] = useState([]);
  const notifications = useSelector((state) => {
    return state.Notifications.notifications;
  });
  console.log(notifications);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleRead = async (notiId) => {
    await Notification.readNotification(notiId);
    dispatch(readNotification(notiId));
  };

  const handleReadAll = async () => {
    await Notification.readNotifications();
    dispatch(readNotifications());
  };

  const handleDeleteAll = async () => {
    await Notification.deleteNotifications();
    dispatch(deleteAllNotifications());
  };

  const loadFunc = () => {
    // if (number - notifications.length < 10) {
    //   console.log("here");
    //   setNotiToRender(notifications.slice(0, notifications.length));
    // } else
    setNotiToRender(
      notifications
        .sort((a, b) => {
          const aDate = new Date(a.createdAt).getTime();
          const bDate = new Date(b.createdAt).getTime();
          return bDate - aDate;
        })
        .slice(0, number)
    );
    setNumber((prev) => prev + 10);
    if (number >= notifications.length) setHasMore(false);
  };
  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{ delay: 0.5 }}
        className="newFeedNotiButton"
      >
        <button
          className="newFeedNotiButtonItem button"
          onClick={handleReadAll}
        >
          {t("Notification.markReadAll")}
        </button>
        <button
          className="newFeedNotiButtonItem button deleteButton"
          onClick={handleDeleteAll}
        >
          {t("Notification.deleteAll")}
        </button>
      </motion.div>
      <div className="newFeedNoti">
        <div className="newFeedNotiItems">
          {notifications.length === 0 && (
            <p style={{ textAlign: "center" }}>{t("Notification.nothing")}</p>
          )}
          {notifications.length > 0 && (
            <InfiniteScroll
              loadMore={loadFunc}
              loader={
                <div className="loader" key={0}>
                  {t("General.loading")}
                </div>
              }
              hasMore={hasMore}
              useWindow={false}
            >
              {console.log(
                notiToRender.sort((a, b) => {
                  const aDate = new Date(a.createdAt).getTime();
                  const bDate = new Date(b.createdAt).getTime();
                  return bDate - aDate;
                })
              )}
              {notiToRender
                .sort((a, b) => {
                  const aDate = new Date(a.createdAt).getTime();
                  const bDate = new Date(b.createdAt).getTime();
                  return bDate - aDate;
                })
                .map((notification) => {
                  return (
                    <Link
                      to={
                        notification.post
                          ? `/post/${notification.post}`
                          : `/profile/${notification.causer.uid}`
                      }
                      className={`newFeedNotiItem ${
                        notification.isReaded === 0 ? "notRead" : ""
                      }`}
                      key={notification._id}
                      onClick={() => {
                        handleRead(notification._id);
                      }}
                    >
                      <img
                        src={
                          notification.causer.photoURL ||
                          PF + "person/noAvatar.webp"
                        }
                        alt=""
                        className="newFeedNotiItemImg"
                      />
                      <div className="newFeedNotiItemText">
                        <span className="newFeedNotiItemDesc">
                          {notification.type === "post"
                            ? `${notification.causer.displayName} ${t(
                                "Notification.postStatus"
                              )}`
                            : notification.type === "reply"
                            ? `${notification.causer.displayName} ${t(
                                "Notification.postComment"
                              )}`
                            : `${notification.causer.displayName} ${t(
                                "Notification.acceptFriend"
                              )}`}
                        </span>
                        {notification.isReaded === 0 && (
                          <span className="newFeedNotiItemNew"></span>
                        )}
                      </div>
                    </Link>
                  );
                })}
            </InfiniteScroll>
          )}
        </div>
      </div>
    </>
  );
}
