import React, { useRef, useState, memo } from "react";
import "./share.css";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import CancelIcon from "@mui/icons-material/Cancel";
import { useSelector } from "react-redux";
import { Firebase } from "../../utils/firebase";
import { Post } from "../../services/Post.service";
import { socket } from "../../helpers/http";
import Loading from "../loading/Loading";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

function Share() {
  const currentUser = useSelector((state) => {
    return state.User.currentUser;
  });
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const desc = useRef();
  const [files, setFiles] = useState([]);
  const [previewFiles, setPreviewFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

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

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    let newPost = await Post.createPost(desc.current.value, []);
    let urls = [];
    Promise.all(
      files.map(async (file) => {
        const fileName = Date.now() + file.name;
        const uploaded = await Firebase.postFile(
          file,
          currentUser.uid + "/post/" + newPost._id + "/" + fileName
        );
        urls.push(uploaded);
      })
    ).then(async () => {
      newPost = await Post.edit(newPost._id, urls);
      socket.emit("createPost", {
        userId: currentUser.uid,
        postId: newPost._id,
      });
      window.location.reload();
      setFiles([]);
      setLoading(false);
    });
  };

  return (
    <>
      {loading && <Loading></Loading>}
      <div className="share">
        <div className="shareWrapper">
          <div className="shareTop">
            <img
              className="shareProfileImg"
              src={
                currentUser.photoURL
                  ? currentUser.photoURL
                  : PF + "person/noAvatar.webp"
              }
              alt=""
            />
            <textarea
              placeholder={
                t("Post.thinkingQuestion") + currentUser.displayName + "?"
              }
              className="shareInput"
              ref={desc}
              onChange={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
            />
          </div>
          <hr className="shareHr"></hr>

          <div className="shareImgsContainer">
            <AnimatePresence>
              {previewFiles.map((previewFile) => {
                return (
                  <motion.div
                    className="shareImgContainer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <img
                      className="shareImg"
                      src={previewFile.previewFile}
                      alt=""
                    />
                    <CancelIcon
                      className="shareCancelImg"
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
          <form className="shareBottom" onSubmit={submitHandler}>
            <div className="shareOptions">
              <label htmlFor="file" className="shareOption">
                <PermMediaIcon
                  htmlColor="tomato"
                  className="shareIcon"
                ></PermMediaIcon>
                <span className="shareOptionText">{t("Post.photos")}</span>
                <input
                  style={{ display: "none" }}
                  type="file"
                  id="file"
                  multiple
                  accept=".png,.jpeg,.jpg"
                  onChange={handleChange}
                />
              </label>
            </div>
            <button className="shareButton" type="submit">
              {t("Post.share")}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default memo(Share);
