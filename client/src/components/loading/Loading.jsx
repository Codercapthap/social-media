import React from "react";
import "./loading.css";
import Fading from "../fading/Fading";
import ReactDOM from "react-dom";

export default function Loading() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return ReactDOM.createPortal(
    <div className="loadingComponentContainer">
      <Fading></Fading>
      <img src={`${PF}/loading.gif`} alt="" className="loadingComponentImg" />
    </div>,
    document.querySelector("body")
  );
}
