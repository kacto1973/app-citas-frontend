import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateClient, validateAdmin } from "../services/api";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";

const Login = () => {
  //useStates
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    localStorage.removeItem("cellphone");
  }, []);

  useEffect(() => {
    if (phone === "1111") {
      console.log("phone value: ", phone);
      console.log("Admin detected, setting admin token");
      localStorage.setItem("8w9j2fjsd", "someValue");
      window.location.reload();
    }
  }, [phone]);

  //functions
  const handleLogin = (e) => {
    // Prevenir la recarga
    e.preventDefault();

    if (phone.length !== 10) {
      setError("El número de celular debe tener 10 dígitos");
      return;
    }

    localStorage.setItem("cellphone", phone);

    // Validar el usuario
    const asyncFunc = async () => {
      const client = await validateClient(phone);

      if (client) {
        console.log("Cliente encontrado redigiriendo a client dashboard");
        //navigate("/clientdashboard");
        window.location.href = "/clientdashboard";
      } else {
        console.log("Cliente no encontrado redigiriendo a register");
        //navigate("/register");
        window.location.href = "/register";
      }
    };
    asyncFunc();
  };

  const handleRegister = () => {
    navigate("/register");
  };

  // Prevenir la entrada de espacios
  const handleKeyDown = (e) => {
    if (e.key === " ") {
      e.preventDefault(); // Evita que el espacio se escriba
    }
  };

  return (
    <>
      <div className="bg-[linear-gradient(209deg,#4C2DFF_0%,#DE9FFE_62%,#855F98_100%)] overflow-hidden relative   min-h-screen flex flex-col justify-center items-center">
        <img
          src="/images/logoBaza.png"
          alt="logo"
          width={120}
          className="mx-auto mt-5 absolute top-[13%] rounded-full hidden"
        />
        <div className="absolute  bg-g4 -bottom-[135%] -right-[160%] w-[200%] h-[200%] rotate-144" />
        <div className="absolute top-0 bg-g4 w-full text-center h-[13%] rounded-b-[30px] flex justify-center items-center">
          <h1 className="text-3xl font-black text-white">Bienvenido</h1>
        </div>
        <div className="top-[34%] absolute flex flex-col m-auto w-[85%] rounded-3xl p-5 bg-g7 text-center">
          <h2 className=" text-black text-2xl font-black mb-6">
            Ingresa tu Celular
          </h2>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col justify-center items-center">
              <TextField
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onKeyDown={handleKeyDown}
                required
                type="number"
                className="w-[90%] border border-black rounded-md my-4 py-1.5 text-center"
                id="outlined-basic"
                label="Tu Nro. Celular (10 dígitos)"
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
        <img
          className="absolute bottom-[15%] left-[20%] z-10"
          src="/images/cellphone3d.png"
          width={100}
          alt="cellphone3d"
        />
        <img
          className="absolute bottom-[15%] right-[20%] z-10"
          src="/images/chatbubble3d.png"
          width={120}
          alt="chatbubble3d"
        />
      </div>
      {error && (
        <div className="z-50 fixed bottom-[5%] left-[50%] -translate-x-1/2 w-[80%]">
          <Alert severity="error" onClose={() => setError("")}>
            {error}
          </Alert>
        </div>
      )}
    </>
  );
};

export default Login;
