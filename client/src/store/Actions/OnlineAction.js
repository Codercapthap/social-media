import { User } from "../../services/User.service";
import { socket } from "../../helpers/http";

export const setOnlineList = (currentUser) => {
  return (dispatch) => {
    socket.on("getUsers", (users) => {
      User.getFriends(currentUser.uid).then((friendList) => {
        dispatch({
          type: "GET_USERS",
          payload: friendList.filter((f) => {
            return users.some((u) => {
              return u.userId === f.uid;
            });
          }),
        });
      });
    });
  };
};
