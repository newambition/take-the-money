import React from "react";
import { FaChevronDown } from "react-icons/fa";

const ScrollArrow = ({ scrollToGameContent }) => (
  <div className="scroll-arrow-container" onClick={scrollToGameContent}>
    <FaChevronDown className="scroll-arrow" />
  </div>
);

export default ScrollArrow;
