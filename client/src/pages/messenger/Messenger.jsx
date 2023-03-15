import React, { useEffect, useRef, useCallback } from "react";
import "./messenger.css";
import Topbar from "../../components/topbar/Topbar";
import Conversation from "../../components/conversation/Conversation";
import Message from "../../components/message/Message";
import ChatOnline from "../../components/chatOnline/ChatOnline";
import { socket } from "../../helpers/http";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Message as MessageService } from "../../services/Message.service";
import { readNewMessage } from "../../store/Actions/ConversationsAction";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useLocation } from "react-router-dom";
import SearchConversation from "../../components/searchConversation/SearchConversation";
import { useTranslation } from "react-i18next";

export default function Messenger() {
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [numberMessage, setNumberMessage] = useState(20);
  const [isAll, setIsAll] = useState(false);
  const [scrollHidden, setScrollHidden] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const chatBoxTopRef = useRef();
  const location = useLocation();
  const input = useRef();
  const searchInputRef = useRef();
  const currentUser = useSelector((state) => {
    return state.User.currentUser;
  });
  const scrollRef = useRef();
  const friendOnlineList = useSelector((state) => {
    return state.Online.friendOnlineList;
  });
  const conversations = useSelector((state) => {
    return state.Conversations.conversations;
  });
  const arrivalMessage = useSelector((state) => {
    return state.NewMessage.newMessage;
  });
  const dispatch = useDispatch();
  const { t } = useTranslation();

  /**
   * TODO: if we mount this with a conversation, it will be set to the current conversation
   */
  useEffect(() => {
    if (location.state?.conversation) {
      setCurrentChat(location.state.conversation);
      MessageService.getMessages(location.state.conversation.id, 7).then(
        (res) => {
          setMessages(res);
        }
      );
    }
  }, []);

  // TODO: get conversation messages
  useEffect(() => {
    if (currentChat?.id) {
      MessageService.getMessages(currentChat?.id, 7).then((res) => {
        setMessages(res);
      });
    } else if (currentChat?._id) {
      MessageService.getMessages(currentChat?._id, 7).then((res) => {
        setMessages(res);
      });
    }
  }, [currentChat]);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.id === arrivalMessage.conversation._id &&
      setMessages((prev) => [arrivalMessage, ...prev]);
  }, [arrivalMessage]);

  const onCurrentChat = useCallback(
    (c) => {
      setCurrentChat(c);
    },
    [currentUser]
  );

  // TODO: emit send message event and post message to server
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentChat?.id) {
      socket.emit("sendMessage", {
        senderId: currentUser.uid,
        receiverId: currentChat.otherUser.uid,
        text: newMessage,
        conversationId: currentChat.id,
      });
    } else if (currentChat?._id) {
      socket.emit("sendMessage", {
        senderId: currentUser.uid,
        receiverId: currentChat.otherUser.uid,
        text: newMessage,
        conversationId: currentChat._id,
      });
    }

    input.current.style.height = "100%";
    setNewMessage("");
  };

  const getMoreMessages = () => {
    if (currentChat?.id) {
      MessageService.getMessages(currentChat?.id, numberMessage).then((res) => {
        if (messages.length === res.length) setIsAll(true);
        setMessages(res);
        setNumberMessage((state) => {
          return state + 10;
        });
      });
    } else if (currentChat?._id) {
      MessageService.getMessages(currentChat?._id, numberMessage).then(
        (res) => {
          if (messages.length === res.length) setIsAll(true);
          setMessages(res);
          setNumberMessage((state) => {
            return state + 10;
          });
        }
      );
    }
  };

  const scrollHandle = () => {
    if (chatBoxTopRef.current) {
      if (
        chatBoxTopRef.current.scrollTop <=
          chatBoxTopRef.current.scrollHeight -
            chatBoxTopRef.current.offsetHeight -
            200 &&
        chatBoxTopRef.current.scrollHeight >=
          chatBoxTopRef.current.offsetHeight + 200
      )
        setScrollHidden(false);
      else {
        setScrollHidden(true);
      }
    }
  };

  const handleScrollDown = () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <>
      <Topbar></Topbar>
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input
              type="text"
              placeholder={t("Messenger.searchFriend")}
              className="chatMenuInput"
              value={searchInput}
              ref={searchInputRef}
              onChange={(e) => {
                setSearchInput(e.target.value);
              }}
            />
            {searchInput ? (
              <SearchConversation
                searchInput={searchInput}
                onCurrentChat={onCurrentChat}
              ></SearchConversation>
            ) : (
              conversations.map((c) => {
                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      MessageService.readMessage(c.id);
                      setIsAll(false);
                      setNumberMessage(20);
                      dispatch(readNewMessage(c.id));
                      setCurrentChat(c);
                    }}
                    className="conversationDiv"
                  >
                    <Conversation conversation={c}></Conversation>
                    {c.lastMessage &&
                      c.lastMessage.isReaded === 0 &&
                      c.lastMessage.sender.uid !== currentUser.uid && (
                        <span className="conversationNotRead"></span>
                      )}
                  </div>
                );
              })
            )}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                <div
                  className="chatBoxTop"
                  ref={chatBoxTopRef}
                  onScroll={scrollHandle}
                >
                  {!isAll && (
                    <button
                      className="loadMoreMessage"
                      onClick={getMoreMessages}
                    >
                      {t("Messenger.loadMore")}
                    </button>
                  )}
                  {messages
                    .slice()
                    .reverse()
                    .map((m) => {
                      return (
                        <div key={m._id}>
                          <Message
                            message={m}
                            own={m.sender.uid === currentUser.uid}
                            ownerId={m.sender.uid}
                          ></Message>
                        </div>
                      );
                    })}
                  {!scrollHidden && (
                    <button
                      className="scrollDownButton"
                      onClick={handleScrollDown}
                    >
                      <ArrowDownwardIcon></ArrowDownwardIcon>
                    </button>
                  )}
                  <div ref={scrollRef}></div>
                </div>
                <div className="chatBoxBottom">
                  <textarea
                    className="chatMessageInput"
                    name=""
                    id=""
                    value={newMessage}
                    ref={input}
                    onChange={(e) => {
                      setNewMessage(e.target.value);
                      e.target.style.height = "auto";
                      e.target.style.height = `${e.target.scrollHeight}px`;
                    }}
                  ></textarea>
                  <button className="chatSubmitButton" onClick={handleSubmit}>
                    Send
                  </button>
                </div>
              </>
            ) : (
              <div className="noConversationContainer">
                <span className="noConversationText">
                  {t("Messenger.openConversationMessage")}
                </span>
                <button
                  className="noConversationButton"
                  onClick={() => {
                    searchInputRef.current.focus();
                  }}
                >
                  {t("Messenger.startChat")}
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <ChatOnline
              friendOnlineList={friendOnlineList}
              onCurrentChat={onCurrentChat}
            ></ChatOnline>
          </div>
        </div>
      </div>
      ;
    </>
  );
}
