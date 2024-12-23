import React, { useState } from "react";
import {
  findAppointmentById,
  getAppointmentExpirationTime,
} from "../../firebaseFunctions";
import { get, set } from "firebase/database";

const PaymentComponent = ({ classNames, appointmentId, business_id }) => {
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

    // const expirationExactTime = await getAppointmentExpirationTime(
    //   appointmentId
    // );

    const expirationExactTime = appointment.expiresAt;

    const response = await fetch(
      "https://3da2-2806-2f0-2461-f100-cd8d-abcb-42d2-6e5e.ngrok-free.app/api/create-order",
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
            business_id: business_id,
            type: "unique_payment",
            expirationExactTime: expirationExactTime,
          },
          //business_id: business_id,
        }),
      }
    );
    console.log("el business id que se va a enviar como cuerpo ", business_id);

    const data = await response.json();

    if (data.init_point) {
      window.open(data.init_point);
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
