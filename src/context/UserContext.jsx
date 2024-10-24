import React, { createContext, useState, useEffect } from "react";
import getDetailsFromToken from "../Pages/Utils";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const userDetails = getDetailsFromToken(token);
      return { ...userDetails, token };
    }
    return { token: null, rol: null }; // Retornar estado inicial si no hay token
  });

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "token") {
        const token = localStorage.getItem("token");
        if (token) {
          const userDetails = getDetailsFromToken(token);
          setUser({ ...userDetails, token });
        } else {
          setUser({ token: null, rol: null }); // Reiniciar estado si no hay token
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser({ token: null, rol: null }); // Reiniciar el estado
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
