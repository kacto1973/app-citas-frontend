import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerClient } from "../../firebaseFunctions";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

const Register = () => {
  const navigate = useNavigate();
  //useStates
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState(false);

  //useEffects

  //functions
  const handleRegister = (e) => {
    e.preventDefault(); // Prevenir la recarga

    //validaciones superadas, registramos al usuario
    const asyncFunc = async () => {
      const result = await registerClient(
        fullName,
        localStorage.getItem("cellphone")
      );
      if (result) {
        alert(
          "Usuario registrado con éxito con el número de celular: " +
            localStorage.getItem("cellphone")
        );
        navigate("/");
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
    <div className="w-full h-screen relative overflow-hidden bg-[linear-gradient(194deg,#4C2DFF_0%,#DE9FFE_100%)] ">
      <img
        className="absolute top-10 left-8 z-10"
        src="/images/return.png"
        width={25}
        alt="return"
        onClick={() => {
          navigate("/");
        }}
      />
      <div className="absolute  bg-g4 -bottom-[135%] -right-[160%] w-[200%] h-[200%] rotate-144" />

      <div className="absolute top-0 bg-g4 w-full text-center h-[13%] rounded-b-[30px] flex justify-center items-center">
        <h1 className="text-3xl font-black text-white">Bienvenido</h1>
      </div>

      <div className="top-[34%] absolute flex flex-col left-1/2 -translate-x-1/2 w-[85%] rounded-3xl p-5 bg-g7 text-center">
        <h2 className=" text-black text-2xl font-black mb-6">
          Ingresa tu Nombre Completo
        </h2>
        <form onSubmit={handleRegister}>
          <div className="flex flex-col justify-center items-center">
            <TextField
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              type="text"
              className="w-[90%] border border-black rounded-md my-4 py-1.5 text-center"
              id="outlined-basic"
              label="Nombre Completo"
              variant="outlined"
            />

            <button
              type="submit"
              className="px-2 py-1 rounded-md mt-6 m-2 bg-g8 text-white w-[120px]"
            >
              Confirmar
            </button>
          </div>
        </form>
      </div>
      {error && (
        <div className="z-50 fixed bottom-[5%] w-[80%] left-[50%] transform -translate-x-1/2">
          <Alert severity="error" onClose={() => setError(false)}>
            {error}
          </Alert>
        </div>
      )}
    </div>
  );
};

export default Register;
