const initialState = {
  confirming: false,
  confirmHandle: null,
  message: null,
};

export default function ConfirmReducer(state = initialState, action) {
  switch (action.type) {
    case "START_CONFIRM":
      return {
        confirmHandle: action.payload.confirmHandle,
        confirming: true,
        message: action.payload.message,
      };

    case "FINISH_CONFIRM":
      return {
        confirmHandle: null,
        confirming: false,
        message: null,
      };

    default:
      return state;
  }
}
