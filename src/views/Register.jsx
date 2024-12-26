import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerClient } from "../../firebaseFunctions";

const Register = () => {
  const navigate = useNavigate();
  //useStates
  const [fullName, setFullName] = useState("");
  const [cellphone, setCellphone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  //useEffects

  //functions
  const handleRegister = (e) => {
    e.preventDefault(); // Prevenir la recarga

    //filtramos los campos
    if (cellphone.length !== 10) {
      alert("El número de celular debe tener 10 dígitos");
      return;
    } else if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    //validaciones superadas, registramos al usuario
    const asyncFunc = async () => {
      const result = await registerClient(
        fullName,
        cellphone,
        username,
        password
      );
      if (result) {
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
    <div className="w-full h-screen relative bg-black">
      <div
        className="absolute top-1/2 left-1/2 -translate-y-1/2 transform -translate-x-1/2
     flex flex-col m-auto w-[80%] bg-gray-100 rounded-md p-5"
      >
        <h1 className="mx-auto mt-5 text-black text-2xl font-black">
          Registro de Usuario
        </h1>
        <form onSubmit={handleRegister}>
          <div className="flex flex-col justify-center items-center">
            <input
              type="text"
              placeholder="Nombre Completo"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-[220px] border border-black rounded-md mt-8 py-1.5 text-center"
            />
            <input
              type="number"
              placeholder="Num. Celular"
              value={cellphone}
              onChange={(e) => setCellphone(e.target.value)}
              required
              className="w-[220px] border border-black rounded-md mt-6 py-1.5 text-center"
            />
            <input
              type="text"
              placeholder="Nombre de Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
              required
              className="w-[220px] border border-black rounded-md mt-6  py-1.5 text-center"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              required
              className="w-[220px] border border-black rounded-md mt-6  py-1.5 text-center"
            />
            <input
              type="password"
              placeholder="Confirmar Contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              required
              className="w-[220px] border border-black rounded-md mt-6  mb-2 py-1.5 text-center"
            />

            <div className="flex w-full justify-evenly">
              <button
                type="submit"
                className="px-2 py-1 rounded-md my-8 bg-c1 text-white w-[120px]"
              >
                Confirmar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
