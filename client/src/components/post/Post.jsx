import "./post.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState, useCallback, useEffect } from "react";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import EditPost from "../editPost/EditPost";
import CancelIcon from "@mui/icons-material/Cancel";
import { deleteFileFromFirestore } from "../../helpers/helper";
import { useSelector, useDispatch } from "react-redux";
import { User } from "../../services/User.service";
import { Post as PostService } from "../../services/Post.service";
import likeImg from "../../assets/like.png";
import ReadMore from "../readMore/ReadMore";
import Comments from "../comments/Comments";
import Loading from "../loading/Loading";
import Confirm from "../confirm/Confirm";
import ImgSlideShow from "../imgSlideShow/ImgSlideShow";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function Post({ post }) {
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [togglePostOptions, setTogglePostOptions] = useState(false);
  const [togglePostEdit, setTogglePostEdit] = useState(false);
  const [user, setUser] = useState({});
  const [numComments, setNumComments] = useState(0);
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [toggleSlideShow, setToggleSlideShow] = useState(false);
  const [position, setPosition] = useState(null);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const currentUser = useSelector((state) => {
    return state.User.currentUser;
  });
  const { t } = useTranslation();

  // TODO: get post likes
  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, [currentUser.uid]);

  // TODO: get owner of the post
  useEffect(() => {
    User.getUserById(post.owner.uid).then((data) => {
      setUser(data);
    });
  }, []);

  /**
   * TODO: like handle function
   */
  const likeHandler = async () => {
    PostService.likeDislikePost(post._id).then(() => {
      setLike(isLiked ? like - 1 : like + 1);
      setIsLiked(!isLiked);
    });
  };

  /**
   * TODO: handle delete post
   */
  const deleteHandler = async () => {
    try {
      setLoading(true);
      Promise.all(
        post.imgs.map(async (file) => {
          if (file.split(".").pop() !== "mp4")
            await deleteFileFromFirestore(file);
          else await PostService.deleteVideo(file);
        })
      ).then(async () => {
        await PostService.deletePost(post._id);
        setLoading(false);
        window.location.reload();
      });
    } catch (err) {
      console.log(err);
    }
  };

  const PostOptions = () => {
    return (
      <div className="postOptions">
        {currentUser.uid === post.owner.uid && (
          <span
            className="postOptionsItem"
            onClick={() => {
              setTogglePostEdit(!togglePostEdit);
            }}
          >
            {t("General.update")}
          </span>
        )}
        <span
          className="postOptionsItem postOptionsItemDelete"
          onClick={() => {
            setConfirming(true);
          }}
        >
          {t("General.delete")}
        </span>
      </div>
    );
  };

  const PostEdit = () => {
    return (
      <div className="editPost">
        <CancelIcon
          className="cancelEditPost"
          onClick={() => {
            setTogglePostEdit(false);
          }}
        ></CancelIcon>
        <EditPost
          toggleEditPost={() => {
            setTogglePostEdit(false);
          }}
          post={post}
        ></EditPost>
      </div>
    );
  };

  const onNumComments = useCallback((num) => {
    setNumComments(num);
  }, []);

  return (
    <div className="post">
      <AnimatePresence
        initial={false}
        mode="wait"
        onExitComplete={() => {
          return null;
        }}
      >
        {confirming && (
          <Confirm
            confirmHandle={deleteHandler}
            toggleHandle={() => {
              setConfirming(false);
            }}
            message={t("Post.confirmDelete")}
          ></Confirm>
        )}
      </AnimatePresence>

      <AnimatePresence
        initial={false}
        mode="wait"
        onExitComplete={() => {
          return null;
        }}
      >
        {loading && <Loading></Loading>}
      </AnimatePresence>

      <AnimatePresence
        initial={false}
        mode="wait"
        onExitComplete={() => {
          return null;
        }}
      >
        {toggleSlideShow && (
          <ImgSlideShow
            imgs={post.imgs}
            position={position}
            handleToggle={() => {
              setToggleSlideShow(false);
            }}
          ></ImgSlideShow>
        )}
      </AnimatePresence>
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`/profile/${user.uid}`}>
              <img
                className="postProfileImg"
                src={
                  user.photoURL ? user.photoURL : PF + "/person/noAvatar.webp"
                }
                alt=""
              />
            </Link>
            <span className="postUsername">{user.displayName}</span>
            <div className="postDate">{format(post.createdAt)}</div>
          </div>
          {(currentUser.uid === post.owner.uid || currentUser.isAdmin) && (
            <div className="postTopRight">
              <button className="postOptionButton">
                <MoreVertIcon
                  onMouseDown={() => {
                    setTogglePostOptions(!togglePostOptions);
                  }}
                ></MoreVertIcon>

                <AnimatePresence
                  initial={false}
                  mode="wait"
                  onExitComplete={() => {
                    return null;
                  }}
                >
                  {togglePostOptions && (
                    <motion.div
                      initial={{ scale: 0, y: "-28px" }}
                      animate={{ scale: 1, y: "-28px" }}
                      exit={{ scale: 0, y: "-28px" }}
                      transition={{ delay: 0.2 }}
                    >
                      <PostOptions></PostOptions>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          )}
        </div>
        <div className="postCenter">
          <span className="postText">
            <ReadMore sliceNum={400}>{post?.desc}</ReadMore>
          </span>
          <div className="postImgsContainer">
            {post.imgs.slice(0, 4).map((img, index) => {
              return (
                <div
                  className={`postImgContainer ${
                    post.imgs.length === 1 && "oneImage"
                  }`}
                  key={img}
                >
                  {img.split(".").pop() !== "mp4" ? (
                    <img
                      className="postImg"
                      src={img}
                      alt=""
                      onClick={() => {
                        setToggleSlideShow(true);
                        setPosition(index);
                      }}
                    />
                  ) : (
                    <>
                      <video
                        className="postImg"
                        alt=""
                        onClick={() => {
                          setToggleSlideShow(true);
                          setPosition(index);
                        }}
                        src={process.env.REACT_APP_API + img}
                      ></video>
                      <a
                        onClick={() => {
                          setToggleSlideShow(true);
                          setPosition(index);
                        }}
                        id="play-video"
                        class="video-play-button"
                        href="#"
                      >
                        <span></span>
                      </a>
                    </>
                  )}

                  {index === 3 && (
                    <div
                      className="remainImg"
                      onClick={() => {
                        setToggleSlideShow(true);
                        setPosition(index);
                      }}
                    >
                      <span> + {post.imgs.length - index - 1}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <hr className="postHr" />
        <div className="postBottom">
          <div className="postBottomLeft">
            <img
              className="likeIcon"
              src={likeImg}
              onClick={likeHandler}
              alt=""
            />
            <span className="postLikeCounter">
              {like} {t("Post.peopleLiked")}
            </span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText">
              {numComments} {t("Post.comments")}
            </span>
          </div>
        </div>
        <hr className="postHr" />
        <Comments onNumComments={onNumComments} post={post}></Comments>
      </div>
      <AnimatePresence
        initial={false}
        mode="wait"
        onExitComplete={() => {
          return null;
        }}
      >
        {togglePostEdit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <PostEdit></PostEdit>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
