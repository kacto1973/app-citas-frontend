import React from "react";
import { useState, useEffect } from "react";
import { findClientByPhoneNumber } from "../../firebaseFunctions";

const ForgotPassword = () => {
  const [dataFound, setDataFound] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [foundUsername, setFoundUsername] = useState("");
  const [foundPassword, setFoundPassword] = useState("");

  const handleClick = async (phoneNumber) => {
    const string = phoneNumber.toString();
    //filtramos los campos
    if (string.length !== 10) {
      alert("El número de celular debe tener 10 dígitos");
      return;
    }
    console.log("hola desde click, esto es phone number string ", string);
    const foundClient = await findClientByPhoneNumber(string);
    if (foundClient) {
      console.log(foundClient);
      setFoundUsername(foundClient.username);
      setFoundPassword(foundClient.password);
      setDataFound(true);
    } else {
      alert("El número de celular no se encontró, pruebe nuevamente");
    }
  };

  useEffect(() => {
    console.log(phoneNumber);
  }, [phoneNumber]);

  return (
    <div className="flex flex-col items-center justify-center min-h-scren w-full">
      <h1 className="text-center mt-10">
        Ingresa tu número de celular sin prefijo
      </h1>

      <form className="w-full">
        <div className="flex flex-col items-center justify-center w-full">
          <input
            className="border border-black rounded-md mt-4 py-1 w-[150px] text-center"
            type="number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="6621314151"
            required
          />
          <button
            onClick={(e) => {
              e.preventDefault();

              const asyncFunc = async () => {
                await handleClick(phoneNumber);
              };
              asyncFunc();
            }}
            className="px-2 py-1 rounded-md mt-4 mb-5 bg-blue text-white w-[120px]"
          >
            Listo
          </button>

          {dataFound && (
            <div className="flex flex-row  p-5 rounded-md drop-shadow-xl justify-center bg-gray-200 ">
              <div className="mr-4">
                <p className="text-center">Tu Usuario</p>
                <input
                  className="border border-black rounded-md mt-4 py-1 w-[150px] text-center"
                  type="text"
                  value={foundUsername}
                />
              </div>
              <div className="ml-4">
                <p className="text-center">Tu Contraseña</p>
                <input
                  className="border border-black rounded-md mt-4 py-1 w-[150px] text-center"
                  type="text"
                  value={foundPassword}
                />
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
