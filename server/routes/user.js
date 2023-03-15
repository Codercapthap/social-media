import express from "express";
import { userController, friendshipController } from "../controllers/index.js";
const router = express.Router();

// add friend
// !OK
router.post("/:id/addFriend", friendshipController.addFriend);

// unadd friend
// !OK
router.put("/:id/unAddFriend", friendshipController.takeBackFriendRequest);

// accept friend
// !OK
router.put("/:id/acceptFriend", friendshipController.acceptFriendRequest);

// unfriend
// !OK
router.put("/:id/unfriend", friendshipController.unfriend);

// declineFriendRequest
//!OK
router.put("/:id/declineFriend", friendshipController.declineFriendRequest);

// get friend requested
// !OK
router.get("/friendRequested", friendshipController.getRequested);

// get friend received
// !OK
router.get("/friendReceived", friendshipController.getReceived);

// get status friendship
// !OK
router.get("/friends/getStatus/", friendshipController.getFriendStatus);

//get friends
// !OK
router.get("/friends/:userId", friendshipController.getFriends);

// disable user
router.put("/:id/disable", userController.disableUser);

// enable user
router.put("/:id/enable", userController.enableUser);

// get user by name
// !OK
router.get("/:name/:number", userController.getUserByName);

// get user
// ! OK
router.get("/", userController.getUser);

// create user
// ! OK
router.post("/", userController.createUser);

// update user
// !OK
router.put("/", userController.updateUser);

export default router;
