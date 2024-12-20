import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import {
  getAppointments,
  getAllRestDays,
  getPaidAppointments,
} from "../../firebaseFunctions";

const Appointments = () => {
  const navigate = useNavigate();
  const [dateDisplayText, setDateDisplayText] = useState("");
  const [appointmentsArray, setAppointmentsArray] = useState([]);
  const [appointmentsLoaded, setAppointmentsLoaded] = useState(false);
  const [appointmentsMap, setAppointmentsMap] = useState({});
  const [appointmentsOnSelectedDate, setAppointmentsOnSelectedDate] = useState(
    []
  );
  const [selectedDate, setSelectedDate] = useState("");
  const [allRestDays, setAllRestDays] = useState([]);
  const [allRestDaysLoaded, setAllRestDaysLoaded] = useState(false);

  useEffect(() => {
    console.log("appmnts of the day ", appointmentsOnSelectedDate);
  }, [appointmentsOnSelectedDate]);

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

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Agregar ceros al mes si es necesario
    const day = date.getDate().toString().padStart(2, "0"); // Agregar ceros al día si es necesario

    return `${year}-${month}-${day}`;
  };

  function formatDuration(durationInMinutes) {
    const hours = Math.floor(durationInMinutes / 60);
    const minutes = durationInMinutes % 60;

    return `${hours} hr ${minutes ? `${minutes}m` : ""}`;
  }

  function formatDateForDisplay(date) {
    //si recibimos 2024-12-31
    const [year, month, dateNum] = date.split("-");
    /*Obtendriamos
    year = 2024
    month = 12
    dateNum = 31
    */
    return `${dateNum}/${month}/${year}`;
  }

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
      date < new Date(new Date().setDate(new Date().getDate() - 1)) ||
      isRestDay(date)
    );
  };

  const getTileClassName = ({ date }) => {
    if (
      date.getDay() === 0 ||
      date < new Date(new Date().setDate(new Date().getDate() - 1))
    ) {
      return "bg-gray-200 text-gray-500 border border-gray-300";
    }

    if (isRestDay(date)) {
      return "bg-gray-400 text-gray-500 border border-gray-500";
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
    <div className="w-full min-h-screen flex flex-col items-center bg-[url('src/assets/stacked-waves.svg')] bg-cover  bg-center">
      <h1 className="text-2xl font-black text-white mt-10 mb-2 text-center">
        Calendario de Citas
      </h1>
      <div className="w-[85%] rounded-md bg-softgreen p-2 my-10">
        <Calendar
          className="bg-white rounded-md"
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
        {selectedDate && selectedDate !== "" ? (
          <p className="w-full text-center text-white font-black">
            Citas para el día seleccionado: <br />
            <span className="text-xl font-black">{dateDisplayText}</span>
          </p>
        ) : null}
        {appointmentsOnSelectedDate && appointmentsOnSelectedDate.length > 0
          ? [...appointmentsOnSelectedDate]
              .sort((a, b) => {
                const dateA = new Date(`${a.selectedDate}T${a.selectedTime}`);
                const dateB = new Date(`${b.selectedDate}T${b.selectedTime}`);
                return dateA.getTime() - dateB.getTime();
              })
              .map((appointment) => (
                <>
                  <div className="relative w-[80%]  mt-6 flex flex-col p-5 rounded-md bg-[url('src/assets/blob-scene.svg')] border-[5px] border-softgreen shadow-md text-white">
                    <div className="flex flex-row mb-2">
                      <p>
                        Cliente:{" "}
                        <span className="font-black">
                          {appointment.userFullName}
                        </span>{" "}
                        <br />
                        Tel:{" "}
                        <span className="font-black">
                          {appointment.cellphone}
                        </span>{" "}
                        <br />
                        Fecha:{" "}
                        <span className="font-black">
                          {formatDateForDisplay(appointment.selectedDate)} a las{" "}
                          {appointment.selectedTime}
                        </span>{" "}
                        <br />
                        Duración:{" "}
                        <span className="font-black">
                          {formatDuration(
                            appointment.totalDurationOfAppointment
                          )}
                        </span>
                      </p>
                      <p className="ml-auto">
                        <span className="text-green font-black text-xl">
                          ${appointment.totalCost}
                        </span>
                      </p>
                    </div>
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
                            • {extraService.name.toUpperCase()}
                            <span className="text-green font-black">
                              (${extraService.price})
                            </span>
                          </p>
                        )
                      )}
                    {appointment.state === "pagado" ? (
                      <p className="py-1 px-1 rounded-md my-5 text-xs bg-green text-white w-[102px] absolute bottom-0 right-5">
                        Cita Confirmada
                      </p>
                    ) : (
                      <button className="pointer-events-none py-1 px-1 rounded-md my-5 text-xs bg-blue text-white w-[83px] absolute bottom-0 right-5">
                        Sin Anticipo
                      </button>
                    )}
                  </div>
                </>
              ))
          : null}
      </div>
    </div>
  );
};

export default Appointments;
