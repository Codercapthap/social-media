import React, { useEffect, useState } from "react";
import Topbar from "../../components/topbar/Topbar.jsx";
import "./postPage.css";
import { useNavigate, useParams } from "react-router-dom";
import { Post as PostService } from "../../services/Post.service.js";
import Post from "../../components/post/Post.jsx";

export default function PostPage() {
  const postId = useParams().postId;
  const [post, setPost] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    PostService.getPost(postId).then((post) => {
      if (!post) {
        return navigate("/notFound");
      }
      setPost(post);
    });
  }, [postId]);

  return (
    <>
      <Topbar></Topbar>
      <div className="postPageContainer">
        {post !== null && <Post post={post}></Post>}
      </div>
    </>
  );
}
