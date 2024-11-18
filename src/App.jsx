import { Route, Routes, useLocation } from "react-router-dom";
import Sidebar from "./Components/Sidebar";
import Navbar from "./Components/Navbar";
import "./App.css";
import LoginEstudiantes from "./Pages/LoginEstudiantes";
import VistaCurso from "./Pages/VistaCurso";
import Modal from "react-modal";
import ClasesPrueba from "./Pages/ClasesPrueba";
import RegistroDocentes from "./Pages/RegistroDocentes";
import RegistroEstudiante from "./Pages/RegistroEstudiantes";
import EnviarSolicitud from "./Pages/EnviarSolicitud";
import RestablecerContrasenia from "./Pages/RestablecerContrasenia";
import LoginDocentes from "./Pages/LoginDocentes";
import { AnimatePresence } from "framer-motion";
import GrupoDetalles from "./Pages/GrupoDetalles";
import EvaluacionSemanal from "./Pages/EvaluacionSemanal";
import Asistencia from "./Pages/Asistencia";
import Rubrica from "./Pages/Rubrica";
import EvaluacionDetalles from "./Pages/EvaluacionDetalles";
import Evaluacion from "./Pages/Evaluacion";
import VistaEvaluacion from "./Pages/VistaEvaluacion";
import Reportes from "./Pages/Reportes";
import ReporteAsistencia from "./Pages/ReporteAsistencia";

Modal.setAppElement("#root");

function App() {
  return (
    <div className="flex flex-col w-screen h-screen font-title">
      <Layout>
        <AnimatePresence>
          <Routes>
            <Route path="/" element={<ClasesPrueba />} />
            <Route path="/Vista-Curso/:cod_clase" element={<VistaCurso />} />
            <Route
              path="/Vista-Curso/:cod_clase/grupo/:cod_grupoempresa"
              element={<GrupoDetalles />}
            />
            <Route
              path="/Vista-Curso/:cod_clase/evaluacion/:cod_evaluacion"
              element={<VistaEvaluacion />}
            />
            <Route path="/RegistroDocentes" element={<RegistroDocentes />} />
            <Route path="/Evaluacion/:cod_clase" element={<Evaluacion />} />
            <Route
              path="/RegistroEstudiante"
              element={<RegistroEstudiante />}
            />
            <Route path="/EnviarSolicitud" element={<EnviarSolicitud />} />
            <Route
              path="/reset-password/:token"
              element={<RestablecerContrasenia />}
            />
            <Route path="/Rubrica/:cod_evaluacion" element={<Rubrica />} />
            <Route path="/LoginEstudiantes" element={<LoginEstudiantes />} />
            <Route path="/LoginDocentes" element={<LoginDocentes />} />
            <Route
              path="/Vista-Curso/:cod_clase/evaluacion-semanal/:cod_grupoempresa/:cod_evaluacion"
              element={<EvaluacionSemanal />}
            />
            <Route path="/Asistencia" element={<Asistencia />} />
            <Route path="/Reportes" element={<Reportes />} />
            <Route path="/Reporte-asistencia/:cod_clase/:cod_grupoempresa" element={<ReporteAsistencia />} />
          </Routes>
        </AnimatePresence>
      </Layout>
    </div>
  );
}

function Layout({ children }) {
  const location = useLocation();

  const isLoginPage =
    location.pathname === "/LoginEstudiantes" ||
    location.pathname === "/LoginDocentes" ||
    location.pathname === "/RegistroDocentes" ||
    location.pathname === "/RegistroEstudiante";

  const isSidebarPage =
    location.pathname === "/" ||
    location.pathname.match(/^\/Vista-Curso\/.+$/) ||
    (location.pathname.startsWith("/Vista-Curso/") &&
      location.pathname.includes("evaluacion-semanal")) ||
    location.pathname === "/Asistencia" ||
    location.pathname === "/Reportes" ||
    location.pathname.match(/^\/Reporte-asistencia\/[^/]+\/[^/]+$/) ||
    location.pathname.match(/^\/Rubrica\/.+$/) ||
    location.pathname.match(/^\/Evaluacion\/.+$/);
  return (
    <div className="flex flex-grow">
      {isSidebarPage && <Sidebar />}
      <div className={`flex-grow ${isSidebarPage ? "ml-64" : ""}`}>
        {isLoginPage && <Navbar />}
        {children}
      </div>
    </div>
  );
}

export default App;
