import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerClient } from "../../firebaseFunctions";
import Alert from "@mui/material/Alert";

const Register = () => {
  const navigate = useNavigate();
  //useStates
  const [fullName, setFullName] = useState("");
  const [cellphone, setCellphone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  //useEffects

  //functions
  const handleRegister = (e) => {
    e.preventDefault(); // Prevenir la recarga

    //filtramos los campos
    if (
      fullName === "" ||
      cellphone === "" ||
      username === "" ||
      password === "" ||
      confirmPassword === ""
    ) {
      setError("Por favor, llena todos los campos");
      return;
    } else if (cellphone.length !== 10) {
      setError("El número de celular debe tener 10 dígitos");
      return;
    } else if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
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
        alert("Usuario registrado con éxito");
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
      <div className="absolute  bg-g4 top-[48%] w-[100%] h-[200%] rounded-tr-[50px]" />
      <div className="absolute top-0 bg-g4 w-full text-center h-[13%] rounded-b-[30px] flex justify-center items-center">
        <h1 className="text-3xl font-black text-white">Registro</h1>
      </div>

      <form>
        <input
          type="text"
          placeholder="Nombre Completo"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className="absolute top-[20%] left-[50%] -translate-x-1/2  w-[70%] border border-black rounded-md py-1.5 text-center"
        />
        <input
          type="number"
          placeholder="Num. Celular"
          value={cellphone}
          onChange={(e) => setCellphone(e.target.value)}
          required
          className="absolute top-[30%] left-[50%] -translate-x-1/2  w-[70%] border border-black rounded-md py-1.5 text-center"
        />
        <p className="text-white font-black text-base  w-[80%] text-center absolute top-[38%] left-[50%] -translate-x-1/2">
          Con estos datos podremos comunicarnos con usted para cualquier
          aclaración
        </p>
        <h1 className="text-white font-black text-xl w-full text-center absolute top-[52%] left-[50%] -translate-x-1/2">
          Datos de Inicio de Sesión
        </h1>

        <input
          type="text"
          placeholder="Nombre de Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKeyDown}
          required
          className="absolute bottom-[37%] left-[50%] -translate-x-1/2  w-[70%] border border-black rounded-md  py-1.5 text-center"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          required
          className="absolute bottom-[27%] left-[50%] -translate-x-1/2  w-[70%] border border-black rounded-md  py-1.5 text-center"
        />
        <input
          type="password"
          placeholder="Confirmar Contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          required
          className="absolute bottom-[17%] left-[50%] -translate-x-1/2  w-[70%] border border-black rounded-md  py-1.5 text-center"
        />

        <div className="flex w-full justify-evenly">
          <button
            onClick={handleRegister}
            className="absolute bottom-[4%] px-2 py-2 rounded-md my-8 bg-g8 text-white w-[120px]"
          >
            Confirmar
          </button>
        </div>
      </form>
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
