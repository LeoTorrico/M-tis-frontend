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
import Rubrica from "./Pages/Rubrica";
Modal.setAppElement("#root");

function App() {
  return (
    <div className="flex flex-col w-screen h-screen font-title">
      <Layout>
        <AnimatePresence>
          <Routes>
            <Route path="/" element={<ClasesPrueba />} />{" "}
            <Route path="/Vista-Curso/:cod_clase" element={<VistaCurso />} />
            <Route
              path="/Vista-Curso/:cod_clase/grupo/:cod_grupoempresa"
              element={<GrupoDetalles />}
            />
            <Route path="/RegistroDocentes" element={<RegistroDocentes />} />
            <Route
              path="/RegistroEstudiante"
              element={<RegistroEstudiante />}
            />
            <Route path="/EnviarSolicitud" element={<EnviarSolicitud />} />
            <Route
              path="/reset-password/:token"
              element={<RestablecerContrasenia />}
            />
            <Route path="/Rubrica" element={<Rubrica />} />
            <Route path="/LoginEstudiantes" element={<LoginEstudiantes />} />
            <Route path="/LoginDocentes" element={<LoginDocentes />} />
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
    location.pathname === "/Rubrica";

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
