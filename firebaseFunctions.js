import database from "./firebaseConfig";
import { ref, push, set, get, remove } from "firebase/database";

const addMinutesToTime = (time, minutes) => {
  const [hoursNum, minutesNum] = time.split(":").map(Number);

  const date = new Date(
    new Date(1970, 0, 1, 0, 0, 0, 0).setHours(hoursNum, minutesNum)
  );

  date.setTime(date.getTime() + minutes * 60 * 1000);

  const hourFormatted = `${
    date.getHours() < 10 ? `0${date.getHours()}` : `${date.getHours()}`
  }:${
    date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`
  }`;

  //return hour formatted as a string and with the minutes added
  return hourFormatted;
};

const itFits = (
  availableTimesArray,
  selectedTime,
  totalDurationOfAppointment
) => {
  //variables necesarias
  let fivePm = "17:00";
  let timeLeft = 0;
  let selectedTimeIndex = 0;

  let allTimesArray = [];
  for (let x = 9; x < 17; x++) {
    for (let y = 0; y < 60; y += 15) {
      let hour = x < 10 ? `0${x}` : `${x}`;
      let minute = y < 10 ? `0${y}` : `${y}`;
      allTimesArray.push(`${hour}:${minute}`);
    }
  }

  let mixedArray = [];
  for (let x = 0; x < allTimesArray.length; x++) {
    let valueToSearch = allTimesArray[x];
    if (availableTimesArray.includes(valueToSearch)) {
      mixedArray.push(valueToSearch);
    } else {
      mixedArray.push("0");
    }
  }

  mixedArray.some((time, index) => {
    if (time === selectedTime) {
      selectedTimeIndex = index;
      return true;
    }
    return false;
  });

  for (let x = 0; x <= totalDurationOfAppointment; x += 15) {
    if (!mixedArray[selectedTimeIndex] && totalDurationOfAppointment <= 60) {
      return true;
    }
    if (mixedArray[selectedTimeIndex] === "0") {
      return false;
    }
    selectedTimeIndex++;
  }

  return true;
};

//Functions that interact with firebase

export const addAppointment = async (
  servicesCart,
  extraServicesCart,
  totalCost,
  selectedDate,
  selectedTime,
  username,
  userFullName,
  totalDurationOfAppointment,
  availableTimesArray
) => {
  //antes de todo, checar si si caben esos servicios en el horario seleccionado

  if (itFits(availableTimesArray, selectedTime, totalDurationOfAppointment)) {
    try {
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
      };

      // console.log(
      //   "appointmentObj antes de agregarlo a Firebase: ",
      //   appointmentObject
      // );

      const appointmentsRef = ref(database, "activeAppointments");

      const newAppointmentsRef = push(appointmentsRef);

      await set(newAppointmentsRef, appointmentObject);

      return true;
    } catch (error) {
      console.error("Error: ", error);
      return false;
    }
  } else {
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
      username,
      password,
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
      if (childData.username === username && childData.password === password) {
        clientData = childData;
        return true;
      }
      return false;
    });

    if (clientFound) {
      localStorage.setItem("clientAuthenticated", "true");
      localStorage.setItem("username", clientData.username);
      localStorage.setItem("userFullName", clientData.fullName);
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
