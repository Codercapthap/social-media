import { getUserById, getUserByName } from "../utils/index.js";
import User from "../models/User.js";
import { getAuth } from "../config/firebase.js";

class userController {
  /**
   * TODO: get user by userId
   * *req.query.userId
   * @param {Object} req
   * @param {Object} res
   * @returns {Promise<Object>}
   */
  async getUser(req, res) {
    try {
      if (req.query.userId) {
        getUserById(req.query.userId).then((user) => {
          res.status(200).json(user);
        });
      } else res.status(403).json(new Error("request invalid"));
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }

  /**
   * TODO: get user by displayName
   * *req.params.name, req.params.number
   * @param {Object} req
   * @param {Object} res
   */
  async getUserByName(req, res) {
    try {
      if (req.params.name) {
        const users = await getUserByName(req.params.name, req.params.number);
        res.status(200).json(users);
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }

  /**
   * TODO: create user
   * *req.body with full data
   * @param {Object} req
   * @param {Object} res
   */
  async createUser(req, res) {
    try {
      const user = new User(req.body);
      const savedUser = await user.save();
      res.status(200).json(savedUser);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }

  /**
   * TODO: update user
   * *req.body with full data to update and req.params.id with uid
   * @param {Object} req
   * @param {Object} res
   */
  async updateUser(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { uid: res.locals.currentUser.uid },
        req.body
      );
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  /**
   * * req.body.userId
   * @param {Object} req
   * @param {Object} res
   */
  async disableUser(req, res) {
    try {
      const user = await User.findOne({ uid: res.locals.currentUser.uid });
      if (user.isAdmin) {
        getAuth.updateUser(req.params.id, {
          disabled: true,
        });

        await User.findOneAndUpdate(
          { uid: req.params.id },
          {
            disabled: true,
          }
        );
      }
      res.status(200).json();
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }

  /**
   * * req.body.userId
   * @param {Object} req
   * @param {Object} res
   */
  async enableUser(req, res) {
    try {
      const user = await User.findOne({ uid: res.locals.currentUser.uid });
      if (user.isAdmin) {
        await getAuth.updateUser(req.params.id, {
          disabled: false,
        });
        await User.findOneAndUpdate(
          { uid: req.params.id },
          {
            disabled: false,
          }
        );
      }
      res.status(200).json();
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
}

export default new userController();
