// import React from "react";
// import { useState, useEffect } from "react";

// const Menu = () => {
//   //use states
//   const [menu, setMenu] = useState([]);
//   const [name, setName] = useState("");
//   const [price, setPrice] = useState("");
//   const [duration, setDuration] = useState("");
//   const [restTime, setRestTime] = useState("");
//   const [selectedOption, setSelectedOption] = useState("");
//   const [editing, setEditing] = useState(false);
//   const [currentEditingProduct, setCurrentEditingProduct] = useState(null);

//   //const [hairLengthNeeded, setHairLengthNeeded] = useState("");
//   const [extraMenu, setExtraMenu] = useState([]);
//   const [extraName, setExtraName] = useState("");
//   const [extraPrice, setExtraPrice] = useState("");
//   const [extraDuration, setExtraDuration] = useState("");
//   const [extraEditing, setExtraEditing] = useState(false);
//   const [extraCurrentEditingProduct, setExtraCurrentEditingProduct] =
//     useState(null);

//   //use effect
//   useEffect(() => {
//     const savedMenu = JSON.parse(localStorage.getItem("menu")) || [];
//     setMenu(savedMenu);

//     const savedExtraMenu = JSON.parse(localStorage.getItem("extraMenu")) || [];
//     setExtraMenu(savedExtraMenu);
//   }, []);

//   //functions
//   const addProduct = (name, price, duration, restTime, selectedOption) => {
//     if (!name || !price || !duration || !restTime || !selectedOption) {
//       alert("Por favor, rellene todos los campos y seleccione una opción");
//       return;
//     }
//     const newMenu = [
//       ...menu,
//       { name, price, duration, restTime, selectedOption },
//     ];
//     setName("");
//     setPrice("");
//     setDuration("");
//     setRestTime("");
//     setSelectedOption("");

//     setMenu(newMenu);
//     localStorage.setItem("menu", JSON.stringify(newMenu));
//   };

//   const addExtraProduct = (name, price, duration) => {
//     if (!name || !price || !duration) {
//       alert("Por favor, rellene todos los campos");
//       return;
//     }
//     const newExtraMenu = [...extraMenu, { name, price, duration }];
//     setExtraName("");
//     setExtraPrice("");
//     setExtraDuration("");

//     setExtraMenu(newExtraMenu);
//     localStorage.setItem("extraMenu", JSON.stringify(newExtraMenu));
//   };

//   const handleEdit = (product) => {
//     setName(product.name);
//     setPrice(product.price);
//     setDuration(product.duration);
//     setRestTime(product.restTime);
//     setSelectedOption(product.selectedOption);
//     setCurrentEditingProduct(product);
//     setEditing(true);
//   };

//   const handleChange = (e) => {
//     setSelectedOption(e.target.value);
//   };

//   const handleExtraEdit = (product) => {
//     setExtraName(product.name);
//     setExtraPrice(product.price);
//     setExtraDuration(product.duration);
//     setExtraCurrentEditingProduct(product);
//     setExtraEditing(true);
//   };

//   const saveProduct = () => {
//     if (!name || !price || !duration || !restTime || !selectedOption) {
//       alert("Por favor, rellene todos los campos");
//       return;
//     }
//     const updatedProduct = {
//       ...currentEditingProduct,
//       name,
//       price,
//       duration,
//       restTime,
//       selectedOption,
//     };

//     //guardarlo en el menu actual
//     const updatedMenu = menu.map((product) =>
//       product === currentEditingProduct ? updatedProduct : product
//     );

//     setMenu(updatedMenu);

//     //guardarlo en localstorage
//     localStorage.setItem("menu", JSON.stringify(updatedMenu));

//     // Restablecer el estado de edición
//     setEditing(false);
//     setCurrentEditingProduct(null);
//     setName("");
//     setPrice("");
//     setDuration("");
//     setRestTime("");
//     setSelectedOption("");
//   };

//   const saveExtraProduct = () => {
//     if (!extraName || !extraPrice || !extraDuration) {
//       alert("Por favor, rellene todos los campos");
//       return;
//     }
//     const updatedProduct = {
//       ...extraCurrentEditingProduct,
//       name: extraName,
//       price: extraPrice,
//       duration: extraDuration,
//     };

//     //guardarlo en el menu actual
//     const updatedExtraMenu = extraMenu.map((product) =>
//       product === extraCurrentEditingProduct ? updatedProduct : product
//     );

//     setExtraMenu(updatedExtraMenu);

//     //guardarlo en localstorage
//     localStorage.setItem("extraMenu", JSON.stringify(updatedExtraMenu));

