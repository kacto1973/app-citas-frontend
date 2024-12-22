import React from "react";
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TrialContext } from "../context/TrialContext";

const TrialExpired = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { isTrialExpired } = useContext(TrialContext); // Accedemos al contexto

  useEffect(() => {
    if (!isTrialExpired) {
      navigate("/"); // Redirigir de forma imperativa
    }
  }, [isTrialExpired]); // El efecto solo se ejecutará cuando `isTrialExpired` cambie

  const business_id = localStorage.getItem("businessID")?.toLowerCase();

  const handlePayment = async () => {
    setLoading(true);

    const response = await fetch(
      "https://ab15-2806-2f0-2461-f100-f1cd-87ff-a4e4-b928.ngrok-free.app/api/create-sub",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          external_reference: {
            business_id: business_id,
            type: "subscription",
          },
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
    <div className="fixed inset-0 bg-[url(src/assets/low-poly.svg)] min-h-screen  flex items-center justify-center z-20">
      <div className="w-[85%] h-[48%] bg-softblue shadow-xl   text-white font-normal text-center p-3 rounded-md">
        <h1 className="font-black text-2xl my-3">Estimado usuario:</h1>
        <p className="text- mb-8 w-[80%] mx-auto">
          {" "}
          Su licencia de aplicación, iniciada el [fecha], ha expirado. El
          servicio está suspendido hasta que se realice el pago. Una vez
          acreditado, podrá usar la plataforma nuevamente sin problemas. Lo cual
          ocurre inmediatamente, con excepción de las Transferencias SPEI
          (plazos de 24-48 horas hábiles)
        </p>
        <button
          className="bg-green font-black w-[150px] text-white px-2 py-1 rounded-md ml-2"
          onClick={handlePayment}
        >
          {loading ? "Cargando..." : "Renovar Licencia"}
        </button>
      </div>
    </div>
  );
};

export default TrialExpired;
