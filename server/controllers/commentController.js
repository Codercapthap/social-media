import Comment from "../models/Comment.js";
import User from "../models/User.js";
import Post from "../models/Post.js";

class commentController {
  /**
   * TODO: create a comment
   * *req.body.userId, req.body.content, req.body.parentId, req.body.postId
   * @param {Object} req
   * @param {Object} res
   */
  async createComment(req, res) {
    if (req.body.content) {
      try {
        const parent = await Comment.findById(req.body.parentId);
        const owner = await User.findOne({ uid: res.locals.currentUser.uid });
        const post = await Post.findById(req.body.postId);
        const comment = new Comment({
          owner: owner,
          content: req.body.content,
          post: post,
          parent: parent,
        });
        const commentSaved = await comment.save();
        res.status(200).json(commentSaved);
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("comment can't be empty");
    }
  }

  /**
   * *req.params.id, req.body.content, req.body.userId
   * @param {Object} req
   * @param {Object} res
   */
  async editComment(req, res) {
    try {
      const comment = await Comment.findById(req.params.id);
      const user = await User.findOne({ uid: res.locals.currentUser.uid });
      if (comment.owner.equals(user._id)) {
        if (!req.body.content) {
          res.status(403).json("comment can't be empty");
        } else {
          const updatedComment = await comment.update({
            content: req.body.content,
          });
          res.status(200).json(updatedComment);
        }
      } else {
        res.status(403).json("you can only update your comment");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }

  /**
   * *req.query.postId
   * @param {Object} req
   * @param {Object} res
   */
  async getCommentsByPostId(req, res) {
    try {
      const comments = await Comment.find({
        post: req.params.postId,
        parent: null,
      })
        .populate({ path: "owner", select: "uid displayName photoURL -_id" })
        .sort({ createdAt: -1 })
        .lean();
      const commentsFiltered = await Promise.all(
        comments.map(async (comment) => {
          const replies = await Comment.find({
            parent: comment._id,
          }).populate({
            path: "owner",
            select: "uid displayName photoURL -_id",
          });
          return { ...comment, replies };
        })
      );
      res.status(200).json(commentsFiltered);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  /**
   * *req.body.userId, req.params.id
   * @param {Object} req
   * @param {Object} res
   */
  async likeDislikeComment(req, res) {
    try {
      const comment = await Comment.findById(req.params.id);
      const user = await User.findOne({ uid: res.locals.currentUser.uid });
      if (!comment.likes.includes(user._id)) {
        await comment.updateOne({ $push: { likes: user } });
        res.status(200).json("the comment has been liked");
      } else {
        await comment.updateOne({ $pull: { likes: user._id } });
        res.status(200).json("the comment has been disliked");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }

  /**
   * *req.params.id, req.params.userId
   * @param {Object} req
   * @param {Object} res
   */
  async deleteComment(req, res) {
    try {
      const comment = await Comment.findById(req.params.id);
      const user = await User.findOne({ uid: res.locals.currentUser.uid });
      if (comment.owner.equals(user._id) || user.isAdmin) {
        if (!comment.parent) {
          await Comment.deleteMany({
            parent: comment._id,
          });
        }
        const deleted = await comment.delete();
        res.status(200).json(deleted);
      } else res.status(403).json("you can't delete this comment");
    } catch (err) {
      res.status(500).json(err);
    }
  }
}

export default new commentController();
