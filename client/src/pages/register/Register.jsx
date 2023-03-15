import React from "react";
import "./register.css";
import { useRef, useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebase";
import { User } from "../../services/User.service";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Register() {
  const [err, setErr] = useState(false);
  const emailInput = useRef();
  const displayNameInput = useRef();
  const passwordInput = useRef();
  const passwordConfirmInput = useRef();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwordConfirmInput.current.value !== passwordInput.current.value) {
      passwordConfirmInput.current.setCustomValidity("Passwords don't match!");
    } else {
      const displayName = displayNameInput.current.value;
      const email = emailInput.current.value;
      const password = passwordInput.current.value;
      try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = await User.createUser({
          uid: res.user.uid,
          displayName: displayName,
          email,
          photoURL: null,
          desc: "",
          coverPicture: null,
          dateOfBirth: "",
          address: "",
        });
        await updateProfile(res.user, {
          displayName: displayName,
        });
      } catch (err) {
        console.log(err);
        setErr(true);
      }
    }
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
            <form className="loginBox" onSubmit={handleSubmit}>
              <input
                type="text"
                required
                placeholder={t("Login.username")}
                ref={displayNameInput}
                className="loginInput"
              />
              <input
                type="email"
                required
                placeholder="Email"
                ref={emailInput}
                className="loginInput"
              />
              <input
                type="password"
                required
                placeholder={t("Login.password")}
                ref={passwordInput}
                className="loginInput"
                minLength={6}
              />
              <input
                type="password"
                required
                placeholder={t("Login.confirmPassword")}
                ref={passwordConfirmInput}
                className="loginInput"
              />
              {err && <span className="errMessage">{t("General.error")}</span>}
              <button className="loginButton">{t("Login.signup")}</button>
              <button
                className="loginRegisterButton"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/login");
                }}
              >
                {t("Login.alreadyHaveAccount")}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
