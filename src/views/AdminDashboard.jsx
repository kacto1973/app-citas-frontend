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

  useEffect(() => {
    const asyncFunc = async () => {
      try {
        const businessID = localStorage.getItem("businessID").toLowerCase();
        const lastSeenRef = ref(database, `businesses/${businessID}/admins`);

        const now = new Date();

        const readableDate = now.toLocaleString("es-MX", {
          weekday: "long", // Nombre completo del día
          year: "numeric", // Año con 4 dígitos
          month: "long", // Nombre completo del mes
          day: "numeric", // Día del mes
          hour: "2-digit", // Hora en formato de 2 dígitos
          minute: "2-digit", // Minutos en formato de 2 dígitos
          second: "2-digit", // Segundos en formato de 2 dígitos
          hour12: true, // Formato de 12 horas (true) o 24 horas (false)
        });

        await update(lastSeenRef, { lastSeen: readableDate });
      } catch (error) {
        console.log(error);
      }
    };
    asyncFunc();
  }, []);

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
    <div className="relative min-h-screen bg-[url(src/assets/blob-scene.svg)] w-full flex flex-col justify-center items-center">
      <h1 className="text-2xl text-white font-black absolute top-[12%]  mb-5">
        Panel de Administración
      </h1>
      <div className="w-[100%] flex flex-col">
        <div className="flex w-full mb-4 space-x-4 justify-center">
          <button
            className="px-2 py-1 rounded-md   bg-blue text-white w-[100px] h-[100px]"
            onClick={() => {
              navigate("/appointments");
            }}
          >
            Ver Citas
          </button>
          <button
            className="px-2 py-1 rounded-md   bg-blue text-white w-[100px] h-[100px]"
            onClick={() => {
              navigate("/restdays");
            }}
          >
            Días de Descanso
          </button>
          <button
            className="px-2 py-1 rounded-md   bg-blue text-white w-[100px] h-[100px]"
            onClick={() => {
              navigate("/clients");
            }}
          >
            Mis Clientes
          </button>
        </div>
        <div className="flex w-full justify-center space-x-4">
          <button
            className="px-2 py-1 rounded-md   bg-blue text-white w-[100px] h-[100px]"
            onClick={() => {
              navigate("/services");
            }}
          >
            Menú de Servicios
          </button>
          <button
            className="px-2 py-1 rounded-md  bg-blue text-white w-[100px] h-[100px]"
            onClick={() => {
              navigate("/appointmentshistory");
            }}
          >
            Historial de Citas
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
