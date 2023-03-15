const initialState = {
  newMessage: null,
};

export default function NewMessageReducer(state = initialState, action) {
  switch (action.type) {
    case "SET_NEW_MESSAGE":
      return {
        newMessage: action.payload,
      };
    default:
      return state;
  }
}
