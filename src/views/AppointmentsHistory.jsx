import React from "react";
import { useNavigate } from "react-router-dom";

import { useEffect, useState, useContext } from "react";
import { getAppointments } from "../../firebaseFunctions";

const AppointmentsHistory = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
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
    <div className="w-full min-h-screen flex flex-col  items-center bg-g10 pb-10">
      {loading ? (
        <div className="absolute inset-0 bg-black  flex items-center justify-center z-20">
          <div className="bg-white p-5 rounded-md shadow-md text-center">
            <h1 className="font-black text-2xl">Cargando...</h1>
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col bg-g10 items-center absolute top-[7rem]">
          {/* gradiente de arriba */}
          <div className="fixed z-10 -top-[675px] left-[50%] -translate-x-1/2 rounded-b-[30px] bg-[linear-gradient(40deg,#4C2DFF_0%,#DE9FFE_100%)] h-[765px] w-[100vw] " />
          {/* elementos posicionados absolutamente */}
          <div className="z-50 fixed bottom-0 bg-white  w-full shadow-black shadow-2xl h-[4.3rem] flex justify-evenly items-center">
            <div className="flex flex-col items-center">
              <img
                src="/images/calendar_black_icon.svg"
                width={30}
                alt="calendar icon"
                onClick={() => {
                  navigate("/appointments");
                }}
              />
              <p className="font-extrabold text-xs text-black">Citas</p>
            </div>
            <div className="flex flex-col items-center">
              <img
                src="/images/moon_black_icon.svg"
                width={30}
                alt="moon icon"
                onClick={() => {
                  navigate("/restdays");
                }}
              />
              <p className="font-extrabold text-xs">Descansos</p>
            </div>
            <div className="flex flex-col items-center">
              <img
                src="/images/people_black_icon.svg"
                width={30}
                alt="people icon"
                onClick={() => {
                  navigate("/clients");
                }}
              />
              <p className="font-extrabold text-xs">Clientes</p>
            </div>
            <div className="flex flex-col items-center">
              <img
                src="/images/scissors_black_icon.svg"
                width={30}
                alt="scissors icon"
                onClick={() => {
                  navigate("/services");
                }}
              />
              <p className="font-extrabold text-xs text-black">Servicios</p>
            </div>
            <div className="flex flex-col items-center">
              <img
                src="/images/history_purple_icon.svg"
                width={30}
                alt="history icon"
                onClick={() => {
                  navigate("/appointmentshistory");
                }}
              />
              <p className="font-extrabold text-g1 text-xs">Historial</p>
            </div>
          </div>
          <img
            className="fixed top-7 left-7 z-50"
            src="/images/logout.png"
            width={30}
            alt="logout"
            onClick={() => {
              console.log("logging out...");
              localStorage.removeItem("8w9j2fjsd");
              localStorage.removeItem("adminUsername");

              window.location.reload();
            }}
          />
          <h1 className="fixed top-7 z-50 text-white font-black text-2xl">
            {localStorage.getItem("adminUsername")}
          </h1>

          <h1 className="text-lg font-black text-black mb-2 text-center">
            Historial de Citas
          </h1>
          <div className="w-[80%] flex flex-col justify-center items-center mb-[8rem] bg-g10">
            {appointmentsHistory && appointmentsHistory.length > 0 && (
              <p className="text-black font-medium text-lg mt-5 text-center">
                Citas pasadas de los últimos 7 días...
              </p>
            )}
            {appointmentsHistory && appointmentsHistory.length > 0 ? (
              appointmentsHistory.map((appointment) => {
                return (
                  <>
                    <div className="relative w-[100%]  mt-6 flex flex-col p-5 rounded-md  shadow-md text-black bg-white">
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
                    </div>
                  </>
                );
              })
            ) : (
              <p className="text-black font-medium text-lg mt-5 text-center">
                Actualmente no hay citas pasadas de los últimos 7 días...
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsHistory;
