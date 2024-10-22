import React, { useState } from "react";
import Nivel from "./Nivel";

const Criterio = ({ criterio, onChange, onDelete }) => {
  const { titulo, descripcion, niveles } = criterio;

  const handleTituloChange = (e) => {
    onChange({ ...criterio, titulo: e.target.value });
  };

  const handleDescripcionChange = (e) => {
    onChange({ ...criterio, descripcion: e.target.value });
  };

  const agregarNivel = () => {
    if (criterio.niveles.length < 3) {
      onChange({
        ...criterio,
        niveles: [...niveles, { puntos: "", tituloNivel: "", descripcion: "" }],
      });
    }
  };

  const actualizarNivel = (index, nuevoNivel) => {
    const nuevosNiveles = [...niveles];
    nuevosNiveles[index] = nuevoNivel;
    onChange({ ...criterio, niveles: nuevosNiveles });
  };

  const eliminarNivel = (index) => {
    onChange({ ...criterio, niveles: niveles.filter((_, i) => i !== index) });
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg mt-4 relative">
      <input
        type="text"
        value={titulo}
        onChange={handleTituloChange}
        placeholder="Título del criterio"
        className="w-full mb-2 p-2 border border-gray-300 rounded"
      />
      <textarea
        value={descripcion}
        onChange={handleDescripcionChange}
        placeholder="Descripción del criterio"
        className="w-full mb-2 p-2 border border-gray-300 rounded"
      />

      <div className="flex flex-row space-x-4">
        {niveles.map((nivel, index) => (
          <Nivel
            key={index}
            nivel={nivel}
            onChange={(nuevoNivel) => actualizarNivel(index, nuevoNivel)}
            onDelete={() => eliminarNivel(index)}
          />
        ))}

        {niveles.length < 3 && (
          <button
            onClick={agregarNivel}
            className="bg-dark-blue text-white w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:bg-blue-modal transition duration-300"
          >
            +
          </button>
        )}
      </div>

      <button
        onClick={onDelete}
        className="bg-red-500 text-white px-4 py-2 rounded mt-4"
      >
        Eliminar criterio
      </button>
    </div>
  );
};

export default Criterio;
