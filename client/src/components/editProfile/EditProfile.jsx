import React, { useContext, useState, useCallback } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import { useSelector } from "react-redux";
import { createObjectFromBase64 } from "../../helpers/helper";
import { auth } from "../../firebase.js";
import "./editProfile.css";
import { Firebase } from "../../utils/firebase";
import { User } from "../../services/User.service";
import { TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import MyAvatarEditor from "../myAvatarEditor/MyAvatarEditor";
import Fading from "../fading/Fading";
import { useTranslation } from "react-i18next";

export default function EditProfile({
  toggleEditProfile,
  setToggleEditProfile,
}) {
  const currentUser = useSelector((state) => {
    return state.User.currentUser;
  });
  const [displayName, setDisplayName] = useState(currentUser.displayName);
  const [desc, setDesc] = useState(currentUser.desc);
  const [avatarPrev, setAvatarPrev] = useState(currentUser.photoURL);
  const [coverPicture, setCoverPicture] = useState(currentUser.coverPicture);
  const [birth, setBirth] = useState(
    currentUser.dateOfBirth ||
      (() => {
        const date = new Date();
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      })
  );
  const [address, setAddress] = useState(currentUser.address);
  const [avatar, setAvatar] = useState(currentUser.photoURL);
  const { t } = useTranslation();

  /**
   * TODO: update avatar to firebase storage and return url
   * @returns {string}
   */
  const getAvatar = async () => {
    if (avatar !== currentUser.photoURL) {
      const avatarObject = await createObjectFromBase64(
        avatar,
        "test.jpg",
        "image/jpeg"
      );
      return await Firebase.postFile(
        avatarObject,
        currentUser.uid + "/photoURL.jpg"
      );
    }
    return currentUser.photoURL;
  };

  /**
   * TODO: update cover picture to firebase storage and return url
   * @returns {string}
   */
  const getCover = async () => {
    if (coverPicture !== currentUser.coverPicture) {
      return await Firebase.postFile(
        coverPicture,
        currentUser.uid + "/coverPicture.jpg"
      );
    }
    return currentUser.coverPicture;
  };

  /**
   * TODO: update profile
   */
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      let newPhotoURL = await getAvatar();
      let newCoverPicture = await getCover();
      await User.updateUserProfile({
        displayName: displayName,
        email: auth.currentUser.email,
        uid: auth.currentUser.uid,
        desc,
        photoURL: newPhotoURL,
        coverPicture: newCoverPicture,
        dateOfBirth: birth,
        address,
      });
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const onAvatar = useCallback((value) => {
    setAvatar(value);
  }, []);

  return (
    <>
      <Fading
        toggleHandle={() => {
          setToggleEditProfile(!toggleEditProfile);
        }}
      ></Fading>
      <form className="editProfileContainer" onSubmit={submitHandler}>
        <div className="editProfileTop">
          <span className="editProfileTitle">{t("Profile.updateTitle")}</span>
          <CancelIcon
            className="editProfileCancel"
            onClick={() => {
              setToggleEditProfile(!toggleEditProfile);
            }}
          ></CancelIcon>
        </div>
        <hr className="editProfileHr" />
        <div className="editProfileContent">
          <div className="editProfilePartsTitle">{t("Profile.basicInfo")}</div>
          <div className="editProfileTextContainer">
            <span className="editProfileTextTitle">
              {t("Profile.profileName")}:
            </span>
            <TextField
              value={displayName}
              onChange={(e) => {
                setDisplayName(e.target.value);
              }}
              fullWidth
              required
              margin="dense"
            ></TextField>
          </div>
          <div className="editProfileTextContainer">
            <span className="editProfileTextTitle">{t("Profile.desc")}: </span>
            <TextField
              value={desc}
              onChange={(e) => {
                setDesc(e.target.value);
              }}
              fullWidth
              margin="dense"
            ></TextField>
          </div>
          <div className="editProfileTextContainer">
            <span className="editProfileTextTitle">
              {t("Profile.address")}:{" "}
            </span>
            <TextField
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
              }}
              fullWidth
              margin="dense"
            ></TextField>
          </div>
          <div className="editProfileTextContainer">
            <span className="editProfileTextTitle">{t("Profile.birth")}: </span>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="DatePicker"
                value={birth}
                onChange={(value) => {
                  setBirth(value.format("YYYY-MM-DD"));
                }}
                inputFormat="YYYY-MM-DD"
                maxDate={new Date()}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    onKeyDown={(e) => {
                      e.preventDefault();
                    }}
                    fullWidth
                    margin="dense"
                  />
                )}
              />
            </LocalizationProvider>
          </div>
          <div className="editProfileImgContainer">
            <span className="editProfilePartsTitle">{t("Profile.avatar")}</span>
            <MyAvatarEditor
              src={avatarPrev}
              width={250}
              height={250}
              border={50}
              scale={1.2}
              rotate={0}
              onAvatar={onAvatar}
            ></MyAvatarEditor>
            <input
              type="file"
              id="avatarInput"
              hidden
              onChange={(e) => {
                return setAvatarPrev(URL.createObjectURL(e.target.files[0]));
              }}
            />
            <label htmlFor="avatarInput" className="editProfileImgButton">
              {t("Profile.change")}
            </label>
          </div>
          <div className="editProfileImgContainer">
            <span className="editProfilePartsTitle">{t("Profile.cover")}</span>
            <img
              src={
                coverPicture !== currentUser.coverPicture
                  ? URL.createObjectURL(coverPicture)
                  : currentUser.coverPicture
              }
              alt=""
              className="editProfileCover"
            />
            <input
              type="file"
              id="coverInput"
              hidden
              onChange={(e) => {
                return setCoverPicture(e.target.files[0]);
              }}
            />
            <label htmlFor="coverInput" className="editProfileImgButton">
              {t("Profile.change")}
            </label>
          </div>
        </div>
        <hr className="editProfileHr" />
        <div className="submitUpdateProfile">
          <button type="submit" className="updateProfile">
            {t("General.update")}
          </button>
        </div>
      </form>
    </>
  );
}
