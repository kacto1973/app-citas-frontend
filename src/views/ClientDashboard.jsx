import React from "react";
import { useNavigate } from "react-router-dom";

const ClientDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen">
      <div className="flex flex-col justify-center items-center w-full">
        <h1 className="text-2xl font-black mt-10 mb-5">PANEL DE CITAS</h1>
        <p className="mb-4">Sus próximas citas:</p>
        <div className="flex flex-col justify-center items-center w-full">
          <div className="relative w-[80%] border border-gray-900 mt-6 flex flex-col p-5 rounded-md shadow-xl bg-gray-100">
            <div className="flex flex-row mb-2">
              <p>Cita #1 - Martes 13 de Diciembre - 10:30 AM</p>
              {/* <span className="text-white bg-blue py-0.5 px-1 ml-2 rounded-lg">
                Transfer
              </span> */}
              <p className="ml-auto">
                <span className="text-green font-black">$150</span>
              </p>
            </div>
            <p>1 x Corte de cabello - ($50) = $50</p>
            <p>1 x Tinte de cabello - ($60) = $60</p>
            <p>1 x Peinado - ($40) = $40</p>
            <button
              className="px-1 py-1 rounded-md my-5 bg-red text-white w-[30px] absolute top-[55%] left-[89%]"
              onClick={() => {
                cancelAppointment();
              }}
            >
              X
            </button>
          </div>

          <div className="relative w-[80%] border border-gray-900 mt-6 flex flex-col p-5 rounded-md shadow-xl bg-gray-100">
            <div className="flex flex-row mb-2">
              <p>Cita #1 - Martes 13 de Diciembre - 10:30 AM</p>
              {/* <span className="text-white bg-blue py-0.5 px-1 ml-2 rounded-lg">
                Transfer
              </span> */}
              <p className="ml-auto">
                <span className="text-green font-black">$150</span>
              </p>
            </div>
            <p>1 x Corte de cabello - ($50) = $50</p>
            <p>1 x Tinte de cabello - ($60) = $60</p>
            <p>1 x Peinado - ($40) = $40</p>
            <button
              className="px-1 py-1 rounded-md my-5 bg-red text-white w-[30px] absolute top-[55%] left-[89%]"
              onClick={() => {
                cancelAppointment();
              }}
            >
              X
            </button>
          </div>
          <button
            className="px-2 py-1 rounded-md my-5 mt-10 bg-blue text-white w-[120px]"
            onClick={() => {
              navigate("/appointmentmaker");
            }}
          >
            Nueva Cita
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
