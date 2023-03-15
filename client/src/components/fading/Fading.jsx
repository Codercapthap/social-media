import React from "react";
import "./fading.css";
import ReactDOM from "react-dom";
import { motion } from "framer-motion";

export default function Fading({ toggleHandle }) {
  const handleClick = () => {
    if (toggleHandle) toggleHandle();
  };
  return ReactDOM.createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="fade" onClick={handleClick}></div>
    </motion.div>,
    document.querySelector("body")
  );
}
