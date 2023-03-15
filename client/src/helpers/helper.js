import { storage } from "../firebase";
import { ref, deleteObject } from "firebase/storage";

/**
 * TODO: delete file from firestore with the following url
 * @param {string} fileUrl
 */
export const deleteFileFromFirestore = async (fileUrl) => {
  const storageRef = ref(storage, fileUrl);
  await deleteObject(storageRef);
};

/**
 * TODO: create object from base64 string
 * @param {string} url
 * @param {string} filename
 * @param {string} mimeType
 * @returns {Promise<File>}
 */
export const createObjectFromBase64 = async (url, filename, mimeType) => {
  mimeType = mimeType || (url.match(/^data:([^;]+);/) || "")[1];
  return fetch(url)
    .then(function (res) {
      return res.arrayBuffer();
    })
    .then(function (buf) {
      return new File([buf], filename, { type: mimeType });
    });
};
