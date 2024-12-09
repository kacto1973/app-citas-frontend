import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Importar estilos predeterminados

const CustomCalendar = () => {
  const [date, setDate] = useState(new Date()); // Fecha seleccionada

  // Función para manejar el cambio de fecha
  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
    console.log("Fecha seleccionada:", selectedDate);
  };

  return (
    <div>
      <Calendar
        onChange={handleDateChange} // Llamar a la función al seleccionar una fecha
        value={date} // Fecha actualmente seleccionada
        className="rounded-md border border-gray-900 shadow-xl"
      />
      <p className="text-center my-7">
        Fecha seleccionada: {date.toDateString("es-MX")}
      </p>
    </div>
  );
};

export default CustomCalendar;
