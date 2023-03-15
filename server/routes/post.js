import express from "express";
import { postController } from "../controllers/index.js";
const router = express.Router();

// create post
// !OK
router.post("/", postController.createPost);

// update post
// !OK
router.put("/:id", postController.updatePost);

// delete post
// !OK
router.delete("/:id", postController.deletePost);

// like/dislike post
// !OK
router.put("/:id/like", postController.likePostHandle);

// get timeline post
// !OK
router.get("/timeline/:number", postController.getTimelinePost);

// get user post
// !OK
router.get("/profile/:userId/:number", postController.getUserPost);

// get post
// !OK
router.get("/:id", postController.getPost);

export default router;
