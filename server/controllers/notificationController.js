import mongoose from "mongoose";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import Post from "../models/Post.js";

class notificationController {
  async getNotification(req, res) {
    try {
      const user = await User.findOne({ uid: res.locals.currentUser.uid });
      const notifications = await Notification.find({
        owner: user._id,
      }).populate({
        path: "causer",
        select: "uid displayName photoURL -_id",
      });
      res.status(200).json(notifications);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  /**
   * TODO: read a notification by id
   * *req.params.id
   * @param {Object} req
   * @param {Object} res
   */
  async readNotification(req, res) {
    try {
      const notification = await Notification.findByIdAndUpdate(req.params.id, {
        isReaded: 1,
      });
      res.status(200).json(notification);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  /**
   * TODO: read all notification by ownerId
   * *req.body.ownerId
   * @param {Object} req
   * @param {Object} res
   */
  async readNotifications(req, res) {
    try {
      const user = await User.findOne({ uid: res.locals.currentUser.uid });
      const notification = await Notification.updateMany(
        { owner: user._id },
        {
          isReaded: 1,
        }
      );
      res.status(200).json(notification);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  /**
   * TODO: delete all notification by ownerId
   * *req.params.ownerId
   * @param {Object} req
   * @param {Object} res
   */
  async deleteNotifications(req, res) {
    try {
      const user = await User.findOne({ uid: res.locals.currentUser.uid });
      const deleted = await Notification.deleteMany({
        owner: user._id,
      });
      res.status(200).json(deleted);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}

export default new notificationController();
