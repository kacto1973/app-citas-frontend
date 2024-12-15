import React, { useState } from "react";
import { findAppointmentById } from "../../firebaseFunctions";

const PaymentComponent = ({ classNames, appointmentId }) => {
  const handlePayment = async () => {
    const appointment = await findAppointmentById();
    let amount = 10; // sample value
    let description = "items list"; // sample value
    if (appointment) {
      amount = Math.ceil(appointment.totalCost / 4);

      //generamos una descripcion
      if (appointment.servicesCart) {
        const services = appointment.servicesCart;
      }
      if (appointment.extraServicesCart) {
        const extraServices = appointment.extraServicesCart;
      }
    }

    const response = await fetch("http://localhost:3000/api/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amount,
        description: description,
      }),
    });

    const data = await response.json();

    if (data.init_point) {
      window.open(data.init_point, "_blank");
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
