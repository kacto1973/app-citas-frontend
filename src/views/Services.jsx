import React from "react";
import { useNavigate } from "react-router-dom";

import { useEffect, useContext } from "react";
import { useState } from "react";
import {
  getServices,
  getExtraServices,
  addService,
  deleteService,
  addExtraService,
  deleteExtraService,
} from "../../firebaseFunctions";
import database from "../../firebaseConfig";
import { ref, update, get } from "firebase/database";
import { TrialContext } from "../context/TrialContext";

const Services = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const { isTrialExpired } = useContext(TrialContext); // Accedemos al contexto

  useEffect(() => {
    if (isTrialExpired) {
      navigate("/trialexpired"); // Redirigir de forma imperativa
    }
  }, [isTrialExpired]); // El efecto solo se ejecutará cuando `isTrialExpired` cambie
  const [showImages, setShowImages] = useState(false);
  const [editing, setEditing] = useState(false);
  const [extraEditing, setExtraEditing] = useState(false);

  const [hairLengthNeeded, setHairLengthNeeded] = useState(false);

  const [name, setName] = useState("");
  const [extraName, setExtraName] = useState("");

  const [restTime, setRestTime] = useState(0);
  const [extraRestTime, setExtraRestTime] = useState(0);

  const [duration, setDuration] = useState("");
  const [extraDuration, setExtraDuration] = useState("");

  const [price, setPrice] = useState("");
  const [extraPrice, setExtraPrice] = useState("");

  const [shortDuration, setShortDuration] = useState(""); // Duración corta
  const [mediumDuration, setMediumDuration] = useState(""); // Duración media
  const [longDuration, setLongDuration] = useState(""); // Duración larga

  const [shortPrice, setShortPrice] = useState(""); // Precio corto
  const [mediumPrice, setMediumPrice] = useState(""); // Precio medio
  const [longPrice, setLongPrice] = useState(""); // Precio largo

  const [services, setServices] = useState([]);
  const [extraServices, setExtraServices] = useState([]);

  const [serviceOldName, setServiceOldName] = useState("");
  const [extraServiceOldName, setExtraServiceOldName] = useState("");

  const handleToggle = () => {
    setShowImages((prev) => !prev);
    onToggle(!showImages);
  };

  const onToggle = (value) => {
    const businessID = localStorage.getItem("businessID").toLowerCase();
    const showImagesRef = ref(database, `businesses/${businessID}/settings/`);
    update(showImagesRef, {
      showImages: value,
    });
  };

  // Función para manejar el cambio en los radio buttons
  const handleChange = (event) => {
    // Si el valor del radio button es "si", establecemos true, si es "no", establecemos false
    if (event.target.value === "si") {
      setHairLengthNeeded(true);
    } else {
      setHairLengthNeeded(false);
    }
  };

  useEffect(() => {
    const businessID = localStorage.getItem("businessID").toLowerCase();
    const showImagesRef = ref(
      database,
      `businesses/${businessID}/settings/showImages`
    );

    const asyncFunc = async () => {
      const showImagesSnap = await get(showImagesRef);
      if (showImagesSnap.exists()) {
        setShowImages(showImagesSnap.val());
        console.log(showImagesSnap.val());
      }
    };
    asyncFunc();
  }, []);

  useEffect(() => {
    const asyncFunc = async () => {
      const services = await getServices();
      const extraServices = await getExtraServices();
      if (services) {
        const arrayServices = Object.values(services);
        setServices(arrayServices);
      }
      if (extraServices) {
        const arrayExtraServices = Object.values(extraServices);
        setExtraServices(arrayExtraServices);
      }
      setLoading(false);
    };
    asyncFunc();
  }, []);

  useEffect(() => {
    console.log(services);
    console.log(extraServices);
  }, [services, extraServices]);

  const handleAdd = () => {
    if (!name || restTime < 0 || restTime === "") {
      alert("Por favor llena todos los campos");
      return;
    }

    if (hairLengthNeeded) {
      if (
        !shortDuration ||
        !mediumDuration ||
        !longDuration ||
        !shortPrice ||
        !mediumPrice ||
        !longPrice
      ) {
        alert("Por favor llena todos los campos");
        return;
      }
    } else {
      if (!duration || !price) {
        alert("Por favor llena todos los campos");
        return;
      }
    }

    if (hairLengthNeeded) {
      if (
        shortDuration <= 0 ||
        mediumDuration <= 0 ||
        longDuration <= 0 ||
        shortPrice <= 0 ||
        mediumPrice <= 0 ||
        longPrice <= 0
      ) {
        alert(
          "Por favor llena todos los campos de duraciones y precios con valores mayores a 0"
        );
        return;
      }
    } else {
      if (duration <= 0 || price <= 0) {
        alert(
          "Por favor llena todos los campos de duraciones y precios con valores mayores a 0"
        );
        return;
      }
    }

    if (hairLengthNeeded) {
      if (
        restTime % 15 !== 0 ||
        shortDuration % 15 !== 0 ||
        mediumDuration % 15 !== 0 ||
        longDuration % 15 !== 0
      ) {
        alert(
          "Los tiempos deben ser múltiplos de 15 (duraciones y descanso | 15, 30, 45, 60, ...)"
        );
        return;
      }
    } else {
      if (restTime % 15 !== 0 || duration % 15 !== 0) {
        alert(
          "Los tiempos deben ser múltiplos de 15 (duraciones y descanso | 15, 30, 45, 60, ...)"
        );
        return;
      }
    }

    const asyncFunct = async () => {
      console.log("Agregando servicio");
      if (hairLengthNeeded) {
        const newService = {
          name: name,
          hairLength: hairLengthNeeded,
          restTime: Number(restTime),
          durationShort: Number(shortDuration),
          durationMedium: Number(mediumDuration),
          durationLong: Number(longDuration),
          priceShort: Number(shortPrice),
          priceMedium: Number(mediumPrice),
          priceLong: Number(longPrice),
        };

        await addService(newService);
      } else {
        const newService = {
          name: name,
          hairLength: hairLengthNeeded,
          restTime: Number(restTime),
          duration: Number(duration),
          price: Number(price),
        };

        await addService(newService);
      }
    };
    asyncFunct();
  };

  const handleEdit = (service) => {
    //vamos a cargar las variables en sus inputs para ahi si guardar lo que se requiera
    setEditing(true);
    setServiceOldName(service.name);
    if (service.hairLength) {
      setHairLengthNeeded(true);
      setShortDuration(service.durationShort);
      setMediumDuration(service.durationMedium);
      setLongDuration(service.durationLong);
      setShortPrice(service.priceShort);
      setMediumPrice(service.priceMedium);
      setLongPrice(service.priceLong);
    } else {
      setHairLengthNeeded(false);
      setDuration(service.duration);
      setPrice(service.price);
    }
    setName(service.name);
    setRestTime(service.restTime);
  };

  const saveEdit = () => {
    if (!name || restTime < 0 || restTime === "") {
      alert("Por favor llena todos los campos");
      return;
    }

    if (hairLengthNeeded) {
      if (
        !shortDuration ||
        !mediumDuration ||
        !longDuration ||
        !shortPrice ||
        !mediumPrice ||
        !longPrice
      ) {
        alert("Por favor llena todos los campos");
        return;
      }
    } else {
      if (!duration || !price) {
        alert("Por favor llena todos los campos");
        return;
      }
    }

    if (hairLengthNeeded) {
      if (
        shortDuration <= 0 ||
        mediumDuration <= 0 ||
        longDuration <= 0 ||
        shortPrice <= 0 ||
        mediumPrice <= 0 ||
        longPrice <= 0
      ) {
        alert(
          "Por favor llena todos los campos de duraciones y precios con valores mayores a 0"
        );
        return;
      }
    } else {
      if (duration <= 0 || price <= 0) {
        alert(
          "Por favor llena todos los campos de duraciones y precios con valores mayores a 0"
        );
        return;
      }
    }

    if (hairLengthNeeded) {
      if (
        restTime % 15 !== 0 ||
        shortDuration % 15 !== 0 ||
        mediumDuration % 15 !== 0 ||
        longDuration % 15 !== 0
      ) {
        alert(
          "Los tiempos deben ser múltiplos de 15 (duraciones y descanso | 15, 30, 45, 60, ...)"
        );
        return;
      }
    } else {
      if (restTime % 15 !== 0 || duration % 15 !== 0) {
        alert(
          "Los tiempos deben ser múltiplos de 15 (duraciones y descanso | 15, 30, 45, 60, ...)"
        );
        return;
      }
    }

    //vamos a guardar los cambios realizados en los inputs y a escribirlos en firebase
    const asyncFunct = async () => {
      console.log("guardando datos editados del servicio");
      if (hairLengthNeeded) {
        const newService = {
          name: name,
          hairLength: hairLengthNeeded,
          restTime: Number(restTime),
          durationShort: Number(shortDuration),
          durationMedium: Number(mediumDuration),
          durationLong: Number(longDuration),
          priceShort: Number(shortPrice),
          priceMedium: Number(mediumPrice),
          priceLong: Number(longPrice),
        };

        await addService(newService, serviceOldName);
      } else {
        const newService = {
          name: name,
          hairLength: hairLengthNeeded,
          restTime: Number(restTime),
          duration: Number(duration),
          price: Number(price),
        };

        await addService(newService, serviceOldName);
      }
    };
    asyncFunct();
  };

  const handleDelete = (service) => {
    console.log("Borrando servicio");

    const asyncFunct = async () => {
      await deleteService(service);
    };

    asyncFunct();
  };

  //////////////////////////////////////// Servicios Extra ////////////////////////////////////////

  const handleExtraAdd = () => {
    if (
      !extraName ||
      extraRestTime < 0 ||
      extraRestTime === "" ||
      !extraDuration ||
      !extraPrice
    ) {
      alert("Por favor llena todos los campos");
      return;
    }

    if (extraRestTime < 0 || extraDuration <= 0 || extraPrice <= 0) {
      alert(
        "Por favor llena todos los campos de duraciones y precios con valores mayores a 0"
      );
      return;
    }

    if (extraRestTime % 15 !== 0 || extraDuration % 15 !== 0) {
      alert(
        "Los tiempos deben ser múltiplos de 15 (duraciones y descanso | 15, 30, 45, 60, ...)"
      );
      return;
    }

    const asyncFunct = async () => {
      console.log("Agregando servicio extra");
      const newExtraService = {
        name: extraName,
        restTime: Number(extraRestTime),
        duration: Number(extraDuration),
        price: Number(extraPrice),
      };

      await addExtraService(newExtraService);
    };
    asyncFunct();
  };

  const handleExtraEdit = (extraService) => {
    setExtraEditing(true);
    setExtraServiceOldName(extraService.name);
    setExtraName(extraService.name);
    setExtraRestTime(extraService.restTime);
    setExtraDuration(extraService.duration);
    setExtraPrice(extraService.price);
  };

  const saveExtraEdit = () => {
    if (
      !extraName ||
      extraRestTime < 0 ||
      extraRestTime === "" ||
      !extraDuration ||
      !extraPrice
    ) {
      alert("Por favor llena todos los campos");
      return;
    }

    if (extraRestTime < 0 || extraDuration <= 0 || extraPrice <= 0) {
      alert(
        "Por favor llena todos los campos de duraciones y precios con valores mayores a 0"
      );
      return;
    }

    if (extraRestTime % 15 !== 0 || extraDuration % 15 !== 0) {
      alert(
        "Los tiempos deben ser múltiplos de 15 (duraciones y descanso | 15, 30, 45, 60, ...)"
      );
      return;
    }

    const asyncFunct = async () => {
      console.log("guardando datos editados del servicio extra");
      const newExtraService = {
        name: extraName,
        restTime: Number(extraRestTime),
        duration: Number(extraDuration),
        price: Number(extraPrice),
      };

      await addExtraService(newExtraService, extraServiceOldName);
    };
    asyncFunct();
  };

  const handleExtraDelete = (extraService) => {
    console.log("Borrando servicio extra");

    const asyncFunct = async () => {
      await deleteExtraService(extraService);
    };

    asyncFunct();
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-strblue">
      {loading ? (
        <div className="absolute inset-0 bg-black  flex items-center justify-center z-20">
          <div className="bg-white p-5 rounded-md shadow-md text-center">
            <h1 className="font-black text-2xl">Cargando...</h1>
          </div>
        </div>
      ) : (
        <>
          <h1 className="text-2xl text-white font-black mt-10 mb-5">
            Menú de Servicios
          </h1>
          <div className="w-full flex flex-col items-center justify-center">
            <div className="flex w-full items-center justify-center">
              <input
                type="text"
                className="mx-3 text-black w-[160px] border border-gray-400 text-center p-1 rounded-md"
                placeholder="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type="number"
                className="mx-3 text-black w-[160px] border border-gray-400 text-center p-1 rounded-md"
                placeholder="Tiempo Descanso"
                value={restTime}
                onChange={(e) => setRestTime(e.target.value)}
                required
              />
            </div>

            <form>
              <div className="my-4 flex flex-col items-center justify-center">
                <label className="block text-sm font-medium text-white">
                  ¿Requiere saber longitud de cabello?
                </label>
                <div className="flex items-center space-x-6">
                  <label className="flex items-center text-white">
                    <input
                      type="radio"
                      id="si"
                      name="respuesta"
                      value="si"
                      checked={hairLengthNeeded === true}
                      onChange={handleChange}
                      className="mr-2 text-white"
                    />
                    Sí
                  </label>

                  <label className="flex items-center text-white">
                    <input
                      type="radio"
                      id="no"
                      name="respuesta"
                      value="no"
                      checked={hairLengthNeeded === false} // Si el estado es false, se selecciona "No"
                      onChange={handleChange}
                      className="mr-2 text-white"
                    />
                    No
                  </label>
                </div>
              </div>
            </form>
          </div>{" "}
          {/**esta parte de arriba se queda siempre lo que cambia es lo de abajp */}
          <div>
            {hairLengthNeeded ? (
              <>
                <div className="flex w-full items-center justify-center">
                  <div className="flex flex-col items-center justify-center mb-3 mx-3">
                    <h1 className="mb-3 text-white font-black">Duraciones</h1>
                    <input
                      type="number"
                      className="mb-3 text-black w-[160px] border border-gray-400 text-center p-1 rounded-md"
                      placeholder="Corto"
                      value={shortDuration}
                      onChange={(e) => setShortDuration(e.target.value)}
                      required
                    />
                    <input
                      type="number"
                      className="mb-3 text-black w-[160px] border border-gray-400 text-center p-1 rounded-md"
                      placeholder="Mediano"
                      value={mediumDuration}
                      onChange={(e) => setMediumDuration(e.target.value)}
                    />
                    <input
                      type="number"
                      className="mb-3 text-black w-[160px] border border-gray-400 text-center p-1 rounded-md"
                      placeholder="Largo"
                      value={longDuration}
                      onChange={(e) => setLongDuration(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col items-center justify-center mb-3 mx-3">
                    <h1 className="mb-3 text-white font-black">Precios</h1>
                    <input
                      type="number"
                      className="mb-3 text-black w-[160px] border border-gray-400 text-center p-1 rounded-md"
                      placeholder="Corto"
                      value={shortPrice}
                      onChange={(e) => setShortPrice(e.target.value)}
                    />
                    <input
                      type="number"
                      className="mb-3 text-black w-[160px] border border-gray-400 text-center p-1 rounded-md"
                      placeholder="Mediano"
                      value={mediumPrice}
                      onChange={(e) => setMediumPrice(e.target.value)}
                    />
                    <input
                      type="number"
                      className="mb-3 text-black w-[160px] border border-gray-400 text-center p-1 rounded-md"
                      placeholder="Largo"
                      value={longPrice}
                      onChange={(e) => setLongPrice(e.target.value)}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex w-full items-center justify-center mb-3">
                  <input
                    type="number"
                    className="mx-3 text-black w-[160px] border border-gray-400 text-center p-1 rounded-md"
                    placeholder="Duración"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  />
                  <input
                    type="number"
                    className="mx-3 text-black w-[160px] border border-gray-400 text-center p-1 rounded-md"
                    placeholder="Precio"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
          {editing ? (
            <button
              className="px-2 py-1 rounded-md my-5 bg-green text-white"
              onClick={saveEdit}
            >
              Guardar Editado
            </button>
          ) : (
            <button
              className="px-2 py-1 rounded-md my-5 mb-10 bg-blue text-white"
              onClick={handleAdd}
            >
              Agregar Servicio
            </button>
          )}
          <div className="overflow-x-auto w-[90%] rounded-md mb-10">
            <table className="min-w-full table-auto border-collapse">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2 border text-left">Nombre</th>
                  <th className="px-4 py-2 border text-left">
                    Tiempo Descanso
                  </th>
                  <th className="px-4 py-2 border text-left">
                    Longitud Cabello
                  </th>
                  <th className="px-4 py-2 border text-left">Duración</th>
                  <th className="px-4 py-2 border text-left">Duración Corta</th>
                  <th className="px-4 py-2 border text-left">
                    Duración Mediana
                  </th>
                  <th className="px-4 py-2 border text-left">Duración Larga</th>
                  <th className="px-4 py-2 border text-left">Precio</th>
                  <th className="px-4 py-2 border text-left">Precio Corto</th>
                  <th className="px-4 py-2 border text-left">Precio Mediano</th>
                  <th className="px-4 py-2 border text-left">Precio Largo</th>
                  <th className="px-4 py-2 border text-left">Acción</th>
                </tr>
              </thead>
              <tbody>
                {services &&
                  services.length > 0 &&
                  services.map((service) => {
                    console.log("hola desde servicios`");
                    console.log("SERVICIO", service);
                    return (
                      <tr className="bg-white">
                        <td className="px-4 py-2 border">{service.name}</td>
                        <td className="px-4 py-2 border">{service.restTime}</td>
                        <td className="px-4 py-2 border">
                          {service.hairLength ? "Sí" : "No"}
                        </td>
                        {service.hairLength ? (
                          <>
                            <td className="px-4 py-2 border ">N/A</td>
                            <td className="px-4 py-2 border">
                              {service.durationShort}
                            </td>
                            <td className="px-4 py-2 border">
                              {service.durationMedium}
                            </td>
                            <td className="px-4 py-2 border">
                              {service.durationLong}
                            </td>
                            <td className="px-4 py-2 border ">N/A</td>
                            <td className="px-4 py-2 border">
                              {service.priceShort}
                            </td>
                            <td className="px-4 py-2 border">
                              {service.priceMedium}
                            </td>
                            <td className="px-4 py-2 border">
                              {service.priceLong}
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-4 py-2 border">
                              {service.duration}
                            </td>
                            <td className="px-4 py-2 border">N/A</td>
                            <td className="px-4 py-2 border">N/A</td>
                            <td className="px-4 py-2 border">N/A</td>
                            <td className="px-4 py-2 border">
                              {service.price}
                            </td>
                            <td className="px-4 py-2 border">N/A</td>
                            <td className="px-4 py-2 border">N/A</td>
                            <td className="px-4 py-2 border">N/A</td>
                          </>
                        )}
                        <td className="border">
                          <div className="flex justify-evenly">
                            <button
                              onClick={() => {
                                handleEdit(service);
                              }}
                              className="px-2 py-1 rounded-md bg-yellow text-white m-3"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => {
                                const userConfirm = confirm(
                                  `¿Estás seguro de querer borrar: ${service.name}?`
                                );
                                if (userConfirm) {
                                  handleDelete(service);
                                }
                              }}
                              className="px-2 py-1 rounded-md bg-red text-white m-3"
                            >
                              Borrar
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
          <h1 className="text-2xl text-white font-black mt-10 mb-5">
            Menú de Servicios Extras
          </h1>
          {/*<div className="w-full flex flex-col items-center justify-center">
        <div className="flex w-full items-center justify-center">
          <input
            type="text"
            className="mx-3 text-black w-[160px] border border-gray-400 text-center p-1 rounded-md"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="number"
            className="mx-3 text-black w-[160px] border border-gray-400 text-center p-1 rounded-md"
            placeholder="Tiempo Descanso"
            value={restTime}
            onChange={(e) => setRestTime(e.target.value)}
            required
          />
        </div>

        <form>
          <div className="my-4 flex flex-col items-center justify-center">
            <label className="block text-sm font-medium text-gray-700">
              ¿Requiere saber longitud de cabello?
            </label>
            <div className="flex items-center space-x-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  id="si"
                  name="respuesta"
                  value="si"
                  checked={hairLengthNeeded === true}
                  onChange={handleChange}
                  className="mr-2"
                />
                Sí
              </label>

              <label className="flex items-center">
                <input
                  type="radio"
                  id="no"
                  name="respuesta"
                  value="no"
                  checked={hairLengthNeeded === false} // Si el estado es false, se selecciona "No"
                  onChange={handleChange}
                  className="mr-2"
                />
                No
              </label>
            </div>
          </div>
        </form>
      </div>{" "} */}
          <div className="w-full flex flex-col items-center justify-center">
            <div className="flex w-full items-center justify-center mb-3">
              <input
                type="text"
                className="mx-3 text-black w-[160px] border border-gray-400 text-center p-1 rounded-md"
                placeholder="Nombre"
                value={extraName}
                onChange={(e) => setExtraName(e.target.value)}
                required
              />
              <input
                type="number"
                className="mx-3 text-black w-[160px] border border-gray-400 text-center p-1 rounded-md"
                placeholder="Tiempo Descanso"
                value={extraRestTime}
                onChange={(e) => setExtraRestTime(e.target.value)}
                required
              />
            </div>
            <div className="flex w-full items-center justify-center mb-3">
              <input
                type="number"
                className="mx-3 text-black w-[160px] border border-gray-400 text-center p-1 rounded-md"
                placeholder="Duración"
                value={extraDuration}
                onChange={(e) => setExtraDuration(e.target.value)}
                required
              />
              <input
                type="number"
                className="mx-3 text-black w-[160px] border border-gray-400 text-center p-1 rounded-md"
                placeholder="Precio"
                value={extraPrice}
                onChange={(e) => setExtraPrice(e.target.value)}
                required
              />
            </div>
          </div>
          {extraEditing ? (
            <button
              className="px-2 py-1 rounded-md my-5 bg-green text-white"
              onClick={saveExtraEdit}
            >
              Guardar Editado Extra
            </button>
          ) : (
            <button
              className="px-2 py-1 rounded-md my-5 bg-blue text-white"
              onClick={handleExtraAdd}
            >
              Agregar Servicio Extra
            </button>
          )}
          <div className="overflow-x-auto w-[90%] rounded-md mb-10">
            <table className="min-w-full table-auto border-collapse">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2 border text-left">Nombre</th>
                  <th className="px-4 py-2 border text-left">
                    Tiempo Descanso
                  </th>
                  <th className="px-4 py-2 border text-left">Duración</th>
                  <th className="px-4 py-2 border text-left">Precio</th>
                  <th className="px-4 py-2 border text-left">Acción</th>
                </tr>
              </thead>
              <tbody>
                {extraServices &&
                  extraServices.length > 0 &&
                  extraServices.map((extraService) => (
                    <tr className="bg-white">
                      <td className="px-4 py-2 border">{extraService.name}</td>
                      <td className="px-4 py-2 border">
                        {extraService.restTime}
                      </td>
                      <td className="px-4 py-2 border">
                        {extraService.duration}
                      </td>
                      <td className="px-4 py-2 border">{extraService.price}</td>
                      <td className="border">
                        <div className="flex justify-evenly">
                          <button
                            onClick={() => {
                              handleExtraEdit(extraService);
                            }}
                            className="px-2 py-1 rounded-md bg-yellow text-white m-3"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => {
                              const userConfirm = confirm(
                                `¿Estás seguro de querer borrar: ${extraService.name}?`
                              );
                              if (userConfirm) {
                                handleExtraDelete(extraService);
                              }
                            }}
                            className="px-2 py-1 rounded-md bg-red text-white m-3"
                          >
                            Borrar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="text-center flex flex-col items-center justify-center">
            <h1 className="text-2xl text-white font-black mt-10 mb-3">
              Imágenes de Referencia
            </h1>
            <div className="flex mt-5 mb-12">
              <span className="text-white mr-5">
                Mostrar imágenes de referencia al cliente
              </span>
              <input
                type="checkbox"
                checked={showImages}
                onChange={() => {
                  const confirm = window.confirm(
                    "¿Estás seguro de querer cambiar la referencia de imágenes?"
                  );

                  if (confirm) {
                    handleToggle();
                  }
                }}
                className="form-checkbox"
              />
            </div>
            {showImages && (
              <div className="relative h-[150px] pt-10  mb-10  bg-white rounded-md w-[90%]">
                <p className="absolute top-4 left-8 font-black">Corto</p>
                <img
                  className="absolute left-[6%]"
                  src="src/assets/images/short.png"
                  alt="shortHair"
                  width={80}
                />
                <p className="absolute top-4 left-[41%] font-black">Mediano</p>
                <img
                  className="absolute right-[35%]"
                  src="src/assets/images/medium.png"
                  alt="shortHair"
                  width={75}
                />
                <p className="absolute top-4 right-[10%] font-black">Largo</p>
                <img
                  className="absolute right-0"
                  src="src/assets/images/long.png"
                  alt="shortHair"
                  width={100}
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Services;
