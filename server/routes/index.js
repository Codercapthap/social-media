import { default as conversationRoute } from "./conversation.js";
import { default as messageRoute } from "./message.js";
import { default as postRoute } from "./post.js";
import { default as userRoute } from "./user.js";
import { default as commentRoute } from "./comment.js";
import { default as notificationRoute } from "./notification.js";

export const route = (app) => {
  app.use("/api/user", userRoute);
  app.use("/api/post", postRoute);
  app.use("/api/conversation", conversationRoute);
  app.use("/api/message", messageRoute);
  app.use("/api/comment", commentRoute);
  app.use("/api/notification", notificationRoute);
};
