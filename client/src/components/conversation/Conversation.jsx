import React, { memo } from "react";
import "./conversation.css";

function Conversation({ conversation }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  return (
    <div className="conversation">
      <img
        src={
          conversation.otherUser.photoURL
            ? conversation.otherUser.photoURL
            : PF + "person/noAvatar.webp"
        }
        className="conversationImg"
        alt=""
      />
      <span className="conversationName">
        {conversation.otherUser.displayName}
      </span>
    </div>
  );
}

export default memo(Conversation);
