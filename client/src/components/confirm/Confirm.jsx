import React from "react";
import "./confirm.css";
import Fading from "../fading/Fading";
import ReactDOM from "react-dom";
import { useTranslation } from "react-i18next";

export default function Confirm({ confirmHandle, message, toggleHandle }) {
  const { t } = useTranslation();
  const onConfirm = () => {
    confirmHandle();
    toggleHandle();
  };

  return ReactDOM.createPortal(
    <div className="confirmContainer">
      <Fading toggleHandle={toggleHandle}></Fading>
      <div className="confirmForm">
        <p className="desc">{message}</p>
        <div className="buttonDiv">
          <button className="button deleteButton" onClick={onConfirm}>
            {t("General.confirm")}
          </button>
          <button
            className="button"
            onClick={() => {
              toggleHandle(false);
            }}
          >
            {t("General.cancel")}
          </button>
        </div>
      </div>
    </div>,
    document.querySelector("body")
  );
}
