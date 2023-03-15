import http from "../helpers/http";

export const Post = {
  /**
   * TODO: create post
   * @param {string} userId
   * @param {string} desc
   * @param {string} imgs
   * @returns {Promise<Object>}
   */
  async createPost(desc, imgs) {
    try {
      const res = await http.post("post", {
        desc,
        imgs,
      });
      return res.data;
    } catch (err) {
      return err;
    }
  },

  /**
   * TODO: get post by postId
   * @param {string} postId
   * @returns {Promise<Object>}
   */
  async getPost(postId) {
    try {
      const res = await http.get("post/" + postId);
      return res.data;
    } catch (err) {
      console.log(err);
      return err;
    }
  },

  /**
   * TODO: edit post
   * @param {string} postId
   * @param {string} userId
   * @param {string} desc
   * @param {string} imgs
   * @returns {Promise<Object>}
   */
  async edit(postId, imgs, desc) {
    console.log(imgs);
    try {
      if (desc) {
        console.log("desc");
        const res = await http.put("post/" + postId, {
          desc,
          imgs,
        });
        return res.data;
      } else {
        console.log("img");
        const res = await http.put("post/" + postId, {
          imgs,
        });
        return res.data;
      }
    } catch (err) {
      console.log(err);
      return err;
    }
  },

  /**
   * TODO: get all user's post
   * @param {string} displayName
   * @returns {Promise<Object>}
   */
  async getProfilePost(uid, number) {
    try {
      const res = await http.get(`post/profile/${uid}/${number}`);
      return res.data;
    } catch (err) {
      console.log(err);
      return err;
    }
  },

  /**
   * TODO: get timeline post
   * @param {string} userId
   * @returns {Promise<Object>}
   */
  async getTimelinePost(number) {
    try {
      const res = await http.get(`post/timeline/${number}`);
      console.log(res.data);
      return res.data;
    } catch (err) {
      console.log(err);
      return err;
    }
  },

  /**
   * TODO: send like post request
   * @param {string} postId
   * @param {string} currentId
   */
  async likeDislikePost(postId) {
    try {
      await http.put("post/" + postId + "/like");
    } catch (err) {
      console.log(err);
    }
  },

  /**
   * TODO: send delete post request
   * @param {string} postId
   * @param {string} currentId
   */
  async deletePost(postId) {
    try {
      await http.delete("post/" + postId);
    } catch (err) {
      console.log(err);
    }
  },
};
