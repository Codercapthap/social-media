import React from "react";
import "./loading.css";
import { motion } from "framer-motion";

export default function Loading() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <motion.div
      initial={{ opacity: 0, position: "fixed" }}
      animate={{ opacity: 1, position: "fixed" }}
      exit={{ opacity: 0, position: "fixed" }}
      transition={{ duration: 0.5 }}
    >
      <div className="loadingContainer">
        <img src={`${PF}/loading.gif`} alt="" className="loadingImg" />
      </div>
    </motion.div>
  );
}
