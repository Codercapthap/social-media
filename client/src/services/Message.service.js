import http from "../helpers/http";

export const Message = {
  /**
   * TODO: create message
   * @param {string} content
   * @param {string} conversationId
   * @param {Number} isReaded
   * @returns {Promise<Object>}
   */
  async createMessage(content, conversationId, isReaded = 0) {
    try {
      const res = await http.post("message", {
        text: content,
        conversationId,
        isReaded,
      });
      return res.data;
    } catch (err) {
      console.log(err);
      return err;
    }
  },

  /**
   * TODO: get first message of a conversation
   * @param {string} conversationId
   * @returns {Promise<Object>}
   */
  async getFirstMessage(conversationId) {
    try {
      const res = await http.get(`message/${conversationId}/lastMessage`);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  },

  /**
   * TODO: get conversation messages
   * @param {string} conversationId
   * @returns {Promise<Array>}
   */
  async getMessages(conversationId, number) {
    try {
      const res = await http.get(`message/${conversationId}/${number}`);
      console.log(res.data);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  },

  /**
   *
   * @param {string} conversationId
   * @returns {Promise<Object>}
   */
  async readMessage(conversationId) {
    try {
      const res = await http.put("message/readMessage/" + conversationId);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  },
};
