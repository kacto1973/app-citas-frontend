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
      <div className="absolute left-[50%] top-[50%] transform -translate-x-1/2  -translate-y-1/2 flex flex-col m-auto w-[80%]  rounded-md  border border-gray-900 shadow-xl">
        <h2 className="mx-auto mt-5">Ingrese el Identificador del Negocio</h2>
        <form onSubmit={handleClick}>
          <div className="flex flex-col justify-center items-center">
            <input
              type="text"
              placeholder="ID_De_Negocio123"
              value={businessID}
              onChange={(e) => setBusinessID(e.target.value)}
              onKeyDown={handleKeyDown}
              required
              className="w-[180px] border border-black rounded-md mt-4 py-1.5 text-center"
            />

            <button
              type="submit"
              className="px-2 py-1 rounded-md mt-4 mb-5 bg-blue text-white w-[120px]"
            >
              Validar
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default BusinessID;
