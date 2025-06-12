import React from "react";
import { FaPaperPlane } from "react-icons/fa";

const InputArea = ({
  currentInput,
  setCurrentInput,
  handleSendMessage,
  isLoadingAI,
  userPromptsRemaining,
  hasPaidForCurrentSession,
  isLoggedIn,
}) => (
  <div className="input-area">
    <textarea
      value={currentInput}
      onChange={(e) => setCurrentInput(e.target.value)}
      onKeyPress={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          handleSendMessage();
        }
      }}
      placeholder="Type your message to the Prize Pool Guardian..."
      className="chat-textarea"
      rows={1}
      disabled={isLoadingAI || userPromptsRemaining <= 0 || !isLoggedIn}
      aria-label="Chat input message to Astra"
    />
    <button
      onClick={handleSendMessage}
      disabled={
        isLoadingAI ||
        !currentInput.trim() ||
        userPromptsRemaining <= 0 ||
        !isLoggedIn
      }
      className="button send-button"
      aria-label="Send message to AI"
    >
      Send
      <FaPaperPlane className="send-icon" />
    </button>
  </div>
);

export default InputArea;
