import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import {
  //cleanseRestDays,
  getAllRestDays,
  //cleanseAppointments,
  getAppointments,
} from "../../firebaseFunctions";

const AdminDashboard = () => {
  const navigate = useNavigate();

  // useEffect(() => {
  //   const asyncFunct = async () => {
  //     //limpiar restdays que ya pasaron
  //     const restDays = await getAllRestDays();
  //     if (restDays) {
  //       const done = await cleanseRestDays(restDays);
  //       if (done) {
  //         console.log("restdays limpiados!");
  //       }
  //     }

  //     //limpiar appointments que ya pasaron

  //     const done = await cleanseAppointments();
  //     if (done) {
  //       console.log("appointments limpiados!");
  //     }
  //   };

  //   asyncFunct();
  // }, []);

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
        <button
          className="px-2 py-1 rounded-md  mb-6  bg-blue text-white w-full"
          onClick={() => {
            navigate("/services");
          }}
        >
          Menú de Servicios
        </button>
        <button
          className="px-2 py-1 rounded-md  mb-6  bg-blue text-white w-full"
          onClick={() => {
            navigate("/appointmentshistory");
          }}
        >
          Historial de Citas
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
