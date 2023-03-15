import mongoose, { Mongoose } from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    causer: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    post: { type: mongoose.Types.ObjectId, ref: "Post" },
    type: {
      type: String,
      required: true,
    },
    isReaded: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", NotificationSchema);
