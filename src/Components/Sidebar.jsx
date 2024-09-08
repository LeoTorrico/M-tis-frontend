import { FaHome, FaBuilding, FaClipboardList, FaChartLine, FaBell, FaSignOutAlt } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <div className="flex flex-col h-screen w-64 bg-dark-blue text-white font-title">
      
      <div className="flex items-center justify-center py-4">
        <div className="bg-gray-400 rounded-full w-12 h-12"></div>
        <h1 className="ml-3 text-lg font-bold">Mtis</h1>
      </div>

      
      <nav className="mt-8 space-y-6">
        <a href="#inicio" className="flex items-center px-4 py-2 hover:bg-light-blue transition-colors">
          <FaHome className="mr-3" />
          Inicio
        </a>
        <a href="#grupo-empresas" className="flex items-center px-4 py-2 hover:bg-light-blue transition-colors">
          <FaBuilding className="mr-3" />
          Grupo Empresas
        </a>
        <a href="#planificacion" className="flex items-center px-4 py-2 hover:bg-light-blue transition-colors">
          <FaClipboardList className="mr-3" />
          Planificación
        </a>
        <a href="#evaluaciones" className="flex items-center px-4 py-2 hover:bg-light-blue transition-colors">
          <FaClipboardList className="mr-3" />
          Evaluaciones
        </a>
        <a href="#reportes" className="flex items-center px-4 py-2 hover:bg-light-blue transition-colors">
          <FaChartLine className="mr-3" />
          Reportes
        </a>
      </nav>
      <nav className="mt-auto space-y-6 mb-8">
        <a href="#notificaciones" className="flex items-center px-4 py-2 hover:bg-light-blue transition-colors">
          <FaBell className="mr-3" />
          Notificaciones
        </a>
        <a href="#cerrar-sesion" className="flex items-center px-4 py-2 hover:bg-light-blue transition-colors">
          <FaSignOutAlt className="mr-3" />
          Cerrar sesión
        </a>
      </nav>
    </div>
  );
};

export default Sidebar;
