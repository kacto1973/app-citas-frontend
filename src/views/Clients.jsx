import React, { useEffect, useState, useContext } from "react";
import { getAllClients, getAppointments } from "../../firebaseFunctions";
import { useNavigate } from "react-router-dom";
import { TrialContext } from "../context/TrialContext";

const Clients = () => {
  //use states
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const { isTrialExpired } = useContext(TrialContext); // Accedemos al contexto

  useEffect(() => {
    if (isTrialExpired) {
      navigate("/trialexpired"); // Redirigir de forma imperativa
    }
  }, [isTrialExpired]); // El efecto solo se ejecutará cuando `isTrialExpired` cambie
  const [clientsArray, setClientsArray] = useState([]);
  const [clientsLoaded, setClientsLoaded] = useState(false);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [appointmentsArray, setAppointmentsArray] = useState([]);
  const [appointmentsLoaded, setAppointmentsLoaded] = useState(true);

  //use effects
  useEffect(() => {
    const asyncFunc = async () => {
      let clientsList = await getAllClients();
      if (clientsList) {
        setClientsArray(clientsList);
        setClientsLoaded(true);
        //console.log(clientsList);
      }

      let appointmentsList = await getAppointments();
      if (appointmentsList) {
        setAppointmentsArray(appointmentsList);
        setAppointmentsLoaded(true);
      }
      setLoading(false);
    };
    asyncFunc();
  }, []);

  useEffect(() => {
    console.log("CLIENTS ARR ", clientsArray);
  }, [clientsLoaded]);

  useEffect(() => {
    const filteredClients = clientsArray.filter((client) => {
      if (
        client.fullName.toLowerCase().includes(searchQuery.toLocaleLowerCase())
      ) {
        return client;
      }
    });

    setFilteredClients(filteredClients);
  }, [searchQuery, clientsLoaded]);

  const calculateClientActiveAppointments = (clientObj) => {
    const result = appointmentsArray.reduce(
      (appointmentsCount, appointment) => {
        if (clientObj.username === appointment.username) {
          return (appointmentsCount += 1);
        } else {
          return appointmentsCount;
        }
      },
      0
    );
    return result;
  };

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

  const calculateClosestAppointment = (clientObj) => {
    let appointmentsOfClient = appointmentsArray.filter((appointment) => {
      if (clientObj.username === appointment.username) {
        return appointment;
      }
    });

    appointmentsOfClient.sort((a, b) => {
      const dateA = new Date(`${a.selectedDate}T${a.selectedTime}`);
      const dateB = new Date(`${b.selectedDate}T${b.selectedTime}`);
      return dateA.getTime() - dateB.getTime();
    });

    return appointmentsOfClient[0];
  };

  return (
    <div className="pt-10 w-full min-h-screen bg-g10 ">
      {loading ? (
        <div className="absolute inset-0 bg-black  flex items-center justify-center z-20">
          <div className="bg-white p-5 rounded-md shadow-md text-center">
            <h1 className="font-black text-2xl">Cargando...</h1>
          </div>
        </div>
      ) : (
        <div className="absolute top-[7rem] w-full flex flex-col justify-center items-center bg-g10 ">
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
              <p className="font-extrabold text-xs text-black">Descansos</p>
            </div>
            <div className="flex flex-col items-center">
              <img
                src="/images/people_purple_icon.svg"
                width={30}
                alt="people icon"
                onClick={() => {
                  navigate("/clients");
                }}
              />
              <p className="font-extrabold text-g1 text-xs">Clientes</p>
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
              <p className="font-extrabold text-xs">Servicios</p>
            </div>
            <div className="flex flex-col items-center">
              <img
                src="/images/history_black_icon.svg"
                width={30}
                alt="history icon"
                onClick={() => {
                  navigate("/appointmentshistory");
                }}
              />
              <p className="font-extrabold text-xs">Historial</p>
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
          <img
            className="fixed top-7 right-7 z-50"
            src="/images/menu.png"
            width={32}
            alt="menu"
            onClick={() => {
              console.log("menu clicked");
            }}
          />

          <div className="w-full flex flex-col justify-center items-center  ">
            <h1 className="text-lg font-black w-[90%] mb-8 text-black text-center">
              Mis Clientes
            </h1>
            {/* Barra de búsqueda */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // Actualizamos el estado con lo que escribe el usuario
              placeholder="Buscar por nombre..."
              className=" text-center shadow-md p-2 rounded-md mb-4"
            />
          </div>
          <div className="flex flex-col items-center justify-center pb-10 mb-16 bg-g10">
            {clientsLoaded && filteredClients.length > 0
              ? filteredClients.map((client, index) => {
                  const closestAppointment =
                    calculateClosestAppointment(client);
                  let formattedDate = "";
                  if (closestAppointment) {
                    formattedDate = formatDate(closestAppointment.selectedDate);
                  } else {
                    formattedDate = "No hay citas cercanas";
                  }

                  return (
                    <div
                      key={index}
                      className="relative w-[80%]   mt-6 flex flex-col p-5 rounded-md bg-white shadow-sm text-black"
                    >
                      <div className="flex flex-row mb-2">
                        <p>
                          Cliente:{" "}
                          <span className="font-black">{client.fullName}</span>{" "}
                          <br />
                          Tel: <span className="font-black"></span>
                          {client.cellphone} <br />
                          Citas Activas:{" "}
                          <span className="font-black">
                            {calculateClientActiveAppointments(client)}
                          </span>{" "}
                          <br />
                          Cita más cercana:{" "}
                          <span className="font-black">
                            {formattedDate}
                          </span>{" "}
                          <br />
                        </p>
                        <p className="ml-auto">
                          <span className="text-green font-black"></span>
                        </p>
                      </div>
                    </div>
                  );
                })
              : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;
