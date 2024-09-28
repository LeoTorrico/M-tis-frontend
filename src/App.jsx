
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
Modal.setAppElement("#root");
import { Route, Routes } from "react-router-dom";
import "./App.css";
import RegistroDocentes from "./Components/RegistroD/RegistroDocentes";
import Home from "./Pages/Home";
function App() {
  return (
    <Router>
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
             <Route
          path="/RegistroDocentes"
          element={<RegistroDocentes></RegistroDocentes>}
        />
        <Route path="/" element={<Home></Home>} />
     
          </Routes>
        </Layout>
      </div>
    </Router>
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
      {isSidebarPage && <Sidebar />}{" "}
      {/* Mostrar Sidebar solo en Inicio y Planificación Docente */}
      <div className={`flex-grow ${isSidebarPage ? "ml-64" : ""}`}>
        {isLoginPage && <Navbar />} {/* Mostrar Navbar solo en Login */}
        {children}
      </div>
    </div>
  );
}
 

export default App;



