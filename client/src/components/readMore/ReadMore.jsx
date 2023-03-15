import "./readMore.css";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const ReadMore = ({ children, sliceNum }) => {
  const text = children;
  const [isReadMore, setIsReadMore] = useState(true);
  const [isLessThanNum, setIsLessThanNum] = useState(true);
  const { t } = useTranslation();
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };
  useEffect(() => {
    if (sliceNum < text.length) setIsLessThanNum(false);
  }, []);
  return (
    <p className="text">
      {isReadMore ? text.slice(0, sliceNum) : text}
      {!isLessThanNum && (
        <span onClick={toggleReadMore} className="read-or-hide">
          {isReadMore ? t("Readmore.readMore") : t("Readmore.showLess")}
        </span>
      )}
    </p>
  );
};

export default ReadMore;
