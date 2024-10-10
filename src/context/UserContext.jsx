import React, { createContext, useState, useEffect } from "react";
import getDetailsFromToken from "../Pages/Utils";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUserFromToken = () => {
      const token = localStorage.getItem("token");
      if (token) {
        const userDetails = getDetailsFromToken(token);
        setUser({ ...userDetails, token });
      } else {
        setUser(null); // No token, usuario no autenticado
      }
    };

    // Cargar el usuario inicialmente
    loadUserFromToken();

    // Escuchar los cambios en el almacenamiento local
    const handleStorageChange = (event) => {
      if (event.key === "token") {
        loadUserFromToken();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
