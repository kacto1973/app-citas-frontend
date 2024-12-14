import React, { useEffect, useState } from "react";

const PaymentComponent = ({ appointmentId, classNames }) => {
  const [preferenceId, setPreferenceId] = useState(null);

  useEffect(() => {
    // Verifica si Mercado Pago está disponible
    if (window.MercadoPago) {
      // Inicializa Mercado Pago con tu clave pública
      const mp = new window.MercadoPago(
        "APP_USR-bd2f9995-457d-4d48-8151-bfc2f32bd65b"
      );

      console.log("Mercado Pago inicializado");
    } else {
      console.error("Mercado Pago no está cargado correctamente.");
    }
  }, []);

  const handlePayment = async () => {
    try {
      // Realiza la solicitud al backend para crear la preferencia
      const response = await fetch("/api/createPreference", {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        setPreferenceId(data.preferenceId);

        // Abre el checkout de Mercado Pago con el preferenceId
        const mp = new window.MercadoPago(
          "APP_USR-bd2f9995-457d-4d48-8151-bfc2f32bd65b"
        ); // Tu public key
        mp.checkout({
          preference: {
            id: data.preferenceId,
          },
        }).open();
      } else {
        console.error("Error al crear la preferencia");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
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
