import { Link } from 'react-router-dom';

const Navbar = () => {
return(
<div className="flex items-center justify-between h-20 w-full bg-dark-blue text-white font-title">

  <div className="flex items-center justify-center">
    <img src="/logoSidebar.svg" alt="Logo Blanco" className="w-22 h-20" />
  </div>

  <nav className="flex space-x-0">
        <a href="#inicio" className="flex items-center px-8 py-7 hover:bg-light-gray transition-colors">
          ESTUDIANTES
        </a>
        <a href="#perfil" className="flex items-center px-8 py-7 hover:bg-light-gray transition-colors">
          DOCENTES
        </a>
        <Link to="/Inicio" className="flex items-center px-4 py-2 hover:bg-light-blue transition-colors">
          Inicio
        </Link>
      </nav>
</div>
  
);
};
export default Navbar;