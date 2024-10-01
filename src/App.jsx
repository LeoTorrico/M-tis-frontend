import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './Components/Sidebar';
import Navbar from './Components/Navbar';
import './App.css';
import Inicio from './Pages/Inicio';
import LoginEstudiantes from './pages/LoginEstudiantes';
import LoginDocentes from './Pages/LoginDocentes';
import RestablecerContrasenia from './Pages/RestablecerContrasenia';
import PlanificacionDocente from './pages/PlanificacionDocente';
import EnviarSolicitud from './Pages/EnviarSolicitud';

function App() {
  return (
    <Router>
      <div className="flex flex-col w-screen h-screen">
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/LoginEstudiantes" />} />
            <Route path="/Inicio" element={<Inicio />} />
            <Route path="/LoginEstudiantes" element={<LoginEstudiantes />} />
            <Route path="/LoginDocentes" element={<LoginDocentes/>} />
            <Route path="/planificacion-docente" element={<PlanificacionDocente />} />
            <Route path="/reset-password/:token" element={<RestablecerContrasenia />} />
            <Route path="/EnviarSolicitud" element={<EnviarSolicitud />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

function Layout({ children }) {
  const location = useLocation();
  const isLoginPage = location.pathname === '/LoginEstudiantes' || location.pathname === '/LoginDocentes';
  const isSidebarPage = location.pathname === '/Inicio' || location.pathname === '/planificacion-docente';

  return (
    <div className="flex flex-grow">
      {isSidebarPage && <Sidebar />} {/* Mostrar Sidebar solo en Inicio y Planificación Docente */}
      <div className={`flex-grow ${isSidebarPage ? 'ml-64' : ''}`}>
        {isLoginPage && <Navbar />} {/* Mostrar Navbar solo en Login */}
        {children}
      </div>
    </div>
  );
}

export default App;
