import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import VerEvaluacion from "../Components/EvaluacionDetalles/VerEvaluacion";
import Instrucciones from "../Components/EvaluacionDetalles/Instrucciones";
import TrabajoGrupo from "../Components/EvaluacionDetalles/TrabajoGrupo";

const EvaluacionDetalles = () => {
  const { cod_clase, cod_evaluacion } = useParams();
  const [evaluacion, setEvaluacion] = useState(null);
  const { user } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("instrucciones");
  const navigate = useNavigate();

  const fetchEvaluacion = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/evaluaciones/detalles/${cod_evaluacion}`, 
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json"
          }
        }
      );
      setEvaluacion(response.data);
    } catch (error) {
      console.error("Error al obtener los detalles de la evaluación:", error);
    }
  };

  useEffect(() => {
    fetchEvaluacion();
  }, [cod_clase, cod_evaluacion]);

  if (!evaluacion) {
    return <p>Cargando detalles de la evaluación...</p>;
  }

  if (user.rol !== "docente") {
    return <VerEvaluacion evaluacion={evaluacion} />;
  }

  return (
    <div className="flex flex-col w-full">
      {/* Header de navegación con diseño adaptado */}
      <div className="flex justify-between items-center border-b-2 border-dark-blue px-6 py-2">
        <div className="w-20"></div>
        <div className="flex justify-center space-x-8 flex-grow">
          <button
            onClick={() => navigate(`/Vista-Curso/${cod_clase}`)} // Navegar a Tablón
            className={`${
              activeTab === "tablon"
                ? "bg-semi-blue text-white"
                : "text-dark-blue"
            } px-4 py-2 rounded-lg font-medium`}
          >
            Tablón
          </button>
          <button
            onClick={() => setActiveTab("instrucciones")}
            className={`${
              activeTab === "instrucciones"
                ? "bg-semi-blue text-white"
                : "text-dark-blue"
            } px-4 py-2 rounded-lg font-medium`}
          >
            Instrucciones
          </button>
          <button
            onClick={() => setActiveTab("trabajoGrupo")}
            className={`${
              activeTab === "trabajoGrupo"
                ? "bg-semi-blue text-white"
                : "text-dark-blue"
            } px-4 py-2 rounded-lg font-medium`}
          >
            Trabajo de los Grupos
          </button>
        </div>
      </div>

      <div>
        {activeTab === "instrucciones" && <Instrucciones evaluacion={evaluacion} user={user} />}
        {activeTab === "trabajoGrupo" && <TrabajoGrupo evaluacion={evaluacion} />}
      </div>
    </div>
  );
};

export default EvaluacionDetalles;
