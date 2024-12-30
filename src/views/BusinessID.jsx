import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateBusinessID } from "../../firebaseFunctions";

const BusinessID = () => {
  //useStates
  const navigate = useNavigate();
  const [businessID, setBusinessID] = useState("");

  //functions
  const handleClick = (e) => {
    // Prevenir la recarga
    e.preventDefault();

    // Validar el usuario
    const asyncFunc = async () => {
      const result = await validateBusinessID(businessID);

      if (result) {
        localStorage.setItem("businessID", businessID);
        window.location.reload();
        navigate("/login");
      } else {
        setBusinessID("");
        alert("El ID de negocio no es válido, intente nuevamente por favor");
      }
    };
    asyncFunc();
  };

  // Prevenir la entrada de espacios
  const handleKeyDown = (e) => {
    if (e.key === " ") {
      e.preventDefault(); // Evita que el espacio se escriba
    }
  };

  return (
    <>
      <div className="overflow-hidden relative min-h-screen flex justify-center items-center bg-[linear-gradient(209deg,#4C2DFF_0%,#DE9FFE_62%,#855F98_100%)]">
        <img
          className="absolute top-[15%] z-10"
          src="/images/bookmark3d.png"
          width={100}
          alt="bookmark3d"
        />
        <img
          className="absolute bottom-[10%] z-10"
          src="/images/calendar3d.png"
          width={120}
          alt="calendar3d"
        />
        <div className="absolute  bg-g4 -bottom-[135%] -right-[160%] w-[200%] h-[200%] rotate-144" />
        <div className="absolute top-0 bg-g4 w-full text-center h-[13%] rounded-b-[30px] flex justify-center items-center">
          <h1 className="text-3xl font-black text-white">EASY AGENDA</h1>
        </div>
        <p className="text-white text-base font-black absolute top-[28%] text-center w-[80%]">
          Solo necesitamos hacer esta única configuración inicial y listo
        </p>
        <p className="text-white text-base font-black absolute bottom-[26%] text-center w-[80%]">
          Su código será entregado a usted por el encargado del negocio
        </p>
        <div className=" text-center bg-g7 absolute left-[50%] top-[50%] transform -translate-x-1/2  -translate-y-1/2 flex flex-col m-auto w-[85%] h-[220px] rounded-3xl p-5">
          <h1 className=" text-black text-xl my-2  font-black ">
            Ingrese el código del negocio
          </h1>
          <form onSubmit={handleClick}>
            <div className="flex flex-col justify-center items-center">
              <input
                type="text"
                placeholder="ID del negocio"
                value={businessID}
                onChange={(e) => setBusinessID(e.target.value)}
                onKeyDown={handleKeyDown}
                required
                className="w-[90%] border border-black rounded-md my-4 py-1.5 text-center"
              />

              <button
                type="submit"
                className="px-2 py-2 rounded-md my-4 text-white w-[120px] bg-g8"
              >
                Validar
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default BusinessID;
