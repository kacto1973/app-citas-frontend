import React from "react";
import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { getAppointments } from "../../firebaseFunctions";

const RestDays = () => {
  const [appointmentsArray, setAppointmentsArray] = useState([]);
  const [appointmentsLoaded, setAppointmentsLoaded] = useState(false);
  const [appointmentsMap, setAppointmentsMap] = useState({});
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      const appointments = await getAppointments();
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

  const handleTileDisabled = ({ date }) => {
    return (
      date.getDay() === 0 ||
      date < new Date(new Date().setDate(new Date().getDate() - 1))
    );
  };

  const getTileClassName = ({ date }) => {
    if (
      date.getDay() === 0 ||
      date < new Date(new Date().setDate(new Date().getDate() - 1))
    ) {
      return "bg-gray-200 text-gray-500 border border-gray-300";
    }

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

  return (
    <div className="w-full min-h-screen flex flex-col items-center">
      <h1 className="text-2xl font-black mt-10 mb-2 text-center">
        ESTABLECER DÍAS DE DESCANSO
      </h1>

      <div className="w-[85%] border-2 border-gray-400 rounded-md shadow-xl my-10">
        <Calendar
          view="month"
          value={selectedDate}
          tileDisabled={handleTileDisabled}
          onClickDay={(value) => setSelectedDate(value)}
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
      <button className="px-2 py-1 rounded-md my-5 bg-blue text-white w-[120px]">
        Inhabilitar Días
      </button>
    </div>
  );
};

export default RestDays;
