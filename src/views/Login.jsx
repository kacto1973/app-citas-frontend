import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateClient, validateAdmin } from "../../firebaseFunctions";
import { set } from "firebase/database";

/*esto esta nomas en la rama main */

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
      <div className="relative bg-[url('/src/assets/layered-waves.svg')] bg-cover bg-center min-h-screen flex flex-col justify-center items-center">
        <img
          src="/images/logoBaza.png"
          alt="logo"
          width={100}
          className="mx-auto mt-10 absolute top-[1%]"
        />
        <div className="top-[23%] absolute flex flex-col m-auto w-[70%] rounded-md p-1 bg-softblue">
          <h2 className="mx-auto mt-5 text-white text-2xl font-black">
            Inicio de Sesión
          </h2>
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
                className="px-2 py-1 rounded-md mt-4 mb-5 bg-softgreen text-white w-[120px]"
              >
                Iniciar Sesión
              </button>
              <p
                className="text-white w-full text-center mt-2 mb-5 underline cursor-pointer"
                onClick={handleRegister}
              >
                Regístrate Aquí
              </p>
            </div>
          </form>
        </div>
        <p
          className="absolute bottom-[30%] text-white w-full text-center my-6 underline cursor-pointer"
          onClick={() => navigate("/forgotpassword")}
        >
          Olvidé mi contraseña
        </p>
      </div>
    </>
  );
};

export default Login;
