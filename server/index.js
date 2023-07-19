import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import connectDB from "./database/db.js";
import { fileURLToPath } from "url";
import { route } from "./routes/index.js";
import "./websocket/index.js";
import middleware from "./middleware/index.js";
import multer from "multer";

//* variables and configs
const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config();
// const __dirname = process.env.DIRNAME;

connectDB();
//* middlewares
app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use("/videos", express.static(path.join(__dirname, "public/videos")));
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);
app.use(helmet());
// app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));

//* Export API
app.get("/", (req, res, next) => {
  res.status(200).json({
    name: "Boken social",
    code: "CT501",
    author: "Nguyen Bach Khiem, Nguyen An Vi, Dam Thanh Tien",
  });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/videos");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
  onError: function (err, next) {
    console.log("error", err);
    next(err);
  },
});

const upload = multer({ storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json(`/videos/${req.body.name}`);
});

app.use(middleware.decodeToken);
//* main api
route(app);
//Catch Error
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

//Log Error
app.use((err, req, res, next) => {
  const error = app.get("env") === "development" ? err : {};
  const status = err.status || 500;

  return res.status(status).json({
    error: {
      message: error.message,
    },
  });
});

const PORT = process.env.PORT || 9000;
//* main listening port
app.listen(PORT, () => {
  console.log("server is running");
});
