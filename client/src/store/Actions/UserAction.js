import { User } from "../../services/User.service";
import { setToken } from "../../helpers/http";
import { setNotifications } from "./NotificationAction";
import { getMyRequest, getRequest } from "./FriendRequestAction";
import { setConversations } from "./ConversationsAction";
import { setOnlineList } from "./OnlineAction";

export const setCurrentUser = (auth) => {
  return (dispatch) => {
    dispatch({ type: "START_LOADING" });
    auth.getIdToken().then((token) => {
      setToken(token);
      User.getUserById(auth.uid).then((user) => {
        dispatch({
          type: "SET_CURRENT_USER",
          payload: user,
        });
        User.getFriends(auth.uid).then((friends) => {
          dispatch({ type: "SET_FRIENDS", payload: friends });
          dispatch(setOnlineList(auth));
          dispatch(setConversations(auth.uid));
          dispatch(setNotifications());
          dispatch(getRequest());
          dispatch(getMyRequest());
          dispatch({ type: "FINISH_LOADING" });
        });
      });
    });
    // const userRef = collection(db, "users");
    // const q = query(userRef, where("uid", "==", auth.uid));
    // getDocs(q).then((querySnapshot) => {
    //   dispatch({
    //     type: "SET_CURRENT_USER",
    //     payload: querySnapshot.docs[0]?.data(),
    //   });
    //   User.getFriends(querySnapshot.docs[0]?.data().uid).then((friends) => {
    //     dispatch({ type: "SET_FRIENDS", payload: friends });
    //     dispatch({ type: "FINISH_LOADING" });
    //   });
    // });
  };
};
