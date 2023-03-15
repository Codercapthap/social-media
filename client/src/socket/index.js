import { getNewMessage } from "../store/Actions/ConversationsAction";
import {
  getNewRequest,
  removeRequest,
  createMyRequest,
} from "../store/Actions/FriendRequestAction";
import { setNewMessage } from "../store/Actions/NewMessageAction";
import { getNewNotification } from "../store/Actions/NotificationAction";

export const socketHandle = (socket, dispatch) => {
  socket.off("getMessage");
  socket.on("getMessage", (data) => {
    dispatch(getNewMessage(data.savedMessage));
    dispatch(setNewMessage(data.savedMessage));
  });
  socket.off("getNotification");
  socket.on("getNotification", (data) => {
    dispatch(getNewNotification(data.savedNotification));
  });
  socket.off("getRequestNoti");
  socket.on("getRequestNoti", (data) => {
    dispatch(getNewRequest(data.data));
  });
  socket.off("getBackRequest");
  socket.on("getBackRequest", (data) => {
    dispatch(removeRequest(data.data));
  });
  socket.off("getMyRequestNoti");
  socket.on("getMyRequestNoti", (data) => {
    dispatch(createMyRequest(data.data));
  });
};
