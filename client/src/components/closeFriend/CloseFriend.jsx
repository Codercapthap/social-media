import "./closeFriend.css";
import { Link } from "react-router-dom";

export default function CloseFriend({ user }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <li className="sidebarFriend">
      <Link to={`/profile/${user.uid}`}>
        <img
          src={user.photoURL ? user.photoURL : PF + "person/noAvatar.webp"}
          alt=""
          className="sidebarFriendImg"
        />
      </Link>
      <span className="sidebarFriendName">{user.displayName}</span>
    </li>
  );
}
