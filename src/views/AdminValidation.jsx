import React from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useState, useEffect} from 'react';
import { validateAdmin } from '../../firebaseFunctions';
import { useNavigate } from 'react-router-dom';

const AdminValidation = () => {

  const navigate = useNavigate();
  const [password, setPassword] = useState("");

  useEffect(() => {
    localStorage.removeItem("p9d4l8rwe");
    localStorage.removeItem("userFullName");
    localStorage.removeItem("cellphone");


  },[])

  const handleLogin = (e) => {
    e.preventDefault();
    const asyncFunc = async () => {
      const admin = await validateAdmin(password);
      if (admin) {
        //en caso de que un admin se meta a la cuenta de un cliente
        //por accidente o lo que sea re remueve el client token
        navigate("/appointments");
        
      } else {
        alert("Contraseña incorrecta, intente nuevamente");
      }
    }
    asyncFunc();
  }

  const handleKeyDown = (e) => {
    if (e.key === " ") {
      e.preventDefault(); // Evita que el espacio se escriba
    }
  };



  return (
    <>
      <div className="bg-[linear-gradient(209deg,#4C2DFF_0%,#DE9FFE_62%,#855F98_100%)] overflow-hidden relative min-h-screen flex flex-col justify-center items-center">
      <div className="absolute  bg-g4 -bottom-[135%] -right-[160%] w-[200%] h-[200%] rotate-144" />

        <div className="absolute top-0 bg-g4 w-full text-center h-[13%] rounded-b-[30px] flex justify-center items-center">
          <h1 className="text-3xl font-black text-white">Bienvenido</h1>
        </div>
        <div className="absolute top-[34%] flex flex-col m-auto w-[85%] rounded-3xl p-5 bg-white text-center">
          <h2 className="text-black text-2xl font-black mb-6">Ingresa tu Contraseña</h2>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col justify-center items-center">
              <TextField
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                required
                type="text"
                className="w-[90%] border border-black rounded-md my-4 py-1.5 text-center"
                id="outlined-basic"
                label="Contraseña"
                variant="outlined"
              />
              <button
                type="submit"
                className="px-2 py-1 rounded-md mt-6 m-2 bg-gray-800 text-white w-[120px]"
              >
                Confirmar
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
  
}

export default AdminValidation