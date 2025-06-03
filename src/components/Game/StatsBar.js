import React from "react";

const StatsBar = ({ prizePool }) => (
  <div className="hero-stats-bar">
    <div className="stat-item">
      <p className="stat-label">Current Pool</p>
      <p className="stat-value">£{prizePool.toFixed(2)}</p>
    </div>
  </div>
);

export default StatsBar;
