import React, { useState, useRef, useEffect } from "react";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import CancelIcon from "@mui/icons-material/Cancel";
import "./editPost.css";
import { deleteFileFromFirestore } from "../../helpers/helper";
import { useSelector } from "react-redux";
import { Firebase } from "../../utils/firebase";
import { Post } from "../../services/Post.service";
import Loading from "../loading/Loading";
import Fading from "../fading/Fading";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function EditPost({ post, toggleEditPost }) {
  const currentUser = useSelector((state) => {
    return state.User.currentUser;
  });
  const [loading, setLoading] = useState(false);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [desc, setDesc] = useState(post.desc);
  const [files, setFiles] = useState(post.imgs);
  const [previewFiles, setPreviewFiles] = useState(() => {
    return post.imgs.map((img) => {
      return { file: img, previewFile: img };
    });
  });
  const [heightDefault, setHeightDefault] = useState("auto");
  const input = useRef();
  const { t } = useTranslation();

  const fileToDataURL = async (file) => {
    var reader = new FileReader();
    const fileBase = await new Promise(function (resolve, reject) {
      reader.onload = function (event) {
        resolve(event.target.result);
      };
      reader.readAsDataURL(file);
    });
    return fileBase;
  };

  const handleChange = (e) => {
    const promise = Array.from(e.target.files).map(async (file) => {
      setFiles((prev) => {
        return [...prev, file];
      });
      const previewFile = await fileToDataURL(file);
      setPreviewFiles((prev) => {
        return [...prev, { file, previewFile }];
      });
    });
    Promise.all(promise);
  };
  /**
   * TODO: if image change, upload it, if post had an image before, remove it
   */
  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    let urls = [];
    const postFiltered = post.imgs.filter((img) => {
      if (files.includes(img)) {
        return false;
      } else {
        return true;
      }
    });
    postFiltered.map(async (postFilter) => {
      await deleteFileFromFirestore(postFilter);
    });
    Promise.all(
      files.map(async (editFile) => {
        if (typeof editFile !== "string") {
          const fileName = Date.now() + editFile.name;

          const fileUploaded = await Firebase.postFile(
            editFile,
            currentUser.uid + "/post/" + post._id + "/" + fileName
          );
          urls.push(fileUploaded);
        } else {
          urls.push(editFile);
        }
      })
    ).then(async () => {
      await Post.edit(post._id, urls, desc);
      setLoading(false);
      window.location.reload();
    });
  };

  useEffect(() => {
    setHeightDefault(input.current.scrollHeight);
  }, [post]);

  return (
    <>
      {loading && <Loading></Loading>}
      <Fading toggleHandle={toggleEditPost}></Fading>
      <div className="editPostWrapper">
        <div className="editPostTop">
          <img
            className="editPostProfileImg"
            src={
              currentUser.photoURL
                ? currentUser.photoURL
                : PF + "person/noAvatar.webp"
            }
            alt=""
          />
          <textarea
            type="text"
            placeholder={
              t("Post.thinkingQuestion") + " " + currentUser.displayName + "?"
            }
            className="editPostInput"
            value={desc}
            style={{ height: heightDefault }}
            onChange={(e) => {
              setDesc(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            ref={input}
          />
          <div className="editPostImgsContainer">
            <AnimatePresence
              initial={false}
              mode="wait"
              onExitComplete={() => {
                return null;
              }}
            >
              {previewFiles.map((previewFile) => {
                return (
                  <motion.div
                    className="editPostImgContainer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <img
                      className="editPostImg"
                      src={previewFile.previewFile}
                      alt=""
                    />
                    <CancelIcon
                      className="editPostCancelImg"
                      onClick={() => {
                        setFiles((prev) => {
                          return prev.filter((item) => {
                            return item !== previewFile.file;
                          });
                        });
                        setPreviewFiles((prev) => {
                          return prev.filter((item) => {
                            return item.file !== previewFile.file;
                          });
                        });
                      }}
                    ></CancelIcon>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
        <form className="editPostBottom" onSubmit={submitHandler}>
          <div className="editPostOptions">
            <label htmlFor="editFile" className="editPostOption">
              <PermMediaIcon
                htmlColor="tomato"
                className="editPostIcon"
              ></PermMediaIcon>
              <span className="editPostOptionText">{t("Post.photos")}</span>
              <input
                style={{ display: "none" }}
                type="file"
                id="editFile"
                accept=".png,.jpeg,.jpg"
                onChange={handleChange}
              />
            </label>
          </div>
          <button className="editPostButton" type="submit">
            {t("General.update")}
          </button>
        </form>
      </div>
    </>
  );
}
