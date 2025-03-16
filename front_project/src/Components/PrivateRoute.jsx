import React from "react";
import { Navigate } from "react-router-dom";
import { useCitizen } from "../context/CitizenContext"; 
import { useMayor } from "../context/MayorContext"; 
import { useAdmin } from "../context/AdminContext"; 

const PrivateRoute = ({ children, role }) => {
  const { citizen } = useCitizen(); 
  const { mayor } = useMayor(); 
  const { admin } = useAdmin(); 

  console.log("PrivateRoute - Role:", role);
  console.log("PrivateRoute - Citizen:", citizen);
  console.log("PrivateRoute - Mayor:", mayor);
  console.log("PrivateRoute - Admin:", admin);

  if (role === "Citizen" && !citizen) {
    console.log("Redirecting to /signuplogin");
    return <Navigate to="/signuplogin" replace />;
  }

  if (role === "Mayor" && !mayor) {
    console.log("Redirecting to /signuplogin");
    return <Navigate to="/signuplogin" replace />;
  }

  if (role === "Admin" && !admin) {
    console.log("Redirecting to /signuplogin");
    return <Navigate to="/signuplogin" replace />;
  }

  return children;
};

export default PrivateRoute;
