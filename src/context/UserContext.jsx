// UserContext.js
import React, { createContext, useState, useEffect } from "react";
import getDetailsFromToken from "../Pages/Utils";

// Crea el contexto
export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // Obtén el token desde localStorage
    const token = localStorage.getItem("token");
    // Si hay un token, extrae los detalles del usuario
    if (token) {
      const userDetails = getDetailsFromToken(token);
      setUser({ ...userDetails, token });
    }
    setIsLoading(false);
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
