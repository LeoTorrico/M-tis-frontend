import React, { useEffect, useState } from "react";
import { MdGroups } from "react-icons/md";

const GruposEmpresas = () => {
  const [grupos, setGrupos] = useState([]);

  // Función para obtener los datos desde la API
  const fetchGrupos = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/grupos/ABCDE"); // Ajusta la URL según tu backend
      const data = await response.json();
      setGrupos(data);
    } catch (error) {
      console.error("Error al obtener los grupos empresa:", error);
    }
  };

  // useEffect para llamar a la función fetchGrupos cuando el componente se monta
  useEffect(() => {
    fetchGrupos();
  }, []);

  return (
    <div className="p-2">
      {grupos.map((grupo) => (
        <div
          key={grupo.cod_grupoempresa} // Usa un identificador único como nombreCorto o nombreLargo
          className="bg-light-blue rounded-lg p-4 flex justify-between items-center mb-4"
        >
          <div className="flex items-center">
            {/* Mostrar el logotipo si existe, de lo contrario un ícono predeterminado */}
            {grupo.logotipo ? (
              <img
                src={`data:image/png;base64,${grupo.logotipo}`} // Decodifica el logo de base64
                alt={grupo.nombre_largo}
                className="w-16 h-16 rounded-full object-cover mr-4"
              />
            ) : (
              <span className="bg-white p-2 rounded-full text-semi-blue mr-4">
                <MdGroups size={32} />
              </span>
            )}
            <span className="text-lg font-medium">{grupo.nombre_largo}</span>
          </div>
          <button className="bg-semi-blue text-white px-4 py-2 rounded-lg">
            Ver Grupo
          </button>
        </div>
      ))}
    </div>
  );
};

export default GruposEmpresas;
