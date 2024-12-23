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
    <div className="relative bg-[url('/assets/stacked-waves.svg')] bg-cover bg-center min-h-screen flex flex-col justify-center items-center">
      {/* <p className="text-white text-sm absolute top-[1%]">
        Si eres administrador, envía mensaje al +52 662-423-7920
      </p> */}
      <h1 className="mx-auto  text-white text-2xl font-black">
        Ingresa tu número de celular
      </h1>

      <form className="w-full">
        <div className="flex flex-col items-center justify-center w-full">
          <input
            className="border border-black rounded-md mt-4 py-1 w-[150px] text-center"
            type="number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="6623456789"
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
            className="px-2 py-1 rounded-md mt-8 mb-10 bg-softgreen text-white w-[120px]"
          >
            Buscar
          </button>

          {dataFound && (
            <div className="flex flex-col  p-5 rounded-md items-center justify-center ">
              <h1 className="mx-auto  text-white text-xl font-black">
                Usuario Encontrado
              </h1>
              <input
                className="border border-black rounded-md mt-4 py-1 w-[150px] text-center"
                type="text"
                value={foundUsername}
              />

              <h1 className="mx-auto mt-6 text-white text- xl font-black">
                Tu Contraseña
              </h1>
              <input
                className="border border-black rounded-md mt-4 py-1 w-[150px] text-center"
                type="text"
                value={foundPassword}
              />
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