//     // Restablecer el estado de edición
//     setExtraEditing(false);
//     setExtraCurrentEditingProduct(null);
//     setExtraName("");
//     setExtraPrice("");
//     setExtraDuration("");
//   };

//   const handleDelete = (productToDelete) => {
//     const userConfirm = confirm(
//       "¿Estás seguro de que quieres eliminar este producto?"
//     );
//     if (userConfirm) {
//       const updatedMenu = menu.filter((product) => product !== productToDelete);
//       setMenu(updatedMenu);
//       localStorage.setItem("menu", JSON.stringify(updatedMenu));
//     }
//   };

//   const handleExtraDelete = (productToDelete) => {
//     const userConfirm = confirm(
//       "¿Estás seguro de que quieres eliminar este producto?"
//     );
//     if (userConfirm) {
//       const updatedExtraMenu = extraMenu.filter(
//         (product) => product !== productToDelete
//       );
//       setExtraMenu(updatedExtraMenu);
//       localStorage.setItem("extraMenu", JSON.stringify(updatedExtraMenu));
//     }
//   };

//   const downloadFromFirebase = () => {
//     console.log("Descargando datos de Firebase");
//   };

//   const syncrhonizeWithFirebase = () => {
//     console.log("Sincronizando datos con Firebase");
//   };

//   return (
//     <>
//       <div className="relative w-full h-full">
//         <button
//           onClick={downloadFromFirebase}
//           className="absolute -top-5 left-8 px-2 py-1 rounded-md my-5 bg-blue text-white"
//         >
//           Descargar
//         </button>
//         <button
//           onClick={syncrhonizeWithFirebase}
//           className="absolute -top-5 right-8 px-2 py-1 rounded-md my-5 bg-blue text-white"
//         >
//           Sincronizar
//         </button>

//         <div className=" flex flex-col items-center justify-center space-y-5 mt-5  mb-10">
//           <h1 className="font-bold text-xl">Servicios Principales</h1>
//           <div className=" flex flex-col w-full items-center justify-center">
//             <div className="w-full flex justify-center mb-5">
//               <input
//                 type="text"
//                 placeholder="Nombre del Servicio"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 className="p-2 border border-gray-300 mx-4 w-[200px]"
//               />
//               <input
//                 type="number"
//                 placeholder="Precio del Servicio"
//                 value={price}
//                 onChange={(e) => setPrice(e.target.value)}
//                 className="p-2 border border-gray-300 mx-4 w-[200px]"
//               />
//             </div>
//             <div className="w-full flex justify-center mb-5">
//               <input
//                 type="number"
//                 placeholder="Duración (minutos)"
//                 value={duration}
//                 onChange={(e) => setDuration(e.target.value)}
//                 className="p-2 border border-gray-300 mx-4 w-[200px]"
//               />
//               <input
//                 type="number"
//                 placeholder="Descanso (minutos)"
//                 value={restTime}
//                 onChange={(e) => setRestTime(e.target.value)}
//                 className="p-2 border border-gray-300 mx-4 w-[200px]"
//               />
//             </div>
//             <div className="w-full flex justify-center">
//               <form className="flex flex-col items-center space-y-4 p-4">
//                 <p className="text-lg font-bold">
//                   ¿Necesita saber longitud del cabello?
//                 </p>

//                 <div className="flex space-x-4">
//                   <label className="flex items-center space-x-2">
//                     <input
//                       type="radio"
//                       name="hairLengthNeeded"
//                       value="true"
//                       checked={selectedOption === "true"}
//                       onChange={handleChange}
//                       className="form-radio text-blue-600"
//                     />
//                     <span>Sí</span>
//                   </label>

//                   <label className="flex items-center space-x-2">
//                     <input
//                       type="radio"
//                       name="hairLengthNeeded"
//                       value="false"
//                       checked={selectedOption === "false"}
//                       onChange={handleChange}
//                       className="form-radio text-blue-600"
//                     />
//                     <span>No</span>
//                   </label>
//                 </div>
//               </form>
//             </div>
//           </div>
//           {editing ? (
//             <button
//               className="px-2 py-1 rounded-md my-5 bg-yellow text-white [220px]"
//               onClick={() => saveProduct(currentEditingProduct)}
//             >
//               Guardar Servicio Editado
//             </button>
//           ) : (
//             <button
//               className="px-2 py-1 rounded-md my-5 bg-blue text-white w-[150px]"
//               onClick={() =>
//                 addProduct(name, price, duration, restTime, selectedOption)
//               }
//             >
//               Agregar Servicio
//             </button>
//           )}

