import React, { useState } from "react";
import { useRef } from "react";
import "./login.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Login() {
  const [err, setErr] = useState(false);
  const emailInput = useRef();
  const passwordInput = useRef();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // TODO: authen and nagivate
  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const email = emailInput.current.value;
      const password = passwordInput.current.value;
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.log(err);
      setErr(true);
    }
  };

  const handleNavigate = async (e) => {
    e.preventDefault();
    navigate("/register");
  };
  return (
    <>
      <div className="login">
        <div className="loginWrapper">
          <div className="loginLeft">
            <img src="full_logo.png" alt="" className="loginLogo" />
            <span className="loginDesc">{t("Login.slogun")}</span>
          </div>
          <div className="loginRight">
            <form className="loginBox" onSubmit={handleClick}>
              <input
                type="email"
                placeholder="Email"
                required
                className="loginInput"
                ref={emailInput}
              />
              <input
                placeholder={t("Login.password")}
                type="password"
                required
                minLength="6"
                className="loginInput"
                ref={passwordInput}
              />
              {err && <span className="errMessage">{t("Login.error")}</span>}
              <button className="loginButton" type="submit">
                {t("Login.login")}
              </button>
              <span className="loginForgot">{t("Login.forgot")}</span>
              <button className="loginRegisterButton" onClick={handleNavigate}>
                {t("Login.createAccount")}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
