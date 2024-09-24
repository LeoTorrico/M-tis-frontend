import React, { useState } from "react";
import HeaderCurso from "../Components/HeaderCurso";
import { MdGroups } from "react-icons/md";

const curso = {
  nombre: "Taller de Ingeniería de Software",
  gestion: "II-2024",
};

const grupos = [
  { id: 1, nombre: "CodeCraft" },
  { id: 2, nombre: "ActionSoft" },
  { id: 3, nombre: "Agile Action" },
  { id: 4, nombre: "AiraSoft" },
  { id: 5, nombre: "Compusoft" },
  { id: 6, nombre: "DevSociety" },
];

// Simulación de las secciones (componentes individuales)
const Tablon = () => <div className="p-4">Contenido del Tablón</div>;

const GruposEmpresas = () => (
  <div className="p-4">
    {grupos.map((grupo) => (
      <div
        key={grupo.id}
        className="bg-light-blue rounded-lg p-4 flex justify-between items-center mb-4"
      >
        <div className="flex items-center">
          <span className="bg-white p-2 rounded-full text-semi-blue mr-4">
            <MdGroups />
          </span>
          <span className="text-lg font-medium">{grupo.nombre}</span>
        </div>
        <button className="bg-semi-blue text-white px-4 py-2 rounded-lg">
          Ver Grupo
        </button>
      </div>
    ))}
  </div>
);
const Alumnos = () => <div className="p-4">Lista de Alumnos</div>;

function VistaCurso() {
  // Manejo de pestañas seleccionadas
  const [activeTab, setActiveTab] = useState("GruposEmpresas");

  // Función para renderizar el contenido basado en la pestaña activa
  const renderContent = () => {
    switch (activeTab) {
      case "Tablon":
        return <Tablon />;
      case "GruposEmpresas":
        return <GruposEmpresas />;
      case "Alumnos":
        return <Alumnos />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Header con las pestañas */}
      <HeaderCurso activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Encabezado de la clase */}
      <div className="bg-semi-blue text-white p-6 rounded-lg m-4">
        <h1 className="text-3xl font-bold">{curso.nombre}</h1>
        <p className="text-xl">{curso.gestion}</p>

        {/* Mostrar el botón "Crear grupo" solo si la pestaña activa es "GruposEmpresas" */}
        {activeTab === "GruposEmpresas" && (
          <div className="flex justify-end">
            <button className="bg-white text-dark-blue font-semibold px-4 py-2 rounded-lg border border-blue-800 flex items-center">
              Crear grupo
              <span className="ml-2 text-xl">+</span>
            </button>
          </div>
        )}
      </div>

      {/* Contenido dinámico basado en la pestaña activa */}
      {renderContent()}
    </div>
  );
}

export default VistaCurso;
