import mongoose, { mongo } from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    post: { type: mongoose.Types.ObjectId, ref: "Post", required: true },
    content: { type: String },
    likes: [{ type: mongoose.Types.ObjectId, ref: "User", default: [] }],
    parent: { type: mongoose.Types.ObjectId, ref: "Comment" },
  },
  { timestamps: true }
);

export default mongoose.model("Comment", CommentSchema);
