import React from "react";
import CustomCalendar from "../components/CustomCalendar";

const AppointmentMaker = () => {
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
            name="serviceName"
            id=""
            className="w-full border-2 border-black rounded-md text-center my-2 mb-6"
          >
            <option value="1">Corte de cabello</option>
            <option value="2">Tinte de cabello</option>
            <option value="3">Peinado</option>
          </select>
          <p>
            Seleccione la longitud de su cabello (
            <span className="text-red">*</span>)
          </p>
          <select
            name="serviceName"
            id=""
            className="w-full  border-2 border-black rounded-md text-center my-2 mb-6"
          >
            <option value="1">Corto</option>
            <option value="2">Mediano</option>
            <option value="3">Largo</option>
          </select>
          <p>¿Algún servicio extra?</p>
          <select
            name="serviceName"
            id=""
            className="w-full  border-2 border-black rounded-md text-center my-2 mb-6"
          >
            <option value="1">Corte de cabello</option>
            <option value="2">Tinte de cabello</option>
            <option value="3">Peinado</option>
          </select>
        </div>

        <div className="relative w-[100%] border border-gray-900 mt-6 mb-7 flex flex-col p-5 rounded-md shadow-xl bg-gray-100">
          <p>
            Seleccione el servicio que desee (
            <span className="text-red">*</span>)
          </p>
          <select
            name="serviceName"
            id=""
            className="w-full border-2 border-black rounded-md text-center my-2 mb-6"
          >
            <option value="1">Corte de cabello</option>
            <option value="2">Tinte de cabello</option>
            <option value="3">Peinado</option>
          </select>
          <p>
            Seleccione la longitud de su cabello (
            <span className="text-red">*</span>)
          </p>
          <select
            name="serviceName"
            id=""
            className="w-full  border-2 border-black rounded-md text-center my-2 mb-6"
          >
            <option value="1">Corto</option>
            <option value="2">Mediano</option>
            <option value="3">Largo</option>
          </select>
          <p>¿Algún servicio extra?</p>
          <select
            name="serviceName"
            id=""
            className="w-full  border-2 border-black rounded-md text-center my-2 mb-6"
          >
            <option value="1">Corte de cabello</option>
            <option value="2">Tinte de cabello</option>
            <option value="3">Peinado</option>
          </select>
        </div>

        <h1 className="text-xl ">
          Costo Total: <span className="text-green font-black">$340</span>
        </h1>
        <button className="px-2 py-1 rounded-md my-5 bg-blue text-white w-[140px]">
          Añadir Servicio
        </button>

        <h1 className="text-xl my-10">Fecha de su Cita</h1>
        <CustomCalendar />

        <h1 className="text-xl mt-10 mb-2">Hora de su Cita</h1>

        <select
          name="selectedTime"
          id=""
          className="w-full  border-2 border-black rounded-md text-center my-2 mb-6"
        >
          <option value="1">9:00 AM</option>
          <option value="2">10:00 AM</option>
        </select>
      </div>
      <h1 className="text-xl mt-10 mb-2">Su cita quedaría así:</h1>

      <div className=" w-[80%] border border-gray-900 my-6 flex flex-col p-5 rounded-md shadow-xl bg-gray-100">
        <div className="flex flex-row mb-2">
          <p>Martes 13 de Diciembre - 10:30 AM</p>
          {/* <span className="text-white bg-blue py-0.5 px-1 ml-2 rounded-lg">
                Transfer
              </span> */}
          <p className="ml-auto">
            <span className="text-green font-black">$150</span>
          </p>
        </div>
        <p>1 x Corte de cabello - ($50) = $50</p>
        <p>1 x Tinte de cabello - ($60) = $60</p>
        <p>1 x Peinado - ($40) = $40</p>
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
