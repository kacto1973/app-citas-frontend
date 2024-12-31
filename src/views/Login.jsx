import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateClient, validateAdmin } from "../../firebaseFunctions";
import { set } from "firebase/database";
import Alert from "@mui/material/Alert";

/*esto esta nomas en la rama main */

const Login = () => {
  //useStates
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  //functions
  const handleLogin = (e) => {
    // Prevenir la recarga
    e.preventDefault();

    // Validar el usuario
    const asyncFunc = async () => {
      const result = await validateClient(username, password);
      const result2 = await validateAdmin(username, password);

      if (result) {
        window.location.reload();
        navigate("/clientdashboard");
      } else if (result2) {
        window.location.reload();
        navigate("/admindashboard");
      } else {
        setError("Usuario o contraseña incorrectos, intente nuevamente");
        setUsername("");
        setPassword("");
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
          className="mx-auto mt-5 absolute top-[13%] rounded-full"
        />
        <div className="absolute  bg-g4 -bottom-[135%] -right-[160%] w-[200%] h-[200%] rotate-144" />
        <div className="absolute top-0 bg-g4 w-full text-center h-[13%] rounded-b-[30px] flex justify-center items-center">
          <h1 className="text-3xl font-black text-white">Bienvenido</h1>
        </div>
        <div className="top-[34%] absolute flex flex-col m-auto w-[85%] rounded-3xl p-5 bg-g7 text-center">
          <h2 className=" text-black text-2xl font-black">Inicio de Sesión</h2>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col justify-center items-center">
              <input
                type="text"
                placeholder="Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleKeyDown}
                required
                className="w-[90%] border border-black rounded-md my-4 py-1.5 text-center"
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                required
                className="w-[90%] border border-black rounded-md mt-5 mb-4 py-1.5 text-center"
              />
              <button
                type="submit"
                className="px-2 py-1 rounded-md mt-4 mb-2 bg-g8 text-white w-[120px]"
              >
                Iniciar Sesión
              </button>
            </div>
          </form>
        </div>
        <button
          className="absolute bottom-[15%] text-white text-center  mt-5 mb-5 bg-g9 px-2 py-1 rounded-md w-[120px] cursor-pointer"
          onClick={handleRegister}
        >
          Registrarme
        </button>
        <p className="text-white text-base font-black absolute bottom-[8%] text-center w-[90%]">
          Si es su primera vez aquí, deberá registrarse con el botón de arriba e
          iniciar sesión posteriormente
        </p>
        <p
          className="absolute bottom-[23%] text-white w-full text-center my-6 underline cursor-pointer"
          onClick={() => navigate("/forgotpassword")}
        >
          Olvidé mi contraseña
        </p>
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
