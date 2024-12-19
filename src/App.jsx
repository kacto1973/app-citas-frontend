import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./views/Login";
import AdminDashboard from "./views/AdminDashboard";
import Appointments from "./views/Appointments";
import Clients from "./views/Clients";
import RestDays from "./views/RestDays";
import Register from "./views/Register";
import ClientDashboard from "./views/ClientDashboard";
import AppointmentMaker from "./views/AppointmentMaker";
import BusinessID from "./views/BusinessID";
import Services from "./views/Services";
import AppointmentsHistory from "./views/AppointmentsHistory";
import ForgotPassword from "./views/ForgotPassword";

const App = () => {
  const clientp9d4l8rwe = localStorage.getItem("p9d4l8rwe");
  const admin8w9j2fjsd = localStorage.getItem("8w9j2fjsd");
  const businessID = localStorage.getItem("businessID");

  return (
    <Router>
      <Routes>
        <Route
          path="/" // esta barrita ba a representar el core de todo, el business ID
          element={
            !businessID ? (
              <BusinessID />
            ) : !clientp9d4l8rwe && !admin8w9j2fjsd ? (
              <Login />
            ) : clientp9d4l8rwe ? (
              <ClientDashboard />
            ) : admin8w9j2fjsd ? (
              <AdminDashboard />
            ) : null
          }
        />
        //////////////
        <Route
          path="/admindashboard"
          element={
            admin8w9j2fjsd && businessID ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/appointments"
          element={
            admin8w9j2fjsd && businessID ? (
              <Appointments />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/clients"
          element={
            admin8w9j2fjsd && businessID ? (
              <Clients />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/restdays"
          element={
            admin8w9j2fjsd && businessID ? (
              <RestDays />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/register"
          element={businessID ? <Register /> : <Navigate to="/" replace />}
        />
        <Route
          path="/clientdashboard"
          element={
            clientp9d4l8rwe && businessID ? (
              <ClientDashboard />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/appointmentmaker"
          element={
            clientp9d4l8rwe && businessID ? (
              <AppointmentMaker />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/forgotpassword"
          element={
            businessID ? <ForgotPassword /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/services"
          element={
            admin8w9j2fjsd && businessID ? (
              <Services />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/appointmentshistory"
          element={
            admin8w9j2fjsd && businessID ? (
              <AppointmentsHistory />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
