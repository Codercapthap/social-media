import { getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage } from "../firebase";
import { ref } from "firebase/storage";

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
};
