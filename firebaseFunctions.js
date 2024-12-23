import database from "./firebaseConfig";
import { ref, push, set, get, remove } from "firebase/database";

const itemID = localStorage.getItem("businessID");
const businessID = itemID ? itemID.toLowerCase() : null;

const path = `businesses/${businessID}`;

//Functions that interact with firebase

export const getAppointmentExpirationTime = async (appointmentId) => {
  try {
    const appointment = await findAppointmentById(appointmentId);

    if (appointment) {
      return appointment.expiresAt;
    }

    return false;
  } catch (error) {
    console.error(
      "Error al obtener la fecha de expiración de la cita: " + error.message
    );
    return false;
  }
};

export const validateBusinessID = async (businessIDTyped) => {
  try {
    const businessesRef = ref(database, "businesses");
    const businessesSnap = await get(businessesRef);

    if (businessesSnap.exists()) {
      const businessesArray = Object.keys(businessesSnap.val());
      const foundBusiness = businessesArray.some(
        (business) => business.toLowerCase() === businessIDTyped.toLowerCase()
      );

      return foundBusiness;
    }
    console.log("No se encontró el businessID: " + businessIDTyped);
    return false;
  } catch (error) {
    console.error("Error al obtener el businessID: " + error.message);
    return false;
  }
};

export const findAppointmentById = async (appointmentId) => {
  try {
    const appointmentsRef = ref(database, `${path}/activeAppointments`);

    const appointmentsSnap = await get(appointmentsRef);

    if (appointmentsSnap.exists()) {
      const appointmentsArray = Object.values(appointmentsSnap.val());
      const foundAppointment = appointmentsArray.find(
        (appointment) => appointment.id === appointmentId
      );

      if (foundAppointment) {
        return foundAppointment; // Retorna el objeto completo.
      }
    }

    console.log("No se encontró una cita con ese ID: " + appointmentId);
    return false;
  } catch (error) {
    console.error("Error al fetchear appointment por ID: " + error.message);
    return false;
  }
};

// export const cleanseRestDays = async (fetchedRestDaysArray) => {
//   try {
//     const yesterday = new Date();
//     yesterday.setDate(yesterday.getDate() - 1); // Restar un día
//     const currentDate = yesterday.toISOString().split("T")[0]; // Convertir a ISO y obtener solo la fecha

//     let restDaysUpdated = fetchedRestDaysArray.filter(
//       (restday) => currentDate < restday
//     );
//     console.log("restdays updated ", restDaysUpdated);
//     const restdaysRef = ref(database, "restdays");

//     await remove(restdaysRef);

//     for (const day of restDaysUpdated) {
//       await push(restdaysRef, day);
//     }

//     return true;
//   } catch (error) {
//     console.error("error al limpiar restdays " + error.message);
//     return false;
//   }
// };

export const getAllRestDays = async () => {
  try {
    const restDaysRef = ref(database, `${path}/restdays`);

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
    const restDaysRef = ref(database, `${path}/restdays`);

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
            const dayRef = ref(database, `${path}/restdays/${key}`);
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
    const restDaysRef = ref(database, `${path}/restdays`);

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
      `${path}/activeAppointments/${appointmentId}`
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

    const appointmentsRef = ref(database, `${path}/activeAppointments`);

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
      state: "no pagado",
      createdAt: new Date().toISOString(), // Fecha y hora actual
      expiresAt: new Date(
        new Date().setHours(new Date().getHours() + 12)
      ).toISOString(),
    };

    await set(newAppointmentsRef, appointmentObject);

    return true;
  } catch (error) {
    console.error("Error: ", error);
    return false;
  }
};

export const findClientByPhoneNumber = async (phoneNumber) => {
  try {
    const clientsRef = ref(database, `${path}/clients`);

    const clientsSnap = await get(clientsRef);

    if (clientsSnap.exists()) {
      const clientsArray = Object.values(clientsSnap.val());
      const foundClient = clientsArray.find(
        (client) => client.cellphone === phoneNumber
      );

      if (foundClient) {
        console.log("Cliente encontrado: ", foundClient);
        return foundClient; // Retorna el objeto completo.
      }
    }

    console.log(
      "No se encontró un cliente con ese número de teléfono: " + phoneNumber
    );
    return false;
  } catch (error) {
    console.error(
      "Error al fetchear cliente por número de teléfono: " + error.message
    );
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
      activeAppointments: [], // inicialmente no se refleja en FB pero esta presente,
      //consent: true,
    };

    //creamos referencia a la coleccion clients en la database
    const clientsRef = ref(database, `${path}/clients`);

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

export const validateAdmin = async (username, password) => {
  try {
    const adminsRef = ref(database, `${path}/admins`);

    const adminsSnap = await get(adminsRef);

    console.log("adminsSnap: ", adminsSnap.val());

    if (adminsSnap.exists()) {
      const adminsArray = Object.values(adminsSnap.val());
      const foundAdmin = adminsArray.some(
        (admin) =>
          admin.username === username.toLowerCase() &&
          admin.password === password.toLowerCase()
      );

      if (foundAdmin) {
        console.log("Admin encontrado", foundAdmin);
        localStorage.setItem("8w9j2fjsd", "true");
      }

      return foundAdmin;
    }
  } catch (error) {
    console.error("Error: ", error);
    return false;
  }
};

export const validateClient = async (username, password) => {
  try {
    //creamos referencia a la coleccion clients en la database
    const clientsRef = ref(database, `${path}/clients`);

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
      localStorage.setItem("p9d4l8rwe", "true");
      localStorage.setItem("username", clientData.username);
      localStorage.setItem("userFullName", clientData.fullName);
      localStorage.setItem("cellphone", clientData.cellphone);
      return true; // Usuario encontrado, devolver true
    }

    return false;
  } catch (error) {
    console.error("Error: ", error);
    return false;
  }
};

