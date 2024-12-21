import React from "react";
import { useState } from "react";

const TrialExpired = () => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

    const response = await fetch("http://localhost:3000/api/create-sub", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        external_reference: {
          business_id: business_id,
        },
      }),
    });
    console.log("el business id que se va a enviar como cuerpo ", business_id);

    const data = await response.json();

    if (data.init_point) {
      window.open(data.init_point, "_blank");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-[url(src/assets/low-poly.svg)] min-h-screen  flex items-center justify-center z-20">
      <div className="w-[90%] h-[48%] bg-softblue shadow-xl   text-white font-normal text-center p-3 rounded-md">
        <h1 className="font-black text-2xl my-3">Estimado usuario:</h1>
        <p className="text-lg mb-8">
          Lamentamos informarle que su suscripción de un mes, iniciada el
          [fecha], ha expirado. Por el momento, debemos suspender el servicio
          hasta que se realice la renovación. Pedimos disculpas por cualquier
          inconveniente y le invitamos a renovar su suscripción haciendo clic en
          el botón de abajo.
        </p>
        <button
          className="bg-green font-black w-[150px] text-white px-2 py-1 rounded-md ml-2"
          onClick={handlePayment}
        >
          Renovar Licencia
        </button>
      </div>
    </div>
  );
};

export default TrialExpired;
