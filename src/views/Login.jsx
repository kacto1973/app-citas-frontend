import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateClient, validateAdmin } from "../../firebaseFunctions";
import { set } from "firebase/database";

const Login = () => {
  //useStates
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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
        alert("Usuario o contraseña incorrectos");
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
      <img
        src="/images/logoBaza.png"
        alt="logo"
        width={100}
        className="mx-auto my-10"
      />
      <div className="flex flex-col m-auto w-[80%]  rounded-md  border border-gray-900 shadow-xl">
        <h2 className="mx-auto mt-5">Inicio de Sesión</h2>
        <form onSubmit={handleLogin}>
          <div className="flex flex-col justify-center items-center">
            <input
              type="text"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
              required
              className="w-[150px] border border-black rounded-md mt-4 py-1.5 text-center"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              required
              className="w-[150px] border border-black rounded-md mt-5 mb-4 py-1.5 text-center"
            />
            <button
              type="submit"
              className="px-2 py-1 rounded-md mt-4 mb-5 bg-blue text-white w-[120px]"
            >
              Iniciar Sesión
            </button>
            <button
              className="w-[120px] px-2 py-1 text-white bg-green rounded-md text-center  cursor-pointer"
              onClick={handleRegister}
            >
              Regístrate
            </button>
          </div>

          <p
            className="text-blue w-full text-center my-6 underline cursor-pointer"
            onClick={() => navigate("/forgotpassword")}
          >
            Olvidé mi contraseña
          </p>
        </form>
      </div>
    </>
  );
};

export default Login;
