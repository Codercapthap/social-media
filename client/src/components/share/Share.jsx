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
  const [imgFiles, setImgFiles] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [previewImgs, setPreviewImgs] = useState([]);
  const [previewVideos, setPreviewVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handleChange = (e) => {
    const promise = Array.from(e.target.files).map(async (file) => {
      if (file.type === "image/png" || file.type === "image/jpeg") {
        setImgFiles((prev) => {
          return [...prev, file];
        });
        const previewFile = await fileToDataURL(file);
        setPreviewImgs((prev) => {
          return [...prev, { file, previewFile }];
        });
      } else if (file.type === "video/mp4") {
        setVideoFiles((prev) => {
          return [...prev, file];
        });
        const source = URL.createObjectURL(file);
        setPreviewVideos((prev) => {
          return [...prev, { file, source }];
        });
      }
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
    Promise.all([
      ...imgFiles.map(async (file) => {
        const fileName = Date.now() + file.name;
        const uploaded = await Firebase.postFile(
          file,
          currentUser.uid + "/post/" + newPost._id + "/" + fileName
        );
        urls.push(uploaded);
      }),
      ...videoFiles.map(async (file) => {
        const fileName = Date.now() + file.name;
        const uploaded = await Post.upload(file, fileName);
        urls.push(uploaded);
      }),
    ]).then(async () => {
      newPost = await Post.edit(newPost._id, urls);
      socket.emit("createPost", {
        userId: currentUser.uid,
        postId: newPost._id,
      });
      window.location.reload();
      setImgFiles([]);
      setPreviewVideos([]);
      setLoading(false);
    });
  };
  // [
  //   {
  //     name: "create",
  //     value: [
  //       {
  //         name: "create",
  //         price: 1000,
  //         quantity: 100,
  //       },
  //     ],
  //   },
  // ];
  // const getOptions = () => {
  //   const options = [];
  //   const optionElements = document.querySelectorAll("[data-groupId]");
  //   options = optionElements.map((optionElement, optionIndex) => {
  //     const name = document.getElementById(`opt-grp-${optionIndex}`).value;
  //     const values = [];
  //     const valueElements = document.querySelectorAll("[data-values-groupid]");
  //     values = valueElements.map((valueElement, index) => {
  //       const valueName = document.querySelectorAll(
  //         `opt-grp-${optionIndex}-name-${index}`
  //       ).value;
  //       const valuePrice = document.querySelectorAll(
  //         `opt-grp-${optionIndex}-price-${index}`
  //       ).value;
  //       const valueStock = document.querySelectorAll(
  //         `opt-grp-${optionIndex}-stock-${index}`
  //       ).value;
  //       return { name: valueName, price: valuePrice, stock: valueStock };
  //     });
  //     return { name: name, values: values };
  //   });
  // };

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
              {previewImgs.map((previewFile) => {
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
                        setImgFiles((prev) => {
                          return prev.filter((item) => {
                            return item !== previewFile.file;
                          });
                        });
                        setPreviewImgs((prev) => {
                          return prev.filter((item) => {
                            return item.file !== previewFile.file;
                          });
                        });
                      }}
                    ></CancelIcon>
                  </motion.div>
                );
              })}
              {previewVideos.map((previewFile) => {
                return (
                  <motion.div
                    className="shareImgContainer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <video
                      className="shareImg"
                      src={previewFile.source}
                      controls
                      alt=""
                    />
                    <CancelIcon
                      className="shareCancelImg"
                      onClick={() => {
                        setVideoFiles((prev) => {
                          return prev.filter((item) => {
                            return item !== previewFile.file;
                          });
                        });
                        setPreviewVideos((prev) => {
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
                  accept=".png,.jpeg,.jpg,.mp4"
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
