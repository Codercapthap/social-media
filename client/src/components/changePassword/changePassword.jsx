import React, { useState } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import "./changePassword.css";
import { TextField } from "@mui/material";
import Loading from "../loading/Loading";
import Fading from "../fading/Fading";
import { useTranslation } from "react-i18next";
import { Firebase } from "../../utils/firebase";
import { Snackbar, Alert } from "@mui/material";

export default function ChangePassword({
  toggleChangePassword,
  setToggleChangePassword,
}) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { t } = useTranslation();

  /**
   * TODO: update profile
   */
  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await Firebase.reauthenticate(oldPassword);
      await Firebase.changePassword(newPassword, confirmPassword);
      setToggleChangePassword(!toggleChangePassword);
      setIsSuccess(true);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <>
      {loading && <Loading></Loading>}
      <Fading
        toggleHandle={() => {
          setToggleChangePassword(!toggleChangePassword);
        }}
      ></Fading>
      <form className="changePasswordContainer" onSubmit={submitHandler}>
        <div className="changePasswordTop">
          <span className="changePasswordTitle">
            {t("Password.changePasswordTitle")}
          </span>
          <CancelIcon
            className="changePasswordCancel"
            onClick={() => {
              setToggleChangePassword(!toggleChangePassword);
            }}
          ></CancelIcon>
        </div>
        <hr className="changePasswordHr" />
        <div className="changePasswordContent">
          <div className="changePasswordTextContainer">
            <span className="changePasswordTextTitle">
              {t("Password.oldPassword")}:
            </span>
            <TextField
              value={oldPassword}
              onChange={(e) => {
                setOldPassword(e.target.value);
              }}
              type="password"
              fullWidth
              required
              margin="dense"
            ></TextField>
          </div>
          <div className="changePasswordTextContainer">
            <span className="changePasswordTextTitle">
              {t("Password.newPassword")}:
            </span>
            <TextField
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
              }}
              type="password"
              fullWidth
              required
              margin="dense"
            ></TextField>
          </div>
          <div className="changePasswordTextContainer">
            <span className="changePasswordTextTitle">
              {t("Password.confirmPassword")}:
            </span>
            <TextField
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
              type="password"
              fullWidth
              required
              margin="dense"
            ></TextField>
          </div>
        </div>

        <hr className="changePasswordHr" />
        <div className="submitChangePassword">
          <button type="submit" className="changePassword">
            {t("General.update")}
          </button>
        </div>
      </form>
      <Snackbar
        open={isSuccess}
        autoHideDuration={6000}
        onClose={() => setIsSuccess(false)}
      >
        <Alert
          onClose={() => setIsSuccess(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {t("Password.passwordChanged")}
        </Alert>
      </Snackbar>
      <Snackbar
        open={Boolean(error.length)}
        autoHideDuration={6000}
        onClose={() => setError("")}
      >
        <Alert
          onClose={() => setError("")}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </>
  );
}
