import React from "react";
import Calendar from "react-calendar";
import { useState, useEffect } from "react";
import {
  getServices,
  getExtraServices,
  getAppointments,
} from "../../firebaseFunctions";
import { set } from "firebase/database";

const AppointmentMaker = () => {
  //use states
  const [dateDisplayText, setDateDisplayText] = useState("");

  const [appointmentsArray, setAppointmentsArray] = useState([]);
  const [appointmentsLoaded, setAppointmentsLoaded] = useState(false);
  const [holidaysLoaded, setHolidaysLoaded] = useState(false);

  const [servicesLoaded, setServicesLoaded] = useState(false);
  const [extraServicesLoaded, setExtraServicesLoaded] = useState(false);

  //estos son los arrays que contienen Todos los servicios en general
  const [servicesArray, setServicesArray] = useState([]);
  const [extraServicesArray, setExtraServicesArray] = useState([]);

  //estos son los arrays que contienen los servicios que el USUARIO quiere
  //los vamos a displayear en la carta de hasta abajo
  const [wantedServices, setWantedServices] = useState([]);
  const [wantedExtraServices, setWantedExtraServices] = useState([]);

  const [selectedService, setSelectedService] = useState(null);
  const [selectedExtraService, setSelectedExtraService] = useState(null);

  //Estas variables conformarán un objeto appointment, para darme una idea aqui estan
  const [servicesCart, setServicesCart] = useState([]);
  const [extraServicesCart, setExtraServicesCart] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [downPaymentTotal, setDownPaymentTotal] = useState(0);
  const [downPaymentDone, setDownPaymentDone] = useState(false);
  const [dateOfAppointment, setDateOfAppointment] = useState(""); // en iso format
  const [selectedHairLength, setSelectedHairLength] = useState("");
  const [appointmentsMap, setAppointmentsMap] = useState({});
  const [availableTimes, setAvailableTimes] = useState([]);

  //ya aqui luego lo veo con mi ma y cargar los dias festivos que ella elija
  const [holidays, setHolidays] = useState([]);

  const [selectedTime, setSelectedTime] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());

  //useEffect

  useEffect(() => {
    //cargar citas, dias festivos
    const fetchAppointments = async () => {
      const appointments = await getAppointments();
      if (appointments) {
        //console.log(appointments);
        setAppointmentsArray(appointments);
        setAppointmentsLoaded(true);
      }
    };
    fetchAppointments();
  }, []);

  useEffect(() => {
    //una vez cargados, estan listos para transformarse en un objeto
    //que contendra claves (fechas) y valores (arreglos de citas)
    const appointmentsPerDayObject = appointmentsArray.reduce(
      (finalObject, appointment) => {
        const formattedDate = new Date(appointment.date)
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
    //console.log("appointmentsMap object: ", appointmentsPerDayObject);
    setAppointmentsMap(appointmentsPerDayObject);
  }, [appointmentsLoaded]);

  useEffect(() => {
    console.log("selectedDate: ", selectedDate);
  }, [selectedDate]);

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
        setServicesLoaded(true);
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
        setExtraServicesLoaded(true);
      }
    };
    fetchExtraServices();
  }, []);

  // useEffect(() => {
  //   if (servicesLoaded) {
  //     console.log(servicesArray);
  //   }
  // }, [servicesLoaded]);

  // useEffect(() => {
  //   if (extraServicesLoaded) {
  //     console.log(extraServicesArray);
  //   }
  // }, [extraServicesLoaded]);

  // useEffect(() => {
  //   console.log("servicesCart: ", servicesCart);
  // }, [servicesCart]);

  // useEffect(() => {
  //   console.log("extraServicesCart: ", extraServicesCart);
  // }, [extraServicesCart]);

  // useEffect(() => {
  //   console.log("selectedService: ", selectedService);
  // }, [selectedService]);

  // useEffect(() => {
  //   console.log("selectedExtraService: ", selectedExtraService);
  // }, [selectedExtraService]);

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
  }, [servicesCart, extraServicesCart]);

  useEffect(() => {
    const interval = 15;
    const startHour = 9;
    const endHour = 17;
    const timeBlocksArray = [];

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        const formattedHour = hour < 10 ? `0${hour}` : hour;
        const formattedMinute = minute < 10 ? `0${minute}` : minute;

        const time = `${formattedHour}:${formattedMinute}`;
        timeBlocksArray.push(time);
      }
    }
    setAvailableTimes(timeBlocksArray);
  }, []);

  useEffect(() => {
    console.log("availableTimes: ", availableTimes);
  }, [availableTimes]);

  //funciones

  const handleTileDisabled = ({ date, view }) => {
    if (date.getDay() === 0 || date < new Date()) {
      return true;
    }
    false;
  };

  const getTileClassName = ({ date, view }) => {
    if (date.getDay() === 0 || date < new Date()) {
      return "bg-gray-200 text-gray-500 border border-gray-300";
    }
    if (
      selectedDate.toISOString().split("T")[0] ===
      date.toISOString().split("T")[0]
    ) {
      return "!bg-blue !text-white";
    }

    //nomas sirvio para pasarlo como clave al mapa de citas
    const formattedDate = date.toISOString().split("T")[0];

    // if (
    //   !appointmentsMap[formattedDate] ||
    //   appointmentsMap[formattedDate].length < 1
    // ) {
    //   //si no hay citas ese dia o hay menos de 3 entonces es dia disponible
    //   return "!bg-green !text-white ";
    // } else if (appointmentsMap[formattedDate].length >= 1) {
    //   //si hay 3 o mas citas es dia ocupado
    //   return "!bg-yellow !text-white";
    // } else if (dayOfWeek === 0) {
    //   //si es domingo no se puede agendar o si es dia festivo, etc
    //   return "!bg-red !text-white";
    // }
  };

  const handleDateClick = (newDateObject) => {
    setSelectedDate(newDateObject);
    const formattedDate = new Intl.DateTimeFormat("es-MX", {
      weekday: "long", // Día de la semana (lunes, martes, etc.)
      year: "numeric", // Año (2024)
      month: "long", // Mes (diciembre)
      day: "numeric", // Día del mes (10)
    }).format(newDateObject);
    setDateDisplayText(formattedDate);
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

        <h1 className="text-lg mt-10 mb-2">Servicios Extra Seleccionados</h1>
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

        <h1 className="text-xl mt-6 ">
          Costo Total:{" "}
          <span className="text-green font-black">${totalCost}</span>
        </h1>

        <h1 className="text-xl my-10">Fecha de su Cita</h1>

        {/* <div className="border-2 border-gray-500 p-2 rounded-md shadow-xl ">
          <Calendar
            tileDisabled={handleTileDisabled}
            onClickDay={(value) => {
              handleDateClick(value);
            }}
            tileClassName={getTileClassName}
          />
        </div> */}
        <div className="border-2 border-gray-400  rounded-md shadow-xl">
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
                <p className="text-center text-lg font-bold uppercase">
                  {date.toLocaleDateString("es-MX", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              );
            }}
          />
        </div>

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
          {availableTimes &&
            availableTimes.map((time, timeIndex) => {
              return (
                <option id={timeIndex} value={time}>
                  {time}
                </option>
              );
            })}
        </select>
      </div>
      <h1 className="text-xl mt-10 mb-2">Su cita quedaría así:</h1>

      <div className=" w-[80%] border border-gray-900 my-6 flex flex-col p-5 rounded-md shadow-xl bg-gray-100">
        <div className="flex flex-row mb-2">
          <p>
            {dateDisplayText} <br /> a las{" "}
            <span className="font-black">{selectedTime}</span> horas
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
      >
        Confirmar Cita
      </button>
    </div>
  );
};

export default AppointmentMaker;
