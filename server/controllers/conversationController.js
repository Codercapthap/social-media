import mongoose from "mongoose";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

class conversationController {
  /**
   * TODO: post conversation to database
   * *req.body.senderId, req.body.receiverId
   * @param {Object} req
   * @param {Object} res
   * @returns {Promise<Object>}
   */
  async createConversation(req, res) {
    try {
      const sender = await User.findOne({ uid: res.locals.currentUser.uid });
      const receiver = await User.findOne({ uid: req.body.receiverId });
      const newConversation = new Conversation({
        members: [sender, receiver],
      });
      const savedConversation = await newConversation.save();
      res.status(200).json(savedConversation);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  /**
   * *req.params.userId
   * @param {Object} req
   * @param {Object} res
   * @returns {Promise<Array>}
   */
  async getConversationByUserId(req, res) {
    try {
      const user = await User.findOne({ uid: res.locals.currentUser.uid });
      const conversations = await Conversation.find({
        members: user._id,
      })
        .populate({
          path: "members",
          match: { _id: { $ne: user._id } },
          select: "-_id",
        })
        .populate({
          path: "lastMessage",
          model: "Message",
          populate: { path: "sender", select: "-_id" },
        });
      const filteredConversation = await conversations.map((conversation) => {
        const members = conversation.members;
        const lastMessage = conversation.lastMessage;
        const id = conversation._id;
        const updatedAt = conversation.updatedAt;
        const otherUser =
          typeof members[0] === "object" ? members[0] : members[1];
        return { lastMessage, id, updatedAt, otherUser };
      });
      res.status(200).json(filteredConversation);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }

  /**
   * *req.params.firstUserId, req.params.secondUserId
   * @param {Object} req
   * @param {Object} res
   * @returns {Promise<Object>}
   */
  async getConversationOfTwoUser(req, res) {
    try {
      // find that conversation
      const currentUser = await User.findOne({
        uid: res.locals.currentUser.uid,
      });
      const otherUser = await User.findOne({ uid: req.params.secondUserId });
      const conversation = await Conversation.findOne({
        members: {
          $all: [currentUser._id, otherUser._id],
        },
      })
        .populate({
          path: "members",
          match: { _id: { $ne: currentUser._id } },
          select: "-_id",
        })
        .populate({
          path: "lastMessage",
          model: "Message",
          populate: { path: "sender", select: "-_id" },
        });
      // if that conversation doesn't exist, create it
      if (!conversation) {
        try {
          const newConversation = new Conversation({
            members: [currentUser, otherUser],
          });
          let savedConversation = await newConversation.save();

          savedConversation = await Conversation.populate(savedConversation, {
            path: "members",
            match: { _id: { $ne: currentUser._id } },
            select: "-_id",
          });
          savedConversation = await Conversation.populate(savedConversation, {
            path: "lastMessage",
            model: "Message",
            populate: { path: "sender", select: "-_id" },
          });

          const filteredConversation = {
            lastMessage: savedConversation.lastMessage,
            id: savedConversation._id,
            updatedAt: savedConversation.updatedAt,
            otherUser:
              typeof savedConversation.members[0] === "object"
                ? savedConversation.members[0]
                : savedConversation.members[1],
          };
          res.status(200).json(filteredConversation);
        } catch (err) {
          res.status(500).json(err);
        }
      } else {
        // update read message
        const updated = await Message.updateMany(
          { conversation: conversation._id },
          { isReaded: 1 }
        );
        const filteredConversation = {
          lastMessage: conversation.lastMessage,
          id: conversation._id,
          updatedAt: conversation.updatedAt,
          otherUser:
            typeof conversation.members[0] === "object"
              ? conversation.members[0]
              : conversation.members[1],
        };
        res.status(200).json(filteredConversation);
      }
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
}

export default new conversationController();
