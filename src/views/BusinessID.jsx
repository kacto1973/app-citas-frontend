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
      <div className="min-h-screen flex justify-center items-center bg-black ">
        <div className="bg-gray-100 absolute left-[50%] top-[50%] transform -translate-x-1/2  -translate-y-1/2 flex flex-col m-auto w-[80%] bg-softblue rounded-md p-5">
          <h1 className="mx-auto mt-5 text-black text-2xl font-black">
            ID del Negocio
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
                className="w-[180px] border border-black rounded-md mt-4 py-1.5 text-center"
              />

              <button
                type="submit"
                className="px-2 py-1 rounded-md mt-4 mb-5 bg-softgreen text-white w-[120px] bg-c1"
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
