import React from "react";
import CustomCalendar from "../components/CustomCalendar";
import { useState, useEffect } from "react";
import { getServices, getExtraServices } from "../../firebaseFunctions";

const AppointmentMaker = () => {
  //use states
  const [servicesLoaded, setServicesLoaded] = useState(false);
  const [extraServicesLoaded, setExtraServicesLoaded] = useState(false);

  //estos son los arrays que contienen Todos los servicios en general
  const [servicesArray, setServicesArray] = useState([]);
  const [extraServicesArray, setExtraServicesArray] = useState([]);

  //estos son los arrays que contienen los servicios que el USUARIO quiere
  const [userServices, setUserServices] = useState([]);
  const [userExtraServices, setUserExtraServices] = useState([]);

  //useEffect
  useEffect(() => {
    const fetchServices = async () => {
      const services = await getServices();
      if (services) {
        setServicesArray(services);
        setServicesLoaded(true);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    const fetchExtraServices = async () => {
      const extraServices = await getExtraServices();
      if (extraServices) {
        setExtraServicesArray(extraServices);
        setExtraServicesLoaded(true);
      }
    };
    fetchExtraServices();
  }, []);

  useEffect(() => {
    if (servicesLoaded) {
      console.log(servicesArray);
    }
  }, [servicesLoaded]);

  useEffect(() => {
    if (extraServicesLoaded) {
      console.log(extraServicesArray);
    }
  }, [extraServicesLoaded]);

  //funciones

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

        <h1 className="text-xl mt-6 ">
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
