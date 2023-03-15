const initialState = {
  componentLoading: false,
};

export default function ComponentLoadingReducer(state = initialState, action) {
  switch (action.type) {
    case "START_COMPONENT_LOADING":
      return {
        componentLoading: true,
      };

    case "FINISH_COMPONENT_LOADING":
      return {
        componentLoading: false,
      };

    default:
      return state;
  }
}
