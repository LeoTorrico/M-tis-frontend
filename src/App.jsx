import { Route, Routes, useLocation } from "react-router-dom";
import Sidebar from "./Components/Sidebar";
import Navbar from "./Components/Navbar";
import "./App.css";
import Inicio from "./Pages/Inicio";
import LoginEstudiantes from "./Pages/LoginEstudiantes";
import PlanificacionDocente from "./Pages/PlanificacionDocente";
import VistaCurso from "./Pages/VistaCurso";
import Modal from "react-modal";
import ClasesPrueba from "./Pages/ClasesPrueba";
import RegistroDocentes from "./Components/RegistroD/RegistroDocentes";
import Home from "./Pages/Home";
import RegistroEstudiante from "./Components/Registros/RegistroEstudiantes";
import EnviarSolicitud from "./Pages/EnviarSolicitud";
import RestablecerContrasenia from "./Pages/RestablecerContrasenia";
import LoginEstudiantes from "./pages/LoginEstudiantes";
import LoginDocentes from "./Pages/LoginDocentes";

Modal.setAppElement("#root");

function App() {
  return (
    <div className="flex flex-col w-screen h-screen font-title">
      <Layout>
        <Routes>
          <Route path="/Inicio" element={<Inicio />} />{" "}
          {/* Cambiado a Inicio */}
          <Route path="/login" element={<LoginEstudiantes />} />
          <Route
            path="/planificacion-docente"
            element={<PlanificacionDocente />}
          />
          <Route path="/Vista-Curso" element={<VistaCurso />} />
          <Route path="/RegistroDocentes" element={<RegistroDocentes />} />
          <Route path="/RegistroEstudiante" element={<RegistroEstudiante />} />
          <Route path="/" element={<Home />} />
          <Route path="/ClasesPrueba" element={<ClasesPrueba />} />{" "}
          <Route path="/EnviarSolicitud" element={<EnviarSolicitud />} />
          <Route
            path="/reset-password/:token"
            element={<RestablecerContrasenia />}
          />
          <Route path="/LoginEstudiantes" element={<LoginEstudiantes />} />
          <Route path="/LoginDocentes" element={<LoginDocentes />} />
        </Routes>
      </Layout>
    </div>
  );
}

function Layout({ children }) {
  const location = useLocation();
  const isLoginPage =
    location.pathname === "/LoginEstudiantes" ||
    location.pathname === "/LoginDocentes";

  const isSidebarPage =
    location.pathname === "/Inicio" ||
    location.pathname === "/planificacion-docente" ||
    location.pathname === "/Vista-Curso" ||
    location.pathname === "/ClasesPrueba"; 

  return (
    <div className="flex flex-grow">
      {isSidebarPage && <Sidebar />}
      <div className={flex-grow ${isSidebarPage ? "ml-64" : ""}}>
        {isLoginPage && <Navbar />}
        {children}
      </div>
    </div>
  );
}

export default App;