import mongoose, { Mongoose } from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    desc: {
      type: String,
      max: 500,
    },
    imgs: {
      type: Array,
    },
    likes: [{ type: mongoose.Types.ObjectId, ref: "User", default: [] }],
  },
  { timestamps: true }
);

export default mongoose.model("Post", PostSchema);
