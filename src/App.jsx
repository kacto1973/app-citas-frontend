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
import ForgotPassword from "./views/ForgotPassword";
//import Menu from "./views/Menu";
//import RecentPayments from "./views/RecentPayments";
import Services from "./views/Services";
import AppointmentsHistory from "./views/AppointmentsHistory";

const App = () => {
  const clientAuthenticated = localStorage.getItem("clientAuthenticated");
  const adminAuthenticated = localStorage.getItem("adminAuthenticated");

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            clientAuthenticated ? (
              <ClientDashboard />
            ) : adminAuthenticated ? (
              <AdminDashboard />
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/admindashboard"
          element={
            adminAuthenticated ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/appointments"
          element={
            adminAuthenticated ? <Appointments /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/clients"
          element={
            adminAuthenticated ? <Clients /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/restdays"
          element={
            adminAuthenticated ? <RestDays /> : <Navigate to="/" replace />
          }
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/clientdashboard"
          element={
            clientAuthenticated ? (
              <ClientDashboard />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/appointmentmaker"
          element={
            clientAuthenticated ? (
              <AppointmentMaker />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route path="/forgotpassword" element={<ForgotPassword />} />

        <Route
          path="/services"
          element={
            adminAuthenticated ? <Services /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/appointmentshistory"
          element={
            adminAuthenticated ? (
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
