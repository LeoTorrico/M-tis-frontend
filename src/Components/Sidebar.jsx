import React, { useContext } from "react";
import Avatar from "react-avatar";
import {
  FaHome,
  FaBuilding,
  FaClipboardList,
  FaChartLine,
  FaBell,
  FaSignOutAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext"; // Ajusta la ruta según tu estructura de carpetas

const Sidebar = () => {
  const { user } = useContext(UserContext);
  console.log(user);
  if (!user) {
    return <p>Cargando...</p>; // Muestra algo mientras los datos se cargan
  }
  return (
    <div className="flex flex-col h-full w-64 bg-dark-blue text-white font-title fixed">
      {/* Logo */}
      <div className="flex items-center justify-center py-4">
        <img src="/logoSidebar.svg" alt="Logo Blanco" className="w-22 h-20" />
      </div>

      {/* Navegación */}
      <nav className="mt-8 space-y-6">
        <Link
          to="/"
          className="flex items-center px-4 py-2 hover:bg-light-blue transition-colors"
        >
          <FaHome className="mr-3" />
          Inicio
        </Link>
        <a
          href="#grupo-empresas"
          className="flex items-center px-4 py-2 hover:bg-light-blue transition-colors"
        >
          <FaBuilding className="mr-3" />
          Grupo Empresas
        </a>
        <Link
          to="/"
          className="flex items-center px-4 py-2 hover:bg-light-blue transition-colors"
        >
          <FaClipboardList className="mr-3" />
          Planificación
        </Link>
        <a
          href="#evaluaciones"
          className="flex items-center px-4 py-2 hover:bg-light-blue transition-colors"
        >
          <FaClipboardList className="mr-3" />
          Evaluaciones
        </a>
      </nav>
      <div className="flex flex-col items-center justify-center flex-grow mt-4">
        <img
          src="https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=Felix?flip=false"
          alt="avatar"
          className="w-20 h-20 rounded-full"
        />
        <h3 className="mt-2 text-lg font-semibold">{user.codigoSis}</h3>
        <p className="text-sm">{user.rol}</p>
      </div>
      <nav className="mt-auto space-y-6 mb-8">
        <a
          href="#notificaciones"
          className="flex items-center px-4 py-2 hover:bg-light-blue transition-colors"
        >
          <FaBell className="mr-3" />
          Notificaciones
        </a>
        <a
          href="#cerrar-sesion"
          className="flex items-center px-4 py-2 hover:bg-light-blue transition-colors"
        >
          <FaSignOutAlt className="mr-3" />
          Cerrar sesión
        </a>
      </nav>
    </div>
  );
};

export default Sidebar;
