import React from "react";

const PaymentButton = ({
  handlePayment,
  PAYMENT_AMOUNT,
  PROMPTS_PER_PAYMENT,
}) => (
  <button
    onClick={handlePayment}
    className="button payment-button"
    aria-label={`Pay £${PAYMENT_AMOUNT.toFixed(
      2
    )} for ${PROMPTS_PER_PAYMENT} Prompts`}
  >
    Pay £{PAYMENT_AMOUNT.toFixed(2)} for {PROMPTS_PER_PAYMENT} Prompts
  </button>
);

export default PaymentButton;
