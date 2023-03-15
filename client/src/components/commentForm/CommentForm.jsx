import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import { useState, memo, useRef, useEffect } from "react";
import "./commentForm.css";
import SendIcon from "@mui/icons-material/Send";
import { useSelector } from "react-redux";
import { Comment } from "../../services/Comment.service";
import { socket } from "../../helpers/http";
import { useTranslation } from "react-i18next";

function CommentForm({
  parentId,
  postId,
  comment,
  onComments,
  onContent,
  onToggleEdit,
  onReply,
  userForNoti,
  onNumCommentsLoad,
}) {
  const [content, setContent] = useState(comment ? comment.content : "");
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const currentUser = useSelector((state) => {
    return state.User.currentUser;
  });
  const input = useRef();
  const { t } = useTranslation();
  // return input to Comment component for handle
  useEffect(() => {
    if (onReply) onReply(input.current);
  }, []);

  /**
   * TODO: create or edit comment
   */
  const handleClick = async () => {
    if (comment) {
      await Comment.editComment(comment._id, content);
      onContent(content);
      onToggleEdit();
    } else if (content) {
      const comment = await Comment.createComment(content, parentId, postId);
      socket.emit("replyComment", {
        userId: currentUser.uid,
        userForNotiId: userForNoti,
        postId,
      });
      if (comment.parent) {
        // onNumCommentsLoad((prev) => prev + 1);
        onComments((prev) => {
          const newState = prev.map((prevItem) => {
            if (prevItem._id === comment.parent._id)
              prevItem.replies.unshift(comment);
            return prevItem;
          });
          return newState;
        });
      } else {
        onNumCommentsLoad((prev) => prev + 1);
        onComments((prev) => {
          return [{ ...comment, replies: [] }, ...prev];
        });
      }
      setContent("");
      input.current.style.height = "100%";
    }
  };

  return (
    <div className="commentFormContainer">
      <img
        src={
          currentUser.photoURL
            ? currentUser.photoURL
            : PF + "person/noAvatar.webp"
        }
        alt=""
        className="commentFormProfileImg"
      />
      <div className="commentFormInputContainer">
        <textarea
          type="text"
          className="commentFormInput"
          placeholder={t("Comment.write")}
          id="commentInputText"
          value={content}
          ref={input}
          onChange={(e) => {
            setContent(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
        />
        <div className="inputIcon">
          <SendIcon
            color="success"
            className="inputIconItem"
            onClick={handleClick}
          ></SendIcon>
        </div>
      </div>
    </div>
  );
}

export default memo(CommentForm);
