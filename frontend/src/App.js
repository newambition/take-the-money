import React, { useState, useEffect, useRef } from "react";
import { FaUser, FaRobot } from "react-icons/fa";
import { motion, useInView } from "framer-motion";
import PLACEHOLDER_MESSAGES from "./data/placeholderMessages";
import ChatArea from "./components/Chat/ChatArea";
import GameStatusMessage from "./components/Game/GameStatusMessage";
import PaymentButton from "./components/Game/PaymentButton";
import InputArea from "./components/Game/InputArea";
import HeroSection from "./components/Game/HeroSection";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "./components/Auth/LoginButton";
import LogoutButton from "./components/Auth/LogoutButton";
import Profile from "./components/Auth/Profile";
import "./styles/App.css";

// Placeholder data and types (normally from types.ts)
// const GamePhase = { // Not currently used, but kept for potential future use
//   NORMAL: "NORMAL",
//   PAYOUT_WINDOW_ACTIVE: "PAYOUT_WINDOW_ACTIVE",
// };

// Typewriter animation for placeholder messages
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
    <motion.span // Changed from div to span for inline flow with icons
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

// Chat message bubble component
const ChatMessageBubble = ({ message, onTypingComplete }) => {
  const isUser = message.sender === "user";
  const isSystem = message.sender === "system";

  if (isSystem && !message.isTypingAnimation) {
    // Non-animated system messages
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

  // Animated system messages will fall through to the normal bubble structure
  // but won't have user/ai icons if we check sender === 'system' again.
  // For animated placeholders, we want them to look like normal chat.

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
              {" "}
              {/* Changed p to div for better flex behavior with Typewriter span */}
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

// Main game component
const AIPoolChallengeGame = () => {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth0();
  const [prizePool, setPrizePool] = useState(164.5);
  const [userPromptsRemaining, setUserPromptsRemaining] = useState(0); // Start with 0 until payment
  const [currentInput, setCurrentInput] = useState("");
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [hasPaidForCurrentSession, setHasPaidForCurrentSession] =
    useState(false); // Start as not paid

  // const [gamePhase, setGamePhase] = useState(GamePhase.NORMAL); // For styling status messages

  const [gameChatHistory, setGameChatHistory] = useState([]);
  const [animatedMessagesList, setAnimatedMessagesList] = useState([]);
  const [isPlaceholderAnimationActive, setIsPlaceholderAnimationActive] =
    useState(true);
  const [currentPlaceholderMessageIndex, setCurrentPlaceholderMessageIndex] =
    useState(0);
  const [readyForNextPlaceholderMessage, setReadyForNextPlaceholderMessage] =
    useState(false);
  const [gameStatusMessage, setGameStatusMessage] = useState(
    "Welcome!\n\n Purchase prompts to begin.\n\n £2.50 buys 5 prompts, money goes towards the pool*\n "
  );

  const PAYMENT_AMOUNT = 2.5;
  const PROMPTS_PER_PAYMENT = 5;

  const chatEndRef = useRef(null);
  const gameContentRef = useRef(null); // For scrolling to game content after hero
  const chatAreaRef = useRef(null); // For InView detection

  // InView detection for starting placeholder animation
  const isChatAreaInView = useInView(chatAreaRef, { amount: 0.5, once: true });

  useEffect(() => {
    if (
      isChatAreaInView &&
      isPlaceholderAnimationActive &&
      animatedMessagesList.length === 0 &&
      PLACEHOLDER_MESSAGES.length > 0
    ) {
      setReadyForNextPlaceholderMessage(true);
    }
  }, [isChatAreaInView, isPlaceholderAnimationActive, animatedMessagesList]);

  // Placeholder animation sequence effect
  useEffect(() => {
    if (
      isPlaceholderAnimationActive &&
      readyForNextPlaceholderMessage &&
      currentPlaceholderMessageIndex < PLACEHOLDER_MESSAGES.length
    ) {
      setReadyForNextPlaceholderMessage(false);
      const nextMsg = {
        ...PLACEHOLDER_MESSAGES[currentPlaceholderMessageIndex],
        isTypingAnimation: true,
      };
      // Add new messages to the BEGINNING of the array for column-reverse behavior
      setAnimatedMessagesList((prev) => [nextMsg, ...prev]);
    }
  }, [
    isPlaceholderAnimationActive,
    readyForNextPlaceholderMessage,
    currentPlaceholderMessageIndex,
  ]);

  const handleTypingAnimationComplete = (messageId) => {
    // Optional: mark message as not typing if needed, but TypewriterFramer hides itself
    setTimeout(() => {
      setCurrentPlaceholderMessageIndex((prev) => prev + 1);
      setReadyForNextPlaceholderMessage(true);
    }, 800); // 0.8s delay
  };

  const stopPlaceholderAnimation = () => {
    if (isPlaceholderAnimationActive) {
      setIsPlaceholderAnimationActive(false);
      // animatedMessagesList will no longer be rendered. Clearing it is optional.
      // setAnimatedMessagesList([]);
    }
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Only scroll if there are actual game messages or AI is loading a real response.
    // This prevents scrolling on initial mount or during placeholder animations.
    if (gameChatHistory.length > 0 || isLoadingAI) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [gameChatHistory, isLoadingAI]);

  const scrollToGameContent = () => {
    gameContentRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handlePayment = () => {
    stopPlaceholderAnimation();
    console.log("Payment button clicked");
    setPrizePool((prev) => prev + PAYMENT_AMOUNT);
    setUserPromptsRemaining(PROMPTS_PER_PAYMENT);
    setHasPaidForCurrentSession(true);
    const paymentSuccessMessage = `Payment successful! You have ${PROMPTS_PER_PAYMENT} prompts. Current Pool: £${(
      prizePool + PAYMENT_AMOUNT
    ).toFixed(2)}.`;
    setGameStatusMessage(paymentSuccessMessage);
    const systemMessage = {
      id: Date.now().toString() + "-system-payment",
      sender: "system",
      text: paymentSuccessMessage,
      timestamp: new Date(),
    };
    setGameChatHistory((prev) => [systemMessage, ...prev]); // Prepend system message
  };

  const handleSendMessage = () => {
    if (!currentInput.trim()) return;
    stopPlaceholderAnimation();
    console.log("Send message:", currentInput);
    const userMessage = {
      id: Date.now().toString() + "-user",
      sender: "user",
      text: currentInput,
      timestamp: new Date(),
    };
    setGameChatHistory((prev) => [userMessage, ...prev]); // Prepend user message
    setCurrentInput("");
    setIsLoadingAI(true);

    const newPromptsRemaining = userPromptsRemaining - 1;
    setUserPromptsRemaining(newPromptsRemaining);

    // Simulate AI response
    setTimeout(() => {
      const aiResponseText =
        newPromptsRemaining === 2 &&
        userMessage.text.toLowerCase().includes("money")
          ? "Hmm, that's a bit direct. Are you sure that's your best approach?"
          : "That is an interesting proposition. Tell me more.";
      const aiResponse = {
        id: Date.now().toString() + "-ai",
        sender: "ai",
        text: aiResponseText,
        timestamp: new Date(),
      };
      setGameChatHistory((prev) => [aiResponse, ...prev]); // Prepend AI response
      setIsLoadingAI(false);
      if (newPromptsRemaining === 0) {
        setGameStatusMessage("You're out of prompts! Pay to continue.");
        setHasPaidForCurrentSession(false);
      } else {
        setGameStatusMessage(
          `You have ${newPromptsRemaining} prompts remaining.`
        );
      }
    }, 1500);
  };

  const getStatusMessageClass = () => {
    let statusClass = "game-status-message";
    if (
      gameStatusMessage.includes("AI seems... different") ||
      gameStatusMessage.includes("Hmm, that's a bit direct")
    ) {
      statusClass += " status-warning";
    } else if (
      gameStatusMessage.includes("disabled") ||
      gameStatusMessage.includes("Error") ||
      gameStatusMessage.includes("Failed") ||
      gameStatusMessage.includes("out of prompts") ||
      gameStatusMessage.includes("Please pay")
    ) {
      statusClass += " status-error";
    } else if (gameStatusMessage.includes("Congratulations!")) {
      statusClass += " status-success";
    } else {
      statusClass += " status-info";
    }
    return statusClass;
  };

  const messagesToDisplay = isPlaceholderAnimationActive
    ? animatedMessagesList
    : gameChatHistory;

  return (
    <div className="app-container">
      <div className="main-card">
        {/* Hero Section */}
        <HeroSection
          scrollToGameContent={scrollToGameContent}
          prizePool={prizePool}
        />
        <hr className="separator" />
        {isAuthenticated && <Profile />}
        <GameStatusMessage
          gameStatusMessage={gameStatusMessage}
          getStatusMessageClass={getStatusMessageClass}
        />
        <section className="game-content" ref={gameContentRef}>
          <ChatArea
            messagesToDisplay={messagesToDisplay}
            isLoadingAI={isLoadingAI}
            chatEndRef={chatEndRef}
            handleTypingAnimationComplete={handleTypingAnimationComplete}
            chatAreaRef={chatAreaRef}
          />

          {/* Input Area and Payment Button */}

          {isAuthLoading ? (
            <div>Loading...</div>
          ) : !isAuthenticated ? (
            <LoginButton />
          ) : !hasPaidForCurrentSession || userPromptsRemaining === 0 ? (
            <PaymentButton
              handlePayment={handlePayment}
              PAYMENT_AMOUNT={PAYMENT_AMOUNT}
              PROMPTS_PER_PAYMENT={PROMPTS_PER_PAYMENT}
            />
          ) : (
            <InputArea
              currentInput={currentInput}
              setCurrentInput={setCurrentInput}
              handleSendMessage={handleSendMessage}
              isLoadingAI={isLoadingAI}
              userPromptsRemaining={userPromptsRemaining}
              isLoggedIn={isAuthenticated}
              hasPaidForCurrentSession={hasPaidForCurrentSession}
            />
          )}
          {isAuthenticated && <LogoutButton />}
          {/* Footer */}
          <footer className="app-footer">
            <p className="footer-text">
              *£2 for every £2.50 is added to the pool. Players must be 18 or
              over. Gamble at your own risk. <br />
              When the fun stops, stop.
            </p>
            {/* {!process.env.REACT_APP_API_KEY && <p className="footer-warning">Warning: API_KEY environment variable not found. AI functionality is disabled.</p>} */}
          </footer>
        </section>
      </div>
    </div>
  );
};

export default AIPoolChallengeGame;

// Ensure motion is imported if not already:
// import { motion, AnimatePresence, useInView } from 'framer-motion';
// FaChevronDown as well if not present:
// import { FaUser, FaRobot, FaPaperPlane, FaChevronDown } from 'react-icons/fa';
