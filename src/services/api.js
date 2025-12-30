import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/* ===================== BUSINESS ===================== */

export const getBusinessData = async () => {
  try {
    const { data } = await api.get("/business/settings");
    return data;
  } catch (error) {
    console.error("Error getBusinessData:", error);
    return false;
  }
};

/* ===================== APPOINTMENTS ===================== */

export const getAppointmentExpirationTime = async (appointmentId) => {
  try {
    const { data } = await api.get(`/appointments/${appointmentId}`);
    return data?.expiresAt ?? false;
  } catch (error) {
    console.error("Error al obtener expiración de cita:", error.message);
    return false;
  }
};

export const findAppointmentById = async (appointmentId) => {
  try {
    const { data } = await api.get(`/appointments/${appointmentId}`);
    return data ?? false;
  } catch (error) {
    console.error("Error al fetchear appointment por ID:", error.message);
    return false;
  }
};

export const getAppointments = async () => {
  try {
    const { data } = await api.get("/appointments");
    return data ?? false;
  } catch (error) {
    console.error("Error ocurrido al fetchear appointments:", error.message);
    return false;
  }
};

export const getPaidAppointments = async () => {
  try {
    const { data } = await api.get("/appointments/paid");
    return data ?? false;
  } catch (error) {
    console.error("Error ocurrido al fetchear citas pagadas:", error.message);
    return false;
  }
};

export const addAppointment = async (
  servicesCart,
  totalCost,
  selectedDate,
  selectedTime,
  username,
  userFullName,
  totalDurationOfAppointment
) => {
  try {
    const payload = {
      servicesCart,
      totalCost,
      selectedDate,
      selectedTime,
      username,
      userFullName,
      totalDurationOfAppointment,
      cellphone: localStorage.getItem("cellphone"),
    };

    await api.post("/appointments/create", payload);
    return true;
  } catch (error) {
    console.error("Error al agregar cita:", error);
    return false;
  }
};

export const cancelAppointment = async (appointmentId) => {
  try {
    await api.delete(`/appointments/${appointmentId}`);
    alert("La cita fue eliminada con éxito");
    window.location.reload();
    return true;
  } catch (error) {
    console.error(`Error al cancelar la cita ${appointmentId}:`, error.message);
    return false;
  }
};

/* ===================== REST DAYS ===================== */

export const getAllRestDays = async () => {
  try {
    const { data } = await api.get("/business/restdays");
    return data ?? false;
  } catch (error) {
    console.error("Error ocurrido al fetchear restdays:", error.message);
    return false;
  }
};

export const addRestDays = async (newDays) => {
  try {
    await api.post("/business/restdays", { days: newDays });
    alert("Días no laborales agregados con éxito");
    return true;
  } catch (error) {
    console.error("Error al agregar días de descanso:", error.message);
    return false;
  }
};

export const removeRestDays = async (daysToRemove) => {
  try {
    await api.post("/business/restdays", {
      remove: true,
      days: daysToRemove,
    });
    alert("Días no laborales eliminados con éxito");
    return true;
  } catch (error) {
    console.error(
      "Hubo un error al eliminar los días de descanso:",
      error.message
    );
    return false;
  }
};

/* ===================== CLIENTS ===================== */

export const findClientByPhoneNumber = async (phoneNumber) => {
  try {
    const { data } = await api.get(`/clients/${phoneNumber}`);
    return data ?? false;
  } catch (error) {
    console.error("Error al fetchear cliente por teléfono:", error.message);
    return false;
  }
};

export const registerClient = async (fullName, cellphone) => {
  try {
    await api.post("/clients/register", { fullName, cellphone });
    return true;
  } catch (error) {
    console.error("Error al registrar cliente:", error);
    return false;
  }
};

export const validateClient = async (cellphone) => {
  try {
    const { data } = await api.post("/clients/validate", { cellphone });

    if (data?.valid) {
      localStorage.setItem("p9d4l8rwe", "true");
      localStorage.setItem("userFullName", data.fullName);
      localStorage.setItem("cellphone", data.cellphone);
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error al validar cliente:", error);
    return false;
  }
};

export const getAllClients = async () => {
  try {
    const { data } = await api.get("/clients");
    return data ?? false;
  } catch (error) {
    console.error("Error al fetchear todos los clientes:", error.message);
    return false;
  }
};

/* ===================== ADMIN ===================== */

export const validateAdmin = async (password) => {
  try {
    const { data } = await api.post("/admin/login", { password });

    if (data?.valid) {
      localStorage.setItem("8w9j2fjsd", "true");
      localStorage.setItem("adminUsername", data.username);
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error al validar admin:", error);
    return false;
  }
};

/* ===================== SERVICES ===================== */

export const getServices = async () => {
  try {
    const { data } = await api.get("/services");
    return data ?? false;
  } catch (error) {
    console.error("Error ocurrido al fetchear services:", error);
    return false;
  }
};

export const addService = async (service, serviceOldName) => {
  try {
    await api.post("/services/create", {
      service,
      serviceOldName,
    });

    alert("Servicio agregado o editado con éxito");
    window.location.reload();
    return true;
  } catch (error) {
    console.error("Error al agregar servicio:", error);
    return false;
  }
};

export const deleteService = async (service) => {
  try {
    await api.delete(`/services/${service.name}`);
    alert("Servicio eliminado con éxito");
    window.location.reload();
    return true;
  } catch (error) {
    console.error("Error al eliminar servicio:", error);
    return false;
  }
};
