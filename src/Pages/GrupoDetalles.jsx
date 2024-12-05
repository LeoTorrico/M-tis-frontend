import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useParams, useNavigate } from "react-router-dom";
import InformacionGrupo from "../Components/GrupoDetalles/InformacionGrupo";
import RegistrarBacklog from "../Components/GrupoDetalles/RegistrarBacklog";
import SprintBacklog from "../Components/GrupoDetalles/SprintBacklog";
import { TbArrowBackUp } from "react-icons/tb";

const GrupoDetalles = () => {
  const [grupo, setGrupo] = useState(null);
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("activeTab") || "informacion"
  );
  const [error, setError] = useState(null);
  const { user } = useContext(UserContext);
  const { cod_grupoempresa, cod_clase } = useParams();
  const navigate = useNavigate();

  const fetchGrupo = async () => {
    try {
      const response = await fetch(
        `https://backend-tis-silk.vercel.app/api/grupos/grupo/${cod_grupoempresa}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const data = await response.json();
      if (data.error) {
        setError(data.detalle);
        setTimeout(() => {
          navigate(`/Vista-Curso/${cod_clase}`, {
            state: { activeTab: "Tablon" },
          });
        }, 3000); // Espera 3 segundos antes de redirigir
      } else {
        setGrupo(data);
      }
    } catch (error) {
      console.error("Error al obtener los detalles del grupo:", error);
    }
  };

  useEffect(() => {
    fetchGrupo();
  }, [cod_grupoempresa]);

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg max-w-md text-center">
          <p className="font-semibold text-lg">Error</p>
          <p className="mt-2">{error}</p>
          <p className="mt-4 text-sm text-gray-600">
            Serás redirigido en unos segundos...
          </p>
        </div>
      </div>
    );
  }

  if (!grupo) {
    return <p>Cargando detalles del grupo...</p>;
  }

  const handleBackToBoard = () => {
    navigate(`/Vista-Curso/${cod_clase}`, { state: { activeTab: "Tablon" } });
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between items-center border-b-2 border-dark-blue px-6 py-2">
        <div className="w-20"></div>
        <button
          onClick={handleBackToBoard}
          className="absolute text-black px-2 py-2 hover:text-semi-blue"
        >
          <TbArrowBackUp className="w-6 h-6" />
        </button>
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
          <button
            onClick={() => setActiveTab("sprint")}
            className={`${
              activeTab === "sprint"
                ? "bg-semi-blue text-white"
                : "text-dark-blue"
            } px-4 py-2 rounded-lg font-medium`}
          >
            Sprint Backlog
          </button>
        </div>
      </div>

      {activeTab === "informacion" && (
        <InformacionGrupo grupo={grupo} user={user} />
      )}
      {activeTab === "backlog" && <RegistrarBacklog />}
      {activeTab === "sprint" && <SprintBacklog />}
    </div>
  );
};

export default GrupoDetalles;
