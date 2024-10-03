import { useLocation, Link } from "react-router-dom";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Verifica si la ruta actual es para estudiantes o docentes
  const isEstudiantesRoute =
    location.pathname === "/LoginEstudiantes" ||
    location.pathname === "/RegistroEstudiante";
  const isDocentesRoute =
    location.pathname === "/LoginDocentes" ||
    location.pathname === "/RegistroDocentes";

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="relative flex items-center justify-between h-20 w-full bg-dark-blue text-white font-title">
      {/* Menú para pantallas grandes, alineado a la derecha */}
      <nav className="hidden md:flex space-x-0 ml-auto">
        <Link
          to="/LoginEstudiantes"
          className={`flex items-center px-8 py-7 transition-colors ${
            isEstudiantesRoute ? "bg-white text-black" : "hover:bg-light-gray"
          }`}
        >
          ESTUDIANTES
        </Link>

        <Link
          to="/LoginDocentes"
          className={`flex items-center px-8 py-7 transition-colors ${
            isDocentesRoute ? "bg-white text-black" : "hover:bg-light-gray"
          }`}
        >
          DOCENTES
        </Link>
      </nav>

      {/* Botón del menú para pantallas pequeñas */}
      <div className="md:hidden flex items-center ml-auto pr-4">
        <button onClick={toggleMenu} className="text-white">
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Menú colapsable para pantallas pequeñas */}
      {isMenuOpen && (
        <div className="absolute top-20 left-0 right-0 bg-dark-blue text-center md:hidden z-10">
          <Link
            to="/LoginEstudiantes"
            className={`block px-4 py-3 transition-colors ${
              isEstudiantesRoute ? "bg-white text-black" : "hover:bg-light-gray"
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            ESTUDIANTES
          </Link>
          <Link
            to="/LoginDocentes"
            className={`block px-4 py-3 transition-colors ${
              isDocentesRoute ? "bg-white text-black" : "hover:bg-light-gray"
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            DOCENTES
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;
