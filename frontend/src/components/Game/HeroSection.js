import React from "react";
import { FaChevronDown } from "react-icons/fa";
import StatsBar from "./StatsBar";

const HeroSection = ({ scrollToGameContent, prizePool }) => (
  <section className="hero-section">
    <header className="app-header">
      <h1 className="header-title">Prize Pool Challenge</h1>
      <p className="header-subtitle">
        Convince the AI to give you the money. Win the prize pool.
      </p>
      <p className="header-subtitle">It's that simple.</p>
    </header>
    <StatsBar prizePool={prizePool} />
    <div className="scroll-arrow-container" onClick={scrollToGameContent}>
      <FaChevronDown className="scroll-arrow" />
    </div>
  </section>
);

export default HeroSection;
