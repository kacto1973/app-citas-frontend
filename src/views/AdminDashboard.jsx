import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import {
  //cleanseRestDays,
  getAllRestDays,
  //cleanseAppointments,
  getAppointments,
} from "../../firebaseFunctions";
import database from "../../firebaseConfig";
import { ref, update } from "firebase/database";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  return (
    <div
      className="
            relative min-h-screen bg-black w-full flex flex-col justify-center items-center"
    >
      {loading ? (
        <div className="absolute inset-0 bg-black  flex items-center justify-center z-20">
          <div className="bg-white p-5 rounded-md shadow-md text-center">
            <h1 className="font-black text-2xl">Cargando...</h1>
          </div>
        </div>
      ) : (
        <>
          <h1 className="text-2xl text-white font-black absolute top-[20%]  mb-5">
            Panel de Administración
          </h1>
          <div className="w-[100%] flex flex-col">
            <div className="flex w-full mb-4 space-x-4 justify-center">
              <button
                className="px-2 py-1 rounded-md   bg-gray-100 text-black font-black w-[100px] h-[100px]"
                onClick={() => {
                  navigate("/appointments");
                }}
              >
                Ver Citas
              </button>
              <button
                className="px-2 py-1 rounded-md   bg-gray-100 text-black font-black w-[100px] h-[100px]"
                onClick={() => {
                  navigate("/restdays");
                }}
              >
                Días de Descanso
              </button>
              <button
                className="px-2 py-1 rounded-md   bg-gray-100 text-black font-black w-[100px] h-[100px]"
                onClick={() => {
                  navigate("/clients");
                }}
              >
                Mis Clientes
              </button>
            </div>
            <div className="flex w-full justify-center space-x-4">
              <button
                className="px-2 py-1 rounded-md   bg-gray-100 text-black font-black w-[100px] h-[100px]"
                onClick={() => {
                  navigate("/services");
                }}
              >
                Menú de Servicios
              </button>
              <button
                className="px-2 py-1 rounded-md  bg-gray-100 text-black font-black w-[100px] h-[100px]"
                onClick={() => {
                  navigate("/appointmentshistory");
                }}
              >
                Historial de Citas
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
