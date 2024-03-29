import axios from "axios";
import { io } from "socket.io-client";

// const defaultOption = {};
var instance = axios.create({
  baseURL: process.env.REACT_APP_API + "/api/",
  headers: {
    common: {
      Authorization: "Bearer ",
    },
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const setToken = (token) => {
  instance.defaults.headers.common["Authorization"] = "Bearer " + token;
};

export const setContentType = (contentType) => {
  instance.defaults.headers["Content-Type"] = contentType;
  instance.defaults.headers.Accept = contentType;
};

export const socket = io(process.env.REACT_APP_SOCKET, {
  transports: ["websocket"],
  withCredentials: true,
});

export default instance;
