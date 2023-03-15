import React, { memo, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { User } from "../../services/User.service";
import "./searchConversation.css";
import { Conversation } from "../../services/Conversation.service";

function SearchConversation({ searchInput, onCurrentChat }) {
  const [friends, setFriends] = useState([]);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const currentUser = useSelector((state) => {
    return state.User.currentUser;
  });
  useEffect(() => {
    User.getFriends(currentUser.uid).then((friends) => {
      setFriends(friends);
    });
  }, []);

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
    <div className="conversationSearchContainer">
      {friends.map(
        (friend) =>
          friend.displayName
            .toLowerCase()
            .includes(searchInput.toLowerCase()) && (
            <div
              key={friend.uid}
              className="ConversationSearchItem"
              onClick={() => handleClick(friend)}
            >
              <div className="ConversationSearchItemImgContainer">
                <img
                  className="ConversationSearchItemImg"
                  src={
                    friend.photoURL
                      ? friend.photoURL
                      : PF + "person/noAvatar.webp"
                  }
                  alt=""
                />
              </div>
              <span className="ConversationSearchItemName">
                {friend.displayName}
              </span>
            </div>
          )
      )}
    </div>
  );
}

export default memo(SearchConversation);
