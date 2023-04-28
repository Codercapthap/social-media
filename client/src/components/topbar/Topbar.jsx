import React, { useState, useEffect, memo, useMemo } from "react";
import "./topbar.css";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ChatIcon from "@mui/icons-material/Chat";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import Notification from "../notification/Notification";
import EditProfile from "../editProfile/EditProfile";
import ChangePassword from "../changePassword/changePassword";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import fullLogo from "../../assets/full_logo.png";
import { useTranslation } from "react-i18next";
import { CSSTransition } from "react-transition-group";
import { motion, AnimatePresence } from "framer-motion";
import { Snackbar, Alert } from "@mui/material";

function Topbar() {
  const [isProfileClicking, setIsProfileClicking] = useState(false);
  const [isMessengerClicking, setIsMessengerClicking] = useState(false);
  const [isFriendClicking, setIsFriendClicking] = useState(false);
  const [isNewFeedClicking, setIsNewFeedClicking] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [activeMenu, setActiveMenu] = useState("main");
  const [menuHeight, setMenuHeight] = useState(null);
  const [isPasswordChanged, setIsPasswordChanged] = useState(false);
  const { i18n } = useTranslation();
  const currentUser = useSelector((state) => {
    return state.User.currentUser;
  });
  const conversations = useSelector((state) => {
    return state.Conversations.conversations;
  });
  const notifications = useSelector((state) => {
    return state.Notifications.notifications;
  });
  const receivedFriendList = useSelector((state) => {
    return state.FriendRequest.friendRequestsUser;
  });
  const [toggleEditProfile, setToggleEditProfile] = useState(false);
  const [toggleChangePassword, setToggleChangePassword] = useState(false);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const navigate = useNavigate();

  //TODO: get the num of friend request and the num of new messages to display
  const numOfFriendRequest = useMemo(() => {
    return receivedFriendList.length;
  }, [receivedFriendList]);
  const { t } = useTranslation();

  const numOfNewFeed = useMemo(() => {
    return notifications.filter((item) => {
      return item.isReaded === 0;
    }).length;
  }, [notifications]);

  const numOfNewMessage = useMemo(() => {
    let num = 0;
    conversations.map((c) => {
      if (
        c.lastMessage &&
        !c.lastMessage.isReaded &&
        c.lastMessage?.sender.uid !== currentUser.uid
      )
        num++;
    });
    return num;
  }, [conversations]);

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      navigate("/search?name=" + searchText);
    }
  };

  const handleChangeLanguage = (lang) => {
    localStorage.setItem("lang", JSON.stringify(lang));
    i18n.changeLanguage(lang);
  };

  const calcHeight = (el) => {
    const height = el.offsetHeight + 24;
    setMenuHeight(height);
  };

  const setTheme = (theme) => {
    document.querySelector("body").setAttribute("data-theme", theme);
  };

  const NumOfNoti = ({ type }) => {
    if (numOfFriendRequest && type === "friend")
      return <span className="topbarIconBadge">{numOfFriendRequest}</span>;
    else if (numOfNewMessage && type === "messenger")
      return <span className="topbarIconBadge">{numOfNewMessage}</span>;
    else if (numOfNewFeed && type === "newfeed") {
      return <span className="topbarIconBadge">{numOfNewFeed}</span>;
    }
  };
  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">
            <img src={fullLogo} alt="" className="logoImg" />
          </span>
        </Link>
      </div>
      <div className="topbarCenter">
        <div
          className="searchBar"
          onKeyDown={(e) => {
            handleSearch(e);
          }}
        >
          <SearchIcon className="searchIcon"></SearchIcon>
          <input
            placeholder={t("Topbar.searchFor")}
            type="text"
            className="searchInput"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarLinks">
          <Link to={"/"} className="topbarLink">
            <span>{t("Topbar.homepage")}</span>
          </Link>
          <Link to={"/messenger"} className="topbarLink">
            <span>Messenger</span>
          </Link>
        </div>
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <PersonIcon
              onMouseDown={() => {
                setIsFriendClicking(!isFriendClicking);
                setIsMessengerClicking(false);
                setIsNewFeedClicking(false);
                setIsProfileClicking(false);
              }}
            ></PersonIcon>
            <NumOfNoti type={"friend"}></NumOfNoti>

            <AnimatePresence
              initial={false}
              mode="wait"
              onExitComplete={() => {
                return null;
              }}
            >
              {isFriendClicking && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Notification type={"friend"}></Notification>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="topbarIconItem">
            <ChatIcon
              onMouseDown={() => {
                setIsMessengerClicking(!isMessengerClicking);
                setIsFriendClicking(false);
                setIsProfileClicking(false);
                setIsNewFeedClicking(false);
              }}
            ></ChatIcon>
            <NumOfNoti type={"messenger"}></NumOfNoti>
            <AnimatePresence
              initial={false}
              mode="wait"
              onExitComplete={() => {
                return null;
              }}
            >
              {isMessengerClicking && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.5, when: "afterChildren" }}
                >
                  <Notification type={"messenger"}></Notification>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="topbarIconItem">
            <CircleNotificationsIcon
              onMouseDown={() => {
                setIsMessengerClicking(false);
                setIsFriendClicking(false);
                setIsProfileClicking(false);
                setIsNewFeedClicking(!isNewFeedClicking);
              }}
            ></CircleNotificationsIcon>
            <NumOfNoti type={"newfeed"}></NumOfNoti>
            <AnimatePresence
              initial={false}
              mode="wait"
              onExitComplete={() => {
                return null;
              }}
            >
              {isNewFeedClicking && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Notification type={"newfeed"}></Notification>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="userNavDiv">
          <img
            src={
              currentUser.photoURL
                ? currentUser.photoURL
                : PF + "person/noAvatar.webp"
            }
            alt=""
            className="topbarImg"
            onMouseDown={() => {
              setIsProfileClicking(!isProfileClicking);
              setIsMessengerClicking(false);
              setIsNewFeedClicking(false);
              setIsFriendClicking(false);
            }}
          />

          <AnimatePresence
            initial={false}
            mode="wait"
            onExitComplete={() => {
              return null;
            }}
          >
            {isProfileClicking && (
              <motion.div
                className="userNav"
                style={{ height: menuHeight }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.5, when: "afterChildren" }}
              >
                <CSSTransition
                  in={activeMenu === "main"}
                  unmountOnExit
                  timeout={500}
                  classNames="menu-primary"
                  onEnter={calcHeight}
                >
                  <div className="userNavMenu">
                    <button className="userNavItem">
                      <Link to={`/profile/${currentUser.uid}`}>
                        {t("Topbar.profilePage")}
                      </Link>
                    </button>
                    <button
                      className="userNavItem"
                      onClick={() => {
                        setToggleEditProfile(!toggleEditProfile);
                      }}
                    >
                      {t("Topbar.updateProfile")}
                    </button>

                    <button
                      className="userNavItem"
                      onClick={() => {
                        setToggleChangePassword(!toggleChangePassword);
                      }}
                    >
                      {t("Topbar.changePassword")}
                    </button>

                    <button
                      className="userNavItem"
                      onClick={() => {
                        setActiveMenu("language");
                      }}
                    >
                      {t("Topbar.changeLanguage")}
                    </button>

                    <button
                      className="userNavItem"
                      onClick={() => {
                        setActiveMenu("theme");
                      }}
                    >
                      {t("Topbar.changeTheme")}
                    </button>

                    <hr className="userNavHr" />
                    <button
                      className="userNavItem"
                      onClick={() => signOut(auth)}
                    >
                      {t("Topbar.logout")}
                    </button>
                  </div>
                </CSSTransition>
                <CSSTransition
                  in={activeMenu === "language"}
                  unmountOnExit
                  timeout={500}
                  classNames="menu-secondary"
                  onEnter={calcHeight}
                >
                  <div className="userNavMenu">
                    <button
                      className="userNavItem"
                      onClick={() => {
                        setActiveMenu("main");
                      }}
                    >
                      <ArrowBackIcon></ArrowBackIcon>
                    </button>
                    <button
                      className="userNavItem"
                      onClick={() => {
                        handleChangeLanguage("en");
                      }}
                    >
                      English
                    </button>
                    <button
                      className="userNavItem"
                      onClick={() => {
                        handleChangeLanguage("vi");
                      }}
                    >
                      Tiếng Việt
                    </button>
                  </div>
                </CSSTransition>
                <CSSTransition
                  in={activeMenu === "theme"}
                  unmountOnExit
                  timeout={500}
                  classNames="menu-secondary"
                  onEnter={calcHeight}
                >
                  <div className="userNavMenu">
                    <button
                      className="userNavItem"
                      onClick={() => {
                        setActiveMenu("main");
                      }}
                    >
                      <ArrowBackIcon></ArrowBackIcon>
                    </button>
                    <button
                      className="userNavItem"
                      onClick={() => {
                        setTheme("dark");
                      }}
                    >
                      {t("Topbar.dark")}
                    </button>
                    <button
                      className="userNavItem"
                      onClick={() => {
                        setTheme("light");
                      }}
                    >
                      {t("Topbar.light")}
                    </button>
                  </div>
                </CSSTransition>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <AnimatePresence
          initial={false}
          mode="wait"
          onExitComplete={() => {
            return null;
          }}
        >
          {toggleEditProfile && (
            <motion.div
              initial={{
                opacity: 0,
                scale: 0,
                position: "fixed",
                top: "50%",
                left: "50%",
              }}
              animate={{
                opacity: 1,
                scale: 1,
                position: "fixed",
                top: "50%",
                left: "50%",
              }}
              exit={{
                opacity: 0,
                scale: 0,
                position: "fixed",
                top: "50%",
                left: "50%",
              }}
              transition={{ duration: 0.5 }}
            >
              <EditProfile
                toggleEditProfile={toggleEditProfile}
                setToggleEditProfile={setToggleEditProfile}
              ></EditProfile>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence
          initial={false}
          mode="wait"
          onExitComplete={() => {
            return null;
          }}
        >
          {toggleChangePassword && (
            <motion.div
              initial={{
                opacity: 0,
                scale: 0,
                position: "fixed",
                top: "50%",
                left: "50%",
              }}
              animate={{
                opacity: 1,
                scale: 1,
                position: "fixed",
                top: "50%",
                left: "50%",
              }}
              exit={{
                opacity: 0,
                scale: 0,
                position: "fixed",
                top: "50%",
                left: "50%",
              }}
              transition={{ duration: 0.5 }}
            >
              <ChangePassword
                toggleChangePassword={toggleChangePassword}
                setToggleChangePassword={setToggleChangePassword}
                onIsPasswordChanged={setIsPasswordChanged}
              ></ChangePassword>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Snackbar
        open={isPasswordChanged}
        autoHideDuration={6000}
        onClose={() => setIsPasswordChanged(false)}
      >
        <Alert
          onClose={() => setIsPasswordChanged(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {t("Password.passwordChanged")}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default memo(Topbar);
