const initialState = {
  conversations: [],
};

export default function ConversationsReducer(state = initialState, action) {
  switch (action.type) {
    case "SET_CONVERSATIONS":
      return {
        conversations: action.payload,
      };
    case "GET_NEW_MESSAGE":
      return {
        conversations: action.payload,
      };
    case "READ_NEW_MESSAGE":
      return {
        conversations: action.payload,
      };
    default:
      return state;
  }
}
