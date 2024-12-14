import React, { useState } from "react";

const PaymentComponent = ({ classNames }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true); // Muestra que se está procesando la solicitud

    try {
      // Datos del producto o servicio que se enviarán al backend
      const preferenceData = {
        items: [
          {
            title: "Anticipo de cita pref", // Título del producto/servicio
            unit_price: 100, // Precio del producto/servicio
            quantity: 1, // Cantidad
          },
        ],
        back_urls: {
          success: "https://mb-salon-citas.netlify.app/downpayment",
          failure: "https://mb-salon-citas.netlify.app/downpayment",
          pending: "https://mb-salon-citas.netlify.app/downpayment",
        },
        auto_return: "approved",
      };

      // Realiza la solicitud al backend para crear la preferencia
      const response = await fetch("https://app-citas-backend.vercel.app/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preferenceData),
      });

      if (response.ok) {
        const data = await response.json();
        const preferenceId = data.preferenceId;

        // Redirige al usuario a Mercado Pago con el preferenceId
        const mp = new window.MercadoPago(
          "APP_USR-bd2f9995-457d-4d48-8151-bfc2f32bd65b"
        );
        mp.checkout({
          preference: {
            id: preferenceId,
          },
        }).open();
      } else {
        console.error("Error al crear la preferencia");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    } finally {
      setLoading(false); // Desactiva el estado de carga
    }
  };

  return (
    <div>
      <button
        className={classNames}
        onClick={handlePayment}
        disabled={loading} // Desactiva el botón mientras se está procesando
      >
        {loading ? "Procesando..." : "Dejar Anticipo"}
      </button>
    </div>
  );
};

export default PaymentComponent;
