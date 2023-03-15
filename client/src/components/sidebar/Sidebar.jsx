import React from "react";
import "./sidebar.css";
import FeedIcon from "@mui/icons-material/Feed";
import ChatIcon from "@mui/icons-material/Chat";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import GroupsIcon from "@mui/icons-material/Groups";
import WorkIcon from "@mui/icons-material/Work";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import CloseFriend from "../closeFriend/CloseFriend";
import { useTranslation } from "react-i18next";

function Sidebar({ friends }) {
  const { t } = useTranslation();
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <ul className="sidebarList">
          <li className="sidebarListItem">
            <FeedIcon className="sidebarIcon"></FeedIcon>
            <span className="sidebarListItemText">{t("Sidebar.feed")}</span>
          </li>
          <li className="sidebarListItem">
            <ChatIcon className="sidebarIcon"></ChatIcon>
            <span className="sidebarListItemText">{t("Sidebar.chat")}</span>
          </li>
          <li className="sidebarListItem">
            <OndemandVideoIcon className="sidebarIcon"></OndemandVideoIcon>
            <span className="sidebarListItemText">{t("Sidebar.videos")}</span>
          </li>
          <li className="sidebarListItem">
            <GroupsIcon className="sidebarIcon"></GroupsIcon>
            <span className="sidebarListItemText">{t("Sidebar.groups")}</span>
          </li>
          <li className="sidebarListItem">
            <WorkIcon className="sidebarIcon"></WorkIcon>
            <span className="sidebarListItemText">{t("Sidebar.jobs")}</span>
          </li>
          <li className="sidebarListItem">
            <EventAvailableIcon className="sidebarIcon"></EventAvailableIcon>
            <span className="sidebarListItemText">{t("Sidebar.events")}</span>
          </li>
        </ul>
        <button className="sidebarButton">{t("Sidebar.more")}</button>
        <hr className="sidebarHr" />
        <ul className="sidebarFriendList">
          {friends.slice(0, 20).map((friend) => {
            return <CloseFriend key={friend.uid} user={friend}></CloseFriend>;
          })}
        </ul>
      </div>
    </div>
  );
}

export default React.memo(Sidebar);
