//Components
import React from "react";
import Calendar from "react-calendar";
import database from "../../firebaseConfig";
import Alert from "@mui/material/Alert";
//Objects from libraries
import { useState, useEffect } from "react";
import { set, get, ref } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { DateTime } from "luxon";
//services
import {
  getServices,
  getAppointments,
  getPaidAppointments,
  addAppointment,
  getAllRestDays,
} from "../services/api";
//functions (there are not, not for now)

//////////////////////////////////////////////END OF IMPORTS

const AppointmentMaker = () => {
  // User information
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [userFullName, setUserFullName] = useState(
    localStorage.getItem("userFullName")
  );

  // Navigation
  const navigate = useNavigate();

  // Wizard/Step control
  const [currentStep, setCurrentStep] = useState(1); // 1, 2, 3...

  // Services states
  const [showServices, setShowServices] = useState(false); // Controla modal de servicios
  const [servicesArray, setServicesArray] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [servicesCart, setServicesCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Cost and duration states
  const [totalCost, setTotalCost] = useState(0);
  const [totalDurationOfAppointment, setTotalDurationOfAppointment] =
    useState(0);
  const [durationInHours, setDurationInHours] = useState(0);
  const [durationInMinutes, setDurationInMinutes] = useState(0);

  // Date and time selection
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [dateDisplayText, setDateDisplayText] = useState(""); // Formato amigable para UI
  const [timesCombobox, setTimesCombobox] = useState([]); // Slots disponibles para el <select>

  // Appointments states
  const [appointmentsArray, setAppointmentsArray] = useState([]); // Todas las citas
  const [appointmentsMap, setAppointmentsMap] = useState({}); // Optimización: mapeo por fecha
  const [appointmentsOnSelectedDate, setAppointmentsOnSelectedDate] = useState(
    []
  ); // Citas para fecha seleccionada
  const [appointmentsLoaded, setAppointmentsLoaded] = useState(false); // Flag de carga

  // Disabled days states
  const [disabledDays, setDisabledDays] = useState([]); // Días bloqueados (feriados, descanso)
  const [disabledDaysLoaded, setDisabledDaysLoaded] = useState(false); // Flag de carga

  // UI states
  const [scrollVisible, setScrollVisible] = useState(false); // Control de scroll indicator
  const [error, setError] = useState("");
  //useEffects

  useEffect(() => {
    /*
    fetch disabled days from database and set them in disabledDays state
    */
    const asyncFunc = async () => {
      let disabledDaysList = await getAllRestDays();
      if (disabledDaysList) {
        setDisabledDays(disabledDaysList);
        setDisabledDaysLoaded(true);
      }
    };
    asyncFunc();
  }, []);

  useEffect(() => {
    /*
    1 - genera todos los time slots de 9 a 5pm en intervalos de 15 minutos 
    */
    const generateTimesArray = () => {
      const timesArray = [];
      const start = 9;
      const end = 17;

      for (let i = start; i < end; i++) {
        for (let j = 0; j < 60; j += 15) {
          const formattedHour = `${i < 10 ? `0${i}` : i}`;
          const formattedMinutes = `${j < 10 ? `0${j}` : j}`;
          timesArray.push(`${formattedHour}:${formattedMinutes}`);
        }
      }
      return timesArray;
    };

    /*
     Metodo para Determinar si una hora está ocupada en base a las citas existentes
    */
    const isTimeOccupied = (time) => {
      for (const appointment of appointmentsOnSelectedDate) {
        const appointmentStart = appointment.selectedTime;
        const appointmentEnd = addMinutesToTime(
          appointmentStart,
          appointment.totalDurationOfAppointment
        );

        if (time >= appointmentStart && time < appointmentEnd) {
          return true;
        }
      }
      return false;
    };

    /*
      Método para determinar si una hora ya ha pasado en el día seleccionado
    */
    const isTimeInThePast = (time) => {
      if (isToday(selectedDate)) {
        const [hr, min] = time.split(":").map(Number);
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinutes = now.getMinutes();
        if (hr < currentHour || (hr === currentHour && min <= currentMinutes)) {
          return true;
        }
      }
      return false;
    };

    //obtenemos los time slots en intervalos de 15 minutos
    const timesArray = generateTimesArray();
    //filtramos de acuerdo a horas ocupadas o transcurridas
    const availableTimesArray = timesArray
      .filter((time) => !isTimeInThePast(time)) // Filtra las horas transcurridas
      .map((time) => {
        if (isTimeOccupied(time)) {
          return "Ocupado";
        }
        return time;
      });

    setTimesCombobox(availableTimesArray);
  }, [appointmentsOnSelectedDate, selectedDate]);

  useEffect(() => {
    //use effect para fetchear appointments
    const fetchAppointments = async () => {
      const appointments = await getAppointments();
      //const appointments = await getPaidAppointments();
      console.log("appointments cargados  ", appointments);
      if (appointments) {
        //console.log(appointments);
        setAppointmentsArray(appointments);
        setAppointmentsLoaded(true);
      }
    };
    fetchAppointments();
  }, []);

  useEffect(() => {
    /*
    Use effect que convierte el array de citas en un objeto donde cada key es una fecha
    Ejemplo:
    {"2024-12-31": [cita1, cita2],
    "2025-01-01": [cita3]
    }
    */

    console.log("appointments cargadas: ", appointmentsArray);

    var appointmentsPerDayObject = {};

    if (appointmentsArray.length > 0) {
      appointmentsPerDayObject = appointmentsArray.reduce(
        (finalObject, appointment) => {
          const formattedDate = new Date(appointment.selectedDate)
            .toISOString()
            .split("T")[0];
          if (!finalObject[formattedDate]) {
            finalObject[formattedDate] = [];
          }

          finalObject[formattedDate].push(appointment);

          return finalObject;
        },
        {} //no borrar, es importante para valor inicial
      );
    }
    console.log("appointmentsPerDayObject: ", appointmentsPerDayObject);
    setAppointmentsMap(appointmentsPerDayObject);
  }, [appointmentsLoaded]);

  useEffect(() => {
    //use effect para fetchear services
    const fetchServices = async () => {
      const services = await getServices();
      if (services) {
        const arrayOfServices = Object.entries(services).map(
          ([key, value]) => ({
            name: key,
            ...value,
          })
        );

        setServicesArray(arrayOfServices);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    {
      /*
      Use effect para prevenir que el usuario salga de la pagina sin completar la cita
      que no se salga por accidente, y así no pierda progreso
      */
    }

    const handleBeforeUnload = (event) => {
      // Mensaje de advertencia
      event.preventDefault();
      event.returnValue = ""; // Es necesario para mostrar el mensaje en algunos navegadores
    };

    // Agregar el evento antes de salir
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      // Limpiar el evento al desmontar el componente
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  {
    /* 
    calcular total cost y total duration cada que servicesCart cambie
    */
  }
  useEffect(() => {
    calculateTotalCost();
    calculateTotalDurationOfAppointment();
    console.log("servicesCart: ", servicesCart);
  }, [servicesCart]);

  useEffect(() => {
    // Manejar el evento de scroll para mostrar/ocultar el botón
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  //funciones
  const isDepositNeeded = () => {
    {
      /*
      Si la cita se puso para hoy o mañana no necesita depósito,
      solo si es para algún día después de mañana necesita depósito
    */
    }

    const today = DateTime.now().toISODate();
    const tomorrow = DateTime.now().plus({ days: 1 }).toISODate();
    const selectedDateISO = DateTime.fromJSDate(selectedDate).toISODate();

    if (selectedDateISO === today || selectedDateISO === tomorrow) {
      return false;
    }

    return true;
  };

  // Manejar el evento de scroll
  const handleScroll = () => {
    if (window.scrollY > 300) {
      setScrollVisible(true); // Mostrar el botón si se pasa cierta distancia
    } else {
      setScrollVisible(false); // Ocultar el botón si se vuelve hacia arriba
    }
  };

  //eliminar servicio del carrito
  const deleteServiceFromCart = (service) => {
    const newCart = servicesCart.filter(
      (serviceInCart) => serviceInCart.name !== service.name
    );
    setServicesCart(newCart);
  };

  //agregar servicio al carrito
  const addServiceToCart = (service) => {
    console.log("service: ", service);
    const newCart = [...servicesCart, service];
    setServicesCart(newCart);
  };

  //formatear hora de ISOString a hh:mm AM/PM
  const formatTime = (timeInISOString) => {
    const dateObj = new Date(timeInISOString);
    const time = dateObj.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return time;
  };

  //formatear fecha de ISOString a YYYY-MM-DD
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Agregar ceros al mes si es necesario
    const day = date.getDate().toString().padStart(2, "0"); // Agregar ceros al día si es necesario

    return `${year}-${month}-${day}`;
  };

  //funcion para colorear los dias inhabilitados de gris
  const isRestDay = (date) => {
    if (disabledDaysLoaded && disabledDays && disabledDays.length > 0) {
      const formattedCurrentDate = formatDate(date);
      const isRestDay = disabledDays.some((restday) => {
        if (restday === formattedCurrentDate) {
          return true;
        }
        return false;
      });
      if (isRestDay) {
        //return "!bg-fuchsia-600 !text-black border border-gray-500";
        return true;
      }
      return false;
    }
  };

  //calcula que tan ocupado esta el dia para colorearlo de amarillo, verde, rojo, asi...
  const calculateBusyTimeOfDay = (arrayOfAppointmentsOfDay) => {
    let result = 0;
    for (let index = 0; index < arrayOfAppointmentsOfDay.length; index++) {
      result += arrayOfAppointmentsOfDay[index].totalDurationOfAppointment;
    }

    return result;
  };

  //Valida que el timeslot seleccionado se adapta al horario del negocio
  const validateTime = (clickedTime) => {
    let indexOfClickedTime = 0;
    timesCombobox.some((timeblock, index) => {
      if (timeblock === clickedTime) {
        indexOfClickedTime = index;
        return true;
      }
      return false;
    });

    for (let i = 0; i <= totalDurationOfAppointment; i += 15) {
      if (indexOfClickedTime >= timesCombobox.length) {
        if (totalDurationOfAppointment <= 60) {
          return true;
        }
      }
      if (timesCombobox[indexOfClickedTime] === "Ocupado") {
        return false;
      }
      indexOfClickedTime += 1;
    }

    return true;
  };

  const isDisabled = (value) => {
    if (value === "Ocupado") {
      return true;
    }
    return false;
  };

  const addMinutesToTime = (time, minutes) => {
    const [hr, mins] = time.split(":").map(Number);

    const date = new Date(1970, 0, 1, hr, mins, 0, 0);
    date.setMinutes(date.getMinutes() + minutes);

    const hrResult = date.getHours();
    const minsResult = date.getMinutes();
    const formattedResult = `${
      hrResult < 10 ? `0${hrResult}` : `${hrResult}`
    }:${minsResult < 10 ? `0${minsResult}` : `${minsResult}`}`;

    return formattedResult;
  };

  const isToday = (dateValue) => {
    const today = new Date();

    if (
      dateValue &&
      dateValue.getDate() === today.getDate() &&
      dateValue.getMonth() === today.getMonth() &&
      dateValue.getFullYear() === today.getFullYear()
    ) {
      return true;
    } else {
      return false;
    }
  };

  const handleTileDisabled = ({ date, view }) => {
    if (
      date.getDay() === 0 ||
      // date < new Date(new Date().setDate(new Date().getDate() + 1)) ||
      date < new Date(new Date().setDate(new Date().getDate() - 1)) ||
      isRestDay(date)
    ) {
      return true;
    }
    false;
  };

  const getTileClassName = ({ date, view }) => {
    if (
      //inhabilitamos si es domingo o si ya transcurrio ese dia
      date.getDay() === 0 ||
      // date < new Date(new Date().setDate(new Date().getDate() + 1)) ||
      date < new Date(new Date().setDate(new Date().getDate() - 1)) ||
      isRestDay(date)
    ) {
      return "bg-gray-200 text-gray-500 border border-gray-300";
    }

    //si es el dia que seleccionamos lo pintamos de azul
    if (
      selectedDate &&
      selectedDate.toISOString().split("T")[0] ===
        date.toISOString().split("T")[0]
    ) {
      return "!bg-blue !text-white";
    }

    //nomas sirvio para pasarlo como clave al mapa de citas
    const formattedDate = date.toISOString().split("T")[0];

    if (appointmentsMap[formattedDate]) {
      const busyMinutes = calculateBusyTimeOfDay(
        appointmentsMap[formattedDate]
      );

      if (busyMinutes <= 160) {
        //lowkey free
        return "!bg-lime-400		 !text-black border border-gray-500";
      } else if (busyMinutes > 160 && busyMinutes <= 320) {
        //available
        return "!bg-amber-300	 !text-black border border-gray-500";
      } else if (busyMinutes > 320) {
        //busy
        return "!bg-rose-400 !text-black border border-gray-500";
      }
    } else {
      //theres absolute 0 appointments
      return "!text-black border border-gray-500";
    }
  };

  const handleDateClick = (newDateObject) => {
    setSelectedDate(newDateObject);
    const formattedDate = new Intl.DateTimeFormat("es-MX", {
      weekday: "long", // Día de la semana (lunes, martes, etc.)
      // year: "numeric", // Año (2024)
      month: "long", // Mes (diciembre)
      day: "numeric", // Día del mes (10)
    }).format(newDateObject);
    setDateDisplayText(formattedDate);

    if (appointmentsMap[newDateObject.toISOString().split("T")[0]]) {
      const appointmentsOfTheSelectedDate =
        appointmentsMap[newDateObject.toISOString().split("T")[0]];

      //aqui lo seteamos a un nuevo arreglo que contiene las citas de ese X dia selected
      setAppointmentsOnSelectedDate(appointmentsOfTheSelectedDate);
    } else {
      setAppointmentsOnSelectedDate([]);
    }
  };

  const addAllServicesToCart = () => {
    if (!selectedService) {
      alert("Por favor selecciona algún servicio primero");
      return;
    }

    if (selectedService) {
      const serviceFormatted = {
        name: selectedService.name,
        price: 0,
        duration: 0,
        restTime: selectedService.restTime,
      };

      setServicesCart([...servicesCart, serviceFormatted]);
      alert("Servicio agregado exitosamente: " + selectedService.name);
      setSelectedService(null);
    }
  };

  const calculateTotalCost = () => {
    let total = 0;

    servicesCart.forEach((service) => {
      total += service.price;
    });

    setTotalCost(total);
  };

  const calculateTotalDurationOfAppointment = () => {
    let total = 0;

    servicesCart.forEach((service) => {
      total += service.duration + service.restTime;
    });

    let horas = Math.floor(total / 60);
    let minutos = total % 60;
    setDurationInHours(horas);
    setDurationInMinutes(minutos);
    setTotalDurationOfAppointment(total);
  };

  return (
    // fondo papa de todo
    <div className="relative w-full min-h-screen flex flex-col items-center bg-g10">
      <img
        src="/images/scrollup.png"
        width={40}
        alt="arrow"
        onClick={() => {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }}
        className={`${
          scrollVisible
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-10 scale-90 pointer-events-none"
        } fixed bottom-[24vh] left-3 z-50 transform transition-all duration-500
               `}
      />

      {/* Carta animada */}
      <div
        className={` fixed bottom-0 z-50  w-[100vw] h-[18vh] bg-white shadow-black shadow-2xl border-b border-black rounded-t-[30px] transform transition-all duration-300 ${
          servicesCart.length === 0 || currentStep === 3
            ? "opacity-0 translate-y-10 scale-90 pointer-events-none" // desaparece
            : "opacity-100 translate-y-0 scale-100" // aparece
        }`}
      >
        <h3 className="text-base font-bold ml-8 mt-4">{`${
          selectedDate && selectedTime
            ? `${dateDisplayText} - ${selectedTime}`
            : ""
        }`}</h3>
        <h3 className="text-sm font-black ml-8 ">
          {`${servicesCart.length > 3 ? `${servicesCart.length}` : ""}`}{" "}
          Servicios Seleccionados
        </h3>
        <p className="absolute right-8 top-2 text-green font-black text-xl">
          ${totalCost}
        </p>
        {/* <button
          onClick={() => {}}
          className=" py-1 px-2 rounded-md bg-g1 absolute right-8 bottom-5 text-white"
        >
          Siguiente
        </button> */}
        {servicesCart && servicesCart.length > 3 ? (
          <>
            <button
              onClick={() => setShowServices(!showServices)}
              className="ml-8 mt-4 bg-g1 text-white py-1 px-2 rounded-md "
            >
              Ver Servicios
            </button>
          </>
        ) : (
          <ul className="ml-8 mt-1">
            {servicesCart.map((item, index) => (
              <li key={index} className="text-gray-700">
                • {item.name} -{" "}
                <span className="font-black text-green">${item.price}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* este es el gradiente de fondo de arriba */}
      <div className="fixed z-10 -top-[600px] left-[50%] -translate-x-1/2 rounded-b-[30px] bg-[linear-gradient(40deg,#4C2DFF_0%,#DE9FFE_100%)] h-[765px] w-[100vw] " />
      {/* demas elementos absolutos colocados aca */}
      <img
        className="fixed top-7 left-8 z-50"
        src={`${
          currentStep === 1 ? "/images/logout.png" : "/images/return.png"
        }`}
        width={25}
        alt="back"
        onClick={() => {
          setCurrentStep((prev) => {
            const step = prev - 1;
            if (step === 0) {
              navigate("/clientdashboard");
            }
            return step;
          });
        }}
      />
      <img
        className={`${
          currentStep === 3 ? "hidden" : ""
        } fixed top-7 right-8 z-50 scale-x-[-1]`}
        src="/images/return.png"
        width={25}
        alt="next"
        onClick={() => {
          setCurrentStep((prev) => {
            if (prev === 1 && servicesCart.length === 0) {
              setError("Por favor selecciona al menos un servicio");
              return prev;
            } else if (prev === 2 && (!selectedDate || !selectedTime)) {
              setError("Por favor selecciona una fecha y hora");
              return prev;
            }
            const step = prev + 1;

            // if (step === 4) {
            //   navigate("/clientdashboard");
            // }
            return step;
          });
        }}
      />
      <h1 className="fixed top-6  w-full text-center text-white text-2xl font-black z-10 ">
        Agendando Cita
      </h1>

      {/* wizard / stepper */}

      {/* aqui estan las barras */}
      <div className="w-[70%] fixed top-[11%] z-50">
        {/* div blanco de fondo */}
        <div className="absolute w-[100%] bg-white h-[3px] z-10" />
        {/* div negro izquierda */}
        <div
          className={`${
            currentStep === 1 ? "hidden" : ""
          } left-0  absolute w-[50%] bg-black h-[3px] z-10`}
        />
        {/* div negro derecha */}
        <div
          className={` ${
            currentStep === 3 ? "" : "hidden"
          } absolute right-0  w-[50%] bg-black h-[3px] z-10`}
        />

        {/* aqui estan los pasos */}

        {/* 1s*/}
        <div className="w-[30px] h-[30px] bg-black absolute -left-1 -top-4 z-20 rounded-full text-white flex items-center justify-center font-black text-2xl">
          1
        </div>

        {/* 2s */}
        <div className="w-[30px] h-[30px] bg-white absolute left-1/2 -translate-x-1/2 -top-4 z-20 rounded-full text-black flex items-center justify-center font-black text-2xl">
          2
        </div>
        <div
          className={` ${
            currentStep === 2 || currentStep === 3 ? "" : "hidden"
          } w-[30px] h-[30px] bg-black absolute left-1/2 -translate-x-1/2 -top-4 z-20 rounded-full text-white flex items-center justify-center font-black text-2xl`}
        >
          2
        </div>

        {/* 3s */}
        <div className="w-[30px] h-[30px] bg-white absolute -right-1 -top-4 z-20 rounded-full text-black flex items-center justify-center font-black text-2xl">
          3
        </div>
        <div
          className={` ${
            currentStep === 3 ? "" : "hidden"
          } w-[30px] h-[30px] bg-black absolute -right-1 -top-4 z-20 rounded-full text-white flex items-center justify-center font-black text-2xl`}
        >
          3
        </div>

        {/* textos estaticos */}
        <p className="absolute text-xs text-white z-20 w-[100px] top-4 -left-10 text-center">
          Selecciona Servicios
        </p>
        <p className="absolute text-xs text-white z-20 w-[100px] top-4 left-1/2 -translate-x-1/2 text-center">
          Elige <br /> Fecha y Hora
        </p>
        <p className="absolute text-xs text-white z-20 w-[100px] top-4 -right-10 text-center">
          Confirmación de Cita
        </p>
      </div>
      {/* wizard / stepper */}

      {/* carta de servicios que se activa con el boton Ver Servicios */}
      <div
        className={`${
          showServices ? "" : "hidden"
        } w-[100vw] h-[100vh] bg-black bg-opacity-50 fixed top-0 left-0 z-50 flex justify-center items-center`}
      >
        <div
          className={`overflow-y-auto fixed w-[80%] h-[50vh] top-[50%] -translate-y-1/2 left-1/2 -translate-x-1/2  bg-white shadow-black shadow-lg rounded-[20px] transform transition-all duration-500 z-50`}
        >
          <h1 className="font-black text-black text-2xl text-center mt-4">
            {`${servicesCart.length > 3 ? `${servicesCart.length}` : ""}`}{" "}
            Servicios Seleccionados
          </h1>

          {servicesCart && servicesCart.length > 0 && (
            <ul className="my-4 ml-7 text-xl">
              {servicesCart.map((service, index) => (
                <li key={index} className="text-black my-2 w-[80%]">
                  • {service.name} -{" "}
                  <span className="font-black text-green">
                    ${service.price}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          onClick={() => {
            setShowServices(!setShowServices);
          }}
          className="fixed right-[8vw] top-[19vh] z-50 bg-red text-xl text-white py-1 px-4 rounded-md"
        >
          X
        </button>
      </div>

      <div className="absolute bg-g10 w-full flex flex-col items-center top-[22%]">
        {/* div padre de la parte 1 */}
        <div
          className={`${
            currentStep === 1 ? "" : "hidden"
          } w-full flex flex-col items-center`}
        >
          <h1 className=" text-black text-2xl font-black ">
            Nuestros Servicios
          </h1>
          {/* Barra de búsqueda */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Actualizamos el estado con lo que escribe el usuario
            placeholder="Buscar por nombre..."
            className="border text-center border-gray-700 p-2 rounded-md mt-4"
          />

          <div className=" flex flex-col justify-center items-center w-full mt-8 pb-[20vh] bg-g10">
            {servicesArray &&
              servicesArray.length > 0 &&
              servicesArray
                .filter((service) =>
                  service.name
                    .toLowerCase()
                    .includes(searchQuery.toLocaleLowerCase())
                )
                .map((service, serviceIndex) => (
                  <>
                    <div
                      id={serviceIndex}
                      className="relative w-[80%] h-[11vh] text-black bg-white mb-5 rounded-[15px]"
                    >
                      <p className="text-lg font-black absolute left-4 top-2 w-[50%]">
                        {service.name}
                      </p>
                      <p className="text-green font-black text-xl absolute right-4 top-2">
                        ${service.price}
                      </p>
                      {servicesCart.some(
                        (serviceInCart) => serviceInCart.name === service.name
                      ) ? (
                        <button
                          onClick={() => deleteServiceFromCart(service)}
                          className="text-white bg-red py-1 px-2 rounded-md absolute right-4 bottom-4"
                        >
                          Eliminar
                        </button>
                      ) : (
                        <button
                          onClick={() => addServiceToCart(service)}
                          className="text-white bg-green py-1 px-2 rounded-md absolute right-4 bottom-4"
                        >
                          Añadir
                        </button>
                      )}
                    </div>
                  </>
                ))}
          </div>
        </div>

        {/* div de la parte 2 */}
        <div
          className={`${
            currentStep === 2 ? "" : "hidden"
          } w-full flex flex-col items-center pb-[10rem] bg-g10`}
        >
          {servicesCart && servicesCart.length > 0 ? (
            <>
              <h1 className=" text-black text-2xl font-black mb-8 ">
                Seleccione el día
              </h1>

              <div className="relative rounded-md bg-white p-2  mb-8 shadow-md w-[80vw]  h-[23rem]">
                <Calendar
                  className="bg-white rounded-md  text-center"
                  view="month"
                  value={selectedDate}
                  tileDisabled={handleTileDisabled}
                  onClickDay={(value) => {
                    handleDateClick(value);
                  }}
                  tileClassName={getTileClassName}
                  nextLabel=">"
                  prevLabel="<"
                  next2Label={null} // Elimina el botón para moverse entre años
                  prev2Label={null} // Elimina el botón para moverse entre años
                  navigationLabel={({ date }) => {
                    return (
                      <p
                        onClick={(e) => e.stopPropagation()} // Detiene cualquier interacción
                        className="text-center text-lg font-bold uppercase cursor-default "
                      >
                        {date.toLocaleDateString("es-MX", {
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    );
                  }}
                />
                <div className="absolute bottom-[25%] left-4 rounded-full bg-lime-400 w-[24px] h-[24px]   border border-black" />
                <p className="absolute bottom-[25%] left-11   ">Casi Libre</p>
                <div className="absolute bottom-[15%] left-4 rounded-full bg-amber-300 w-[24px] h-[24px]   border border-black" />
                <p className="absolute bottom-[15%] left-11  ">Ocupado</p>
                <div className="absolute bottom-[5%] left-4 rounded-full bg-rose-400 w-[24px] h-[24px]  border border-black" />
                <p className="absolute bottom-[5%] left-11  ">Muy Ocupado</p>
                <div className="absolute bottom-[25%] left-[50%] rounded-full bg-white w-[24px] h-[24px]  border border-black" />
                <p className="absolute bottom-[25%] left-[59%]  ">Todo Libre</p>
                <div className="absolute bottom-[15%] left-[50%] rounded-full bg-gray-200 w-[24px] h-[24px]   border border-black" />
                <p className="absolute bottom-[15%] left-[59%]  ">
                  No Disponible
                </p>
                <div className="absolute bottom-[5%] left-[50%] rounded-full bg-blue  w-[24px] h-[24px]  border border-black" />
                <p className="absolute bottom-[5%] left-[59%]  ">
                  Día Escogido
                </p>
              </div>

              <h1 className=" text-black text-2xl font-black my-5 ">
                Elija la Hora
              </h1>

              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                name="selectedTime"
                id=""
                className="w-[80vw] font-black shadow-md  text-black bg-white rounded-md h-[3rem]  text-center my-2 mb-10"
              >
                <option value="">Seleccione una opción</option>
                {timesCombobox &&
                  timesCombobox.map((time, timeIndex) => {
                    const disabled = isDisabled(time);
                    return (
                      <option id={timeIndex} value={time} disabled={disabled}>
                        {time}
                      </option>
                    );
                  })}
              </select>
            </>
          ) : null}
        </div>

        <div
          className={` ${
            currentStep === 3 ? "" : "hidden"
          } w-full flex flex-col items-center`}
        >
          {servicesCart &&
          servicesCart.length > 0 &&
          selectedDate !== null &&
          selectedTime !== null &&
          selectedTime !== "" ? (
            <>
              <h1 className=" text-black text-2xl font-black mb-8 text-center ">
                Un último detalle
              </h1>
              <div
                className={` w-[80%]   flex flex-col p-5 rounded-md  bg-white `}
              >
                <div className="flex flex-row mb-2">
                  <p className="font-black text-black text-lg w-[75%]">
                    {dateDisplayText} a las {selectedTime} (duración de{" "}
                    {durationInHours ? durationInHours : 0} hr
                    {durationInMinutes ? ` ${durationInMinutes}m` : null})
                  </p>
                  {/* <span className="text-white bg-blue py-0.5 px-1 ml-2 rounded-lg">
                  Transfer
                </span> */}
                  <p className="ml-auto">
                    <span className="text-green font-black text-xl">
                      ${totalCost}
                    </span>
                  </p>
                </div>
                {/* <p>1 x Corte de cabello - ($50) = $50</p>
          <p>1 x Tinte de cabello - ($60) = $60</p>
          <p>1 x Peinado - ($40) = $40</p> */}
                {servicesCart.map((service, serviceIndex) => (
                  <p
                    key={serviceIndex}
                    className="text-black font-regular text-base"
                  >
                    • {service.name}{" "}
                    <span className="font-black text-green">
                      (${service.price})
                    </span>
                  </p>
                ))}
              </div>
              <p className="my-8 text-center text-sm w-[80%]">{`${
                isDepositNeeded()
                  ? "Le pedimos confirmar su cita con un anticipo, esto debe hacerlo desde el menú principal. Puede hacerlo cuando sea dentro de  las próximas 12 horas o su cita tendrá que ser anulada, agradecemos su comprensión "
                  : "No es necesario que haga su depósito para citas intradía o del día siguiente. ¡Todo ya quedó listo!"
              }`}</p>
              <button
                type="submit"
                className={`px-3 py-2 font-black rounded-md my-5 mb-10 ${
                  isDepositNeeded() ? "bg-blue" : "bg-green"
                } text-white w-[200px]`}
                //Deberia aqui en vez de pasar selected date/time,
                // combinarlos en un date object y pasar eso
                //ademas me falta agregar cosas del anticipo, como true o cuanto es
                onClick={async () => {
                  if (!validateTime(selectedTime)) {
                    setError(
                      "La duración de la cita excede la disponibilidad del horario, por favor seleccione otra hora o día con más flexibilidad"
                    );
                    return;
                  }

                  const success = await addAppointment(
                    servicesCart,
                    totalCost,
                    selectedDate,
                    selectedTime,
                    username,
                    userFullName,
                    totalDurationOfAppointment
                  );
                  if (success) {
                    const expiresAt = new Date(
                      new Date().setHours(new Date().getHours() + 12)
                    ).toISOString();

                    const formattedExpiration = formatTime(expiresAt);

                    const todayLocalDate = DateTime.now()
                      .setZone("America/Hermosillo")
                      .toFormat("yyyy-MM-dd");

                    const dayAfterLocalDate = DateTime.now()
                      .setZone("America/Hermosillo")
                      .plus({ days: 1 })
                      .toFormat("yyyy-MM-dd");

                    const selectedDateFormatted = formatDate(selectedDate);

                    if (
                      selectedDateFormatted === todayLocalDate ||
                      selectedDateFormatted === dayAfterLocalDate
                    ) {
                      alert(
                        "Cita agendada con éxito, le esperamos en el establecimiento 😊"
                      );
                    } else {
                      alert(`Cita creada con éxito, gracias su preferencia 😊`);
                    }

                    navigate("/clientdashboard");
                  } else {
                    console.error("Hubo un error al agregar la cita");
                  }
                }}
              >
                Agendar y Continuar
              </button>
              <img
                className=" mb-10"
                src="/images/hucha-3d.png"
                width={100}
                alt="bookmark3d"
              />
            </>
          ) : null}
        </div>
      </div>
      {error && (
        <div className="z-50 fixed bottom-[5%] w-[90%] left-[50%] transform -translate-x-1/2">
          <Alert
            severity="error"
            variant="filled"
            onClose={() => setError(false)}
          >
            {error}
          </Alert>
        </div>
      )}
    </div>
  );
};

export default AppointmentMaker;
