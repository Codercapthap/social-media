import React, { useState } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ReactDOM from "react-dom";
import CancelIcon from "@mui/icons-material/Cancel";
import "./imgSlideShow.css";
import { motion } from "framer-motion";

export default function ImgSlideShow({ imgs, position, handleToggle }) {
  const [currentPosition, setCurrentPosition] = useState(position || 0);

  const handlePrevious = () => {
    if (currentPosition === 0) {
      setCurrentPosition(imgs.length - 1);
    } else {
      setCurrentPosition((prev) => {
        return prev - 1;
      });
    }
  };

  const handleNext = () => {
    if (currentPosition === imgs.length - 1) {
      setCurrentPosition(0);
    } else {
      setCurrentPosition((prev) => {
        return prev + 1;
      });
    }
  };
  return ReactDOM.createPortal(
    <motion.div
      initial={{
        scale: 0,
        position: "fixed",
        top: "50%",
        left: "50%",
        opacity: 0,
      }}
      animate={{ scale: 1, position: "fixed", top: 0, left: 0, opacity: 1 }}
      exit={{
        scale: 0,
        position: "fixed",
        top: "50%",
        left: "50%",
        opacity: 0,
      }}
      transition={{ duration: 0.4 }}
    >
      <div className="ImgsSlideShowContainer">
        <CancelIcon
          className="cancelSlideShow"
          onClick={handleToggle}
        ></CancelIcon>
        <div className="SlideShowContainer">
          <div className="previousImg">
            <ArrowBackIosIcon
              className="slideShowButton"
              onClick={handlePrevious}
            ></ArrowBackIosIcon>
          </div>
          {imgs[currentPosition].split(".").pop() !== "mp4" ? (
            <img src={imgs[currentPosition]} alt="" className="imgShowing" />
          ) : (
            <video
              src={"http://localhost:3001" + imgs[currentPosition]}
              alt=""
              controls
              className="imgShowing"
            ></video>
          )}

          <div className="nextImg">
            <ArrowForwardIosIcon
              className="slideShowButton"
              onClick={handleNext}
            ></ArrowForwardIosIcon>
          </div>
        </div>
      </div>
    </motion.div>,
    document.querySelector("body")
  );
}
