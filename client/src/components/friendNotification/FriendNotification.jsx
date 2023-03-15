import { useDispatch, useSelector } from "react-redux";
import { User } from "../../services/User.service";
import { Link } from "react-router-dom";
import "./friendNotification.css";
import {
  removeMyRequest,
  removeRequest,
} from "../../store/Actions/FriendRequestAction";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function FriendNotification() {
  const currentUser = useSelector((state) => {
    return state.User.currentUser;
  });
  const requestedFriendList = useSelector((state) => {
    return state.FriendRequest.myFriendRequestsUser;
  });
  const receivedFriendList = useSelector((state) => {
    return state.FriendRequest.friendRequestsUser;
  });
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  /**
   * TODO: handle when clicking accept a friend request
   * @param {string} id
   */
  const handleAccept = async (id) => {
    try {
      await User.acceptFriend(id, currentUser.uid);
      dispatch(removeRequest({ uid: id }));
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * TODO: handle when clicking cancel a friend request
   * @param {string} id
   */
  const handleCancel = async (id) => {
    try {
      await User.takeFriendRequestBack(id);
      dispatch(removeMyRequest(id));
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * TODO: handle when clicking decline a friend request
   * @param {string} id
   */
  const handleDecline = async (id) => {
    try {
      await User.declineFriendRequest(id);
      dispatch(removeRequest({ uid: id }));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <span className="notiFriendTitle">{t("Friend.receiveTitle")}</span>
      {receivedFriendList.map((receivedRequest) => {
        return (
          <div className="friendNotiItem" key={receivedRequest.uid}>
            <Link to={`/profile/${receivedRequest.uid}`}>
              <img
                src={receivedRequest.photoURL || PF + "person/noAvatar.webp"}
                alt=""
                className="friendNotiItemImg"
              />
            </Link>
            <div className="friendNotiItemText">
              <span className="friendNotiItemName">
                {receivedRequest.displayName}
              </span>
              <div className="friendNotiItemButton">
                <button
                  className="friendDeclineButton friendItembutton"
                  onClick={() => {
                    handleDecline(receivedRequest.uid);
                  }}
                >
                  {t("Friend.decline")}
                </button>
                <button
                  className="friendAcceptButton friendItembutton"
                  onClick={() => {
                    handleAccept(receivedRequest.uid);
                  }}
                >
                  {t("Friend.accept")}
                </button>
              </div>
            </div>
          </div>
        );
      })}
      <hr className="notiFriendHr" />
      <span className="notiFriendTitle">{t("Friend.requestTitle")}</span>

      <AnimatePresence
        initial={false}
        mode="wait"
        onExitComplete={() => {
          return null;
        }}
      >
        {requestedFriendList.map((request) => {
          return (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.5, when: "afterChildren" }}
            >
              <div className="friendNotiItem" key={request.uid}>
                <Link to={`/profile/${request.uid}`}>
                  <img
                    src={request.photoURL || PF + "person/noAvatar.webp"}
                    alt=""
                    className="friendNotiItemImg"
                  />
                </Link>
                <div className="friendNotiItemText">
                  <span className="friendNotiItemName">
                    {request.displayName}
                  </span>
                  <div className="friendNotiItemButton">
                    <button
                      className="friendCancelButton button"
                      onClick={() => {
                        handleCancel(request.uid);
                      }}
                    >
                      {t("Friend.cancel")}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </>
  );
}
