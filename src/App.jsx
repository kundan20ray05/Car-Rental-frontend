import React from "react";

import Navbar from "./components/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import CarDetails from "./pages/CarDetails";
import Cars from "./pages/Cars";
import MyBooking from "./pages/MyBooking";
import Footer from "./components/Footer";
import Layout from "./pages/owner/Layout";
import Dashboard from "./pages/owner/Dashboard";
import AddCar from "./pages/owner/AddCar";
import ManageCars from "./pages/owner/ManageCars";
import ManageBooking from "./pages/owner/ManageBooking";
import Login from "./pages/owner/Login";
import { Toaster } from "react-hot-toast";
import { SignUp, SignIn } from "@clerk/react";

const App = () => {
  const isOwnerPath = useLocation().pathname.startsWith("/owner");
  const isAuthPath = useLocation().pathname.startsWith("/auth");

  return (
    <>
      <Toaster />

      {!isOwnerPath && !isAuthPath && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/car-details/:id" element={<CarDetails />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/my-bookings" element={<MyBooking />} />
        <Route path="/auth/sign-in" element={<SignIn />} />
        <Route path="/auth/sign-up" element={<SignUp />} />
        <Route path="/owner" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="add-car" element={<AddCar />} />
          <Route path="manage-cars" element={<ManageCars />} />
          <Route path="manage-bookings" element={<ManageBooking />} />
        </Route>
      </Routes>

      {!isOwnerPath && !isAuthPath && <Footer />}
    </>
  );
};
export default App;
