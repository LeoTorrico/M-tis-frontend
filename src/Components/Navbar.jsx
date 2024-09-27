import { Link } from 'react-router-dom';

const Navbar = () => {
return(
<div className="flex items-center justify-between h-20 w-full bg-dark-blue text-white font-title">

  <div className="flex items-center justify-center py-4">
    <img src="/logoSidebar.svg" alt="Logo Blanco" className="w-22 h-20" />
  </div>

  <nav className="flex space-x-0">
        <a href="/LoginEstudiantes" className="flex items-center px-8 py-7 hover:bg-light-gray transition-colors">
          ESTUDIANTES
        </a>
        <a href="/LoginDocentes" className="flex items-center px-8 py-7 hover:bg-light-gray transition-colors">
          DOCENTES
        </a>
      </nav>
</div>
  
);
};
export default Navbar;