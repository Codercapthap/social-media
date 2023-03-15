const initialState = {
  friendRequestsUser: [], // loi moi minh nhan duoc
  myFriendRequestsUser: [], // loi moi cua minh
};

export default function FriendRequestReducer(state = initialState, action) {
  switch (action.type) {
    case "GET_REQUEST":
      return {
        myFriendRequestsUser: state.myFriendRequestsUser,
        friendRequestsUser: action.payload,
      };
    case "GET_MY_REQUEST":
      return {
        myFriendRequestsUser: action.payload,
        friendRequestsUser: state.friendRequestsUser,
      };
    case "GET_NEW_REQUEST":
      console.log(action.payload);
      return {
        myFriendRequestsUser: state.myFriendRequestsUser,
        friendRequestsUser: [...state.friendRequestsUser, action.payload],
      };
    case "REMOVE_MY_REQUEST":
      return {
        friendRequestsUser: state.friendRequestsUser,
        myFriendRequestsUser: state.myFriendRequestsUser.filter((item) => {
          return item.uid !== action.payload;
        }),
      };
    case "REMOVE_REQUEST":
      return {
        myFriendRequestsUser: state.myFriendRequestsUser,
        friendRequestsUser: state.friendRequestsUser.filter((item) => {
          return item.uid !== action.payload;
        }),
      };
    case "CREATE_MY_REQUEST":
      return {
        myFriendRequestsUser: [...state.myFriendRequestsUser, action.payload],
        friendRequestsUser: state.friendRequestsUser,
      };
    default:
      return state;
  }
}
