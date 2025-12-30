import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import Calendar from "react-calendar";
import {
  getAppointments,
  addRestDays,
  getAllRestDays,
  getPaidAppointments,
  removeRestDays,
} from "../services/api";

const RestDays = () => {
  // Navigation
  const navigate = useNavigate();

  // Loading states
  const [loading, setLoading] = useState(true);
  const [appointmentsLoaded, setAppointmentsLoaded] = useState(false);
  const [allRestDaysLoaded, setAllRestDaysLoaded] = useState(false);

  // Appointments states
  const [appointmentsArray, setAppointmentsArray] = useState([]);
  const [appointmentsMap, setAppointmentsMap] = useState({});

  // Date selection
  const [selectedDate, setSelectedDate] = useState("");
  const [range, setRange] = useState([]);

  // Rest days
  const [allRestDays, setAllRestDays] = useState([]);

  useEffect(() => {
    const fetchRestDays = async () => {
      const restDays = await getAllRestDays();
      if (restDays) {
        setAllRestDays(restDays);
        setAllRestDaysLoaded(true);
      }
    };
    fetchRestDays();
  }, []);

  useEffect(() => {
    const fetchAppointments = async () => {
      const appointments = await getAppointments();
      //const appointments = await getPaidAppointments();
      if (appointments) {
        setAppointmentsArray(appointments);
        setAppointmentsLoaded(true);
      }
      setLoading(false);
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

  const calculateBusyTimeOfDay = (arrayOfAppointmentsOfDay) => {
    let result = 0;
    for (let index = 0; index < arrayOfAppointmentsOfDay.length; index++) {
      result += arrayOfAppointmentsOfDay[index].totalDurationOfAppointment;
    }
    return result;
  };

  const isRestDay = (date) => {
    if (allRestDaysLoaded && allRestDays && allRestDays.length > 0) {
      const formattedCurrentDate = formatDate(date);
      const isRestDay = allRestDays.some((restday) => {
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

  const handleTileDisabled = ({ date }) => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    return (
      date.getDay() === 0 ||
      date < new Date(new Date().setDate(new Date().getDate() - 1))
    );
  };

  const getTileClassName = ({ date }) => {
    // Validar si la fecha está dentro del rango de dias de descanso

    if (selectedDate && selectedDate !== "") {
      if (date.getTime() === selectedDate.getTime()) {
        return "!bg-blue	 !text-white border border-gray-500";
      }
    }

    if (range && Array.isArray(range) && range.length > 0) {
      if (date >= range[0] && date <= range[1]) {
        return "!bg-cyan-400	 !text-black border border-gray-500";
      }
    }

    if (isRestDay(date)) {
      return "bg-gray-400 text-gray-500 border border-gray-500";
    }

    //si no checamos si es domingo o un dia pasado para mostrarlo inhabilitado
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    if (
      date.getDay() === 0 ||
      date < new Date(new Date().setDate(new Date().getDate() - 1))
    ) {
      return "bg-gray-200 text-gray-500 border border-gray-300";
    }

    //si no es de descanso ni esta inhabilitado entonces ya checamos si esta
    //en el appmnts map y lo coloreamos conforme a lo ocupado que este
    const formattedDate = date.toISOString().split("T")[0];
    if (appointmentsMap[formattedDate]) {
      const freeMinutes = calculateBusyTimeOfDay(
        appointmentsMap[formattedDate]
      );
      if (freeMinutes <= 160) {
        return "!bg-lime-400 !text-black border border-gray-500";
      } else if (freeMinutes > 160 && freeMinutes <= 320) {
        return "!bg-amber-300 !text-black border border-gray-500";
      } else if (freeMinutes > 320) {
        return "!bg-rose-400 !text-black border border-gray-500";
      }
    } else {
      return "!text-black border border-gray-500";
    }
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Agregar ceros al mes si es necesario
    const day = date.getDate().toString().padStart(2, "0"); // Agregar ceros al día si es necesario

    return `${year}-${month}-${day}`;
  };

  /**
   * Habilita días que estaban marcados como descanso
   * Convierte días de descanso (grises oscuro) en días laborables (blancos)
   */
  const enableDays = () => {
    // Validar que se haya seleccionado un rango completo (inicio y fin)
    if (!range || range.length === 0 || range.length === 1) {
      alert(
        "Seleccione primero un rango de días de descanso para activar (solo grises oscuro)"
      );
      return;
    }

    // Obtener fechas de inicio y fin del rango
    let startDate = range[0];
    let endDate = range[1];
    // Crear copias para no mutar las fechas originales
    let startCopy = new Date(range[0]);
    let endCopy = new Date(range[1]);

    // Validar que todos los días del rango sean días de descanso
    while (startDate <= endDate) {
      if (!isRestDay(startDate)) {
        alert("No puedes activar días que ya están habilitados");
        setRange([]);
        setSelectedDate("");
        return;
      }
      startDate.setDate(startDate.getDate() + 1); // Avanzar al siguiente día
    }

    // Crear array con los días formateados que se van a remover de descanso
    let daysToRemove = [];
    while (startCopy <= endCopy) {
      const formattedDate = formatDate(startCopy);
      daysToRemove.push(formattedDate);
      startCopy.setDate(startCopy.getDate() + 1); // Avanzar al siguiente día
    }

    console.log("removiendo dias ", daysToRemove);

    // Función asíncrona para remover los días de descanso de Firebase
    const asyncFunc = async () => {
      await removeRestDays(daysToRemove);
      window.location.reload(); // Recargar página para reflejar cambios
    };
    asyncFunc();
  };

  /**
   * Deshabilita días laborables convirtiéndolos en días de descanso
   * Convierte días laborables (blancos) en días de descanso (grises oscuro)
   */
  const disableDays = () => {
    // Validar que se haya seleccionado un rango completo (inicio y fin)
    if (!range || range.length === 0 || range.length === 1) {
      alert(
        "Seleccione primero un rango de días para establecerlos como descanso (solo blancos)"
      );
      return;
    }

    // Obtener fechas de inicio y fin del rango
    let startDate = range[0];
    let endDate = range[1];
    // Crear copias para no mutar las fechas originales
    let startCopy = new Date(range[0]);
    let endCopy = new Date(range[1]);

    console.log("pre for values of not copies");
    console.log("start ", startDate);
    console.log("end ", endDate);

    // Validar que no haya citas en el rango y que no sean días ya desactivados
    while (startDate <= endDate) {
      const formattedDate = formatDate(startDate);
      console.log("formattedDates ", formattedDate);

      // Verificar si existe una cita en este día
      if (formattedDate in appointmentsMap) {
        alert(
          "Hay una cita de por medio en el rango seleccionado, inténtelo de nuevo"
        );
        setRange([]);
        setSelectedDate("");
        return;
      }
      // Verificar si el día ya es de descanso
      else if (isRestDay(startDate)) {
        alert("No puedes desactivar días que ya estaban desactivados");
        setRange([]);
        setSelectedDate("");
        return;
      }

      startDate.setDate(startDate.getDate() + 1); // Avanzar al siguiente día
    }

    console.log("post for values: ");
    console.log("start C ", startCopy);
    console.log("end C", endCopy);

    // Crear array con los días formateados que se van a agregar como descanso
    let newDays = [];
    while (startCopy <= endCopy) {
      const formattedDate = formatDate(startCopy);
      console.log("formatted dates ", formattedDate);
      newDays.push(formattedDate);
      startCopy.setDate(startCopy.getDate() + 1); // Avanzar al siguiente día
    }

    // Función asíncrona para agregar los días de descanso a Firebase
    const asyncFunc = async () => {
      await addRestDays(newDays);
      window.location.reload(); // Recargar página para reflejar cambios
    };
    asyncFunc();
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-g10">
      {loading ? (
        <div className="absolute inset-0 bg-black  flex items-center justify-center z-20">
          <div className="bg-white p-5 rounded-md shadow-md text-center">
            <h1 className="font-black text-2xl">Cargando...</h1>
          </div>
        </div>
      ) : (
        <div className="absolute top-[7rem] w-full flex flex-col justify-center items-center bg-g10">
          {" "}
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
                src="/images/moon_purple_icon.svg"
                width={30}
                alt="moon icon"
                onClick={() => {
                  navigate("/restdays");
                }}
              />
              <p className="font-extrabold text-xs text-g1">Descansos</p>
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
          <h1 className="text-lg font-black w-[90%] text-black text-center">
            Haga click sobre dos días para seleccionar un rango
          </h1>
          <div className="relative rounded-md bg-white p-2 mt-5 mb-8 shadow-md w-[80vw]  h-[24rem]">
            <Calendar
              className="bg-white rounded-md text-center"
              view="month"
              selectRange
              value={range}
              tileDisabled={handleTileDisabled}
              onChange={(value) => {
                setRange(value);
              }}
              onClickDay={setSelectedDate}
              tileClassName={getTileClassName}
              nextLabel=">"
              prevLabel="<"
              next2Label={null}
              prev2Label={null}
              navigationLabel={({ date }) => {
                return (
                  <p
                    onClick={(e) => e.stopPropagation()}
                    className="text-center text-lg font-bold uppercase cursor-default"
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
            <div className="absolute bottom-[35%] left-4 rounded-full bg-white w-[24px] h-[24px]  border border-black" />
            <p className="absolute bottom-[35%] left-11  ">Todo Libre</p>
            <div className="absolute bottom-[35%] left-[50%] rounded-full bg-gray-200 w-[24px] h-[24px]   border border-black" />
            <p className="absolute bottom-[35%] left-[59%]  ">No Disponible</p>
            <div className="absolute bottom-[15%] left-[50%] rounded-full bg-blue  w-[24px] h-[24px]  border border-black" />
            <p className="absolute bottom-[15%] left-[59%]  ">Indicador</p>
            <div className="absolute bottom-[25%] left-[50%] rounded-full bg-gray-400  w-[24px] h-[24px]  border border-black" />
            <p className="absolute bottom-[25%] left-[59%]  ">Inhabilitado</p>
            <div className="absolute bottom-[5%] left-[50%] rounded-full bg-cyan-400  w-[24px] h-[24px]  border border-black" />
            <p className="absolute bottom-[5%] left-[59%]  ">Rango Escogido</p>
          </div>
          <p
            className={`${
              range[0] && range[1]
                ? "text-center font-semibold text-black"
                : "hidden"
            }`}
          >
            Rango seleccionado: <br />{" "}
            <span className="font-black text-xl">
              {range[0]?.toLocaleDateString()} -{" "}
              {range[1]?.toLocaleDateString()}
            </span>
          </p>
          <div className="flex justify-around my-10 mb-[7rem] bg-white w-[80%] shadow-md rounded-2xl p-5">
            <div className="flex flex-col items-center">
              <img onClick={disableDays} width={50} src="/images/pause.svg" />
              <p>Deshabilitar</p>
            </div>

            <div className="flex flex-col items-center">
              <img onClick={enableDays} width={50} src="/images/play.svg" />
              <p>Habilitar</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestDays;
