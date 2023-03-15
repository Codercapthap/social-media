import { User } from "../../services/User.service";

export const getRequest = () => {
  return (dispatch) => {
    User.getFriendReceived().then((res) => {
      dispatch({ type: "GET_REQUEST", payload: res });
    });
  };
};

export const getMyRequest = () => {
  return (dispatch) => {
    User.getFriendRequested().then((res) => {
      dispatch({ type: "GET_MY_REQUEST", payload: res });
    });
  };
};

export const getNewRequest = (data) => {
  return (dispatch) => {
    console.log(data);
    dispatch({ type: "GET_NEW_REQUEST", payload: data });
  };
};

export const removeRequest = (data) => {
  return (dispatch) => {
    dispatch({ type: "REMOVE_REQUEST", payload: data.uid });
  };
};

export const removeMyRequest = (id) => {
  return (dispatch) => {
    dispatch({ type: "REMOVE_MY_REQUEST", payload: id });
  };
};

export const createMyRequest = (data) => {
  return (dispatch) => {
    dispatch({ type: "CREATE_MY_REQUEST", payload: data });
  };
};
