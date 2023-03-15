import React, { memo, useCallback } from "react";
import "./feed.css";
import Share from "../share/Share.jsx";
import { default as PostComponent } from "../post/Post.jsx";
import { Post } from "../../services/Post.service";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import InfiniteScroll from "react-infinite-scroller";
import { useTranslation } from "react-i18next";

function Feed({ uid }) {
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [number, setNumber] = useState(10);
  const currentUser = useSelector((state) => {
    return state.User.currentUser;
  });
  const { t } = useTranslation();

  useEffect(() => {
    setPosts([]);
    setNumber(10);
    fetchMore();
  }, [uid]);

  /**
   * TODO: get post to display
   */
  const fetchMore = async () => {
    const res = uid
      ? await Post.getProfilePost(uid, number)
      : await Post.getTimelinePost(number);

    if (posts.length >= res.length) {
      setHasMore(false);
    }

    setPosts(
      res.sort((p1, p2) => {
        return new Date(p2.createdAt) - new Date(p1.createdAt);
      })
    );

    setNumber((prev) => {
      return prev + 10;
    });
  };

  const onPosts = useCallback((newPosts) => {
    setPosts(newPosts);
  }, []);

  return (
    <div className="feed">
      <div className="feedWrapper">
        {(!uid || uid === currentUser.uid) && <Share onPosts={onPosts}></Share>}
        <InfiniteScroll
          hasMore={hasMore}
          loader={
            <div className="loader" key={0}>
              {t("General.loading")}
            </div>
          }
          loadMore={fetchMore}
        >
          {posts.map((p) => {
            return <PostComponent key={p._id} post={p}></PostComponent>;
          })}
        </InfiniteScroll>
      </div>
    </div>
  );
}
export default memo(Feed);
