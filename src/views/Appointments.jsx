import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import { getAppointments } from "../../firebaseFunctions";

const Appointments = () => {
  const navigate = useNavigate();
  const [dateDisplayText, setDateDisplayText] = useState("");
  const [appointmentsArray, setAppointmentsArray] = useState([]);
  const [appointmentsLoaded, setAppointmentsLoaded] = useState(false);
  const [appointmentsMap, setAppointmentsMap] = useState({});
  const [appointmentsOnSelectedDate, setAppointmentsOnSelectedDate] = useState(
    []
  );
  const [selectedDate, setSelectedDate] = useState(null);

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
    if (
      selectedDate &&
      selectedDate.toISOString().split("T")[0] ===
        date.toISOString().split("T")[0]
    ) {
      return "!bg-blue !text-white";
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

  const handleDateClick = (newDateObject) => {
    setSelectedDate(newDateObject);
    const formattedDate = new Intl.DateTimeFormat("es-MX", {
      weekday: "long",
      month: "long",
      day: "numeric",
    }).format(newDateObject);
    setDateDisplayText(formattedDate);

    if (appointmentsMap[newDateObject.toISOString().split("T")[0]]) {
      const appointmentsOfTheSelectedDate =
        appointmentsMap[newDateObject.toISOString().split("T")[0]];
      setAppointmentsOnSelectedDate(appointmentsOfTheSelectedDate);
    } else {
      setAppointmentsOnSelectedDate([]);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center">
      <h1 className="text-2xl font-black mt-10 mb-2 text-center">
        VISTA DE CITAS
      </h1>
      <div className="w-[85%] border-2 border-gray-400 rounded-md shadow-xl my-10">
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
      <div className="flex flex-col w-full items-center mb-20">
        <p className="w-full text-center">
          Citas para el día seleccionado: <br />
          <span className="text-xl font-black">{dateDisplayText}</span>
        </p>
        <div className="relative w-[80%] border border-gray-900 mt-6 flex flex-col p-5 rounded-md shadow-xl bg-gray-100">
          <div className="flex flex-row mb-2">
            <p>
              Cita #1 - 12/12/2024 a las 10:00 AM <br />
              (duración de 1 hr 30m)
            </p>
            <p className="ml-auto">
              <span className="text-green font-black">$500</span>
            </p>
          </div>
          <p>• Corte de cabello ($200)</p>
          <p>• Peinado ($150)</p>
          <p>• Tratamiento capilar ($150)</p>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