export const getAppointments = async () => {
  try {
    const appointmentsRef = ref(database, `${path}/activeAppointments`);

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

export const getPaidAppointments = async () => {
  try {
    const appointmentsRef = ref(database, `${path}/activeAppointments`);

    const appointmentsArraySnap = await get(appointmentsRef);

    if (appointmentsArraySnap.exists()) {
      const array = Object.values(appointmentsArraySnap.val());

      const paidAppointments = array.filter(
        (appointment) => appointment.state === "pagado"
      );

      return paidAppointments;
    } else {
      console.log("No hay citas activas");
      return false;
    }
  } catch (error) {
    console.error("Error ocurrido al fetchear appointments: " + error.message);
    return false;
  }
};

export const getExtraServices = async () => {
  try {
    //get Database reference
    const extraServicesRef = ref(database, `${path}/menu/extraServices`);

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

export const deleteService = async (service) => {
  try {
    await remove(ref(database, `${path}/menu/services/${service.name}`));

    alert("Servicio eliminado con éxito");
    window.location.reload();
    return true;
  } catch (error) {
    console.error("Error al eliminar servicio: " + error.message);
    return false;
  }
};

export const addService = async (service, serviceOldName) => {
  try {
    if (serviceOldName) {
      await remove(ref(database, `${path}/menu/services/${serviceOldName}`));
      await set(
        ref(database, `${path}/menu/services/${service.name}`),
        service
      );
    } else {
      await set(
        ref(database, `${path}/menu/services/${service.name}`),
        service
      );
    }

    alert("Servicio agregado o editado con éxito");
    window.location.reload();

    return true;
  } catch (error) {
    console.error("Error al agregar servicio: " + error.message);
    return false;
  }
};

export const addExtraService = async (service, serviceOldName) => {
  try {
    if (serviceOldName) {
      await remove(
        ref(database, `${path}/menu/extraServices/${serviceOldName}`)
      );
      await set(
        ref(database, `${path}/menu/extraServices/${service.name}`),
        service
      );
    } else {
      await set(
        ref(database, `${path}/menu/extraServices/${service.name}`),
        service
      );
    }

    alert("Servicio extra agregado o editado con éxito");
    window.location.reload();

    return true;
  } catch (error) {
    console.error("Error al agregar servicio extra: " + error.message);
    return false;
  }
};

export const deleteExtraService = async (service) => {
  try {
    await remove(ref(database, `${path}/menu/extraServices/${service.name}`));

    alert("Servicio extra eliminado con éxito");
    window.location.reload();
    return true;
  } catch (error) {
    console.error("Error al eliminar servicio extra: " + error.message);
    return false;
  }
};

export const getServices = async () => {
  try {
    //get Database reference
    const servicesRef = ref(database, `${path}/menu/services`);

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
    const clientsRef = ref(database, `${path}/clients`);

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

// export const cleanseAppointments = async () => {
//   try {
//     const appointmentsArray = await getAppointments();
//     const sevenDaysAgo = new Date();
//     sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
//     const sevenDaysAgoFormatted = sevenDaysAgo.toISOString().split("T")[0];

//     const filteredAppointments = appointmentsArray.filter(
//       (appointment) => appointment.selectedDate > sevenDaysAgoFormatted
//     );

//     //eliminar el nodo entero para nomas agregar las filtradas posteriormente
//     await remove(ref(database, "activeAppointments"));

//     // Actualizar citas activas
//     for (const appointment of filteredAppointments) {
//       await set(
//         ref(database, `activeAppointments/${appointment.id}`),
//         appointment
//       );
//     }

//     console.log("Citas limpiadas correctamente.");
//     return true;
//   } catch (error) {
//     console.error("No se pudieron limpiar las citas: " + error.message);
//     return false;
//   }
// };
