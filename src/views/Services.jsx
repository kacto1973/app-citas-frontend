import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { getServices, getExtraServices } from "../../firebaseFunctions";

const Services = () => {
  const [editing, setEditing] = useState(false);

  const [hairLengthNeeded, setHairLengthNeeded] = useState(false);
  const [name, setName] = useState("");
  const [restTime, setRestTime] = useState("");

  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");

  const [shortDuration, setShortDuration] = useState(""); // Duración corta
  const [mediumDuration, setMediumDuration] = useState(""); // Duración media
  const [longDuration, setLongDuration] = useState(""); // Duración larga

  const [shortPrice, setShortPrice] = useState(""); // Precio corto
  const [mediumPrice, setMediumPrice] = useState(""); // Precio medio
  const [longPrice, setLongPrice] = useState(""); // Precio largo

  const [services, setServices] = useState([]);
  const [extraServices, setExtraServices] = useState([]);

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
    };
    asyncFunc();
  }, []);

  useEffect(() => {
    console.log(services);
  }, [services]);

  const handleAdd = () => {
    console.log("Agregando servicio");
  };

  const handleEdit = () => {
    console.log("Editando servicio");
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center">
      <h1 className="text-2xl font-black mt-10 mb-5">Menú de Servicios</h1>
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
            type="text"
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
      </div>{" "}
      {/**esta parte de arriba se queda siempre lo que cambia es lo de abajp */}
      <div>
        {hairLengthNeeded ? (
          <>
            <div className="flex w-full items-center justify-center">
              <div className="flex flex-col items-center justify-center mb-3 mx-3">
                <h1 className="mb-3">Duraciones</h1>
                <input
                  type="text"
                  className="mb-3 text-black w-[160px] border border-gray-400 text-center p-1 rounded-md"
                  placeholder="Corto"
                  value={shortDuration}
                  onChange={(e) => setShortDuration(e.target.value)}
                  required
                />
                <input
                  type="text"
                  className="mb-3 text-black w-[160px] border border-gray-400 text-center p-1 rounded-md"
                  placeholder="Mediano"
                  value={mediumDuration}
                  onChange={(e) => setMediumDuration(e.target.value)}
                />
                <input
                  type="text"
                  className="mb-3 text-black w-[160px] border border-gray-400 text-center p-1 rounded-md"
                  placeholder="Largo"
                  value={longDuration}
                  onChange={(e) => setLongDuration(e.target.value)}
                />
              </div>
              <div className="flex flex-col items-center justify-center mb-3 mx-3">
                <h1 className="mb-3">Precios</h1>
                <input
                  type="text"
                  className="mb-3 text-black w-[160px] border border-gray-400 text-center p-1 rounded-md"
                  placeholder="Corto"
                  value={shortPrice}
                  onChange={(e) => setShortPrice(e.target.value)}
                />
                <input
                  type="text"
                  className="mb-3 text-black w-[160px] border border-gray-400 text-center p-1 rounded-md"
                  placeholder="Mediano"
                  value={mediumPrice}
                  onChange={(e) => setMediumPrice(e.target.value)}
                />
                <input
                  type="text"
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
                type="text"
                className="mx-3 text-black w-[160px] border border-gray-400 text-center p-1 rounded-md"
                placeholder="Duración"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
              <input
                type="text"
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
          onClick={handleEdit}
        >
          Guardar Editado
        </button>
      ) : (
        <button
          className="px-2 py-1 rounded-md my-5 bg-blue text-white"
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
              <th className="px-4 py-2 border text-left">Tiempo Descanso</th>
              <th className="px-4 py-2 border text-left">Longitud Cabello</th>
              <th className="px-4 py-2 border text-left">Duración</th>
              <th className="px-4 py-2 border text-left">Duración Corta</th>
              <th className="px-4 py-2 border text-left">Duración Mediana</th>
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
                        <td className="px-4 py-2 border bg-black">No aplica</td>
                        <td className="px-4 py-2 border">
                          {service.durationShort}
                        </td>
                        <td className="px-4 py-2 border">
                          {service.durationMedium}
                        </td>
                        <td className="px-4 py-2 border">
                          {service.durationLong}
                        </td>
                        <td className="px-4 py-2 border bg-black">No aplica</td>
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
                        <td className="px-4 py-2 border">{service.duration}</td>
                        <td className="px-4 py-2 border bg-black">No aplica</td>
                        <td className="px-4 py-2 border bg-black">No aplica</td>
                        <td className="px-4 py-2 border bg-black">No aplica</td>
                        <td className="px-4 py-2 border">{service.price}</td>
                        <td className="px-4 py-2 border bg-black">No aplica</td>
                        <td className="px-4 py-2 border bg-black">No aplica</td>
                        <td className="px-4 py-2 border bg-black">No aplica</td>
                      </>
                    )}
                    <td className="border">
                      <div className="flex justify-evenly">
                        <button className="px-2 py-1 rounded-md bg-yellow text-white m-3">
                          Editar
                        </button>
                        <button className="px-2 py-1 rounded-md bg-red text-white m-3">
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
      <h1 className="text-2xl font-black mt-10 mb-5">
        Menú de Servicios Extras
      </h1>
      <div className="overflow-x-auto w-[90%] rounded-md mb-10">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 border text-left">Color</th>
              <th className="px-4 py-2 border text-left">Duration Long</th>
              <th className="px-4 py-2 border text-left">Duration Medium</th>
              <th className="px-4 py-2 border text-left">Duration Short</th>
              <th className="px-4 py-2 border text-left">Hair Length</th>
              <th className="px-4 py-2 border text-left">Price Long</th>
              <th className="px-4 py-2 border text-left">Price Medium</th>
              <th className="px-4 py-2 border text-left">Price Short</th>
              <th className="px-4 py-2 border text-left">Rest Time</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white">
              <td className="px-4 py-2 border">Rojo</td>
              <td className="px-4 py-2 border">180</td>
              <td className="px-4 py-2 border">180</td>
              <td className="px-4 py-2 border">180</td>
              <td className="px-4 py-2 border">True</td>
              <td className="px-4 py-2 border">2500</td>
              <td className="px-4 py-2 border">2000</td>
              <td className="px-4 py-2 border">1500</td>
              <td className="px-4 py-2 border">30</td>
            </tr>
            <tr className="bg-white">
              <td className="px-4 py-2 border">Azul</td>
              <td className="px-4 py-2 border">180</td>
              <td className="px-4 py-2 border">180</td>
              <td className="px-4 py-2 border">180</td>
              <td className="px-4 py-2 border">True</td>
              <td className="px-4 py-2 border">2500</td>
              <td className="px-4 py-2 border">2000</td>
              <td className="px-4 py-2 border">1500</td>
              <td className="px-4 py-2 border">30</td>
            </tr>
            <tr className="bg-white">
              <td className="px-4 py-2 border">Verde</td>
              <td className="px-4 py-2 border">180</td>
              <td className="px-4 py-2 border">180</td>
              <td className="px-4 py-2 border">180</td>
              <td className="px-4 py-2 border">True</td>
              <td className="px-4 py-2 border">2500</td>
              <td className="px-4 py-2 border">2000</td>
              <td className="px-4 py-2 border">1500</td>
              <td className="px-4 py-2 border">30</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Services;
