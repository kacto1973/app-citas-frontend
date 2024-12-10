import React from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center">
      <h1 className="text-2xl font-black mt-10 mb-5">PANEL DE CONTROL</h1>
      <div className="w-[40%] flex flex-col">
        <button
          className="px-2 py-1 rounded-md mt-5 mb-6  bg-blue text-white w-full"
          onClick={() => {
            navigate("/appointments");
          }}
        >
          Ver Citas
        </button>
        <button
          className="px-2 py-1 rounded-md  mb-6   bg-blue text-white w-full"
          onClick={() => {
            navigate("/restdays");
          }}
        >
          Días de Descanso
        </button>
        <button
          className="px-2 py-1 rounded-md  mb-6   bg-blue text-white w-full"
          onClick={() => {
            navigate("/clients");
          }}
        >
          Mis Clientes
        </button>
        {/* <button
          className="px-2 py-1 rounded-md  mb-6  bg-blue text-white w-full"
          onClick={() => {
            navigate("/menu");
          }}
        >
          Menú de Servicios
        </button> */}
      </div>
    </div>
  );
};

export default AdminDashboard;
