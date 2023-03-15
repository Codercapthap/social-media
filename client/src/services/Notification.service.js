import http from "../helpers/http";

export const Notification = {
  /**
   * TODO: get all notification by userId
   * @returns {Promise<Array>}
   */
  async getNotification() {
    try {
      const res = await http.get("notification/");
      return res.data;
    } catch (err) {
      console.log(err);
      return err;
    }
  },

  /**
   * TODO: send request read a notification by notification id
   * @param {string} id
   * @returns {Promise<Object>}
   */
  async readNotification(id) {
    try {
      const res = http.put("notification/" + id + "/read");
      return res.data;
    } catch (err) {
      console.log(err);
      return err;
    }
  },

  /**
   * TODO: send request to read all notifications by userId
   * @returns {Promise<Object>}
   */
  async readNotifications() {
    try {
      const res = http.put("notification/read");
      return res.data;
    } catch (err) {
      console.log(err);
      return err;
    }
  },

  /**
   * TODO: send request to delete all notifications by userId
   * @returns {Promise<string>}
   */
  async deleteNotifications() {
    try {
      const res = http.delete("notification/delete/");
      return res.data;
    } catch (err) {
      console.log(err);
      return err;
    }
  },
};
