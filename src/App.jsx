import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Sidebar from './Components/Sidebar';
import Navbar from './Components/Navbar';
import './App.css';
import Inicio from './Pages/Inicio';
import LoginEstudiantes from './pages/LoginEstudiantes';
import PlanificacionDocente from './Pages/PlanificacionDocente'; // Importa el nuevo componente
import ClasesPrueba from './Pages/ClasesPrueba';
function App() {
  return (
    <Router>
      <div className="flex flex-col w-screen h-screen ">
        <NavbarAndSidebar />
        <div className="flex flex-grow font-title">
          <Routes>
            <Route
              path="/Inicio"
              element={
                <>
                  <Sidebar />
                  <div className="flex-grow p-4">
                    <Inicio />
                  </div>
                </>
              }
            />
            <Route
              path="/login"
              element={
                <div className="flex flex-grow p-4">
                  <LoginEstudiantes />
                </div>
              }
            />
            <Route
              path="/planificacion-docente"
              element={
                <>
                  <Sidebar />
                  <div className="flex-grow p-4">
                    <PlanificacionDocente />
                  </div>
                </>
              }
            />
            <Route
              path="/prueba"
              element={
                <>
                  <Sidebar />
                  <div className="flex-grow p-4">
                    <ClasesPrueba />
                  </div>
                </>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

function NavbarAndSidebar() {
  const location = useLocation();
  const showNavbar = location.pathname === '/login'; 

  return <>{showNavbar && <Navbar />}</>;
}

export default App;
