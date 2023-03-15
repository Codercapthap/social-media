import React from "react";
import "./message.css";
import { format } from "timeago.js";
import { memo } from "react";

function Message({ message, own, ownerId }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <img
          src={message.sender?.photoURL || PF + "person/noAvatar.webp"}
          alt=""
          className="messageImg"
        />
        <p className="messageText">{message.text}</p>
      </div>
      <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  );
}
export default memo(Message);
