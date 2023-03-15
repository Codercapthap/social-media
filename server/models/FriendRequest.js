import mongoose, { mongo } from "mongoose";

const FriendRequestSchema = new mongoose.Schema({
  requester: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  recipient: { type: mongoose.Types.ObjectId, ref: "User", required: true },
});

export default mongoose.model("FriendRequest", FriendRequestSchema);
