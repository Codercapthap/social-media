import "./closeFriend.css";

export default function CloseFriend({ user }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <li className="sidebarFriend">
      <img
        src={user.photoURL ? user.photoURL : PF + "person/noAvatar.webp"}
        alt=""
        className="sidebarFriendImg"
      />
      <span className="sidebarFriendName">{user.displayName}</span>
    </li>
  );
}
