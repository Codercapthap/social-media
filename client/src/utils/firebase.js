import { getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage } from "../firebase";
import { ref } from "firebase/storage";
import { auth } from "../firebase";
import {
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { t } from "i18next";

export const Firebase = {
  /**
   * TODO: post file to firebase storage
   * @param {Blob} file
   * @param {string} direction
   */
  async postFile(file, direction) {
    const storageRef = ref(storage, direction);
    const uploadTask = uploadBytesResumable(storageRef, file);
    await uploadTask;
    return await getDownloadURL(uploadTask.snapshot.ref);
  },

  async reauthenticate(currentPassword) {
    try {
      const user = auth.currentUser;
      const cred = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, cred);
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async changePassword(newPassword, confirmPassword) {
    if (confirmPassword !== newPassword) {
      throw new Error(t("Password.passwordNotMatch"));
    } else {
      const user = auth.currentUser;
      try {
        await updatePassword(user, newPassword);
        return true;
      } catch (err) {
        throw new Error(t("General.error"));
      }
    }
  },
};
