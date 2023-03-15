import http from "../helpers/http";
export const Comment = {
  /**
   * TODO: send request create comment
   * @param {string} content
   * @param {string} parentId
   * @param {string} postId
   * @returns {Promise<Object>}
   */
  async createComment(content, parentId, postId) {
    try {
      const res = await http.post("comment", {
        content,
        parentId,
        postId,
      });
      return res.data;
    } catch (err) {
      console.log(err);
      return err;
    }
  },

  /**
   * TODO: send request to edit a comment by commentId
   * @param {string} commentId
   * @param {string} content
   * @returns {Promise<String>}
   */
  async editComment(commentId, content) {
    try {
      const res = await http.put("comment/" + commentId, {
        content,
      });
      return res.data;
    } catch (err) {
      console.log(err);
      return err;
    }
  },

  /**
   * TODO: get all comment of a post
   * @param {string} postId
   * @returns {Promise<Array>}
   */
  async getComments(postId) {
    try {
      const res = await http.get(`comment/${postId}`);
      return res.data;
    } catch (err) {
      return err;
    }
  },

  /**
   * TODO: send request to like or dislike a comment
   * @param {string} commentId
   * @returns {Promise<String>}
   */
  async likeDislikeComment(commentId) {
    try {
      const res = await http.put("comment/" + commentId + "/like");
      return res.data;
    } catch (err) {
      console.log(err);
      return err;
    }
  },

  /**
   * TODO: send a request to delete a comment by commentId
   * @param {string} commentId
   */
  async deleteComment(commentId) {
    try {
      await http.delete("comment/" + commentId + "/");
    } catch (err) {
      console.log(err);
    }
  },
};
