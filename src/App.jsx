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
  const clientAuthenticated = localStorage.getItem("clientAuthenticated");
  const adminAuthenticated = localStorage.getItem("adminAuthenticated");
  const businessID = localStorage.getItem("businessID");

  return (
    <Router>
      <Routes>
        <Route
          path="/" // esta barrita ba a representar el core de todo, el business ID
          element={
            !businessID ? (
              <BusinessID />
            ) : !clientAuthenticated && !adminAuthenticated ? (
              <Login />
            ) : clientAuthenticated ? (
              <ClientDashboard />
            ) : adminAuthenticated ? (
              <AdminDashboard />
            ) : null
          }
        />
        //////////////
        <Route
          path="/admindashboard"
          element={
            adminAuthenticated && businessID ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/appointments"
          element={
            adminAuthenticated && businessID ? (
              <Appointments />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/clients"
          element={
            adminAuthenticated && businessID ? (
              <Clients />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/restdays"
          element={
            adminAuthenticated && businessID ? (
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
            clientAuthenticated && businessID ? (
              <ClientDashboard />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/appointmentmaker"
          element={
            clientAuthenticated && businessID ? (
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
            adminAuthenticated && businessID ? (
              <Services />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/appointmentshistory"
          element={
            adminAuthenticated && businessID ? (
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
