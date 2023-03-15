import { Notification } from "../../services/Notification.service";
import store from "../index.js";

export const setNotifications = () => {
  return (dispatch) => {
    Notification.getNotification().then((res) => {
      dispatch({ type: "SET_NOTIFICATIONS", payload: res });
    });
  };
};

export const getNewNotification = (data) => {
  return (dispatch) => {
    dispatch({ type: "GET_NEW_NOTIFICATION", payload: data });
  };
};

export const readNotification = (id) => {
  return (dispatch) => {
    const notifications = store.getState().Notifications.notifications;
    const newNotiList = notifications.map((noti) => {
      if (noti._id === id) noti.isReaded = 1;
      return noti;
    });
    dispatch({ type: "READ_NOTIFICATION", payload: newNotiList });
  };
};

export const readNotifications = () => {
  return (dispatch) => {
    const notifications = store.getState().Notifications.notifications;
    const newNotiList = notifications.map((noti) => {
      noti.isReaded = 1;
      return noti;
    });
    dispatch({ type: "READ_ALL_NOTIFICATIONS", payload: newNotiList });
  };
};

export const deleteAllNotifications = () => {
  return (dispatch) => {
    const newNotiList = [];
    dispatch({ type: "DEL_ALL_NOTIFICATIONS", payload: newNotiList });
  };
};
