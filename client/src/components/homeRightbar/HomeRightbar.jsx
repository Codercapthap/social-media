import React from "react";
import Online from "../online/Online";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./homeRightbar.css";
import { useTranslation } from "react-i18next";

export default function HomeRightbar() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const friendOnlineList = useSelector((state) => {
    return state.Online.friendOnlineList;
  });
  const friends = useSelector((state) => {
    return state.User.friends;
  });
  const [birthdayList, setBirthdayList] = useState({
    firstFriend: null,
    numOfBirthFriend: 0,
  });
  const { t } = useTranslation();
  useEffect(() => {
    const today = new Date();
    const todayString = `${today.getDate()}${today.getMonth()}`;
    const birthday = {
      firstFriend: null,
      numOfBirthFriend: 0,
    };
    friends.map((friend) => {
      if (friend.dateOfBirth) {
        const birth = new Date(friend.dateOfBirth);
        const birthString = `${birth.getDate()}${birth.getMonth()}`;
        if (birthString.localeCompare(todayString) === 0) {
          if (!birthday.firstFriend) birthday.firstFriend = friend;
          birthday.numOfBirthFriend++;
        }
      }
    });
    setBirthdayList(birthday);
  }, [friends]);

  return (
    <>
      {birthdayList.firstFriend && (
        <div className="birthdayContainer">
          <img className="birthdayImg" src={`${PF}gift.png`} alt="" />
          <span className="birthdayText">
            <b>{birthdayList.firstFriend.displayName}</b>{" "}
            {birthdayList.numOfBirthFriend > 1 && (
              <>
                {t("Rightbar.and")}{" "}
                <b>
                  {birthdayList.numOfBirthFriend} {t("Rightbar.otherFriends")}
                </b>{" "}
                {t("Rightbar.have")}
              </>
            )}{" "}
            {birthdayList.numOfBirthFriend === 1 && "has"}{" "}
            {t("Rightbar.todayBirth")}
          </span>
        </div>
      )}
      <img
        className="rightbarAd"
        src={`${PF}/person/coverDefault.jpg`}
        alt=""
      />
      <h4 className="rightbarTitle">{t("Rightbar.onlineFriend")}</h4>
      <ul className="rightbarFriendList">
        {friendOnlineList.map((u) => {
          return <Online key={u.uid} user={u}></Online>;
        })}
      </ul>
    </>
  );
}
