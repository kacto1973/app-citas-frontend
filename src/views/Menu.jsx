import React from "react";
import { useState, useEffect } from "react";

const Menu = () => {
  const [menu, setMenu] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [editing, setEditing] = useState(false);
  const [currentEditingProduct, setCurrentEditingProduct] = useState(null);

  const addProduct = (name, price) => {
    if (!name || !price) {
      alert("Por favor, rellene todos los campos");
      return;
    }
    const newMenu = [...menu, { name, price }];
    setName("");
    setPrice("");

    setMenu(newMenu);
    localStorage.setItem("menu", JSON.stringify(newMenu));
  };

  useEffect(() => {
    const savedMenu = JSON.parse(localStorage.getItem("menu")) || [];
    setMenu(savedMenu);
  }, []);

  const handleEdit = (product) => {
    setName(product.name);
    setPrice(product.price);
    setCurrentEditingProduct(product);
    setEditing(true);
  };

  const saveProduct = () => {
    if (!name || !price) {
      alert("Por favor, rellene todos los campos");
      return;
    }
    const updatedProduct = { ...currentEditingProduct, name, price };

    //guardarlo en el menu actual
    const updatedMenu = menu.map((product) =>
      product === currentEditingProduct ? updatedProduct : product
    );

    setMenu(updatedMenu);

    //guardarlo en localstorage
    localStorage.setItem("menu", JSON.stringify(updatedMenu));

    // Restablecer el estado de edición
    setEditing(false);
    setCurrentEditingProduct(null);
    setName("");
    setPrice("");
  };

  const handleDelete = (productToDelete) => {
    const userConfirm = confirm(
      "¿Estás seguro de que quieres eliminar este producto?"
    );
    if (userConfirm) {
      const updatedMenu = menu.filter((product) => product !== productToDelete);
      setMenu(updatedMenu);
      localStorage.setItem("menu", JSON.stringify(updatedMenu));
    }
  };

  return (
    <>
      <div className="w-full h-full">
        <div className="flex flex-col items-center justify-center space-y-5 mt-5  mb-10">
          <h1 className="font-bold text-xl">Servicios Principales</h1>
          <input
            type="text"
            placeholder="Nombre del Servicio"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 border border-gray-300 mr-2"
          />
          <input
            type="number"
            placeholder="Precio del Servicio"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="p-2 border border-gray-300 mr-2"
          />
          <input
            type="number"
            placeholder="Descanso (minutos)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="p-2 border border-gray-300 mr-2"
          />
          {editing ? (
            <button
              className="px-2 py-1 rounded-md my-5 bg-yellow text-white w-[120px]"
              onClick={() => saveProduct(currentEditingProduct)}
            >
              Guardar Servicio Editado
            </button>
          ) : (
            <button
              className="px-2 py-1 rounded-md my-5 bg-blue text-white w-[120px]"
              onClick={() => addProduct(name, price)}
            >
              Agregar Servicio
            </button>
          )}

          <table className="border-collapse w-[80%] table-auto text-sm">
            <thead>
              <tr>
                <th className="border border-black text-center">Nombre</th>
                <th className="border border-black text-center">Precio</th>
                <th className="border border-black text-center">Acción</th>
              </tr>
            </thead>
            <tbody>
              {menu.map((product) => (
                <tr>
                  <td className="border border-black px-2 min-h-[50px] text-center break-words">
                    {product.name}
                  </td>
                  <td className="border border-black px-3 min-h-[50px] text-center break-words">
                    {product.price}
                  </td>
                  <td className="border border-black min-h-[50px] text-center">
                    <div className="flex flex-row justify-center items-center">
                      <button
                        className="px-2 py-1 rounded-md my-5 bg-blue text-white w-[60px] mx-3"
                        onClick={() => handleEdit(product)}
                      >
                        {" "}
                        Editar
                      </button>
                      <button
                        colors="bg-red m-3"
                        onClick={() => handleDelete(product)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col items-center justify-center space-y-5 mt-5  mb-10">
          <h1 className="font-bold text-xl">Servicios Extras</h1>
          <input
            type="text"
            placeholder="Nombre del Servicio"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 border border-gray-300 mr-2"
          />
          <input
            type="number"
            placeholder="Precio del Servicio"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="p-2 border border-gray-300 mr-2"
          />
          <input
            type="number"
            placeholder="Descanso (minutos)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="p-2 border border-gray-300 mr-2"
          />
          {editing ? (
            <button
              className=" text-white bg-yellow"
              onClick={() => saveProduct(currentEditingProduct)}
            >
              Guardar Servicio Editado
            </button>
          ) : (
            <button
              className="bg-blue text-white"
              onClick={() => addProduct(name, price)}
            >
              Agregar Servicio
            </button>
          )}

          <table className="border-collapse w-[80%] table-auto text-sm">
            <thead>
              <tr>
                <th className="border border-black text-center">Nombre</th>
                <th className="border border-black text-center">Precio</th>
                <th className="border border-black text-center">Acción</th>
              </tr>
            </thead>
            <tbody>
              {menu.map((product) => (
                <tr>
                  <td className="border border-black px-2 min-h-[50px] text-center break-words">
                    {product.name}
                  </td>
                  <td className="border border-black px-3 min-h-[50px] text-center break-words">
                    {product.price}
                  </td>
                  <td className="border border-black min-h-[50px] text-center">
                    <div className="flex flex-row justify-center items-center">
                      <button
                        colors="bg-yellow m-3"
                        onClick={() => handleEdit(product)}
                      >
                        text=""
                      </button>
                      <button
                        colors="bg-red m-3"
                        onClick={() => handleDelete(product)}
                      >
                        text=""
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Menu;
