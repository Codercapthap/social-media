import React from "react";
import Topbar from "../../components/topbar/Topbar.jsx";
import Sidebar from "../../components/sidebar/Sidebar.jsx";
import Rightbar from "../../components/rightbar/Rightbar.jsx";
import Feed from "../../components/feed/Feed.jsx";
import "./home.css";
import { useSelector } from "react-redux";

export default function Home() {
  const friends = useSelector((state) => {
    return state.User.friends;
  });
  return (
    <>
      <Topbar></Topbar>
      <div className="homeContainer">
        <Sidebar friends={friends}></Sidebar>
        <Feed></Feed>
        <Rightbar></Rightbar>
      </div>
    </>
  );
}
