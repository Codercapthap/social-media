export const setNewMessage = (data) => {
  return (dispatch) => {
    dispatch({ type: "SET_NEW_MESSAGE", payload: data });
  };
};
