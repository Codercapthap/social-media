import express from "express";
import { conversationController } from "../controllers/index.js";

const router = express.Router();

// get a conversation between two user
// !OK
router.get(
  "/find/:secondUserId",
  conversationController.getConversationOfTwoUser
);

// create conversation
//!OK
router.post("/", conversationController.createConversation);

// get all user's conversations
// !OK
router.get("/", conversationController.getConversationByUserId);

export default router;
