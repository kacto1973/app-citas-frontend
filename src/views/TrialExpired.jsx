import React from "react";

const TrialExpired = () => {
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
          onClick={() => {
            alert("Renovando licencia...");
          }}
        >
          Renovar Licencia
        </button>
      </div>
    </div>
  );
};

export default TrialExpired;
