import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// connect database
export default function connectDB() {
  try {
    mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("connect successfully");
  } catch (err) {
    console.log(err);
  }
}
