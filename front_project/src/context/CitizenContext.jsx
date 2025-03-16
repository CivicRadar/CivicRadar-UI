import React, { createContext, useContext, useState } from "react";

const CitizenContext = createContext();

export const useCitizen = () => useContext(CitizenContext);

export const CitizenProvider = ({ children }) => {
  const [citizen, setCitizen] = useState(() => {
    const savedCitizen = localStorage.getItem("citizen");
    return savedCitizen ? JSON.parse(savedCitizen) : null;
  });

  const loginCitizen = (data) => {
    setCitizen(data);
    localStorage.setItem("citizen", JSON.stringify(data));
  };

  const logoutCitizen = () => {
    setCitizen(null);
    localStorage.removeItem("citizen");
  };

  return (
    <CitizenContext.Provider value={{ citizen, loginCitizen, logoutCitizen }}>
      {children}
    </CitizenContext.Provider>
  );
};
