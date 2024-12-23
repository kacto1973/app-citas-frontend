import React from "react";
import { useNavigate } from "react-router-dom";

import { useEffect, useState, useContext } from "react";
import { getAppointments } from "../../firebaseFunctions";
import { TrialContext } from "../context/TrialContext";

const AppointmentsHistory = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { isTrialExpired } = useContext(TrialContext); // Accedemos al contexto

  useEffect(() => {
    if (isTrialExpired) {
      navigate("/trialexpired"); // Redirigir de forma imperativa
    }
  }, [isTrialExpired]); // El efecto solo se ejecutará cuando `isTrialExpired` cambie

  const [appointmentsHistory, setAppointmentsHistory] = useState([]);

  useEffect(() => {
    const asynFunct = async () => {
      const objectOfAppointments = await getAppointments();
      if (objectOfAppointments) {
        const todayFormatted = formatDate(new Date());
        const array = Object.values(objectOfAppointments);

        const appointmentsHistoryArray = array.filter((appointment) => {
          if (appointment.selectedDate < todayFormatted) {
            console.log(appointment.selectedDate, todayFormatted);
            return true;
          }
        });
        console.log("array de ordenes pasadas", appointmentsHistoryArray);
        setAppointmentsHistory(appointmentsHistoryArray);
      } else {
        console.log("No hay citas que recuperar");
      }
      setLoading(false);
    };
    asynFunct();
  }, []);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Agregar ceros al mes si es necesario
    const day = date.getDate().toString().padStart(2, "0"); // Agregar ceros al día si es necesario

    return `${year}-${month}-${day}`;
  };

  function formatDateForDisplay(date) {
    //si recibimos 2024-12-31
    const [year, month, dateNum] = date.split("-");
    /*Obtendriamos
    year = 2024
    month = 12
    dateNum = 31
    */
    return `${dateNum}/${month}/${year}`;
  }

  function formatDuration(durationInMinutes) {
    const hours = Math.floor(durationInMinutes / 60);
    const minutes = durationInMinutes % 60;

    return `${hours} hr ${minutes ? `${minutes}m` : ""}`;
  }

  return (
    <div className="w-full min-h-screen flex flex-col  items-center bg-strblue pb-10">
      {loading ? (
        <div className="absolute inset-0 bg-black  flex items-center justify-center z-20">
          <div className="bg-white p-5 rounded-md shadow-md text-center">
            <h1 className="font-black text-2xl">Cargando...</h1>
          </div>
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-black text-white mt-10 mb-2 text-center">
            Historial de Citas
          </h1>
          <div className="w-[80%] flex flex-col justify-center items-center">
            {appointmentsHistory && appointmentsHistory.length > 0 ? (
              appointmentsHistory.map((appointment) => {
                return (
                  <>
                    <div className="relative w-[100%]  mt-6 flex flex-col p-5 rounded-md bg-[url('src/assets/blob-scene.svg')] border-[5px]  border-softgreen shadow-md text-white">
                      <div className="flex flex-row mb-2">
                        <p>
                          Cliente:{" "}
                          <span className="font-black">
                            {appointment.userFullName}
                          </span>{" "}
                          <br />
                          Tel:{" "}
                          <span className="font-black">
                            {appointment.cellphone}
                          </span>{" "}
                          <br />
                          Fecha:{" "}
                          <span className="font-black">
                            {formatDateForDisplay(appointment.selectedDate)} a
                            las {appointment.selectedTime}
                          </span>{" "}
                          <br />
                          Duración:{" "}
                          <span className="font-black">
                            {formatDuration(
                              appointment.totalDurationOfAppointment
                            )}
                          </span>
                        </p>
                        <p className="ml-auto">
                          <span className="text-green font-black text-xl">
                            ${appointment.totalCost}
                          </span>
                        </p>
                      </div>
                      {appointment.servicesCart &&
                        appointment.servicesCart.map(
                          (service, serviceIndex) => (
                            <p key={serviceIndex} className="w-[62%]">
                              • {service.name.toUpperCase()}{" "}
                              <span className="font-black text-green">
                                (${service.price})
                              </span>
                            </p>
                          )
                        )}
                      {appointment.extraServicesCart &&
                        appointment.extraServicesCart.map(
                          (extraService, extraServiceIndex) => (
                            <p key={extraServiceIndex} className="w-[62%]">
                              • {extraService.name.toUpperCase()}
                              <span className="font-black text-green">
                                ($
                                {extraService.price})
                              </span>
                            </p>
                          )
                        )}
                      {appointment.state === "pagado" ? (
                        <p className="py-1 px-1 rounded-md my-5 text-xs bg-green text-white w-[102px] absolute bottom-0 right-5">
                          Cita Confirmada
                        </p>
                      ) : (
                        <button className="pointer-events-none py-1 px-1 rounded-md my-5 text-xs bg-blue text-white w-[83px] absolute bottom-0 right-5">
                          Sin Anticipo
                        </button>
                      )}
                    </div>
                  </>
                );
              })
            ) : (
              <p className="text-white font-black text-xl mt-5 text-center">
                Actualmente no hay citas pasadas de los últimos 7 días...
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AppointmentsHistory;
