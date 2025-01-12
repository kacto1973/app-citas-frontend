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
      "https://app-citas-backend.vercel.app/api/create-sub",
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
    <div className="fixed inset-0 min-h-screen bg-[url('/images/polygrid.svg')] bg-cover flex items-center justify-center z-20">
      <div className="relative w-[85vw] h-[60vh] shadow-xl bg-white font-normal text-center p-3 rounded-md flex items-center flex-col">
        <img className="my-8" src="/images/hucha-3d.png" width={100} alt="pig image" />
        <p className="text-black mb-8 w-[80%] mx-auto">
          Su licencia de plataforma ha expirado. El servicio está suspendido hasta que se realice
          el pago de renovación. Una vez acreditado, podrá usar la plataforma de inmediato sin problemas ya que el pago se  refleja
          al instante.
        </p>
        <button
          className="bg-g1 font-black w-[150px] text-white px-2 py-1 rounded-md ml-2"
          onClick={handlePayment}
        >
          {loading ? "Cargando..." : "Renovar Licencia"}
        </button>
        <div className="absolute rounded-t-md top-0 w-full h-[0.7rem] bg-[linear-gradient(90deg,#4C2DFF_0%,#4C2DFF_75%,#4C2DFF_100%)] z-50" />

      </div>

    </div>
  );
};

export default TrialExpired;
