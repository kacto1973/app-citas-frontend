import database from "./firebaseConfig";
import { ref, push, set, get, remove } from "firebase/database";

//Functions that interact with firebase

export const getAllRestDays = async () => {
  try {
    const restDaysRef = ref(database, "restdays");

    const restDaysArraySnap = await get(restDaysRef);

    if (restDaysArraySnap.exists()) {
      const array = Object.values(restDaysArraySnap.val());

      return array;
    } else {
      console.log("No hay dias de descanso");
      return false;
    }
  } catch (error) {
    console.error("Error ocurrido al fetchear los restdays: " + error.message);
    return false;
  }
};

export const removeRestDays = async (daysToRemove) => {
  try {
    const restDaysRef = ref(database, "restdays");

    // Obtener los días de descanso actuales
    const snapshot = await get(restDaysRef);
    if (snapshot.exists()) {
      const restDays = snapshot.val();

      // Buscar los nodos que coinciden con las fechas de daysToRemove
      for (const key in restDays) {
        if (restDays.hasOwnProperty(key)) {
          const day = restDays[key];

          // Si la fecha coincide con algún día a eliminar
          if (daysToRemove.includes(day)) {
            const dayRef = ref(database, `restdays/${key}`);
            await remove(dayRef);
          }
        }
      }

      alert("Días no laborales eliminados con éxito");
      return true;
    } else {
      console.log("No se encontraron días de descanso en la base de datos.");
      return false;
    }
  } catch (error) {
    console.error(
      "Hubo un error al eliminar los días de descanso: ",
      error.message
    );
    return false;
  }
};

export const addRestDays = async (newDays) => {
  try {
    const restDaysRef = ref(database, "restdays");

    for (const day of newDays) {
      await push(restDaysRef, day);
    }

    alert("Dias no laborales agregados con éxito");
    return true;
  } catch (error) {
    console.error(
      "Hubo un error al agregar los dias de descanso " + error.message
    );
    return false;
  }
};

export const cancelAppointment = async (appointmentId) => {
  try {
    const appointmentsRef = ref(
      database,
      `activeAppointments/${appointmentId}`
    );

    await remove(appointmentsRef);

    alert("La cita fue eliminada con éxito");
    window.location.reload();
    return true;
  } catch (error) {
    console.error(
      `Error al remover la cita con ID ${appointmentId}: ${error.message}`
    );

    return false;
  }
};

export const addAppointment = async (
  servicesCart,
  extraServicesCart,
  totalCost,
  selectedDate,
  selectedTime,
  username,
  userFullName,
  totalDurationOfAppointment
) => {
  //antes de todo, checar si si caben esos servicios en el horario seleccionado

  try {
    // console.log(
    //   "appointmentObj antes de agregarlo a Firebase: ",
    //   appointmentObject
    // );

    const appointmentsRef = ref(database, "activeAppointments");

    const newAppointmentsRef = push(appointmentsRef);

    const dateString = selectedDate.toISOString().split("T")[0];

    const appointmentObject = {
      servicesCart,
      extraServicesCart,
      totalCost,
      selectedDate: dateString,
      selectedTime,
      username,
      userFullName,
      totalDurationOfAppointment,
      id: newAppointmentsRef.key,
      cellphone: localStorage.getItem("cellphone"),
    };

    await set(newAppointmentsRef, appointmentObject);

    return true;
  } catch (error) {
    console.error("Error: ", error);
    return false;
  }
};

export const registerClient = async (
  fullName,
  cellphone,
  username,
  password
) => {
  try {
    const clientObject = {
      fullName,
      username: username.toLowerCase(),
      password: password.toLowerCase(),
      cellphone,
      activeAppointments: [], // inicialmente no se refleja en FB pero esta presente
    };

    //creamos referencia a la coleccion clients en la database
    const clientsRef = ref(database, "clients");

    //obtenemos los datos de la coleccion clients
    const snapshot = await get(clientsRef);

    // Comprobamos si el username y password coinciden con alguno de los clientes
    const clientFound = Object.values(snapshot.val()).some(
      (childData) => childData.username === username
    );
    //

    if (clientFound) {
      alert("Ese nombre de usuario no está disponible, intente con otro");
      return false;
    } else {
      //creamos una clave unica para ese cliente usando push
      const newClientRef = push(clientsRef);

      // Guardar el cliente en la base de datos
      await set(newClientRef, clientObject);

      alert("Usuario registrado con éxito");

      return true;
    }
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

    let clientData = {};

    // Comprobamos si el username y password coinciden con alguno de los clientes
    const clientFound = Object.values(snapshot.val()).some((childData) => {
      if (
        childData.username === username.toLowerCase() &&
        childData.password === password.toLowerCase()
      ) {
        clientData = childData;
        return true;
      }
      return false;
    });

    if (clientFound) {
      localStorage.setItem("clientAuthenticated", "true");
      localStorage.setItem("username", clientData.username);
      localStorage.setItem("userFullName", clientData.fullName);
      localStorage.setItem("cellphone", clientData.cellphone);
      return true; // Usuario encontrado, devolver true
    }

    alert("Usuario o contraseña incorrectos, intente nuevamente");
    return false;
  } catch (error) {
    console.error("Error: ", error);
    return false;
  }
};

export const getAppointments = async () => {
  try {
    const appointmentsRef = ref(database, "activeAppointments");

    const appointmentsArraySnap = await get(appointmentsRef);

    if (appointmentsArraySnap.exists()) {
      const array = Object.values(appointmentsArraySnap.val());

      return array;
    } else {
      console.log("No hay citas activas");
      return false;
    }
  } catch (error) {
    console.error("Error ocurrido al fetchear appointments: " + error.message);
    return false;
  }
};

export const moveData = async () => {
  try {
    const oldRef = ref(database, "menu/activeAppointments"); // Ruta original
    const newRef = ref(database, "activeAppointments"); // Nueva ruta

    // 1. Obtener los datos desde la ubicación original
    const snapshot = await get(oldRef);

    if (snapshot.exists()) {
      // 2. Escribir los datos en la nueva ubicación
      await set(newRef, snapshot.val());

      // 3. Eliminar los datos originales
      await remove(oldRef);

      console.log("Datos movidos con éxito.");
    } else {
      console.log("No hay datos para mover.");
    }
  } catch (error) {
    console.error("Error al mover datos: ", error.message);
  }
};

export const getExtraServices = async () => {
  try {
    //get Database reference
    const extraServicesRef = ref(database, "menu/extraServices");

    //get data from the reference
    const extraServicesSnapshot = await get(extraServicesRef);

    if (extraServicesSnapshot.exists()) {
      return extraServicesSnapshot.val();
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error ocurrido al fetchear extraServices: " + error.message);
    return false;
  }
};

export const getServices = async () => {
  try {
    //get Database reference
    const servicesRef = ref(database, "menu/services");

    //get data from the reference
    const servicesSnapshot = await get(servicesRef);

    if (servicesSnapshot.exists()) {
      return servicesSnapshot.val();
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error ocurrido al fetchear services: " + error.message);
    return false;
  }
};

export const getAllClients = async () => {
  try {
    const clientsRef = ref(database, "clients");

    const clientsSnap = await get(clientsRef);

    if (clientsSnap.exists()) {
      let result = Object.values(clientsSnap.val());
      return result;
    } else {
      console.log("no hay clientes que fetchear");
      return false;
    }
  } catch (error) {
    console.error("error al fetchear todos los clientes " + error.message);
    return false;
  }
};