//           <table className="border-collapse w-[80%] table-auto text-sm">
//             <thead>
//               <tr>
//                 <th className="border border-black text-center">Nombre</th>
//                 <th className="border border-black text-center">Precio</th>
//                 <th className="border border-black text-center">Duración</th>
//                 <th className="border border-black text-center">Descanso</th>
//                 <th className="border border-black text-center">
//                   Tipo Cabello
//                 </th>
//                 <th className="border border-black text-center">Acción</th>
//               </tr>
//             </thead>
//             <tbody>
//               {menu.map((product, index) => (
//                 <tr key={index}>
//                   <td className="border border-black px-2 min-h-[50px] text-center break-words">
//                     {product.name}
//                   </td>
//                   <td className="border border-black px-3 min-h-[50px] text-center break-words">
//                     {product.price}
//                   </td>
//                   <td className="border border-black px-2 min-h-[50px] text-center break-words">
//                     {product.duration}
//                   </td>
//                   <td className="border border-black px-3 min-h-[50px] text-center break-words">
//                     {product.restTime}
//                   </td>
//                   <td className="border border-black px-3 min-h-[50px] text-center break-words">
//                     {product.selectedOption === "true" ? "Sí" : "No"}
//                   </td>
//                   <td className="border border-black min-h-[50px] text-center">
//                     <div className="flex flex-row justify-center items-center">
//                       <button
//                         className="px-2 py-1 rounded-md my-5 bg-yellow text-white w-[60px] mr-4"
//                         onClick={() => handleEdit(product)}
//                       >
//                         Editar
//                       </button>
//                       <button
//                         className="px-2 py-1 rounded-md my-5 bg-red text-white w-[65px]"
//                         onClick={() => handleDelete(product)}
//                       >
//                         Eliminar
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//         <div className="flex flex-col items-center justify-center space-y-5 mt-5  mb-10">
//           <h1 className="font-bold text-xl">Servicios Extras</h1>
//           <input
//             type="text"
//             placeholder="Nombre del Servicio"
//             value={extraName}
//             onChange={(e) => setExtraName(e.target.value)}
//             className="p-2 border border-gray-300 mr-2"
//           />
//           <input
//             type="number"
//             placeholder="Precio del Servicio"
//             value={extraPrice}
//             onChange={(e) => setExtraPrice(e.target.value)}
//             className="p-2 border border-gray-300 mr-2"
//           />
//           <input
//             type="number"
//             placeholder="Duración (minutos)"
//             value={extraDuration}
//             onChange={(e) => setExtraDuration(e.target.value)}
//             className="p-2 border border-gray-300 mr-2"
//           />
//           {extraEditing ? (
//             <button
//               className="px-2 py-1 rounded-md my-5 bg-yellow text-white w-[220px]"
//               onClick={() => saveExtraProduct(extraCurrentEditingProduct)}
//             >
//               Guardar Servicio Editado
//             </button>
//           ) : (
//             <button
//               className="px-2 py-1 rounded-md my-5 bg-blue text-white w-[150px]"
//               onClick={() =>
//                 addExtraProduct(extraName, extraPrice, extraDuration)
//               }
//             >
//               Agregar Servicio
//             </button>
//           )}

//           <table className="border-collapse w-[80%] table-auto text-sm">
//             <thead>
//               <tr>
//                 <th className="border border-black text-center">Nombre</th>
//                 <th className="border border-black text-center">Precio</th>
//                 <th className="border border-black text-center">Duración</th>
//                 <th className="border border-black text-center">Acción</th>
//               </tr>
//             </thead>
//             <tbody>
//               {extraMenu.map((product) => (
//                 <tr>
//                   <td className="border border-black px-2 min-h-[50px] text-center break-words">
//                     {product.name}
//                   </td>
//                   <td className="border border-black px-3 min-h-[50px] text-center break-words">
//                     {product.price}
//                   </td>
//                   <td className="border border-black px-3 min-h-[50px] text-center break-words">
//                     {product.duration}
//                   </td>
//                   <td className="border border-black min-h-[50px] text-center">
//                     <div className="flex flex-row justify-center items-center">
//                       <button
//                         className="px-2 py-1 rounded-md my-5 bg-yellow text-white w-[60px] mr-4"
//                         onClick={() => handleExtraEdit(product)}
//                       >
//                         Editar
//                       </button>
//                       <button
//                         className="px-2 py-1 rounded-md my-5 bg-red text-white w-[65px]"
//                         onClick={() => handleExtraDelete(product)}
//                       >
//                         Eliminar
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Menu;
