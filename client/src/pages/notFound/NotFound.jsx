import React from "react";
import { useNavigate } from "react-router-dom";
import "./notFound.css";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/");
  };
  const { t } = useTranslation();
  return (
    <>
      <img
        src={`${PF}/notFoundBackground.jpg`}
        alt=""
        className="notFoundBackground"
      />
      <div className="notFoundContainer">
        <img src={`${PF}/paimon.png`} alt="" className="paimon" />
        <div className="notFoundMessageContainer">
          <p className="notFoundMessageTitle">404</p>
          <h3 className="notFoundMessageDesc">{t("404.pageNotFound")}</h3>
          <p className="notFoundMessageText">{t("404.message")}</p>
          <button className="notFoundButton" onClick={handleClick}>
            {t("404.backHome")}
          </button>
        </div>
      </div>
    </>
  );
}
