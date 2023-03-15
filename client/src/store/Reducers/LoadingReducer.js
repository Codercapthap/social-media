const initialState = {
  loading: true,
};

export default function LoadingReducer(state = initialState, action) {
  switch (action.type) {
    case "START_LOADING":
      return {
        loading: true,
      };

    case "FINISH_LOADING":
      return {
        loading: false,
      };

    default:
      return state;
  }
}
