import mongoose, { mongo } from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    // conversationId: {
    //   type: String,
    // },
    conversation: {
      type: mongoose.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    // sender: {
    //   type: String,
    // },
    sender: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    text: {
      type: String,
    },
    isReaded: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Message", MessageSchema);
