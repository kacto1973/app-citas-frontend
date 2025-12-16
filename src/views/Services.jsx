import React from "react";
import { useNavigate } from "react-router-dom";

import { useEffect } from "react";
import { useState } from "react";
import {
  getServices,
  addService,
  deleteService,
} from "../../firebaseFunctions";
import database from "../../firebaseConfig";
import { ref, update, get } from "firebase/database";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

const Services = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [showImages, setShowImages] = useState(false);
  const [editing, setEditing] = useState(false);

  const [showServiceModal, setShowServiceModal] = useState(false);
  //const [showEditServiceModal, setShowEditServiceModal] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const [name, setName] = useState("");

  const [restTime, setRestTime] = useState("");

  const [duration, setDuration] = useState("");

  const [price, setPrice] = useState("");

  const [subModalOpen, setSubModalOpen] = useState(false);
  const [services, setServices] = useState([]);
  const [serviceOldName, setServiceOldName] = useState("");

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

  /*
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
  }, []); */

  useEffect(() => {
    const asyncFunc = async () => {
      const services = await getServices();
      if (services) {
        const arrayServices = Object.values(services);
        setServices(arrayServices);
      }

      setLoading(false);
    };
    asyncFunc();
  }, []);

  const handleAdd = () => {
    if (!name || restTime < 0 || restTime === "") {
      alert("Por favor llena todos los campos");
      return;
    }

    const asyncFunct = async () => {
      console.log("Agregando servicio");
    };
    asyncFunct();
  };

  const handleEdit = (service) => {
    //vamos a cargar las variables en sus inputs para ahi si guardar lo que se requiera
    setEditing(true);
    setServiceOldName(service.name);
    setName(service.name);
    setRestTime(service.restTime);
  };

  const saveEdit = () => {
    if (!name || restTime < 0 || restTime === "") {
      alert("Por favor llena todos los campos");
      return;
    }

    //vamos a guardar los cambios realizados en los inputs y a escribirlos en firebase
    const asyncFunct = async () => {
      console.log("guardando datos editados del servicio");
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

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-g10">
      {loading ? (
        <div className="absolute inset-0 bg-black  flex items-center justify-center z-20">
          <div className="bg-white p-5 rounded-md shadow-md text-center">
            <h1 className="font-black text-2xl">Cargando...</h1>
          </div>
        </div>
      ) : (
        <div className="absolute top-[7rem] w-full flex flex-col justify-center items-center ">
          {/* modales para agregar y editar servicios */}

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
                src="/images/moon_black_icon.svg"
                width={30}
                alt="moon icon"
                onClick={() => {
                  navigate("/restdays");
                }}
              />
              <p className="font-extrabold text-xs">Descansos</p>
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
                src="/images/scissors_purple_icon.svg"
                width={30}
                alt="scissors icon"
                onClick={() => {
                  navigate("/services");
                }}
              />
              <p className="font-extrabold text-xs text-g1">Servicios</p>
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

          <div
            className={`${
              showServiceModal ? "" : "hidden"
            } w-[100vw] h-[100vh] bg-black bg-opacity-50 fixed top-0 left-0 z-50 flex justify-center items-center`}
          >
            <div
              className={`overflow-y-auto flex flex-col items-center fixed w-[80%] h-[50vh] top-[50%] -translate-y-1/2 left-1/2 -translate-x-1/2  bg-white shadow-black shadow-lg rounded-[20px] transform transition-all duration-500 z-50`}
            >
              <h1 className="font-black text-black text-lg text-center my-4">
                {editing ? "Editar Servicio" : "Agregar Servicio"}
              </h1>
              <button
                onClick={() => {
                  setShowServiceModal(false);
                  setEditing(false);
                  setName("");
                  setPrice("");
                  setDuration("");
                  setRestTime("");
                }}
                className="fixed right-4 top-4 z-50 bg-red text-sm text-white py-1 px-2 rounded-md"
              >
                X
              </button>
              {/*<input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre del Servicio" className="text-center border border-black p-2 rounded-md w-[70%] my-3 mt-8"  type="text" /> 
              
              <input 
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Precio del Servicio" className="text-center border border-black  p-2 rounded-md w-[70%] my-3"  type="number" />
              
              <input
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Duración (15, 30, 45...mins)" className="text-center border border-black  p-2 rounded-md w-[70%] my-3"  type="number" />
              
              <input 
              value={restTime}
              onChange={(e) => setRestTime(e.target.value)}
              placeholder="T. Descanso (0, 15, 30...mins)" className="text-center border border-black  p-2 rounded-md w-[70%] my-3"  type="number" />


              */}
              <TextField
                value={name}
                size="small"
                margin="normal"
                onChange={(e) => setName(e.target.value)}
                id="outlined-basic"
                label="Nombre del Servicio"
                className="w-[70%] my-3 mt-10"
                variant="outlined"
              />

              <TextField
                value={price}
                size="small"
                margin="normal"
                onChange={(e) => setPrice(e.target.value)}
                id="outlined-basic"
                label="Precio del Servicio"
                className="w-[70%] my-3"
                variant="outlined"
              />

              <TextField
                value={duration}
                size="small"
                margin="normal"
                onChange={(e) => setDuration(e.target.value)}
                id="outlined-basic"
                label="Duración (15, 30, 45...mins)"
                className="w-[70%] my-3"
                variant="outlined"
              />

              <TextField
                value={restTime}
                size="small"
                margin="normal"
                onChange={(e) => setRestTime(e.target.value)}
                id="outlined-basic"
                label="T. Descanso (0, 15, 30...mins)"
                className="w-[70%] my-3"
                variant="outlined"
              />

              <button
                onClick={editing ? saveEdit : handleAdd}
                className="bg-g1 text-white py-2 px-4 rounded-md my-4"
              >
                Confirmar
              </button>
            </div>
          </div>

          <h1 className="text-lg font-black w-[90%] text-black mb-8 text-center">
            Servicios
          </h1>

          <div className="w-[90%] flex  items-center justify-between mb-4">
            {/* Barra de búsqueda */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // Actualizamos el estado con lo que escribe el usuario
              placeholder="Buscar por nombre..."
              className="text-center shadow-md p-2 rounded-md mb-4 w-[70%]"
            />

            <img
              src="/images/plus.png"
              width={50}
              className="mb-2"
              alt="plus icon"
              onClick={() => {
                setShowServiceModal(true);
              }}
            />
          </div>

          <div className="overflow-x-auto w-[90%] rounded-2xl  mb-[8rem]">
            <table className="min-w-full table-auto border-collapse rounded-2xl">
              <thead className="bg-g1">
                <tr>
                  <th className="px-4 py-2 border text-center text-white">
                    Nombre
                  </th>
                  <th className="px-4 py-2 border text-center text-white">
                    Tiempo Descanso
                  </th>

                  <th className="px-4 py-2 border text-center text-white">
                    Duración
                  </th>

                  <th className="px-4 py-2 border text-center text-white">
                    Precio
                  </th>

                  <th className="px-4 py-2 border text-center text-white">
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody>
                {services &&
                  services.length > 0 &&
                  services
                    .filter((service) => {
                      if (searchQuery === "") {
                        return service;
                      } else if (
                        service.name
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase())
                      ) {
                        return service;
                      }
                    })
                    .map((service) => {
                      console.log("hola desde servicios`");
                      console.log("SERVICIO", service);
                      return (
                        <tr className="bg-white">
                          <td className="px-4 py-2 border">{service.name}</td>
                          <td className="px-4 py-2 border">
                            {service.restTime}
                          </td>

                          <td className="px-4 py-2 border">
                            {service.duration}
                          </td>
                          <td className="px-4 py-2 border">{service.price}</td>

                          <td className="border">
                            <div className="flex justify-evenly">
                              <button
                                onClick={() => {
                                  handleEdit(service);
                                  setShowServiceModal(true);
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
        </div>
      )}
    </div>
  );
};

export default Services;
