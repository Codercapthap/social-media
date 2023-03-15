import "./chatOnline.css";
import { useState, useEffect, memo } from "react";
import { Conversation } from "../../services/Conversation.service";

function ChatOnline({ friendOnlineList, onCurrentChat }) {
  const [onlineFriends, setOnlineFriends] = useState([]);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  // TODO: set current user being online friend list
  useEffect(() => {
    setOnlineFriends(friendOnlineList);
  }, [friendOnlineList]);

  // TODO: get and set current conversation
  const handleClick = async (user) => {
    try {
      Conversation.getConversation(user.uid).then((conversation) => {
        onCurrentChat(conversation);
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="chatOnline">
      {onlineFriends.map((o) => (
        <div
          key={o.uid}
          className="chatOnlineFriend"
          onClick={() => handleClick(o)}
        >
          <div className="chatOnlineImgContainer">
            <img
              className="chatOnlineImg"
              src={o.photoURL ? o.photoURL : PF + "person/noAvatar.webp"}
              alt=""
            />
            <div className="chatOnlineBadge"></div>
          </div>
          <span className="chatOnlineName">{o.displayName}</span>
        </div>
      ))}
    </div>
  );
}

export default memo(ChatOnline);
