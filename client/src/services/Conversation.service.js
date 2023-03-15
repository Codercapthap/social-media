import http from "../helpers/http";

export const Conversation = {
  /**
   * TODO: get the conversation of two user
   * @param {string} otherId
   * @returns {Promise<Object>}
   */
  async getConversation(otherId) {
    const res = await http.get(`conversation/find/${otherId}`);
    return res.data;
  },

  /**
   * TODO: get a list of conversation of an user
   * @returns {Promise<Array>}
   */
  async getConversationList() {
    const res = await http.get("conversation/");
    return res.data;
  },
};
