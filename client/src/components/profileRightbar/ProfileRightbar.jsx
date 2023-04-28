import React from "react";
import { useState, useEffect, memo } from "react";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useSelector } from "react-redux";
import { User } from "../../services/User.service";
import { useDispatch } from "react-redux";
import "./profileRightbar.css";
import { useTranslation } from "react-i18next";
import { AnimatePresence } from "framer-motion";
import Confirm from "../confirm/Confirm";

export default function ProfileRightbar({ user }) {
  const [isFriend, setIsFriend] = useState("notFriend");
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [isRequester, setIsRequester] = useState(false);
  const [isReceiver, setIsReceiver] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [friends, setFriends] = useState([]);
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => {
    return state.User.currentUser;
  });
  const [toggleAdminEnableButton, setToggleAdminEnableButton] = useState(
    currentUser.isAdmin && user.disabled
  );
  const { t } = useTranslation();

  // TODO: get relationship of 2 user
  useEffect(() => {
    if (user.uid !== currentUser.uid) {
      User.getFriendStatus(user.uid).then((friendStatus) => {
        console.log(friendStatus);
        if (friendStatus === "requester") {
          setIsFriend("pending");
          setIsRequester(true);
        } else if (friendStatus === "recipient") {
          setIsFriend("pending");
          setIsReceiver(true);
        } else if (friendStatus === "friended") {
          setIsFriend("friended");
        }
      });
    }
    User.getFriends(user.uid).then((friends) => {
      setFriends(friends);
    });
  }, [user]);

  // TODO: handle friend action
  const handleFriend = async () => {
    if (isFriend === "notFriend") {
      User.requestAddFriend(user.uid, currentUser.uid).then(() => {
        setIsFriend("pending");
        setIsRequester(true);
      });
    } else if (isFriend === "pending" && isRequester) {
      User.takeFriendRequestBack(user.uid).then(() => {
        setIsFriend("notFriend");
        setIsRequester(false);
      });
    } else if (isFriend === "pending" && isReceiver) {
      User.acceptFriend(user.uid, currentUser.uid).then(() => {
        setIsFriend("friended");
        setIsReceiver(false);
      });
    } else if (isFriend === "friended") {
      User.unfriend(user.uid).then(() => {
        setIsFriend("notFriend");
      });
    }
  };

  const handleDisableUser = async () => {
    await User.disableUser(user.uid);
    setToggleAdminEnableButton(true);
  };

  const handleEnableUser = async () => {
    await User.enableUser(user.uid);
    setToggleAdminEnableButton(false);
  };

  const FriendButton = () => {
    if (isFriend === "notFriend") {
      return (
        <button className="normalFriendButton button" onClick={handleFriend}>
          {t("Friend.add")}
          <AddIcon></AddIcon>
        </button>
      );
    } else if (isFriend === "pending" && isRequester === true) {
      return (
        <button className="normalFriendButton button" onClick={handleFriend}>
          {t("Friend.cancel")}
          <RemoveIcon></RemoveIcon>
        </button>
      );
    } else if (isFriend === "pending" && isReceiver === true) {
      return (
        <button className="normalFriendButton button" onClick={handleFriend}>
          {t("Friend.acceptRequest")}
          <AddIcon></AddIcon>
        </button>
      );
    } else if (isFriend === "friended") {
      return (
        <button className="normalFriendButton button" onClick={handleFriend}>
          {t("Friend.unfriend")}
          <RemoveIcon></RemoveIcon>
        </button>
      );
    }
  };

  // *decline button appear together with accept button, so we make it seperately
  // TODO: handle for decline button
  const handleDeclineButton = async () => {
    User.declineFriendRequest(user.uid).then(() => {
      setIsReceiver(false);
      setIsFriend("notFriend");
    });
  };

  const FriendDeclineButton = () => {
    if (isFriend === "pending" && isReceiver === true) {
      return (
        <button className="declineButton button" onClick={handleDeclineButton}>
          {t("Friend.declineRequest")}
          <RemoveIcon></RemoveIcon>
        </button>
      );
    }
  };

  return (
    <>
      <AnimatePresence
        initial={false}
        mode="wait"
        onExitComplete={() => {
          return null;
        }}
      >
        {confirming && (
          <Confirm
            confirmHandle={handleDisableUser}
            toggleHandle={() => {
              setConfirming(false);
            }}
            message={t("Profile.confirmDisable")}
          ></Confirm>
        )}
      </AnimatePresence>
      {user.uid !== currentUser.uid && (
        <div className="rightbarFollowingButton">
          <FriendButton></FriendButton>
          {isFriend === "pending" && isReceiver === true && (
            <FriendDeclineButton></FriendDeclineButton>
          )}
        </div>
      )}
      <h4 className="rightbarTitle">{t("Profile.userInfo")}</h4>
      <div className="rightbarInfo">
        <div className="rightbarInfoItem">
          <span className="rightbarInfoKey">{t("Profile.birth")}:</span>
          <span className="rightbarInfoValue">{user.dateOfBirth}</span>
        </div>
        <div className="rightbarInfoItem">
          <span className="rightbarInfoKey">{t("Profile.address")}:</span>
          <span className="rightbarInfoValue">{user.address}</span>
        </div>
      </div>
      {console.log(currentUser.isAdmin)}
      {currentUser.isAdmin &&
        (toggleAdminEnableButton ? (
          <button className="blockButton button" onClick={handleEnableUser}>
            {t("Profile.enableUser")}
          </button>
        ) : (
          <button
            className="blockButton button"
            onClick={() => {
              setConfirming(true);
            }}
          >
            {t("Profile.disableUser")}
          </button>
        ))}
      <h4 className="rightbarTitle">{t("Profile.friend")}</h4>
      <div className="rightbarFollowings">
        {friends.slice(0, 9).map((friend) => (
          <Link
            to={"/profile/" + friend.uid}
            style={{ textDecoration: "none" }}
            key={friend.uid}
          >
            <div className="rightbarFollowing">
              <img
                src={
                  friend.photoURL
                    ? friend.photoURL
                    : PF + "person/noAvatar.webp"
                }
                alt=""
                className="rightbarFollowingImg"
              />
              <span className="rightbarFollowingName">
                {friend.displayName}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
