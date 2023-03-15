import React, { useEffect, useState } from "react";
import "./search.css";
import Topbar from "../../components/topbar/Topbar";
import SearchItem from "../../components/searchItem/SearchItem";
import { Link, useSearchParams } from "react-router-dom";
import { User } from "../../services/User.service";
import InfiniteScroll from "react-infinite-scroller";
import { AnimatePresence, motion } from "framer-motion";

export default function Search() {
  const [searchText, setSearchText] = useSearchParams();
  const [hasMore, setHasMore] = useState(true);
  const [number, setNumber] = useState(30);
  const [searchItems, setSearchItems] = useState([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    loadMore();
    setExpanded(!expanded);
  }, [searchText]);

  const loadMore = () => {
    const query = searchText.get("name");
    User.getUserByName(query, number).then((res) => {
      setNumber((prev) => prev + 10);
      if (searchItems.length >= res.length) setHasMore(false);
      setSearchItems(res);
    });
  };

  return (
    <>
      <Topbar></Topbar>
      <AnimatePresence
        initial={false}
        mode="wait"
        onExitComplete={() => {
          return null;
        }}
      >
        <motion.div
          key={expanded}
          initial={{ opacity: 0, marginLeft: "100vw" }}
          animate={{ opacity: 1, marginLeft: 0 }}
          exit={{ opacity: 0, marginLeft: "100vw" }}
          transition={{ duration: 0.4 }}
        >
          <div className="searchContainer">
            <InfiniteScroll
              hasMore={hasMore}
              loadMore={loadMore}
            ></InfiniteScroll>
            {searchItems.map((searchItem) => {
              return (
                <Link
                  to={`/profile/${searchItem.uid}`}
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <SearchItem user={searchItem}></SearchItem>
                </Link>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
