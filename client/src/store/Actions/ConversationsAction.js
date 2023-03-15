import { Utils } from "../../utils/utils";
import store from "../index.js";

export const setConversations = () => {
  return (dispatch) => {
    Utils.getConversations().then((result) => {
      dispatch({ type: "SET_CONVERSATIONS", payload: result });
    });
  };
};

export const getNewMessage = (data) => {
  return (dispatch) => {
    const conversations = store.getState().Conversations.conversations;
    const newArray = conversations.map((c) => {
      if (c.id === data.conversation._id) {
        c.lastMessage = data;
      }
      return c;
    });

    dispatch({ type: "GET_NEW_MESSAGE", payload: newArray });
  };
};

export const readNewMessage = (conversationId) => {
  return (dispatch) => {
    const conversations = store.getState().Conversations.conversations;
    const newArray = conversations.map((c) => {
      if (c.id === conversationId) {
        if (c.lastMessage) {
          c.lastMessage.isReaded = 1;
        }
      }
      return c;
    });

    dispatch({ type: "READ_NEW_MESSAGE", payload: newArray });
  };
};
