/** @format */

import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../../store/authSlice";

const ProtectedRoutes = () => {
  const isLoggedIn = useSelector(isAuthenticated);

  if (!isLoggedIn) {
    return <Navigate to={"/"} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
