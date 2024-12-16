import React, { useState } from "react";
import { findAppointmentById } from "../../firebaseFunctions";
import { set } from "firebase/database";

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
      if (appointment.extraServicesCart) {
        const extraServices = appointment.extraServicesCart;
        for (const extraService of extraServices) {
          description += `${extraService.name}. `;
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

    const response = await fetch("http://localhost:3000/api/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amount,
        description: description,
        external_reference: appointmentId,
      }),
    });

    const data = await response.json();

    if (data.init_point) {
      window.open(data.init_point, "_blank");
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
