import React from "react";
import { useNavigate } from "react-router-dom";
import { getAppointments, cancelAppointment } from "../../firebaseFunctions";
import { useEffect, useState } from "react";
import PaymentComponent from "../components/PaymentComponent";
import { DateTime } from "luxon";

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
    const cellphone = localStorage.getItem("cellphone");
    let rightAppointments = [];
    if (cellphone) {
      for (const appointment of allAppointmentsArray) {
        if (appointment.cellphone === cellphone) {
          rightAppointments.push(appointment);
        }
      }
    } else {
      console.log("no hay nombre de usuario guardado en este navegador");
    }
    return rightAppointments;
  };

  return (
    // este es el background principal de todo
    <div className="relative w-full min-h-screen bg-g10  ">
      {/* este es el gradiente de fondo de arriba */}
      <div className="fixed z-10 -top-[615px] left-[50%] -translate-x-1/2 rounded-b-[30px] bg-[linear-gradient(40deg,#4C2DFF_0%,#DE9FFE_100%)] h-[760px] w-[100vw] " />

      {/* aqui vamos a poner demas elementos absolutamente colocados   */}
      <img
        className="fixed top-5 left-5 z-50"
        src="/images/logout.png"
        width={25}
        alt="logout"
        onClick={() => {
          console.log("logging out...");
          localStorage.removeItem("cellphone");
          localStorage.removeItem("p9d4l8rwe");
          localStorage.removeItem("bannerShown");
          localStorage.removeItem("username");
          localStorage.removeItem("userFullName");

          window.location.reload();
        }}
      />
      <h1 className="fixed top-11  w-full text-center text-white text-3xl font-black z-10 ">
        EASY AGENDA
      </h1>
      <p className="text-base font-black fixed top-[5.5rem] text-center w-full text-white z-50">
        {new Date().toLocaleDateString("es-MX", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
      {appointmentsOfClientLoaded && appointmentsOfClient.length > 0 ? (
        <>
          <p className="absolute top-[23%] w-full z-0 text-center text-lg text-black font-black">
            Bienvenid@ {localStorage.getItem("userFullName").split(" ")[0]}{" "}
            <br />
            <span className="text-gray-400 text-sm">
              {" "}
              Usamos el formato DD/MM/AAAA
            </span>
          </p>
        </>
      ) : (
        <>
          <p className="absolute top-[23%] w-full z-0 text-center text-lg text-black font-black">
            Bienvenid@ {localStorage.getItem("userFullName").split(" ")[0]}{" "}
          </p>
          <p className="absolute top-[32%] w-[80%] left-1/2 -translate-x-1/2 text-center text-gray-500 text-base font-black">
            Por ahora no tiene citas agendadas, cuando quieras haz una con el
            botón de abajo
          </p>
          <img
            src="/images/side-calendar3d.png"
            className="absolute top-[42%] left-[50%] -translate-x-1/2"
            width={150}
          ></img>
          {/* <img
              src="/images/plus.png"
              className="absolute bottom-[25%] z-50"
              width={65}
              onClick={() => {
                navigate("/appointmentmaker");
              }}
            ></img> */}
        </>
      )}
      {/*  */}

      {/* <div className="relative flex flex-col justify-center items-center w-full mt-[60%]"> */}
      {/* este es el contenedor de todas las citas */}
      <div className="absolute top-[30%] flex flex-col bg-g10 justify-center items-center w-full -z-0">
        {appointmentsOfClientLoaded &&
          [...appointmentsOfClient] // Copia inmutable del arreglo original
            .sort((a, b) => {
              const dateA = new Date(`${a.selectedDate}T${a.selectedTime}`);
              const dateB = new Date(`${b.selectedDate}T${b.selectedTime}`);
              return dateA - dateB; // Orden ascendente
            })
            .map((appointment, index) => {
              const localeDateTime = DateTime.fromISO(appointment.createdAt)
                .setZone("America/Hermosillo")
                .toFormat("yyyy-MM-dd");

              const selectedDateTime = appointment.selectedDate;

              const forToday = localeDateTime === selectedDateTime;

              const localeNextDateTime = DateTime.fromISO(appointment.createdAt)
                .setZone("America/Hermosillo")
                .plus({ days: 1 })
                .toFormat("yyyy-MM-dd");

              const nextDay = localeNextDateTime === selectedDateTime;

              return (
                <>
                  <div className="relative w-[86%] mt-6 mb-4 flex flex-col p-5 rounded-md shadow-md bg-white">
                    <div
                      className={
                        appointment.state === "pagado" || forToday || nextDay
                          ? `absolute bg-green w-[100%] h-[10px] rounded-t-md top-0 left-0`
                          : `absolute bg-blue  w-[100%] h-[10px] rounded-t-md top-0 left-0`
                      }
                    ></div>
                    {appointment.state === "pagado" ||
                    forToday ||
                    nextDay ? null : (
                      <p className="mb-4 text-white bg-blue   rounded-md p-3 text-xs my-2">
                        Favor de hacer su anticipo a tiempo antes de las{" "}
                        {formatTime(appointment.expiresAt)} horas para confirmar
                        su cita (el anticipo se definirá según sus servicios al
                        dar click en "Dar Anticipo")
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

                    {appointment.state === "pagado" || forToday || nextDay ? (
                      <p className="py-1 px-1 rounded-md my-5 text-xs bg-green text-white w-[96px] absolute bottom-0 right-5">
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
              );
            })}
        {appointmentsOfClientLoaded && appointmentsOfClient.length === 0 ? (
          <img
            src="/images/plus.png"
            className="absolute -bottom-[25rem] left-[50%] -translate-x-1/2"
            width={65}
            onClick={() => {
              navigate("/appointmentmaker");
            }}
          ></img>
        ) : (
          <img
            src="/images/plus.png"
            className="mx-auto relative my-10 z-50 "
            width={65}
            onClick={() => {
              navigate("/appointmentmaker");
            }}
          ></img>
        )}
      </div>
      {/* </div> */}

      {!bannerShown && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-[70%] bg-blue text-white text-center p-5 rounded-md">
            <p className="mb-5">
              Estimado cliente, le recordamos que dispone de un máximo de 12
              horas desde la programación de su cita para realizar el anticipo
              (excepto citas intradía o del día siguiente). De no hacerlo, la
              cita será cancelada automáticamente. Asimismo al realizar un pago,
              asegúrese de que el monto sea exacto, ya que cualquier
              discrepancia provocaría el rechazo del mismo. <br /> <br /> Esto
              nos permite respetar el tiempo y los espacios de todos nuestros
              clientes. Agradecemos su comprensión y preferencia.
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
