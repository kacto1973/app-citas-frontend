import React, { createContext, useState, useEffect } from "react";
import { ref, get, update } from "firebase/database";
import database from "../../firebaseConfig"; // Asegúrate de que apunte a tu configuración de Firebase

export const TrialContext = createContext();

export const TrialProvider = ({ children }) => {
  //const [trialStartDate, setTrialStartDate] = useState(null);
  const [isTrialExpired, setIsTrialExpired] = useState(false);

  //tenemos que asegurarnos de que existan los tokens
  //admin token nos asegura que estas logeado como administrador del negocio
  const adminToken = localStorage.getItem("8w9j2fjsd");
  //nos permite saber de que negocio estamos hablando y a quien ponerle parones
  const businessID = localStorage.getItem("businessID")?.toLowerCase();

  const createTrialExpirationDate = async () => {
    //nos aseguramos de que existan los tokens
    const trialRef = ref(database, `businesses/${businessID}/settings`);
    await update(trialRef, {
      trialEnd: new Date(
        new Date().setMonth(new Date().getMonth() + 2)
      ).toISOString(),
    });
  };

  //le pasamos el string iso de la fecha de inicio del trial de ese business
  const checkTrialExpiration = (storedEndDateISO) => {
    const expirationDate = new Date(storedEndDateISO);

    if (new Date() > expirationDate) {
      localStorage.setItem("ttotuh453xrd", "true");
      setIsTrialExpired(true);
    } else {
      setIsTrialExpired(false);
    }
  };

  useEffect(() => {
    //validamos que sabemos de que negocio hablamos y que el usuario es admin
    //lo que significa que esta en alguna vista respectiva a un admin
    if (adminToken && businessID) {
      const asyncFunc = async () => {
        const trialRef = ref(
          database,
          `businesses/${businessID}/settings/trialEnd`
        );
        const trialStoredSnap = await get(trialRef);
        if (trialStoredSnap.exists()) {
          //si si existe comprobaremos si ya vencio y tomamos accion en torno a ello

          checkTrialExpiration(trialStoredSnap.val());
        } else {
          //si no existe entonces la crearemos
          createTrialExpirationDate();
        }
      };
      const alreadyFetched = localStorage.getItem("ttotuh453xrd");
      if (alreadyFetched) {
        setIsTrialExpired(true);
      } else {
        asyncFunc();
      }
    }
  }, []);

  return (
    <TrialContext.Provider value={{ isTrialExpired }}>
      {children}
    </TrialContext.Provider>
  );
};
