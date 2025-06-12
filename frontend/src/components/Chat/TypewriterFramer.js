import React, { useState } from "react";
import { motion } from "framer-motion";

const TypewriterFramer = ({ text, onComplete, speedPerChar = 0.05 }) => {
  const [animationCompletedOnce, setAnimationCompletedOnce] = useState(false);
  if (!text) return null;
  const characters = Array.from(text);
  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: speedPerChar, delayChildren: 0 },
    },
  };
  const charVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", damping: 15, stiffness: 200 },
    },
  };
  return (
    <motion.span
      style={{ display: "inline-flex", flexWrap: "wrap" }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      onAnimationComplete={() => {
        if (!animationCompletedOnce) {
          onComplete();
          setAnimationCompletedOnce(true);
        }
      }}
    >
      {characters.map((char, index) => (
        <motion.span
          key={index}
          variants={charVariants}
          style={{ whiteSpace: "pre-wrap" }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
};

export default TypewriterFramer;
