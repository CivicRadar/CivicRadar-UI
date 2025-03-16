import React, { createContext, useContext, useState } from "react";

const MayorContext = createContext();

export const useMayor = () => useContext(MayorContext);

export const MayorProvider = ({ children }) => {
  const [mayor, setMayor] = useState(() => {
    const savedMayor = localStorage.getItem("mayor");
    return savedMayor ? JSON.parse(savedMayor) : null;
  });

  const loginMayor = (data) => {
    setMayor(data);
    localStorage.setItem("mayor", JSON.stringify(data));
  };

  const logoutMayor = () => {
    setMayor(null);
    localStorage.removeItem("mayor");
  };

  return (
    <MayorContext.Provider value={{ mayor, loginMayor, logoutMayor }}>
      {children}
    </MayorContext.Provider>
  );
};
