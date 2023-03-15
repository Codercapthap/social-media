import React, { useEffect, useState } from "react";
import Topbar from "../../components/topbar/Topbar.jsx";
import "./postPage.css";
import { useParams } from "react-router-dom";
import { Post as PostService } from "../../services/Post.service.js";
import Post from "../../components/post/Post.jsx";

export default function PostPage() {
  const postId = useParams().postId;
  const [post, setPost] = useState(null);

  useEffect(() => {
    PostService.getPost(postId).then((post) => {
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
