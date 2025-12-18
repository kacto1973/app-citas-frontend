import React, { useState } from "react";
import { findAppointmentById } from "../../firebaseFunctions";

const PaymentComponent = ({ classNames, appointmentId }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

    const appointment = await findAppointmentById(appointmentId);
    let amount = 10; // sample value
    let description = "Anticipo de cita. "; // sample value
    let containsPackage = false;
    if (appointment) {
      //generamos una descripcion
      if (appointment.servicesCart) {
        const services = appointment.servicesCart;
        for (const service of services) {
          description += `${service.name}. `;
          if (service.name.toLowerCase().includes("paquete")) {
            containsPackage = true;
          }
        }
      }

      if (containsPackage) {
        amount = Math.ceil(appointment.totalCost / 2);
      } else if (appointment.totalCost >= 1000) {
        amount = 500;
      } else {
        amount = Math.ceil(appointment.totalCost / 2);
      }
    }

    const expirationExactTime = appointment.expiresAt;

    const response = await fetch(
      "https://app-citas-backend.vercel.app/api/create-order",
      //"https://a53b-2806-263-c485-8db7-c195-c5f0-828e-bac1.ngrok-free.app/api/create-order",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount,
          description: description,
          external_reference: {
            appointmentId: appointmentId,
            business_id: "mb_salon",
            type: "unique_payment",
            expirationExactTime: expirationExactTime,
          },
        }),
      }
    );

    const data = await response.json();

    if (data.init_point) {
      window.location.href = data.init_point;
    }

    setLoading(false);
  };

  return (
    <div>
      <button className={classNames} onClick={handlePayment}>
        {loading ? "Cargando..." : "Dar Anticipo"}
      </button>
    </div>
  );
};

export default PaymentComponent;
