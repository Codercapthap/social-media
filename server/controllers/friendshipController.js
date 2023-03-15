import Friendship from "../models/Friendship.js";
import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";
import { deleteFriendRequest, getFriends } from "../utils/index.js";

class friendshipController {
  /**
   * TODO: get friendship status of two user
   * *req.query.currentUserId, req.query.userId
   * @param {Object} req
   * @param {Object} res
   * @returns {Promise<string>}
   */
  async getFriendStatus(req, res) {
    try {
      var result;
      const currentUser = await User.findOne({
        uid: res.locals.currentUser.uid,
      });
      const user = await User.findOne({ uid: req.query.userId });
      const friendship = await Friendship.findOne({
        members: { $all: [currentUser._id, user._id] },
      });
      if (friendship) {
        result = "friended";
      } else {
        const doc1 = await FriendRequest.findOne({
          requester: currentUser._id,
          recipient: user._id,
        });
        const doc2 = await FriendRequest.findOne({
          requester: user._id,
          recipient: currentUser._id,
        });
        if (doc1) result = "requester";
        else if (doc2) result = "recipient";
        else result = "notFriend";
      }
      res.status(200).json(result);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }

  /**
   * TODO: get list friend of a user
   * *req.params.userId
   * @param {Object} req
   * @param {Object} res
   * @returns {Promise<Array>}
   */
  async getFriends(req, res) {
    try {
      const currentUser = await User.findOne({
        uid: req.params.userId,
      });
      const friends = await getFriends(currentUser._id);
      res.status(200).json(friends);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }

  /**
   * TODO: create a friendship
   * *req.body.userId, req.params.id
   * @param {Object} req
   * @param {Object} res
   * @returns {Promise<Object>}
   */
  async addFriend(req, res) {
    if (res.locals.currentUser.uid != req.params.id) {
      try {
        const requester = await User.findOne({
          uid: res.locals.currentUser.uid,
        });
        const recipient = await User.findOne({ uid: req.params.id });
        const friendrequest = await FriendRequest.findOne({
          $or: [
            { requester: requester._id, recipient: recipient._id },
            { recipient: recipient._id, requester: requester._id },
          ],
        });
        if (!friendrequest) {
          const newFriendrequest = new FriendRequest({
            requester: requester,
            recipient: recipient,
          });
          const savedFriendrequest = await newFriendrequest.save();
          res.status(200).json(savedFriendrequest);
        } else {
          res.status(403).json("you've already add friend this user");
        }
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("you can't add friend yourself");
    }
  }

  /**
   * TODO: tack back friend request
   * *req.body.userId, req.params.id
   * @param {Object} req
   * @param {Object} res
   * @returns {Promise<string>}
   */
  async takeBackFriendRequest(req, res) {
    if (req.locals.currentUser.uid !== req.params.id) {
      try {
        const requester = await User.findOne({
          uid: res.locals.currentUser.uid,
        });
        const recipient = await User.findOne({ uid: req.params.id });
        const friendRequest = await deleteFriendRequest(
          requester._id,
          recipient._id
        );
        res.status(200).json(friendRequest);
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("you can't take back friend request to yourself");
    }
  }

  /**
   * TODO: accept friend request
   * @param {Object} req
   * @param {Object} res
   * @returns {Promise<string>}
   */
  async acceptFriendRequest(req, res) {
    if (req.body.userId != req.params.id) {
      try {
        const requester = await User.findOne({ uid: req.params.id });
        const recipient = await User.findOne({
          uid: res.locals.currentUser.uid,
        });
        const newFriendship = new Friendship({
          members: [requester, recipient],
        });
        const savedFriendship = await newFriendship.save();
        await deleteFriendRequest(requester._id, recipient._id);
        res.status(200).json(savedFriendship);
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("you can't add friend yourself");
    }
  }

  /**
   * TODO: unfriend
   * @param {Object} req
   * @param {Object} res
   * @returns {Promise<string>}
   */
  async unfriend(req, res) {
    if (req.body.userId != req.params.id) {
      try {
        const user1 = await User.findOne({ uid: res.locals.currentUser.uid });
        const user2 = await User.findOne({ uid: req.params.id });
        const friendship = await Friendship.findOneAndDelete({
          members: { $all: [user1._id, user2._id] },
        });
        res.status(200).json(friendship);
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("you can't unadd friend yourself");
    }
  }

  /**
   * TODO: decline a friend request
   * @param {Object} req
   * @param {Object} res
   * @returns {Promise<string>}
   */
  async declineFriendRequest(req, res) {
    if (req.body.userId != req.params.id) {
      try {
        const requester = await User.findOne({ uid: req.params.id });
        const recipient = await User.findOne({
          uid: res.locals.currentUser.uid,
        });
        const friendRequest = await deleteFriendRequest(requester, recipient);
        res.status(200).json(friendRequest);
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("you can't unadd friend yourself");
    }
  }

  /**
   * TODO: get list of user that this user requested
   * @param {Object} req
   * @param {Object} res
   * @returns {Promise<Array>}
   */
  async getRequested(req, res) {
    try {
      const requester = await User.findOne({ uid: res.locals.currentUser.uid });
      let requestList = await FriendRequest.find({
        requester: requester._id,
      })
        .populate({ path: "recipient", select: "-_id" })
        .select("-_id -requester");
      requestList = requestList.map((request) => {
        return request.recipient;
      });
      res.status(200).json(requestList);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  /**
   * TODO: get list of user requested this user
   * @param {Object} req
   * @param {Object} res
   * @returns {Promise<Array>}
   */
  async getReceived(req, res) {
    try {
      const recipient = await User.findOne({ uid: res.locals.currentUser.uid });
      let receiveList = await FriendRequest.find({
        recipient: recipient._id,
      })
        .populate({ path: "requester", select: "-_id" })
        .select("-_id -recipient");
      receiveList = receiveList.map((receive) => {
        return receive.requester;
      });
      res.status(200).json(receiveList);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}

export default new friendshipController();
