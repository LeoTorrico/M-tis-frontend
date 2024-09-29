import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
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

Modal.setAppElement("#root");

function App() {
  return (
    <div className="flex flex-col w-screen h-screen font-title">
      <Layout>
        <Routes>
          <Route path="/Inicio" element={<ClasesPrueba />} />
          <Route path="/login" element={<LoginEstudiantes />} />
          <Route
            path="/planificacion-docente"
            element={<PlanificacionDocente />}
          />
          <Route path="/Vista-Curso" element={<VistaCurso />} />
          <Route path="/RegistroDocentes" element={<RegistroDocentes />} />
          <Route path="/RegistroEstudiante" element={<RegistroEstudiante />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Layout>
    </div>
  );
}

function Layout({ children }) {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const isSidebarPage =
    location.pathname === "/Inicio" ||
    location.pathname === "/planificacion-docente" ||
    location.pathname === "/Vista-Curso";

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
