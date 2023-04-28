import { useState, useEffect, useMemo, memo, useCallback } from "react";
import likeImg from "../../assets/like.png";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import "./comment.css";
import CommentForm from "../commentForm/CommentForm";
import { User } from "../../services/User.service";
import { format } from "timeago.js";
import { useSelector } from "react-redux";
import { pink } from "@mui/material/colors";
import { Comment as CommentService } from "../../services/Comment.service";
import ReadMore from "../readMore/ReadMore";
import { useTranslation } from "react-i18next";
import Confirm from "../confirm/Confirm";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

function Comment({
  comment,
  postId,
  onComments,
  onChildInput,
  parentInput,
  ownId,
  onNumCommentsLoad,
}) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user, setUser] = useState(null);
  const [content, setContent] = useState(comment.content);
  const [toggleEdit, setToggleEdit] = useState(false);
  const [input, setInput] = useState(null);
  const [childInput, setChildInput] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const currentUser = useSelector((state) => {
    return state.User.currentUser;
  });
  const [toggleLike, setToggleLike] = useState(() => {
    return comment.likes.includes(currentUser.uid);
  });
  const [like, setLike] = useState(comment.likes.length);
  const { t, i18n } = useTranslation();

  // get user for display
  useEffect(() => {
    User.getUserById(comment.owner.uid).then((user) => {
      setUser(user);
    });
  }, []);

  // handle focus for the first time clicking reply at child comment
  useEffect(() => {
    if (childInput && !comment.parentId) input.focus();
  }, []);

  // toggle edit input
  const handleEdit = async () => {
    setToggleEdit(!toggleEdit);
  };

  // get all user for Noti
  const userNotiList = useMemo(() => {
    let userNoti = [...new Set([ownId, comment.owner.uid])];
    if (comment.replies && comment.replies.length > 0) {
      userNoti = [
        ...new Set([
          ...userNoti,
          ...comment.replies.map((reply) => {
            return reply.owner.uid;
          }),
        ]),
      ];
    }
    return userNoti.filter((id) => {
      return id !== currentUser.uid;
    });
  }, [currentUser]);

  /**
   * TODO: delete handle
   */
  const handleDelete = async () => {
    try {
      if (comment.parent) {
        onComments((prev) => {
          const newState = prev.map((prevItem) => {
            if (
              prevItem._id === comment.parent ||
              (comment.parent._id && prevItem._id === comment.parent._id)
            ) {
              const newStateItemReplies = prevItem.replies.filter((r) => {
                return r._id !== comment._id;
              });
              const newStateItem = {
                ...prevItem,
                replies: newStateItemReplies,
              };
              return newStateItem;
            } else return prevItem;
          });
          return newState;
        });
      } else {
        onComments((prev) => {
          return prev.filter((c) => {
            return c._id !== comment._id;
          });
        });
      }
      await CommentService.deleteComment(comment._id);
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * TODO: like handle
   */
  const handleLike = async () => {
    try {
      await CommentService.likeDislikeComment(comment._id);
      setToggleLike(!toggleLike);
      setLike((prev) => {
        return !toggleLike ? prev + 1 : prev - 1;
      });
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * TODO: handle for clicking reply
   */
  const handleClickReply = () => {
    if (comment.parent) {
      parentInput.focus();
      onChildInput();
    } else {
      input.focus();
      setChildInput(true);
    }
    setIsLoaded(true);
  };

  const onToggleEdit = useCallback(() => {
    setToggleEdit(false);
  }, []);

  const onContent = useCallback((content) => {
    setContent(content);
  }, []);

  const onChildInputCallBack = useCallback(() => {
    setChildInput(true);
  }, []);

  const onReply = useCallback((value) => {
    setInput(value);
  }, []);

  return (
    user && (
      <div className="commentContainer">
        <AnimatePresence
          initial={false}
          mode="wait"
          onExitComplete={() => {
            return null;
          }}
        >
          {confirming && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Confirm
                confirmHandle={handleDelete}
                toggleHandle={() => {
                  setConfirming(false);
                }}
                message={t("Comment.delete")}
              ></Confirm>
            </motion.div>
          )}
        </AnimatePresence>
        {!toggleEdit && (
          <div className="commentLeft">
            <Link to={`/profile/${user.uid}`}>
              <img
                src={
                  user.photoURL ? user.photoURL : PF + "person/noAvatar.webp"
                }
                alt=""
                className="commentLeftProfileImg"
              />
            </Link>
          </div>
        )}
        <div className="commentRight">
          {!toggleEdit ? (
            <>
              <div className="commentRightMessageContainer">
                <span className="commentRightMessageName">
                  {user.displayName}
                </span>
                <span className="commentRightMessageText">
                  <ReadMore sliceNum={150}>{content}</ReadMore>
                </span>
                <div className="commentRightMessageLike">
                  <img
                    className="commentRightMessageLikeIcon"
                    src={likeImg}
                    alt=""
                  />
                  <span className="commentRightMessageLikeNumber">{like}</span>
                </div>
                {(comment.owner.uid === currentUser.uid ||
                  currentUser.isAdmin) && (
                  <div className="inputEditIcon">
                    {comment.owner.uid === currentUser.uid && (
                      <EditIcon
                        color="primary"
                        className="inputEditIconItem"
                        onClick={handleEdit}
                      ></EditIcon>
                    )}
                    <DeleteIcon
                      sx={{ color: pink[500] }}
                      className="inputEditIconItem"
                      onClick={() => {
                        setConfirming(true);
                      }}
                    ></DeleteIcon>
                  </div>
                )}
              </div>
              <div className="commentRightMessageAction">
                <span
                  className={
                    "commentRightMessageActionItem " +
                    (toggleLike ? "active" : "")
                  }
                  onClick={handleLike}
                >
                  {t("General.like")}
                </span>
                <span
                  className="commentRightMessageActionItem"
                  onClick={handleClickReply}
                >
                  {t("Comment.reply")}
                </span>
                <span className="commentRightTime">
                  {format(comment.createdAt)}
                </span>
              </div>
            </>
          ) : (
            <CommentForm
              parentId={null}
              postId={postId}
              comment={comment}
              onContent={onContent}
              onComments={onComments}
              onToggleEdit={onToggleEdit}
            ></CommentForm>
          )}
          <div className="commentRightReplies">
            {comment.replies && isLoaded && (
              <>
                {comment.replies.map((reply) => {
                  return (
                    <Comment
                      comment={reply}
                      key={reply._id}
                      postId={postId}
                      onComments={onComments}
                      onChildInput={onChildInputCallBack}
                      parentInput={input}
                      ownId={ownId}
                    ></Comment>
                  );
                })}
              </>
            )}
            {!isLoaded && comment.replies && comment.replies.length > 0 && (
              <p
                className="readMore"
                onClick={() => {
                  setIsLoaded(true);
                }}
              >
                {t("Comment.read")} {comment.replies.length}{" "}
                {t("Comment.replies")}
              </p>
            )}
          </div>
        </div>
        {!comment.parent && (
          <div className="repCommentForm" hidden={!childInput ? "hidden" : ""}>
            <CommentForm
              parentId={comment._id}
              postId={postId}
              onComments={onComments}
              onReply={onReply}
              userForNoti={userNotiList}
              onNumCommentsLoad={onNumCommentsLoad}
            ></CommentForm>
          </div>
        )}
      </div>
    )
  );
}

export default memo(Comment);
