import React from "react";
import { FaUser, FaRobot } from "react-icons/fa";
import { motion } from "framer-motion";
import TypewriterFramer from "./TypewriterFramer";

const ChatMessageBubble = ({ message, onTypingComplete }) => {
  const isUser = message.sender === "user";
  const isSystem = message.sender === "system";

  if (isSystem && !message.isTypingAnimation) {
    return (
      <motion.div
        className="system-message-container"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className="system-message-text"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {message.text}
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`message-row ${
        isUser
          ? "message-row-user"
          : message.sender === "ai" || message.sender === "system"
          ? "message-row-ai"
          : ""
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className={`message-content-wrapper ${
          isUser
            ? "message-content-wrapper-user"
            : message.sender === "ai" || message.sender === "system"
            ? "message-content-wrapper-ai"
            : ""
        }`}
      >
        <div
          className={`message-bubble ${
            isUser
              ? "message-bubble-user"
              : message.sender === "ai" || message.sender === "system"
              ? "message-bubble-ai"
              : ""
          }`}
        >
          {message.sender === "user" ? (
            <FaUser className="icon user-icon" />
          ) : message.sender === "ai" || message.sender === "system" ? (
            <FaRobot className="icon ai-icon" />
          ) : null}
          <div className="message-content">
            <div className="message-text">
              {message.isTypingAnimation && onTypingComplete ? (
                <TypewriterFramer
                  text={message.text}
                  onComplete={onTypingComplete}
                />
              ) : (
                message.text
              )}
            </div>
            <p
              className={`message-timestamp ${
                isUser
                  ? "message-timestamp-user"
                  : message.sender === "ai" || message.sender === "system"
                  ? "message-timestamp-ai"
                  : ""
              }`}
            >
              {message.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessageBubble;
