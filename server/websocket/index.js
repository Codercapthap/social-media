import { Server } from "socket.io";
import Message from "../models/Message.js";
import { getFriends, getUserById } from "../utils/index.js";
import Notification from "../models/Notification.js";
import Conversation from "../models/Conversation.js";
import User from "../models/User.js";
import Post from "../models/Post.js";

const io = new Server(8900, {
  cors: {
    origin: ["http://127.0.0.1:3000", "http://localhost:3000"],
  },
});

let users = [];

const onConnection = (socket) => {
  /**
   * TODO: get user in socket by id
   * @param {string} userId
   * @returns {Object}
   */
  const getUser = (userId) => {
    return users.find((user) => {
      return user.userId === userId;
    });
  };

  /**
   * TODO: add user to users socket
   * @param {string} userId
   * @param {string} socketId
   */
  const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
      users.push({ userId, socketId });
  };

  /**
   * TODO: remove user out of users socket
   * @param {string} socketId
   */
  const removeUser = (socketId) => {
    users = users.filter((user) => {
      return user.socketId !== socketId;
    });
  };

  // handle for add a user event
  socket.on("addUser", (userId) => {
    console.log("a user connected");
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  // handle for disconnect event
  socket.on("disconnect", () => {
    console.log("a user disconnected");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });

  // handle for send message event
  socket.on(
    "sendMessage",
    async ({ senderId, receiverId, text, conversationId }) => {
      console.log(senderId, receiverId, text, conversationId);
      const user = getUser(receiverId);
      const sendUser = getUser(senderId);
      const conversation = await Conversation.findById(conversationId);
      const sender = await User.findOne({ uid: senderId });
      const newMessage = new Message({
        sender: sender,
        conversation: conversation,
        text: text,
        isReaded: 0,
      });
      const savedMessage = await newMessage.save();
      const updatedConversation = await conversation.updateOne(
        {
          lastMessage: savedMessage,
        },
        { new: true }
      );
      io.to(user?.socketId).emit("getMessage", {
        savedMessage,
        updatedConversation,
      });
      io.to(sendUser?.socketId).emit("getMessage", {
        savedMessage,
        updatedConversation,
      });
    }
  );

  // handle for friend request
  socket.on("requestFriend", async ({ ownId, currentId, friendship }) => {
    const user = getUser(ownId);
    const currentUser = getUser(currentId);
    if (user && currentUser) {
      getUserById(friendship.data.requester.uid).then((res) => {
        const { uid, displayName, photoURL } = res;
        const data = { uid, displayName, photoURL };
        io.to(user.socketId).emit("getRequestNoti", { data });
        io.to(currentUser.socketId).emit("getMyRequestNoti", { data });
      });
    }
  });

  // handle for cancel request
  socket.on("cancelRequestFriend", async ({ ownId, friendship }) => {
    if (friendship.data) {
      const user = getUser(ownId);
      const requester = await User.findById(friendship.data.requester);
      if (user) {
        const { uid, displayName, photoURL } = requester;
        const data = { uid, displayName, photoURL };
        io.to(user.socketId).emit("getBackRequest", { data });
      }
    }
  });

  // handle for notification friend accept
  socket.on("acceptFriend", async ({ ownId, currentId }) => {
    const user = getUser(ownId);
    const userObject = await User.findOne({ uid: currentId });
    const ownerObject = await User.findOne({ uid: ownId });
    const notification = new Notification({
      owner: ownerObject,
      causer: userObject,
      type: "accept",
      isReaded: 0,
    });
    const savedNotification = await notification.save();
    if (user) {
      io.to(user.socketId).emit("getNotification", { savedNotification });
    }
  });

  // handle for newFeed
  socket.on("createPost", async ({ userId, postId }) => {
    const userObject = await User.findOne({ uid: userId });
    const friends = await getFriends(userObject._id);
    const postObject = await Post.findById(postId);
    console.log(postObject, postId);
    friends.map(async (friend) => {
      const friendObject = await User.findOne({ uid: friend.uid });
      const notification = new Notification({
        owner: friendObject,
        causer: userObject,
        post: postObject,
        type: "post",
        isReaded: 0,
      });
      const savedNotification = await notification.save();
      const user = getUser(friend.uid);
      if (user) {
        io.to(user.socketId).emit("getNotification", {
          savedNotification,
        });
      }
    });
  });

  // handle for notification with comment
  socket.on("replyComment", async ({ userId, userForNotiId, postId }) => {
    const userObject = await User.findOne({ uid: userId });
    const post = await Post.findById(postId);
    userForNotiId.map(async (id) => {
      const owner = await User.findOne({ uid: id });
      const notification = new Notification({
        owner: owner,
        causer: userObject,
        post: post,
        type: "reply",
        isReaded: 0,
      });
      const savedNotification = await notification.save();
      const user = getUser(id);
      if (user) {
        io.to(user.socketId).emit("getNotification", {
          savedNotification,
        });
      }
    });
  });
};

io.on("connection", onConnection);
