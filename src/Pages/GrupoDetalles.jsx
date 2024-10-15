import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useParams } from "react-router-dom";
import InformacionGrupo from "../Components/GrupoDetalles/InformacionGrupo";
import RegistrarBacklog from "../Components/GrupoDetalles/RegistrarBacklog";

const GrupoDetalles = () => {
  const [grupo, setGrupo] = useState(null);
  const [activeTab, setActiveTab] = useState("informacion");
  const { user } = useContext(UserContext);
  const { cod_grupoempresa } = useParams();

  const fetchGrupo = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/grupos/grupo/${cod_grupoempresa}`
      );
      const data = await response.json();
      setGrupo(data);
    } catch (error) {
      console.error("Error al obtener los detalles del grupo:", error);
    }
  };

  useEffect(() => {
    fetchGrupo();
  }, [cod_grupoempresa]);

  if (!grupo) {
    return <p>Cargando detalles del grupo...</p>;
  }

  return (
    <div className="flex flex-col w-full">
      {/* Header de navegación con diseño adaptado */}
      <div className="flex justify-between items-center border-b-2 border-dark-blue px-6 py-2">
        {/* Contenedor vacío para mantener el ícono de usuario en la derecha (en caso de necesitar espacio adicional) */}
        <div className="w-20"></div>

        {/* Pestañas centradas */}
        <div className="flex justify-center space-x-8 flex-grow">
          <button
            onClick={() => setActiveTab("informacion")}
            className={`${
              activeTab === "informacion"
                ? "bg-semi-blue text-white"
                : "text-dark-blue"
            } px-4 py-2 rounded-lg font-medium`}
          >
            Información
          </button>
          <button
            onClick={() => setActiveTab("backlog")}
            className={`${
              activeTab === "backlog"
                ? "bg-semi-blue text-white"
                : "text-dark-blue"
            } px-4 py-2 rounded-lg font-medium`}
          >
            Product Backlog
          </button>
        </div>
      </div>

      {/* Contenido dinámico basado en la pestaña seleccionada */}
      {activeTab === "informacion" ? (
        <InformacionGrupo grupo={grupo} user={user} />
      ) : (
        <RegistrarBacklog />
      )}
    </div>
  );
};

export default GrupoDetalles;
