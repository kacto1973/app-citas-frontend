import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {};

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
              required
              className="w-[150px] border border-black rounded-md mt-4 py-1.5 text-center"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-[150px] border border-black rounded-md mt-5 mb-4 py-1.5 text-center"
            />
            <button
              type="submit"
              className="px-2 py-1 rounded-md mb-5 bg-blue text-white w-[120px]"
            >
              Iniciar Sesión
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
