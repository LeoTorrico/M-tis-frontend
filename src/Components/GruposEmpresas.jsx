import React from "react";
import { MdGroups } from "react-icons/md";

const GruposEmpresas = ({ grupos }) => (
  <div className="p-2">
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

export default GruposEmpresas;
