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
  // const [files, setFiles] = useState(post.imgs);
  const [imgFiles, setImgFiles] = useState(() => {
    return post.imgs.filter((img) => {
      return img.split(".").pop() !== "mp4";
    });
  });
  // img.split(".").pop() !== "mp4";
  const [videoFiles, setVideoFiles] = useState(() => {
    return post.imgs.filter((img) => {
      return img.split(".").pop() === "mp4";
    });
  });
  // const [previewImgs, setPreviewImgs] = useState([]);
  // const [previewVideos, setPreviewVideos] = useState([]);
  const [previewImgs, setPreviewImgs] = useState(() => {
    return post.imgs
      .map((img) => {
        if (img.split(".").pop() !== "mp4")
          return { file: img, previewFile: img };
      })
      .filter((item) => {
        return item !== undefined;
      });
  });
  const [previewVideos, setPreviewVideos] = useState(() => {
    return post.imgs
      .map((video) => {
        if (video.split(".").pop() === "mp4")
          return { file: video, previewFile: video };
      })
      .filter((item) => {
        return item !== undefined;
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
  /**
   * TODO: if image change, upload it, if post had an image before, remove it
   */
  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    let urls = [];
    const imgsFiltered = post.imgs.filter((img) => {
      if (imgFiles.includes(img)) {
        return false;
      } else {
        return true;
      }
    });
    imgsFiltered.map(async (imgFiltered) => {
      await deleteFileFromFirestore(imgFiltered);
    });
    const videosFiltered = post.imgs.filter((video) => {
      if (videoFiles.includes(video)) {
        return false;
      } else {
        return true;
      }
    });
    videosFiltered.map(async (videoFiltered) => {
      await Post.deleteVideo(videoFiltered);
    });
    Promise.all([
      ...imgFiles.map(async (editImgFile) => {
        if (typeof editImgFile !== "string") {
          const fileName = Date.now() + editImgFile.name;

          const fileUploaded = await Firebase.postFile(
            editImgFile,
            currentUser.uid + "/post/" + post._id + "/" + fileName
          );
          urls.push(fileUploaded);
        } else {
          urls.push(editImgFile);
        }
      }),
      ...videoFiles.map(async (editVideoFile) => {
        if (typeof editVideoFile !== "string") {
          const fileName = Date.now() + editVideoFile.name;
          const uploaded = await Post.upload(editVideoFile, fileName);
          urls.push(uploaded);
        } else {
          urls.push(editVideoFile);
        }
      }),
    ]).then(async () => {
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
              {previewImgs.map((previewImg) => {
                if (previewImg)
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
                        src={previewImg.previewFile}
                        alt=""
                      />
                      <CancelIcon
                        className="editPostCancelImg"
                        onClick={() => {
                          setImgFiles((prev) => {
                            return prev.filter((item) => {
                              return item !== previewImg.file;
                            });
                          });
                          setPreviewImgs((prev) => {
                            return prev.filter((item) => {
                              return item.file !== previewImg.file;
                            });
                          });
                        }}
                      ></CancelIcon>
                    </motion.div>
                  );
              })}
              {previewVideos.map((previewVideo) => {
                if (previewVideo)
                  return (
                    <motion.div
                      className="editPostImgContainer"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <video
                        className="editPostImg"
                        src={
                          process.env.REACT_APP_API + previewVideo.previewFile
                        }
                        alt=""
                        controls
                      />
                      <CancelIcon
                        className="editPostCancelImg"
                        onClick={() => {
                          setVideoFiles((prev) => {
                            return prev.filter((item) => {
                              return item !== previewVideo.file;
                            });
                          });
                          setPreviewVideos((prev) => {
                            return prev.filter((item) => {
                              return item.file !== previewVideo.file;
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
                accept=".png,.jpeg,.jpg,.mp4"
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
