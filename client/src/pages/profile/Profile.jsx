import React from "react";
import Topbar from "../../components/topbar/Topbar.jsx";
import Sidebar from "../../components/sidebar/Sidebar.jsx";
import Rightbar from "../../components/rightbar/Rightbar.jsx";
import Feed from "../../components/feed/Feed.jsx";
import "./profile.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { User } from "../../services/User.service.js";
import { useSelector } from "react-redux";
import Loading from "../loading/Loading.jsx";

export default function Profile() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const uid = useParams().uid;
  const friends = useSelector((state) => {
    return state.User.friends;
  });

  // TODO: get user of this profile
  useEffect(() => {
    setIsLoading(true);
    User.getUserById(uid)
      .then((res) => {
        setUser(res);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [uid]);

  return (
    <>
      {isLoading ? (
        <Loading></Loading>
      ) : (
        <>
          <Topbar></Topbar>
          <div className="profile">
            <Sidebar friends={friends}></Sidebar>
            <div className="profileRight">
              <div className="profileRightTop">
                <div className="profileCover">
                  <img
                    className="profileCoverImg"
                    src={
                      user.coverPicture
                        ? user.coverPicture
                        : PF + "person/coverDefault.jpg"
                    }
                    alt=""
                  />
                  <img
                    className="profileUserImg"
                    src={
                      user.photoURL
                        ? user.photoURL
                        : PF + "person/noAvatar.webp"
                    }
                    alt=""
                  />
                </div>
                <div className="profileInfo">
                  <h4 className="profileInfoName">{user.displayName}</h4>
                  <span className="profileInfoDesc">{user.desc}</span>
                </div>
              </div>
              <div className="profileRightBottom">
                <Feed uid={uid}></Feed>
                <Rightbar user={user}></Rightbar>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
