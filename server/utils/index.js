import FriendRequest from "../models/FriendRequest.js";
import Friendship from "../models/Friendship.js";
import User from "../models/User.js";
/**
 * TODO: get user by userId
 * @param {string} userId
 * @returns {Promise<Object>}
 */
export const getUserById = async (userId) => {
  // const q = query(collection(db, "users"), where("uid", "==", userId));
  // const querySnapshot = await getDocs(q);
  // return querySnapshot.docs[0]?.data();
  try {
    const user = await User.findOne({ uid: userId }).select("-_id");
    return user;
  } catch (err) {
    return err;
  }
};

/**
 * TODO: get user by displayName
 * @param {string} displayName
 * @returns {Promise<Object>}
 */
// export const getUserByDisplayName = async (displayName) => {
//   console.log("ör here");
//   const q = query(
//     collection(db, "users"),
//     where("displayName", "==", displayName)
//   );
//   const querySnapshot = await getDocs(q);
//   return querySnapshot.docs[0]?.data();
// };

export const getUserByName = async (name, number) => {
  try {
    // console.log("come to here");
    // const q = query(
    //   collection(db, "users"),
    //   where("displayName", "==", name),
    //   limit(number)
    // );
    // const querySnapshot = await getDocs(q);
    // const result = [];
    // querySnapshot.forEach((doc) => {
    //   result.push(doc.data());
    // });
    // return result;{name:{'$regex' : '^string$', '$options' : 'i'}}{ first_name: { $regex: /michael/i } }new RegExp(param1, $options:'i')
    const user = await User.find({
      displayName: { $regex: name, $options: "i" },
    }).limit(number);
    console.log(user);
    return user;
  } catch (err) {
    console.log(err);
    return err;
  }
};

/**
 * TODO: get list of user by id list
 * @param {string} userIdList
 * @returns {Promise<Array>}
 */
export const getUserByIdList = async (userIdList) => {
  // if (userIdList.length) {
  //   const q = query(collection(db, "users"), where("uid", "in", userIdList));
  //   const querySnapshot = await getDocs(q);
  //   const users = [];
  //   querySnapshot.forEach((doc) => {
  //     users.push(doc.data());
  //   });
  //   return users;
  // }
  // return [];
  try {
    if (userIdList.length) {
      const users = User.find({ uid: { $in: userIdList } });
      return users;
    } else return [];
  } catch (err) {
    return err;
  }
};

export const deleteFriendRequest = async (requesterId, recipientId) => {
  const friendRequest = await FriendRequest.findOneAndDelete({
    requester: requesterId,
    recipient: recipientId,
  });
  return friendRequest;
};

export const getFriends = async (userId) => {
  const friendships = await Friendship.find({
    members: userId,
  }).populate({
    path: "members",
    match: { _id: { $ne: userId } },
    select: "uid displayName photoURL address dateOfBirth disabled",
  });

  const friends = friendships.map((friendship) => {
    return typeof friendship.members[0] === "object"
      ? friendship.members[0]
      : friendship.members[1];
  });
  return friends;
};
/* --------------------------- */

/**
 * TODO: get friendship of two user
 * @param {string} userId1
 * @param {string} userId2
 * @returns {Promise<Object>}
 */
export const findFriendshipOfTwoUser = async (userId1, userId2) => {
  const friendship = await FriendShip.findOne({
    requesterId: userId1,
    receiverId: userId2,
  });
  const friendship2 = await FriendShip.findOne({
    requesterId: userId2,
    receiverId: userId1,
  });
  if (friendship) return { type: 1, friendship };
  else if (friendship2) return { type: -1, friendship: friendship2 };
  return null;
};

/**
 * TODO: get all friendship of a user
 * @param {string} userId
 * @returns {Promise<Array>}
 */
export const getAllFriendship = async (userId) => {
  const friendship = await FriendShip.find({
    requesterId: userId,
    status: 1,
  });
  const friendship2 = await FriendShip.find({
    receiverId: userId,
    status: 1,
  });
  return [...friendship, ...friendship2];
};

/**
 * TODO: get all friends from a friendship list
 * @param {string} userId
 * @param {Array} friendshipList
 * @returns {Promise<Array>}
 */
export const getFriendsFromFriendshipList = async (userId, friendshipList) => {
  const friendIdList = [];
  friendshipList.map((friendship) => {
    if (friendship.receiverId === userId)
      friendIdList.push(friendship.requesterId);
    else friendIdList.push(friendship.receiverId);
  });

  const friendList = [];
  const friends = await Promise.all(
    friendIdList.map(async (friendId) => {
      const friend = await getUserById(friendId);
      friendList.push(friend);
    })
  ).then(() => {
    return friendList;
  });
  return friends;
};

/**
 *
 * @param {string} userId
 * @returns {Promise<Array<Object>>}
 */
// export const getFriends = async (userId) => {
//   //* query to get all friendship of a user
//   const friendShipList = await getAllFriendship(userId);

//   //* get list friend from those friendship
//   const friends = await getFriendsFromFriendshipList(userId, friendShipList);
//   return friends;
// };
