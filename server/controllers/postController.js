import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import { getFriends } from "../utils/index.js";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

class postController {
  /**
   * *req.body = {... post}
   * @param {Object} req
   * @param {Object} res
   * @returns {Promise<Object>}
   */
  async createPost(req, res) {
    try {
      const user = await User.findOne({ uid: res.locals.currentUser.uid });
      const newPost = new Post({
        owner: user,
        desc: req.body.desc,
        imgs: req.body.imgs,
      });
      const savedPost = await newPost.save();
      res.status(200).json(savedPost);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  /**
   * *req.params.id, req.body = {...post}
   * @param {Object} req
   * @param {Object} res
   * @returns {Promise<string>}
   */
  async updatePost(req, res) {
    try {
      const post = await Post.findById(req.params.id);
      const user = await User.findOne({ uid: res.locals.currentUser.uid });
      if (post.owner.equals(user._id)) {
        const newPost = await post.updateOne({ $set: req.body });
        res.status(200).json(newPost);
      } else {
        res.status(403).json("you can update only your post");
      }
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }

  /**
   * *req.params.id, req.params.userId
   * @param {Object} req
   * @param {Object} res
   * @returns {Promise<string>}
   */
  async deletePost(req, res) {
    try {
      const post = await Post.findById(req.params.id);
      const user = await User.findOne({ uid: res.locals.currentUser.uid });
      if (post.owner.equals(user._id) || user.isAdmin) {
        await Comment.deleteMany({ post: post._id });
        await Notification.deleteMany({
          post: post._id,
        });
        const deletedPost = await post.deleteOne();
        res.status(200).json(deletedPost);
      } else {
        res.status(403).json("you can delete only your post");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }

  /**
   * *req.params.id, req.body.userId
   * @param {Object} req
   * @param {Object} res
   * @returns {Promise<string>}
   */
  async likePostHandle(req, res) {
    try {
      const post = await Post.findById(req.params.id);
      const user = await User.findOne({ uid: res.locals.currentUser.uid });
      if (!post.likes.includes(user._id)) {
        await post.updateOne({ $push: { likes: user } });
        res.status(200).json("the post has been liked");
      } else {
        await post.updateOne({ $pull: { likes: user._id } });
        res.status(200).json("the post has been disliked");
      }
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }

  /**
   * *req.params.userId
   * @param {Object} req
   * @param {Object} res
   * @returns {Promise<Array>}
   */
  async getTimelinePost(req, res) {
    try {
      const user = await User.findOne({ uid: res.locals.currentUser.uid });
      const userPost = await Post.find({ owner: user._id }).populate({
        path: "owner",
        select: "-_id",
      });
      const friends = await getFriends(user._id);
      var friendPosts = await Promise.all(
        friends.map(async (friend) => {
          const posts = await Post.find({
            owner: friend._id,
          }).populate({ path: "owner", select: "-_id" });
          return posts;
        })
      );
      friendPosts = friendPosts.filter((friendPost) => {
        return !friendPost[0]?.owner.disabled;
      });
      res.status(200).json(
        userPost
          .concat(...friendPosts)
          .sort((p1, p2) => {
            return new Date(p2.createdAt) - new Date(p1.createdAt);
          })
          .slice(0, req.params.number)
      );
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }

  /**
   * *req.params.username
   * @param {Object} req
   * @param {Object} res
   * @returns {Promise<Array>}
   */
  async getUserPost(req, res) {
    try {
      const user = await User.findOne({ uid: req.params.userId });
      const posts = await Post.find({
        owner: user._id,
      })
        .populate({ path: "owner", select: "-_id" })
        .sort({ createdAt: -1 })
        .limit(req.params.number);
      res.status(200).json(posts);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  /**
   * *req.params.id
   * @param {Object} req
   * @param {Object} res
   * @returns {Promise<Object>}
   */
  async getPost(req, res) {
    try {
      const post = await Post.findById(req.params.id).populate("owner");
      if (post.owner.disabled) {
        res.status(403).json("Bài đăng đã bị ẩn");
      } else {
        res.status(200).json(post);
      }
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }

  /**
   * *req.body.filePath
   * @param {*} req
   * @param {*} res
   */
  async deleteVideo(req, res) {
    try {
      const __dirname = path.dirname(fileURLToPath(import.meta.url));
      // const __dirname = process.env.DIRNAME;
      fs.unlink(path.join(__dirname, `public/${req.query.path}`), (err) => {
        if (err) {
          console.error(err);
          return;
        }

        res.status(200).json("file has been deleted");
      });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
}

export default new postController();
