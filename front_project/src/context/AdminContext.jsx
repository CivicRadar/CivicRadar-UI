import React, { createContext, useContext, useState } from "react";

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    const savedAdmin = localStorage.getItem("admin");
    return savedAdmin ? JSON.parse(savedAdmin) : null;
  });

  const loginAdmin = (data) => {
    setAdmin(data);
    localStorage.setItem("admin", JSON.stringify(data));
  };

  const logoutAdmin = () => {
    setAdmin(null);
    localStorage.removeItem("admin");
  };

  return (
    <AdminContext.Provider value={{ admin, loginAdmin, logoutAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};
