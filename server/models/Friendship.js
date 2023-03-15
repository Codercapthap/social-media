import mongoose, { mongo } from "mongoose";

const FriendshipSchema = new mongoose.Schema({
  members: [{ type: mongoose.Types.ObjectId, ref: "User", required: true }],
});

export default mongoose.model("Friendship", FriendshipSchema);
