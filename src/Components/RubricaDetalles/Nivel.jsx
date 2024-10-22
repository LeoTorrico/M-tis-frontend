import React, { useState } from "react";
import { FiMoreVertical } from "react-icons/fi"; // Importamos el ícono de tres puntos verticales

const Nivel = ({ nivel, onChange, onDelete }) => {
  const { puntos, tituloNivel, descripcion } = nivel;
  const [menuVisible, setMenuVisible] = useState(false);

  const handlePuntosChange = (e) => {
    onChange({ ...nivel, puntos: e.target.value });
  };

  const handleTituloChange = (e) => {
    onChange({ ...nivel, tituloNivel: e.target.value });
  };

  const handleDescripcionChange = (e) => {
    onChange({ ...nivel, descripcion: e.target.value });
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <div className="flex flex-col w-1/3 p-2 border border-gray-300 rounded relative">
      <input
        type="number"
        value={puntos}
        onChange={handlePuntosChange}
        placeholder="Puntos"
        className="w-full mb-2 p-2 border border-gray-300 rounded"
      />
      <input
        type="text"
        value={tituloNivel}
        onChange={handleTituloChange}
        placeholder="Título del nivel"
        className="w-full mb-2 p-2 border border-gray-300 rounded"
      />
      <textarea
        value={descripcion}
        onChange={handleDescripcionChange}
        placeholder="Descripción"
        className="w-full p-2 border border-gray-300 rounded"
      />

      {/* Icono de tres puntos con una circunferencia en la esquina inferior derecha */}
      <button
        onClick={toggleMenu}
        className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-dark-blue flex items-center justify-center hover:bg-blue-modal transition duration-300 focus:outline-none"
      >
        <FiMoreVertical className="text-white" size={20} />
      </button>

      {/* Menú emergente */}
      {menuVisible && (
        <div className="absolute bottom-10 right-2 bg-white border border-gray-300 shadow-lg rounded p-2 z-10">
          <button
            onClick={onDelete}
            className="text-dark-blue hover:text-red-500 focus:outline-none"
          >
            Eliminar este nivel
          </button>
        </div>
      )}
    </div>
  );
};

export default Nivel;
