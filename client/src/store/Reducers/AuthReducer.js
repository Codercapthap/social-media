const initialState = {
  auth: null,
};

export default function AuthReducer(state = initialState, action) {
  switch (action.type) {
    case "LOGIN":
      return {
        auth: action.payload,
      };
    default:
      return state;
  }
}
