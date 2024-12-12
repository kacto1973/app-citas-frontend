import React from "react";
import { useNavigate } from "react-router-dom";
import { getAppointments, cancelAppointment } from "../../firebaseFunctions";
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
  // const [reload, setReload] = useState(false);

  //use effects

  // useEffect(() => {
  //   const syncFunc = async () => {
  //     const allAppointments = await getAppointments();

  //     if (allAppointments) {
  //       setAllAppointmentsArray(allAppointments);
  //       //setAllAppointmentsArrayLoaded(true);
  //     } else {
  //       console.log("de TODOS los appointments, no hubo nada que fetchear");
  //     }

  //     const clientAppointments = getAppointmentsForClient(allAppointments);
  //     if (clientAppointments) {
  //       setAppointmentsOfClient(clientAppointments);
  //       //setAppointmentsOfClientLoaded(true);
  //     } else {
  //       console.log("No hubo appointments que jalar para ese usuario");
  //     }
  //   };
  //   syncFunc();
  // }, [reload]);

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

  function formatDuration(durationInMinutes) {
    const hours = Math.floor(durationInMinutes / 60);
    const minutes = durationInMinutes % 60;

    return `${hours} hr ${minutes ? `${minutes}m` : ""}`;
  }

  function formatDate(date) {
    //si recibimos 2024-12-31
    const [year, month, dateNum] = date.split("-");
    /*Obtendriamos
    year = 2024
    month = 12
    dateNum = 31
    */
    return `${dateNum}/${month}/${year}`;
  }

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
        {appointmentsOfClientLoaded && appointmentsOfClient.length > 0 ? (
          <p className="mb-4 text-center">Sus próximas citas:</p>
        ) : (
          <p className="mb-4 text-center">
            Por ahora no tiene citas agendadas...
          </p>
        )}
        <div className="flex flex-col justify-center items-center w-full">
          {appointmentsOfClientLoaded &&
            [...appointmentsOfClient] // Copia inmutable del arreglo original
              .sort((a, b) => {
                const dateA = new Date(`${a.selectedDate}T${a.selectedTime}`);
                const dateB = new Date(`${b.selectedDate}T${b.selectedTime}`);
                return dateA - dateB; // Orden ascendente
              })
              .map((appointment, index) => (
                <>
                  <div className="relative w-[80%] border border-gray-900 mt-6 flex flex-col p-5 rounded-md shadow-xl bg-gray-100">
                    <div className="flex flex-row mb-2">
                      <p>
                        Cita #{index + 1} -{" "}
                        {formatDate(appointment.selectedDate)} a las{" "}
                        {appointment.selectedTime} <br /> (duración de{" "}
                        {formatDuration(appointment.totalDurationOfAppointment)}
                        )
                      </p>
                      {/* <span className="text-white bg-blue py-0.5 px-1 ml-2 rounded-lg">
                Transfer
              </span> */}
                      <p className="ml-auto">
                        <span className="text-green font-black">
                          ${appointment.totalCost}
                        </span>
                      </p>
                    </div>
                    {appointment.servicesCart &&
                      appointment.servicesCart.map((service, serviceIndex) => (
                        <p key={serviceIndex} className="w-[62%]">
                          • {service.name} (${service.price})
                        </p>
                      ))}
                    {appointment.extraServicesCart &&
                      appointment.extraServicesCart.map(
                        (extraService, extraServiceIndex) => (
                          <p key={extraServiceIndex} className="w-[62%]">
                            • {extraService.name} (${extraService.price})
                          </p>
                        )
                      )}
                    <button
                      className="py-1 rounded-md my-5 text-xs bg-blue text-white w-[90px] absolute bottom-0 right-[13%]"
                      onClick={() => {
                        downPayment(appointment.id);
                      }}
                    >
                      Dejar Anticipo
                    </button>
                    <button
                      className=" py-1 rounded-md my-5 text-xs bg-red text-white w-[30px] absolute bottom-0 right-[3%]"
                      onClick={() => {
                        const userConfirm = confirm(
                          //aqui depende de si tiene anticipo o no pues mandar distintos alerts
                          "¿Seguro que desea eliminar esta cita? Una vez dejado el anticipo, no se puede recuperar"
                        );
                        if (userConfirm) {
                          cancelAppointment(appointment.id);
                        }
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
