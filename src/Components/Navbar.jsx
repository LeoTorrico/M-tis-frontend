import { useLocation, Link } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  // Verifica si la ruta actual es para estudiantes o docentes
  const isEstudiantesRoute =
    location.pathname === "/LoginEstudiantes" ||
    location.pathname === "/RegistroEstudiante";
  const isDocentesRoute =
    location.pathname === "/LoginDocentes" ||
    location.pathname === "/RegistroDocentes";

  return (
    <div className="flex items-center justify-between h-20 w-full bg-dark-blue text-white font-title">
      <div className="flex items-center justify-center py-4">
        <img src="/logoSidebar.svg" alt="Logo Blanco" className="w-22 h-20" />
      </div>

      <nav className="flex space-x-0">
        {/* Estudiantes link */}
        <Link
          to="/LoginEstudiantes"
          className={`flex items-center px-8 py-7 transition-colors ${
            isEstudiantesRoute ? "bg-white text-black" : "hover:bg-light-gray"
          }`}
        >
          ESTUDIANTES
        </Link>
        {/* Docentes link */}
        <Link
          to="/LoginDocentes"
          className={`flex items-center px-8 py-7 transition-colors ${
            isDocentesRoute ? "bg-white text-black" : "hover:bg-light-gray"
          }`}
        >
          DOCENTES
        </Link>
      </nav>
    </div>
  );
};

export default Navbar;
