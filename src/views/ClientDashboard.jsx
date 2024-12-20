import React from "react";
import { useNavigate } from "react-router-dom";
import { getAppointments, cancelAppointment } from "../../firebaseFunctions";
import { useEffect, useState } from "react";
import PaymentComponent from "../components/PaymentComponent";

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
  const [bannerShown, setBannerShown] = useState(false);

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
    const bannerShown = localStorage.getItem("bannerShown");
    if (bannerShown) {
      setBannerShown(true);
    }
  }, []);

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

  const formatTime = (timeInISOString) => {
    const dateObj = new Date(timeInISOString);
    const time = dateObj.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return time;
  };

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
    <div
      className="relative w-full min-h-screen bg-softblue  "
      //style={{ backgroundImage: `url(${waves})` }}
    >
      <div className="flex flex-col justify-center items-center w-full">
        <h1 className="mx-auto mt-10 text-white text-2xl font-black">
          Panel de Citas
        </h1>
        {appointmentsOfClientLoaded && appointmentsOfClient.length > 0 ? (
          <p className="mb-4 mt-5 text-center text-white font-black">
            Sus próximas citas:
          </p>
        ) : (
          <p className="mb-4 mt-5 text-center text-white font-black">
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
                  <div className="relative w-[86%]  mt-6 mb-4 flex flex-col p-5 rounded-md shadow-md bg-white">
                    <div
                      className={
                        appointment.state === "pagado"
                          ? `absolute bg-green w-[100%] h-[10px] rounded-t-md top-0 left-0`
                          : `absolute bg-blue w-[100%] h-[10px] rounded-t-md top-0 left-0`
                      }
                    ></div>
                    {appointment.state !== "pagado" && (
                      <p className="mb-4 text-white bg-blue rounded-md p-3 text-xs my-2">
                        Favor de hacer su anticipo a tiempo antes de las{" "}
                        {formatTime(appointment.expiresAt)} horas para confirmar
                        su cita
                      </p>
                    )}
                    <div className="flex flex-row">
                      <p className="mb-1 text-xl font-black">
                        {formatDate(appointment.selectedDate)}-{" "}
                        {appointment.selectedTime} <br />{" "}
                        <span className=" text-sm font-normal text-gray-500">
                          ( duración de{" "}
                          {formatDuration(
                            appointment.totalDurationOfAppointment
                          )}
                          )
                        </span>
                      </p>
                      {/* <span className="text-white bg-blue py-0.5 px-1 ml-2 rounded-lg">
                Transfer
              </span> */}
                      <p className="ml-auto">
                        <span className="text-green font-black text-xl">
                          ${appointment.totalCost}
                        </span>
                      </p>
                    </div>
                    <p className="font-bold">Servicios Enlistados</p>
                    {appointment.servicesCart &&
                      appointment.servicesCart.map((service, serviceIndex) => (
                        <p key={serviceIndex} className="w-[62%]">
                          • {service.name.toUpperCase()}{" "}
                          <span className="text-green font-black">
                            (${service.price})
                          </span>
                        </p>
                      ))}
                    {appointment.extraServicesCart &&
                      appointment.extraServicesCart.map(
                        (extraService, extraServiceIndex) => (
                          <p key={extraServiceIndex} className="w-[62%]">
                            • {extraService.name.toUpperCase()}{" "}
                            <span className="text-green font-black">
                              (${extraService.price})
                            </span>
                          </p>
                        )
                      )}
                    {/* <button
                      className="py-1 rounded-md my-5 text-xs bg-blue text-white w-[90px] absolute bottom-0 right-[13%]"
                      onClick={() => {
                        //downPayment(appointment.id);
                        window.open("https://mpago.la/1qdjQMh");
                      }}
                    >
                      Dejar Anticipo
                    </button> */}
                    {appointment.state === "pagado" ? (
                      <p className="py-1 px-1 rounded-md my-5 text-xs bg-green text-white w-[102px] absolute bottom-0 right-5">
                        Cita Confirmada
                      </p>
                    ) : (
                      <PaymentComponent
                        business_id={localStorage.getItem("businessID")}
                        appointmentId={appointment.id}
                        classNames="py-1 px-1 rounded-md my-5 text-xs bg-blue text-white w-[83px] absolute bottom-0 right-5"
                      />
                    )}

                    <button
                      className=" py-1 rounded-md my-5 text-xs bg-red text-white w-[30px] absolute -top-7  -left-4"
                      onClick={() => {
                        const userConfirm = confirm(
                          //aqui depende de si tiene anticipo o no pues mandar distintos alerts
                          "¿Está usted seguro que desea eliminar esta cita? Una vez dejado el anticipo, no se puede recuperar"
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
            className="px-2 py-1 rounded-md mb-10 mt-5 bg-blue text-white w-[120px]"
            onClick={() => {
              navigate("/appointmentmaker");
            }}
          >
            Nueva Cita
          </button>
        </div>
      </div>
      {!bannerShown && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-[70%] bg-blue text-white text-center p-3 rounded-md">
            <p className="mb-5">
              Estimado cliente, le recordamos que el tiempo máximo para realizar
              el anticipo de su cita es de 12 horas a partir de su creación. En
              caso de no hacerlo, la cita será cancelada automáticamente. <br />
              <br />
              Esto con el fin de respetar el tiempo y espacio de todos. <br />
              Agradecemos mucho su comprensión y preferencia.
            </p>
            <button
              className="bg-white text-blue px-2 py-1 rounded-md ml-2"
              onClick={() => {
                setBannerShown(true);
                localStorage.setItem("bannerShown", true);
              }}
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;
