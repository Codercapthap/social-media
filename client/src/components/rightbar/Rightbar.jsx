import { memo } from "react";
import "./rightbar.css";
import HomeRightbar from "../homeRightbar/HomeRightbar";
import ProfileRightbar from "../profileRightbar/ProfileRightbar";

function Rightbar({ user }) {
  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {user ? (
          <ProfileRightbar user={user}></ProfileRightbar>
        ) : (
          <HomeRightbar></HomeRightbar>
        )}
      </div>
    </div>
  );
}

export default memo(Rightbar);
