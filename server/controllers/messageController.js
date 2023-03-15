import mongoose from "mongoose";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

class messageController {
  /**
   * *req.body = {senderId, conversationId, content, isReaded}
   * @param {Object} req
   * @param {Object} res
   * @returns {Promise<Object>}
   */
  async createMessage(req, res) {
    try {
      const sender = await User.findOne({ uid: res.locals.currentUser.uid });
      const conversation = await Conversation.findById(req.body.conversationId);
      const newMessage = new Message({
        sender: sender,
        text: req.body.content,
        conversation: conversation,
        isReaded: req.body.isReaded,
      });
      const savedMessage = await newMessage.save();
      await Conversation.findOneAndUpdate(
        { _id: conversation._id },
        { lastMessage: savedMessage }
      );
      res.status(200).json(savedMessage);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  /**
   * *req.params.conversationId, *req.params.pages
   * @param {Object} req
   * @param {Object} res
   * @returns {Promise<Array>}
   */
  async getMessageOfConversation(req, res) {
    try {
      const messages = await Message.find({
        conversation: req.params.conversationId,
      })
        .populate({ path: "sender", select: "-_id" })
        .sort({ createdAt: -1 })
        .limit(req.params.number);
      res.status(200).json(messages);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  /**
   * *req.params.conversationId
   * @param {Object} req
   * @param {Object} res
   * @returns {Promise<string>}
   */
  async readMessageConversation(req, res) {
    try {
      const conversation = await Conversation.findById(
        req.params.conversationId
      ).populate("lastMessage");
      const user = await User.findOne({ uid: res.locals.currentUser.uid });
      if (
        conversation.lastMessage &&
        !conversation.lastMessage.sender.equals(user._id)
      ) {
        const updated = await Message.updateMany(
          {
            conversation: conversation._id,
          },
          { isReaded: 1 }
        );
        res.status(200).json(updated);
      } else res.status(200).json("nothing to update");
      // }
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
}

export default new messageController();
