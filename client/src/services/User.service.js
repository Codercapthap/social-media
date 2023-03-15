import http, { socket } from "../helpers/http";

export const User = {
  /**
   * TODO: get list friend of a user
   * @param {string} userId
   * @returns {Promise<array>}
   */
  async getFriends(userId) {
    const res = await http.get("user/friends/" + userId);
    return res.data;
  },

  /**
   * TODO: get user by userId
   * @param {string} userId
   * @returns {Promise<Object>}
   */
  async getUserById(userId) {
    const res = await http.get("user?userId=" + userId);
    return res.data;
  },

  /**
   * TODO: get user by name
   * @param {string} name
   * @returns
   */
  async getUserByName(name, number) {
    const res = await http.get(`user/${name}/${number}`);
    return res.data;
  },

  /**
   * TODO: update profile
   * @param {Object} data
   * @param {string} userId
   * @return {Promise<Object>}
   */
  async updateUserProfile(data) {
    // await setDoc(doc(db, "users", userId), data);
    const res = await http.put(`user/`, data);
    return res.data;
  },

  /**
   * TODO: create user
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async createUser(data) {
    const res = await http.post("user", data);
    return res.data;
  },

  /**
   * TODO: accept friend request
   * @param {string} otherId
   * @param {string} currentId
   */
  async acceptFriend(otherId, currentId) {
    await http.put("user/" + otherId + "/acceptFriend");
    socket.emit("acceptFriend", { ownId: otherId, currentId: currentId });
  },

  /**
   * TODO: take the friend requested back
   * @param {string} otherId
   */
  async takeFriendRequestBack(otherId) {
    const friendship = await http.put("user/" + otherId + "/unAddFriend");
    socket.emit("cancelRequestFriend", { ownId: otherId, friendship });
  },

  /**
   * TODO: decline a friend request
   * @param {string} otherId
   */
  async declineFriendRequest(otherId) {
    await http.put("user/" + otherId + "/declineFriend");
  },

  /**
   * TODO: get list user that currentUser requested
   * @returns {Promise<Array>}
   */
  async getFriendRequested() {
    const res = await http.get("user/friendRequested");
    return res.data;
  },

  /**
   * TODO: get list user that requested currentUser
   * @returns {Promise<Array>}
   */
  async getFriendReceived() {
    const res = await http.get("user/friendReceived");
    return res.data;
  },

  /**
   *
   * @param {string} otherId
   * @returns {Promise<string>}
   */
  async getFriendStatus(otherId) {
    try {
      const res = await http.get(`user/friends/getStatus?userId=${otherId}`);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  },

  /**
   * TODO: send request add friend
   * @param {string} otherId
   * @param {string} currentId
   */
  async requestAddFriend(otherId, currentId) {
    try {
      const friendship = await http.post("user/" + otherId + "/addFriend");
      socket.emit("requestFriend", { ownId: otherId, currentId, friendship });
    } catch (err) {
      console.log(err);
    }
  },

  /**
   * TODO: send unfriend request
   * @param {string} otherId
   */
  async unfriend(otherId) {
    try {
      await http.put("user/" + otherId + "/unfriend");
    } catch (err) {
      console.log(err);
    }
  },

  /**
   * TODO: send request to disable an user
   * @param {string} userId
   */
  async disableUser(userId) {
    try {
      await http.put("user/" + userId + "/disable");
    } catch (err) {
      console.log(err);
    }
  },

  /**
   * TODO: send request to enable an user
   * @param {string} userId
   */
  async enableUser(userId) {
    try {
      await http.put("user/" + userId + "/enable");
    } catch (err) {
      console.log(err);
    }
  },
};
