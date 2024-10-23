import React, { useState } from "react";
import { FiMoreVertical } from "react-icons/fi"; // Importamos el ícono de tres puntos verticales

const Nivel = ({ nivel, onChange, onDelete }) => {
  const { puntos, tituloNivel, descripcion } = nivel;
  const [menuVisible, setMenuVisible] = useState(false);

  const handlePuntosChange = (e) => {
    const newPuntos = parseInt(e.target.value);
    if (newPuntos >= 0 && newPuntos <= 100) {
      onChange({ ...nivel, puntos: newPuntos });
    }
  };

  const handleTituloChange = (e) => {
    onChange({ ...nivel, tituloNivel: e.target.value });
  };

  const handleDescripcionChange = (e) => {
    const newDescripcion = e.target.value;
    if (newDescripcion.length >= 10 && newDescripcion.length <= 300) {
      onChange({ ...nivel, descripcion: newDescripcion });
    }
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
        placeholder="Puntos (0-100)"
        className="w-full mb-2 p-2 border border-gray-300 rounded"
        min="0"
        max="100"
      />
      <select
        value={tituloNivel}
        onChange={handleTituloChange}
        className="w-full mb-2 p-2 border border-gray-300 rounded"
      >
        <option value="">Seleccione un nivel</option>
        <option value="Muy bien">Muy bien</option>
        <option value="Bien">Bien</option>
        <option value="Insuficiente">Insuficiente</option>
      </select>
      <textarea
        value={descripcion}
        onChange={handleDescripcionChange}
        placeholder="Descripción (10-300 caracteres)"
        className="w-full p-2 border border-gray-300 rounded"
        minLength="10"
        maxLength="300"
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
