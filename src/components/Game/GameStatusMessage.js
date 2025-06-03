import React from "react";

const GameStatusMessage = ({ gameStatusMessage, getStatusMessageClass }) => (
  <div className={getStatusMessageClass()}>{gameStatusMessage}</div>
);

export default GameStatusMessage;
