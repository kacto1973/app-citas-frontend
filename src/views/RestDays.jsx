import React from "react";
import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import {
  getAppointments,
  addRestDays,
  getAllRestDays,
  getPaidAppointments,
  removeRestDays,
} from "../../firebaseFunctions";

const RestDays = () => {
  const [appointmentsArray, setAppointmentsArray] = useState([]);
  const [appointmentsLoaded, setAppointmentsLoaded] = useState(false);
  const [appointmentsMap, setAppointmentsMap] = useState({});
  const [range, setRange] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [allRestDays, setAllRestDays] = useState([]);
  const [allRestDaysLoaded, setAllRestDaysLoaded] = useState(false);

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
      date < new Date(new Date().setDate(new Date().getDate() - 1)) ||
      date.toDateString() === new Date().toDateString() || // Deshabilitar el día actual
      date.toDateString() === tomorrow.toDateString() // Deshabilitar el día siguiente
    );
  };

  const getTileClassName = ({ date }) => {
    // Validar si la fecha está dentro del rango de dias de descanso

    if (selectedDate && selectedDate !== "") {
      if (date.getTime() === selectedDate.getTime()) {
        return "!bg-blue	 !text-white border border-gray-500";
      }
    }

    // if (allRestDaysLoaded && allRestDays && allRestDays.length > 0) {
    //   const formattedCurrentDate = formatDate(date);
    //   const isRestDay = allRestDays.some((restday) => {
    //     if (restday === formattedCurrentDate) {
    //       return true;
    //     }
    //     return false;
    //   });
    //   if (isRestDay) {
    //     return "!bg-fuchsia-600 !text-black border border-gray-500";
    //   }
    // }

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
      date < new Date(new Date().setDate(new Date().getDate() - 1)) ||
      date.toDateString() === new Date().toDateString() || // Deshabilitar el día actual
      date.toDateString() === tomorrow.toDateString() // Deshabilitar el día siguiente
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

  const enableDays = () => {
    if (!range || range.length === 0 || range.length === 1) {
      alert(
        "Seleccione primero un rango de días de descanso para activar (solo grises oscuro)"
      );
      return;
    }

    let startDate = range[0];
    let endDate = range[1];
    let startCopy = new Date(range[0]);
    let endCopy = new Date(range[1]);

    while (startDate <= endDate) {
      if (!isRestDay(startDate)) {
        alert("No puedes activar días que ya están habilitados");
        setRange([]);
        setSelectedDate("");
        return;
      }

      startDate.setDate(startDate.getDate() + 1); // Esto maneja el cambio de mes y año automáticamente
    }

    let daysToRemove = [];
    while (startCopy <= endCopy) {
      const formattedDate = formatDate(startCopy);
      daysToRemove.push(formattedDate);
      startCopy.setDate(startCopy.getDate() + 1); // Esto maneja el cambio de mes y año automáticamente
    }
    console.log("removiendo dias ", daysToRemove);
    const asyncFunc = async () => {
      await removeRestDays(daysToRemove);
      window.location.reload();
    };
    asyncFunc();
  };

  const disableDays = () => {
    if (!range || range.length === 0 || range.length === 1) {
      alert(
        "Seleccione primero un rango de días para establecerlos como descanso"
      );
      return;
    }

    //let restDaysArray = [];
    let startDate = range[0];
    let endDate = range[1];
    let startCopy = new Date(range[0]);
    let endCopy = new Date(range[1]);

    console.log("pre for values of not copies");
    console.log("start ", startDate);
    console.log("end ", endDate);
    while (startDate <= endDate) {
      const formattedDate = formatDate(startDate);

      console.log("formattedDates ", formattedDate);
      if (formattedDate in appointmentsMap) {
        alert(
          "Hay una cita de por medio en el rango seleccionado, inténtelo de nuevo"
        );
        setRange([]);
        setSelectedDate("");
        return;
      } else if (isRestDay(startDate)) {
        alert("No puedes desactivar días que ya estaban desactivados");
        setRange([]);
        setSelectedDate("");
        return;
      }
      startDate.setDate(startDate.getDate() + 1); // Esto maneja el cambio de mes y año automáticamente
    }

    console.log("post for values: ");
    console.log("start C ", startCopy);
    console.log("end C", endCopy);
    let newDays = [];
    while (startCopy <= endCopy) {
      const formattedDate = formatDate(startCopy);
      console.log("formatted dates ", formattedDate);
      newDays.push(formattedDate);
      startCopy.setDate(startCopy.getDate() + 1); // Esto maneja el cambio de mes y año automáticamente
    }

    const asyncFunc = async () => {
      await addRestDays(newDays);
      window.location.reload();
    };
    asyncFunc();
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-[url('/src/assets/layered-waves.svg')] bg-cover bg-center">
      <h1 className="text-2xl text-white font-black mt-10 mb-2 text-center">
        Manejo de Días de Descanso
      </h1>

      <div className="w-[85%] rounded-md bg-softgreen p-2 my-10">
        <Calendar
          className="bg-white rounded-md"
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
      </div>
      <p className="text-center font-black text-white">
        Rango seleccionado: <br />{" "}
        <span className="font-black text-xl">
          {range[0]?.toLocaleDateString()} - {range[1]?.toLocaleDateString()}
        </span>
      </p>
      <div className="flex w-full justify-around mt-10">
        <button
          onClick={disableDays}
          className="px-2 py-1 rounded-md my-5 bg-softgreen text-white w-[130px]"
        >
          Desactivar Días
        </button>
        <button
          onClick={enableDays}
          className="px-2 py-1 rounded-md my-5 bg-blue text-white w-[130px]"
        >
          Activar Días
        </button>
      </div>
    </div>
  );
};

export default RestDays;
