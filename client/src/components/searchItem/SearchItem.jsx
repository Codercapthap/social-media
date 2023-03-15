import React from "react";
import "./searchItem.css";

export default function SearchItem({ user }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <div className="searchItemContainer">
      <img
        src={user.photoURL || PF + "person/noAvatar.webp"}
        alt=""
        className="searchItemImg"
      />
      <div className="searchItemText">
        <p className="searchItemName">{user.displayName}</p>
        <p className="searchItemDesc">{user.desc}</p>
      </div>
    </div>
  );
}
