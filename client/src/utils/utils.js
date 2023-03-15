import { User } from "../services/User.service.js";
import { Notification } from "../services/Notification.service.js";
import { Conversation } from "../services/Conversation.service.js";
import { Message } from "../services/Message.service.js";

export const Utils = {
  /**
   * TODO: send request to create notification for all friends of a user
   * @param {string} userId
   * @param {string} postId
   */
  async emitNotiToAllFriend(userId, postId) {
    const friends = await User.getFriends(userId);
    friends.map(async (friend) => {
      await Notification.createNotification(friend.uid, userId, postId, "post");
    });
  },

  /**
   * TODO: send request to create notification for all user reply and owner of root comment
   * @param {string} userId
   * @param {string} postId
   * @param {Array} userIdList
   */
  async emitNotiToAllUser(userId, userIdList, postId) {
    userIdList.map(async (id) => {
      await Notification.createNotification(id, userId, postId, "reply");
    });
  },

  async getConversations() {
    try {
      const conversationList = await Conversation.getConversationList();
      // let result = [];
      // await Promise.all(
      //   conversationList.map(async (conversation) => {
      //     const firstMessage = await Message.getFirstMessage(conversation._id);
      //     if (conversation.members[0] !== userId) {
      //       const user = await User.getUserById(conversation.members[0]);
      //       return { conversation, user, firstMessage };
      //     } else {
      //       const user = await User.getUserById(conversation.members[1]);
      //       return { conversation, user, firstMessage };
      //     }
      //   })
      // ).then((res) => {
      //   result = res;
      // });
      return conversationList;
    } catch (err) {
      console.log(err);
    }
  },
};
