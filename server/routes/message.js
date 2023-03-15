import express from "express";
import { messageController } from "../controllers/index.js";

const router = express.Router();

// create message
// !OK
router.post("/", messageController.createMessage);

// get the last message of a conversation
// router.get(
//   "/:conversationId/lastMessage",
//   messageController.getLastMessageOfConversation
// );

// get a conversation's messages
//!OK
router.get(
  "/:conversationId/:number",
  messageController.getMessageOfConversation
);

// read messages of a conversation
// !OK
router.put(
  "/readMessage/:conversationId",
  messageController.readMessageConversation
);

export default router;
