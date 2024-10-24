import React, { useState } from "react";
import Nivel from "./Nivel";
import { FaRegTrashAlt } from "react-icons/fa";

const Criterio = ({ criterio, onChange, onDelete }) => {
  const { titulo, descripcion, niveles } = criterio;
  const [errores, setErrores] = useState({
    titulo: "",
    descripcion: "",
  });

  const handleTituloChange = (e) => {
    const newTitulo = e.target.value;
    let error = "";
    if (newTitulo.length < 10 || newTitulo.length > 50) {
      error = "El título debe tener entre 10 y 50 caracteres.";
    }
    setErrores((prev) => ({ ...prev, titulo: error }));
    onChange({ ...criterio, titulo: newTitulo });
  };

  const handleDescripcionChange = (e) => {
    const newDescripcion = e.target.value;
    let error = "";
    if (newDescripcion.length < 10 || newDescripcion.length > 200) {
      error = "La descripción debe tener entre 10 y 200 caracteres.";
    }
    setErrores((prev) => ({ ...prev, descripcion: error }));
    onChange({ ...criterio, descripcion: newDescripcion });
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
        placeholder="Título del criterio (10-50 caracteres)"
        className="w-full mb-2 p-2 border border-gray-300 rounded"
        maxLength="50"
        required
      />
      {errores.titulo && <span className="text-red-500">{errores.titulo}</span>}

      <textarea
        value={descripcion}
        onChange={handleDescripcionChange}
        placeholder="Descripción del criterio (10-200 caracteres)"
        className="w-full mb-2 p-2 border border-gray-300 rounded"
        maxLength="200"
        required
      />
      {errores.descripcion && (
        <span className="text-red-500">{errores.descripcion}</span>
      )}

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
        <FaRegTrashAlt className="text-white" />
      </button>
    </div>
  );
};

export default Criterio;
