import database from "./firebaseConfig";
import { ref, push, set, get } from "firebase/database";

//Functions that interact with firebase

export const registerClient = async (
  fullName,
  cellphone,
  username,
  password
) => {
  try {
    const clientObject = {
      fullName,
      username,
      password,
      cellphone,
      activeAppointments: [], // inicialmente no se refleja en FB pero esta presente
    };

    //creamos referencia a la coleccion clients en la database
    const clientsRef = ref(database, "clients");

    //creamos una clave unica para ese cliente usando push
    const newClientRef = push(clientsRef);

    // Guardar el cliente en la base de datos
    await set(newClientRef, clientObject);

    alert("Usuario registrado con éxito");

    return true;
  } catch (error) {
    console.error("Error: ", error);
    return false;
  }
};

export const validateClient = async (username, password) => {
  try {
    //creamos referencia a la coleccion clients en la database
    const clientsRef = ref(database, "clients");

    //obtenemos los datos de la coleccion clients
    const snapshot = await get(clientsRef);

    // Comprobamos si el username y password coinciden con alguno de los clientes
    const clientFound = Object.values(snapshot.val()).some(
      (childData) =>
        childData.username === username && childData.password === password
    );

    if (clientFound) {
      localStorage.setItem("clientAuthenticated", "true");
      return true; // Usuario encontrado, devolver true
    }

    alert("Usuario o contraseña incorrectos, intente nuevamente");
    return false;
  } catch (error) {
    console.error("Error: ", error);
    return false;
  }
};
