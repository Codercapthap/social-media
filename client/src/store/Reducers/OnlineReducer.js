const initialState = {
  friendOnlineList: [],
};

export default function AuthReducer(state = initialState, action) {
  switch (action.type) {
    case "GET_USERS":
      return {
        friendOnlineList: action.payload,
      };
    default:
      return state;
  }
}
