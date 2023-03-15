import { useState, useEffect, useCallback, memo } from "react";
import Comment from "../comment/Comment";
import CommentForm from "../commentForm/CommentForm";
import { Comment as CommentService } from "../../services/Comment.service";
import { useSelector } from "react-redux";
import "./comments.css";
import { useTranslation } from "react-i18next";

function Comments({ onNumComments, post }) {
  const [comments, setComments] = useState([]);
  const [numCommentsLoad, setNumCommentsLoad] = useState(1);
  const [isMore, setIsMore] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const { t } = useTranslation();
  const currentUser = useSelector((state) => {
    return state.User.currentUser;
  });
  //TODO: get comment of the post
  // ! if anything wrong, combine it
  useEffect(() => {
    CommentService.getComments(post._id).then(async (commentList) => {
      setComments(commentList);
    });
  }, []);

  useEffect(() => {
    let num = comments.length;
    comments.map((comment) => {
      num += comment.replies.length;
    });
    onNumComments(num);
  }, [comments]);

  useEffect(() => {
    if (numCommentsLoad >= comments.length) setIsMore(false);
    else setIsMore(true);
    setExpanded(!expanded);
  }, [comments, numCommentsLoad]);

  const handleReadMore = () => {
    if (numCommentsLoad < comments.length) {
      setNumCommentsLoad((prev) => prev + 10);
    }
  };

  const onNumCommentsLoad = useCallback(
    (func) => {
      const newNumCommentsLoad = func(numCommentsLoad);
      setNumCommentsLoad(newNumCommentsLoad);
    },
    [comments]
  );

  const onComments = useCallback(
    (func) => {
      const newComments = func(comments);
      setComments(newComments);
    },
    [comments]
  );

  return (
    <div className="postComments">
      <CommentForm
        onComments={onComments}
        parentId={null}
        postId={post._id}
        userForNoti={[post.owner.uid].filter((id) => {
          return id !== currentUser.uid;
        })}
        onNumCommentsLoad={onNumCommentsLoad}
      ></CommentForm>
      {comments.slice(0, numCommentsLoad).map((comment) => {
        return (
          <Comment
            ownId={post.owner.uid}
            onComments={onComments}
            comment={comment}
            key={comment._id}
            postId={post._id}
            onNumCommentsLoad={onNumCommentsLoad}
          ></Comment>
        );
      })}
      {isMore && (
        <p className="readMore" onClick={handleReadMore}>
          {t("Comment.readMore")}
        </p>
      )}
    </div>
  );
}

export default memo(Comments);
