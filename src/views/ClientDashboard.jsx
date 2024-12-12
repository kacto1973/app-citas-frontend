import React from "react";
import { useNavigate } from "react-router-dom";
import { getAppointments } from "../../firebaseFunctions";
import { useEffect, useState } from "react";

const ClientDashboard = () => {
  //use states
  const navigate = useNavigate();
  const [appointmentsOfClient, setAppointmentsOfClient] = useState([]);
  const [appointmentsOfClientLoaded, setAppointmentsOfClientLoaded] =
    useState(false);
  const [allAppointmentsArray, setAllAppointmentsArray] = useState([]);
  const [allAppointmentsArrayLoaded, setAllAppointmentsArrayLoaded] =
    useState(false);

  //use effects

  useEffect(() => {
    //cargamos todos los appointments
    const syncFunc = async () => {
      const allAppointments = await getAppointments();

      if (allAppointments) {
        setAllAppointmentsArray(allAppointments);
        setAllAppointmentsArrayLoaded(true);
      } else {
        console.log("de TODOS los appointments, no hubo nada que fetchear");
      }
    };
    syncFunc();
  }, []);

  useEffect(() => {
    //una vez cargados, mostramos nomas los del usuario
    const clientAppointments = getAppointmentsForClient(allAppointmentsArray);
    if (clientAppointments) {
      setAppointmentsOfClient(clientAppointments);
      setAppointmentsOfClientLoaded(true);
    } else {
      console.log("No hubo appointments que jalar para ese usuario");
    }
  }, [allAppointmentsArrayLoaded]);

  //functions

  const getAppointmentsForClient = (allAppointmentsArray) => {
    console.log("getting em...");
    const username = localStorage.getItem("username");
    let rightAppointments = [];
    if (username) {
      for (const appointment of allAppointmentsArray) {
        if (appointment.username === username) {
          rightAppointments.push(appointment);
        }
      }
    } else {
      console.log("no hay nombre de usuario guardado en este navegador");
    }
    return rightAppointments;
  };

  return (
    <div className="w-full h-screen">
      <div className="flex flex-col justify-center items-center w-full">
        <h1 className="text-2xl font-black mt-10 mb-5">PANEL DE CITAS</h1>
        <p className="mb-4">Sus próximas citas:</p>
        <div className="flex flex-col justify-center items-center w-full">
          {appointmentsOfClientLoaded &&
            appointmentsOfClient.map((appointment, index) => (
              <>
                <div className="relative w-[80%] border border-gray-900 mt-6 flex flex-col p-5 rounded-md shadow-xl bg-gray-100">
                  <div className="flex flex-row mb-2">
                    <p>
                      Cita #{index + 1} - {appointment.selectedDate} <br /> a
                      las {appointment.selectedTime}
                    </p>
                    {/* <span className="text-white bg-blue py-0.5 px-1 ml-2 rounded-lg">
                Transfer
              </span> */}
                    <p className="ml-auto">
                      <span className="text-green font-black">$150</span>
                    </p>
                  </div>
                  <p>1 x Corte de cabello - ($50) = $50</p>
                  <p>1 x Tinte de cabello - ($60) = $60</p>
                  <p>1 x Peinado - ($40) = $40</p>
                  <button
                    className="px-1 py-1 rounded-md my-5 bg-red text-white w-[30px] absolute top-[55%] left-[89%]"
                    onClick={() => {
                      cancelAppointment();
                    }}
                  >
                    X
                  </button>
                </div>
              </>
            ))}

          <button
            className="px-2 py-1 rounded-md my-5 mt-10 bg-blue text-white w-[120px]"
            onClick={() => {
              navigate("/appointmentmaker");
            }}
          >
            Nueva Cita
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
