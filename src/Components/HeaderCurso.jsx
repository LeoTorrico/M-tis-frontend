import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";

function HeaderCurso({ activeTab, setActiveTab }) {
  const { user } = useContext(UserContext);

  return (
    <div className="flex justify-between items-center border-b-2 border-dark-blue px-6 py-2">
      <div className="w-20"></div>

      <div className="flex justify-center space-x-8 flex-grow">
        <button
          onClick={() => setActiveTab("Tablon")}
          className={`${
            activeTab === "Tablon"
              ? "bg-semi-blue text-white"
              : "text-dark-blue"
          } px-4 py-2 rounded-lg font-medium`}
        >
          Tablon
        </button>
        <button
          onClick={() => setActiveTab("GruposEmpresas")}
          className={`${
            activeTab === "GruposEmpresas"
              ? "bg-semi-blue text-white"
              : "text-dark-blue"
          } px-4 py-2 rounded-lg font-medium`}
        >
          Grupos-empresas
        </button>
        <button
          onClick={() => setActiveTab("Alumnos")}
          className={`${
            activeTab === "Alumnos"
              ? "bg-semi-blue text-white"
              : "text-dark-blue"
          } px-4 py-2 rounded-lg font-medium`}
        >
          Alumnos
        </button>

        {user && user.rol === "docente" && (
          <button
            onClick={() => setActiveTab("Reporte")}
            className={`${
              activeTab === "Reporte"
                ? "bg-semi-blue text-white"
                : "text-dark-blue"
            } px-4 py-2 rounded-lg font-medium`}
          >
            Reporte
          </button>
        )}
      </div>
    </div>
  );
}

export default HeaderCurso;
