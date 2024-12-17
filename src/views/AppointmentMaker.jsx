import React from "react";
import Calendar from "react-calendar";
import { useState, useEffect } from "react";
import {
  getServices,
  getExtraServices,
  getAppointments,
  getPaidAppointments,
  addAppointment,
  getAllRestDays,
} from "../../firebaseFunctions";
import { set } from "firebase/database";
import { useNavigate } from "react-router-dom";

const AppointmentMaker = () => {
  //use states
  const navigate = useNavigate();
  const [dateDisplayText, setDateDisplayText] = useState("");
  const [appointmentsArray, setAppointmentsArray] = useState([]);
  const [appointmentsLoaded, setAppointmentsLoaded] = useState(false);
  const [servicesArray, setServicesArray] = useState([]);
  const [extraServicesArray, setExtraServicesArray] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedExtraService, setSelectedExtraService] = useState(null);
  const [totalDurationOfAppointment, setTotalDurationOfAppointment] =
    useState(0);
  const [durationInHours, setDurationInHours] = useState(0);
  const [durationInMinutes, setDurationInMinutes] = useState(0);
  const [servicesCart, setServicesCart] = useState([]);
  const [extraServicesCart, setExtraServicesCart] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [downPaymentTotal, setDownPaymentTotal] = useState(0);
  const [downPaymentDone, setDownPaymentDone] = useState(false);
  const [dateOfAppointment, setDateOfAppointment] = useState(""); // en iso format
  const [selectedHairLength, setSelectedHairLength] = useState("");
  const [appointmentsMap, setAppointmentsMap] = useState({});
  const [appointmentsOnSelectedDate, setAppointmentsOnSelectedDate] = useState(
    []
  );
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [userFullName, setUserFullName] = useState(
    localStorage.getItem("userFullName")
  );
  //times to display con opciones apartadas deshabilitadas y las disponibles
  const [timesCombobox, setTimesCombobox] = useState([]);
  const [disabledDays, setDisabledDays] = useState([]);
  const [disabledDaysLoaded, setDisabledDaysLoaded] = useState(false);
  //useEffect

  useEffect(() => {
    console.log("map ", appointmentsMap);
  }),
    [appointmentsMap];

  useEffect(() => {
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

    const isTimeOccupied = (time) => {
      for (const appointment of appointmentsOnSelectedDate) {
        const appointmentStart = appointment.selectedTime; // Hora inicial
        const appointmentEnd = addMinutesToTime(
          appointmentStart,
          appointment.totalDurationOfAppointment
        );

        if (time >= appointmentStart && time < appointmentEnd) {
          return true; // Hora está ocupada
        }
      }
      return false;
    };

    const isTimeInThePast = (time) => {
      if (isToday(selectedDate)) {
        const [hr, min] = time.split(":").map(Number);
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinutes = now.getMinutes();
        if (hr < currentHour || (hr === currentHour && min <= currentMinutes)) {
          return true; // Hora ya ha pasado hoy
        }
      }
      return false;
    };

    const timesArray = generateTimesArray();
    const availableTimesArray = timesArray
      .filter((time) => !isTimeInThePast(time)) // Filtra las horas transcurridas
      .map((time) => {
        if (isTimeOccupied(time)) {
          return "Ocupado";
        }
        return time;
      });

    console.log(availableTimesArray); // Aquí verás los resultados
    setTimesCombobox(availableTimesArray);
  }, [appointmentsOnSelectedDate, selectedDate]);

  // useEffect(() => {
  //   console.log("appointments of selected date: ", appointmentsOnSelectedDate);
  // }, [appointmentsOnSelectedDate]);

  useEffect(() => {
    const fetchAppointments = async () => {
      //const appointments = await getAppointments();
      const appointments = await getPaidAppointments();
      console.log("appointments cargadosssm  ", appointments);
      if (appointments) {
        //console.log(appointments);
        setAppointmentsArray(appointments);
        setAppointmentsLoaded(true);
      }
    };
    fetchAppointments();
  }, []);

  useEffect(() => {
    const appointmentsPerDayObject = appointmentsArray.reduce(
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
      {}
    );
    setAppointmentsMap(appointmentsPerDayObject);
  }, [appointmentsLoaded]);

  useEffect(() => {
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
    const fetchExtraServices = async () => {
      const extraServices = await getExtraServices();
      if (extraServices) {
        const arrayOfExtraServices = Object.entries(extraServices).map(
          ([key, value]) => ({
            name: key,
            ...value,
          })
        );

        setExtraServicesArray(arrayOfExtraServices);
      }
    };
    fetchExtraServices();
  }, []);

  useEffect(() => {
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

  useEffect(() => {
    calculateTotalCost();
    calculateTotalDurationOfAppointment();
  }, [servicesCart, extraServicesCart]);

  // useEffect(() => {
  //   console.log("totalDurationOfAppointment: ", totalDurationOfAppointment);
  // }, [totalDurationOfAppointment]);

  //funciones

  const formatTime = (timeInISOString) => {
    const dateObj = new Date(timeInISOString);
    const time = dateObj.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return time;
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Agregar ceros al mes si es necesario
    const day = date.getDate().toString().padStart(2, "0"); // Agregar ceros al día si es necesario

    return `${year}-${month}-${day}`;
  };

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

  const calculateBusyTimeOfDay = (arrayOfAppointmentsOfDay) => {
    let result = 0;
    for (let index = 0; index < arrayOfAppointmentsOfDay.length; index++) {
      result += arrayOfAppointmentsOfDay[index].totalDurationOfAppointment;
    }

    return result;
  };

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
      date < new Date(new Date().setDate(new Date().getDate() + 1)) ||
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
      date < new Date(new Date().setDate(new Date().getDate() + 1)) ||
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
      const freeMinutes = calculateBusyTimeOfDay(
        appointmentsMap[formattedDate]
      );

      if (freeMinutes <= 160) {
        //lowkey free
        return "!bg-lime-400		 !text-black border border-gray-500";
      } else if (freeMinutes > 160 && freeMinutes <= 320) {
        //available
        return "!bg-amber-300	 !text-black border border-gray-500";
      } else if (freeMinutes > 320) {
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
    if (!selectedService && !selectedExtraService) {
      alert("Por favor selecciona algún servicio y/o servicio extra primero");
      return;
    }

    if (selectedExtraService) {
      setExtraServicesCart([...extraServicesCart, selectedExtraService]);
      alert(
        "Servicio extra agregado exitosamente: " + selectedExtraService.name
      );

      setSelectedExtraService(null);
    }

    if (selectedService) {
      const serviceFormatted = {
        name: selectedService.name,
        price: 0,
        duration: 0,
        restTime: selectedService.restTime,
      };

      if (selectedService.hairLength === true) {
        if (!selectedHairLength) {
          alert("Por favor selecciona la longitud de tu cabello primero");
          return;
        }
        switch (selectedHairLength) {
          case "short":
            serviceFormatted.price = selectedService.priceShort;
            serviceFormatted.duration = selectedService.durationShort;
            break;
          case "medium":
            serviceFormatted.price = selectedService.priceMedium;
            serviceFormatted.duration = selectedService.durationMedium;
            break;
          case "long":
            serviceFormatted.price = selectedService.priceLong;
            serviceFormatted.duration = selectedService.durationLong;
            break;
        }
      } else {
        serviceFormatted.price = selectedService.price;
        serviceFormatted.duration = selectedService.duration;
      }

      setServicesCart([...servicesCart, serviceFormatted]);
      alert("Servicio agregado exitosamente: " + selectedService.name);
      setSelectedService(null);
      setSelectedHairLength(null);
    }
  };

  const calculateTotalCost = () => {
    let total = 0;

    servicesCart.forEach((service) => {
      total += service.price;
    });

    extraServicesCart.forEach((extraService) => {
      total += extraService.price;
    });

    setTotalCost(total);
  };

  const calculateTotalDurationOfAppointment = () => {
    let total = 0;

    servicesCart.forEach((service) => {
      total += service.duration + service.restTime;
    });

    extraServicesCart.forEach((extraService) => {
      total += extraService.duration + extraService.restTime;
    });

    let horas = Math.floor(total / 60);
    let minutos = total % 60;
    setDurationInHours(horas);
    setDurationInMinutes(minutos);
    setTotalDurationOfAppointment(total);
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center">
      <h1 className="text-2xl font-black mt-10 mb-2 text-center">
        AGENDADOR DE CITAS
      </h1>

      <div className="flex flex-col justify-center items-center w-[65%]">
        <div className="relative w-[100%] border border-gray-900 mt-6 mb-2 flex flex-col p-5 rounded-md shadow-xl bg-gray-100">
          <p>
            Seleccione el servicio que desee (
            <span className="text-red">*</span>)
          </p>
          <select
            value={(selectedService && selectedService.name) || ""}
            onChange={(e) =>
              setSelectedService(
                servicesArray.find((service) => service.name === e.target.value)
              )
            }
            name="serviceName"
            className="w-full border-2 border-black rounded-md text-center my-2 mb-6"
          >
            <option value="">Seleccione una opción</option>
            {servicesArray.map((service, serviceIndex) => {
              return (
                <>
                  <option id={serviceIndex} value={service.name}>
                    {service.name}
                  </option>
                </>
              );
            })}
          </select>
          {selectedService && selectedService.hairLength === true ? (
            <>
              <p>
                Seleccione la longitud de su cabello (
                <span className="text-red">*</span>)
              </p>
              <select
                value={selectedHairLength || ""}
                name="serviceName"
                onChange={(e) => setSelectedHairLength(e.target.value)}
                className="w-full  border-2 border-black rounded-md text-center my-2 mb-6"
              >
                <option value="">Seleccione una opción</option>
                <option value="short">Corto</option>
                <option value="medium">Mediano</option>
                <option value="long">Largo</option>
              </select>
            </>
          ) : null}
          <p>¿Algún servicio extra?</p>
          <select
            value={(selectedExtraService && selectedExtraService.name) || ""}
            onChange={(e) =>
              setSelectedExtraService(
                extraServicesArray.find(
                  (extraService) => extraService.name === e.target.value
                )
              )
            }
            name="serviceName"
            className="w-full  border-2 border-black rounded-md text-center my-2 mb-6"
          >
            <option value="">Seleccione una opción</option>
            {extraServicesArray.map((extraService, extraServiceIndex) => {
              return (
                <option id={extraServiceIndex} value={extraService.name}>
                  {extraService.name}
                </option>
              );
            })}
          </select>
        </div>

        <button
          onClick={addAllServicesToCart}
          className="px-2 py-1 rounded-md my-5 bg-blue text-white w-[140px]"
        >
          Añadir Servicios Seleccionados
        </button>

        {servicesCart && servicesCart.length > 0 ? (
          <>
            <h1 className="text-lg mt-10 mb-2">Servicios Seleccionados</h1>
            <table className="table-auto w-full border drop-shadow-xl border-black border-collapse text-sm text-center">
              <thead>
                <tr>
                  <td className="border border-black">Nombre del Servicio</td>
                  <td className="border border-black">Precio del Servicio</td>
                  <td className="border border-black">Acción</td>
                </tr>
              </thead>
              <tbody>
                {servicesCart.map((service, serviceIndex) => (
                  <tr key={serviceIndex}>
                    <td className="border border-black">{service.name}</td>
                    <td className="border border-black">
                      <span className="text-green font-black">
                        ${service.price}
                      </span>
                    </td>
                    <td className="border border-black">
                      <button
                        className="px-1 py-0.5 rounded-md m-2.5 bg-red text-white w-[90px]"
                        onClick={() => {
                          const userConfirmation = confirm(
                            `¿Eliminar servicio: ${service.name}?`
                          );
                          if (userConfirmation) {
                            setServicesCart(
                              servicesCart.filter(
                                (serviceFiltered) => serviceFiltered !== service
                              )
                            );
                          }
                        }}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : null}

        {extraServicesCart && extraServicesCart.length > 0 ? (
          <>
            <h1 className="text-lg mt-10 mb-2">
              Servicios Extra Seleccionados
            </h1>
            <table className="table-auto w-full border drop-shadow-xl border-black border-collapse text-sm text-center">
              <thead>
                <tr>
                  <td className="border border-black">Nombre del Servicio</td>
                  <td className="border border-black">Precio del Servicio</td>
                  <td className="border border-black">Acción</td>
                </tr>
              </thead>
              <tbody>
                {extraServicesCart.map((extraService, extraServiceIndex) => (
                  <tr key={extraServiceIndex}>
                    <td className="border border-black">{extraService.name}</td>
                    <td className="border border-black">
                      <span className="text-green font-black">
                        ${extraService.price}
                      </span>
                    </td>
                    <td className="border border-black">
                      <button
                        className="px-1 py-0.5 rounded-md m-2.5 bg-red text-white w-[90px]"
                        onClick={() => {
                          const userConfirmation = confirm(
                            `¿Eliminar servicio extra: ${extraService.name}?`
                          );
                          if (userConfirmation) {
                            setExtraServicesCart(
                              extraServicesCart.filter(
                                (extraServiceFiltered) =>
                                  extraServiceFiltered !== extraService
                              )
                            );
                          }
                        }}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : null}

        <h1 className="text-xl mt-6 ">
          Costo Total:{" "}
          <span className="text-green font-black">${totalCost}</span>
        </h1>

        {(servicesCart && servicesCart.length > 0) ||
        (extraServicesCart && extraServicesCart.length > 0) ? (
          <>
            <h1 className="text-xl my-10">Fecha de su Cita</h1>

            <div className="border-2 border-gray-400  rounded-md shadow-xl mb-10">
              <Calendar
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
            </div>

            {selectedDate && selectedDate !== null && selectedDate !== "" ? (
              <>
                <p className="mt-3 text-center">
                  Día Seleccionado: <br />
                  {dateDisplayText}
                </p>
                <h1 className="text-xl mt-10 mb-2">Hora de su Cita</h1>

                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  name="selectedTime"
                  id=""
                  className="w-full  border-2 border-black rounded-md text-center my-2 mb-6"
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
          </>
        ) : null}
      </div>

      {((servicesCart && servicesCart.length > 0) ||
        (extraServicesCart && extraServicesCart.length > 0)) &&
      selectedDate !== null &&
      selectedTime !== null &&
      selectedTime !== "" ? (
        <>
          <h1 className="text-xl mt-10 mb-2">Su cita quedaría así:</h1>
          <div className=" w-[80%] border border-gray-900 my-6 flex flex-col p-5 rounded-md shadow-xl bg-gray-100">
            <div className="flex flex-row mb-2">
              <p>
                {dateDisplayText} a las
                <br />
                <span className="font-black">{selectedTime}</span> (duración de{" "}
                {durationInHours ? durationInHours : 0} hr
                {durationInMinutes ? ` ${durationInMinutes}m` : null})
              </p>
              {/* <span className="text-white bg-blue py-0.5 px-1 ml-2 rounded-lg">
                  Transfer
                </span> */}
              <p className="ml-auto">
                <span className="text-green font-black">${totalCost}</span>
              </p>
            </div>
            {/* <p>1 x Corte de cabello - ($50) = $50</p>
          <p>1 x Tinte de cabello - ($60) = $60</p>
          <p>1 x Peinado - ($40) = $40</p> */}
            {servicesCart.map((service, serviceIndex) => (
              <p key={serviceIndex}>
                • {service.name} (${service.price})
              </p>
            ))}
            {extraServicesCart.map((extraService, extraServiceIndex) => (
              <p key={extraServiceIndex}>
                • {extraService.name} (${extraService.price})
              </p>
            ))}
          </div>
          <button
            type="submit"
            className="px-3 py-2 font-black rounded-md my-5 bg-blue text-white w-[150px]"
            //Deberia aqui en vez de pasar selected date/time,
            // combinarlos en un date object y pasar eso
            //ademas me falta agregar cosas del anticipo, como true o cuanto es
            onClick={async () => {
              if (!validateTime(selectedTime)) {
                alert(
                  "La duración de la cita excede la disponibilidad del horario, por favor seleccione otra hora con más tiempo disponible"
                );
                return;
              }

              const success = await addAppointment(
                servicesCart,
                extraServicesCart,
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

                alert(
                  `Cita creada con éxito, para confirmarla es importante que realice su depósito dentro de las próximas 12 horas (antes de las ${formattedExpiration} horas), de lo contrario esta se cancelará. Puede hacer esto en el menú principal, gracias 😊.`
                );
                navigate("/clientdashboard");
              } else {
                console.error("Hubo un error al agregar la cita");
              }
            }}
          >
            Confirmar Cita
          </button>
        </>
      ) : null}
    </div>
  );
};

export default AppointmentMaker;
