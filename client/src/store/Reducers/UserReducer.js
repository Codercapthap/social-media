const initialState = {
  currentUser: null,
  friends: [],
};

export default function AuthReducer(state = initialState, action) {
  switch (action.type) {
    case "SET_CURRENT_USER":
      return {
        currentUser: action.payload,
        friends: state.friends,
      };
    case "SET_FRIENDS":
      return {
        currentUser: state.currentUser,
        friends: action.payload,
      };
    default:
      return state;
  }
}
