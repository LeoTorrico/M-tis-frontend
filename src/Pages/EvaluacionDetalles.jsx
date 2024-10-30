import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import Instrucciones from "../Components/EvaluacionDetalles/Instrucciones";
import TrabajoGrupo from "../Components/EvaluacionDetalles/TrabajoGrupo";

const EvaluacionDetalles = () => {
  const { cod_clase, cod_evaluacion } = useParams();
  const [evaluacion, setEvaluacion] = useState(null);
  const { user } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("instrucciones");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchEvaluacion = async () => {
    if (!user || !user.token) {
      setError("Token de usuario no disponible.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `https://mtis.netlify.app/evaluaciones/detalles/${cod_evaluacion}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setEvaluacion(response.data);
    } catch (error) {
      console.error("Error al obtener los detalles de la evaluación:", error);
      setError(error.response ? error.response.data.message : "Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvaluacion();
  }, [cod_clase, cod_evaluacion, user]); // Asegúrate de incluir `user` aquí

  if (loading) {
    return <p>Cargando detalles de la evaluación...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  const tabs = [
    {
      name: "Tablón",
      visible: true,
      component: null,
      action: () => navigate(`/Vista-Curso/${cod_clase}`),
    },
    {
      name: "Instrucciones",
      visible: true,
      component: <Instrucciones evaluacion={evaluacion} user={user} />,
    },
    {
      name: "Trabajo de los Grupos",
      visible: user.rol === "docente",
      component: <TrabajoGrupo evaluacion={evaluacion} />,
    },
  ];

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between items-center border-b-2 border-dark-blue px-6 py-2">
        <div className="w-20"></div>
        <div className="flex justify-center space-x-8 flex-grow">
          {tabs
            .filter((tab) => tab.visible)
            .map((tab) => (
              <button
                key={tab.name}
                onClick={tab.action || (() => setActiveTab(tab.name.toLowerCase()))}
                className={`${
                  activeTab === tab.name.toLowerCase()
                    ? "bg-semi-blue text-white"
                    : "text-dark-blue"
                } px-4 py-2 rounded-lg font-medium`}
              >
                {tab.name}
              </button>
            ))}
        </div>
      </div>

      <div>
        {tabs
          .filter((tab) => tab.visible && activeTab === tab.name.toLowerCase())
          .map((tab) => (
            <div key={tab.name}>
              {tab.component}
            </div>
          ))}
      </div>
    </div>
  );
};

export default EvaluacionDetalles;
