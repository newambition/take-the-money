import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatMessageBubble from "./ChatMessageBubble";

const ChatArea = ({
  messagesToDisplay,
  isLoadingAI,
  chatEndRef,
  handleTypingAnimationComplete,
  chatAreaRef,
}) => (
  <div className="chat-area chat-scrollbar" ref={chatAreaRef}>
    {isLoadingAI && (
      <motion.div
        key="loading-indicator"
        className="message-row message-row-ai"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.2 }}
      >
        <div className="message-content-wrapper message-content-wrapper-ai">
          <div className="loading-ai-bubble">
            {/* FaRobot icon and loading dots are handled in App or can be moved here if needed */}
            <div className="loading-dots">
              <div className="dot dot-1"></div>
              <div className="dot dot-2"></div>
              <div className="dot dot-3"></div>
            </div>
          </div>
        </div>
      </motion.div>
    )}
    <div ref={chatEndRef} />
    <AnimatePresence initial={false}>
      {messagesToDisplay.map((msg) => (
        <ChatMessageBubble
          key={msg.id}
          message={msg}
          {...(msg.isTypingAnimation && {
            onTypingComplete: () => handleTypingAnimationComplete(msg.id),
          })}
        />
      ))}
    </AnimatePresence>
  </div>
);

export default ChatArea;
