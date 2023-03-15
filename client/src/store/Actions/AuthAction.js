export const setCurrentAuth = (user) => {
  return (dispatch) => {
    dispatch({ type: "LOGIN", payload: user });
  };
};
