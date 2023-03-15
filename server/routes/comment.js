import express from "express";
import { commentController } from "../controllers/index.js";

const router = express.Router();

// create a comment
// !OK
router.post("/", commentController.createComment);

// edit a comment
// !OK
router.put("/:id", commentController.editComment);

// get comments of a post
// !OK
router.get("/:postId", commentController.getCommentsByPostId);

//like a comment
// !OK
router.put("/like", commentController.likeDislikeComment);

// delete a comment
// !OK
router.delete("/:id", commentController.deleteComment);

export default router;
