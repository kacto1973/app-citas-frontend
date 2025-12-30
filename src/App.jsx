import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./views/Login";
import Appointments from "./views/Appointments";
import Clients from "./views/Clients";
import RestDays from "./views/RestDays";
import Register from "./views/Register";
import ClientDashboard from "./views/ClientDashboard";
import AppointmentMaker from "./views/AppointmentMaker";
import Services from "./views/Services";
import AppointmentsHistory from "./views/AppointmentsHistory";

const queryClient = new QueryClient();

const App = () => {
  const clientp9d4l8rwe = localStorage.getItem("p9d4l8rwe");
  const admin8w9j2fjsd = localStorage.getItem("8w9j2fjsd");
  const cellphone = localStorage.getItem("cellphone");

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              !clientp9d4l8rwe && !admin8w9j2fjsd ? (
                <Login />
              ) : clientp9d4l8rwe ? (
                <ClientDashboard />
              ) : admin8w9j2fjsd ? (
                <Appointments />
              ) : null
            }
          />
          //////////////
          <Route
            path="/register"
            element={cellphone ? <Register /> : <Navigate to="/" replace />}
          />
          <Route
            path="/appointments"
            element={
              admin8w9j2fjsd ? <Appointments /> : <Navigate to="/" replace />
            }
          />
          <Route
            path="/clients"
            element={admin8w9j2fjsd ? <Clients /> : <Navigate to="/" replace />}
          />
          <Route
            path="/restdays"
            element={
              admin8w9j2fjsd ? <RestDays /> : <Navigate to="/" replace />
            }
          />
          <Route
            path="/clientdashboard"
            element={
              clientp9d4l8rwe ? (
                <ClientDashboard />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/appointmentmaker"
            element={
              clientp9d4l8rwe ? (
                <AppointmentMaker />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/services"
            element={
              admin8w9j2fjsd ? <Services /> : <Navigate to="/" replace />
            }
          />
          <Route
            path="/appointmentshistory"
            element={
              admin8w9j2fjsd ? (
                <AppointmentsHistory />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
