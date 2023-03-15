import express from "express";
import notificationController from "../controllers/notificationController.js";

const router = express.Router();

// get notification
// !OK
router.get("/", notificationController.getNotification);

// read notification
// !OK
router.put("/:id/read", notificationController.readNotification);

// read notifications
// !OK
router.put("/read", notificationController.readNotifications);

// delete notification
// !OK
router.delete("/delete", notificationController.deleteNotifications);

export default router;
