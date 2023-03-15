import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema(
  {
    members: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    lastMessage: {
      type: mongoose.Types.ObjectId,
      ref: "Message",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Conversation", ConversationSchema);
