import React, { useState } from "react";

const PaymentComponent = ({ classNames, appointmentId }) => {
  const handlePayment = async () => {
    const response = await fetch("http://localhost:3000/api/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      //body: JSON.stringify({ amount: 101 }),
    });

    const data = await response.json();

    if (data.init_point) {
      window.location.href = data.init_point;
    }
  };

  return (
    <div>
      <button className={classNames} onClick={handlePayment}>
        Dejar Anticipo
      </button>
    </div>
  );
};

export default PaymentComponent;
