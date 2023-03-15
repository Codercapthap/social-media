const initialState = {
  fading: false,
  toggleFadingFunction: null,
};

export default function FadingReducer(state = initialState, action) {
  switch (action.type) {
    case "START_FADING":
      return {
        toggleFadingFunction: action.payload,
        fading: true,
      };

    case "FINISH_FADING":
      return {
        toggleFadingFunction: null,
        fading: false,
      };

    default:
      return state;
  }
}
