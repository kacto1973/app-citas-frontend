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
  const [userOrders, setUserOrders] = useState([]); //cada objeto service es una card
  //const [userExtraServices, setUserExtraServices] = useState([]);

  //variables
  const [totalCost, setTotalCost] = useState(0);

  //useEffect
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

  useEffect(() => {
    console.log(userOrders);
  }, [userOrders]);

  //funciones

  const addService = () => {
    const orderObject = {
      serviceName: "", //nombre del servicio
      restTime: 0, //tiempo de descanso
      hairLength: "", //dependiendo de si es true o false cambian price y duration
      price: 0,
      priceShort: 0,
      priceMedium: 0,
      priceLong: 0,
      duration: 0,
      durationShort: 0,
      durationMedium: 0,
      durationLong: 0,
    };

    setUserOrders([...userOrders, orderObject]);
  };

  const updateUserOrdersArray = ({ serviceName, orderIndex }) => {
    const updatedUserOrders = [...userOrders];
    const orderObject = userOrders.find((order, id) => id === orderIndex);
    const serviceObject = servicesArray.find(
      (service) => service.name === serviceName
    );
    orderObject.serviceName = serviceObject.name;
    orderObject.restTime = serviceObject.restTime;
    orderObject.hairLength = serviceObject.hairLength;
    if (orderObject.hairLength) {
      orderObject.priceShort = serviceObject.priceShort;
      orderObject.priceMedium = serviceObject.priceMedium;
      orderObject.priceLong = serviceObject.priceLong;
      orderObject.durationShort = serviceObject.durationShort;
      orderObject.durationMedium = serviceObject.durationMedium;
      orderObject.durationLong = serviceObject.durationLong;
    } else {
      orderObject.price = serviceObject.price;
      orderObject.duration = serviceObject.duration;
    }

    updatedUserOrders[orderIndex] = orderObject;
    setUserOrders(updatedUserOrders);

    // const orderObject = {
    //   serviceName: "", //nombre del servicio
    //   restTime: 0, //tiempo de descanso
    //   hairLength: "", //dependiendo de si es true o false cambian price y duration
    //   price: 0,
    //   duration: 0,
    // };
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center">
      <h1 className="text-2xl font-black mt-10 mb-2 text-center">
        AGENDADOR DE CITAS
      </h1>

      <div className="flex flex-col justify-center items-center w-[65%]">
        {userOrders.map((orderObject, orderIndex) => {
          return (
            <div
              id={orderIndex}
              className="relative w-[100%] border border-gray-900 mt-6 mb-2 flex flex-col p-5 rounded-md shadow-xl bg-gray-100"
            >
              <p>
                Seleccione el servicio que desee (
                <span className="text-red">*</span>)
              </p>
              <select
                onChange={(e) => updateUserOrdersArray(e.value, orderIndex)}
                name="serviceName"
                id=""
                className="w-full border-2 border-black rounded-md text-center my-2 mb-6"
              >
                {/* <option value="1">Corte de cabello</option> */}
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
              <p>
                Seleccione la longitud de su cabello (
                <span className="text-red">*</span>)
              </p>
              <select
                name="serviceName"
                id=""
                className="w-full  border-2 border-black rounded-md text-center my-2 mb-6"
              >
                <option value="short">Corto</option>
                <option value="medium">Mediano</option>
                <option value="long">Largo</option>
              </select>
              <p>¿Algún servicio extra?</p>
              <select
                name="serviceName"
                id=""
                className="w-full  border-2 border-black rounded-md text-center my-2 mb-6"
              >
                {extraServicesArray.map((extraService, index) => {
                  return (
                    <option id={index} value={extraService.name}>
                      {extraService.name}
                    </option>
                  );
                })}
              </select>
            </div>
          );
        })}

        <h1 className="text-xl mt-6 ">
          Costo Total:{" "}
          <span className="text-green font-black">${totalCost}</span>
        </h1>
        <button
          onClick={addService}
          className="px-2 py-1 rounded-md my-5 bg-blue text-white w-[140px]"
        >
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
