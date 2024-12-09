import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./views/Login";
import AdminDashboard from "./views/AdminDashboard";
import Appointments from "./views/Appointments";
import Clients from "./views/Clients";
import RestDays from "./views/RestDays";
import Register from "./views/Register";
import ClientDashboard from "./views/ClientDashboard";
import AppointmentMaker from "./views/AppointmentMaker";

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
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/restdays" element={<RestDays />} />
        <Route path="/register" element={<Register />} />
        <Route path="/clientdashboard" element={<ClientDashboard />} />
        <Route path="/appointmentmaker" element={<AppointmentMaker />} />
      </Routes>
    </Router>
  );
};

export default App;
