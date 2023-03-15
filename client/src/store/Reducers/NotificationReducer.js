const initialState = {
  notifications: [],
};

export default function NotificationsReducer(state = initialState, action) {
  switch (action.type) {
    case "SET_NOTIFICATIONS":
      return {
        notifications: action.payload,
      };
    case "GET_NEW_NOTIFICATION":
      return {
        notifications: [...state.notifications, action.payload],
      };
    case "READ_NOTIFICATION":
      return {
        notifications: action.payload,
      };
    case "READ_ALL_NOTIFICATIONS":
      console.log("here");
      return {
        notifications: action.payload,
      };
    case "DEL_ALL_NOTIFICATIONS":
      return {
        notifications: action.payload,
      };
    default:
      return state;
  }
}
