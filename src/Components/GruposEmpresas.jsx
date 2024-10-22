import React, { useEffect, useState } from "react";
import { MdGroups } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom"; // Importar useNavigate y useParams

const GruposEmpresas = () => {
  const [grupos, setGrupos] = useState([]);
  const navigate = useNavigate(); // Hook para navegar
  const { cod_clase } = useParams(); // Obtener el código de clase de la URL

  const fetchGrupos = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/grupos/${cod_clase}`
      );
      const data = await response.json();
      setGrupos(data);
    } catch (error) {
      console.error("Error al obtener los grupos empresa:", error);
    }
  };

  useEffect(() => {
    fetchGrupos();
  }, [cod_clase]);

  const handleVerGrupo = (cod_grupoempresa) => {
    // Redirigir a GrupoDetalles con el cod_clase y cod_grupoempresa
    navigate(`/Vista-Curso/${cod_clase}/grupo/${cod_grupoempresa}`);
  };

  return (
    <div className="p-2">
      {grupos.map((grupo) => (
        <div
          key={grupo.cod_grupoempresa}
          className="bg-light-blue rounded-lg p-4 flex justify-between items-center mb-4"
        >
          <div className="flex items-center">
            {grupo.logotipo ? (
              <img
                src={`data:image/png;base64,${grupo.logotipo}`}
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
          <button
            onClick={() => handleVerGrupo(grupo.cod_grupoempresa)}
            className="bg-semi-blue text-white px-4 py-2 rounded-lg"
          >
            Ver Grupo
          </button>
        </div>
      ))}
    </div>
  );
};

export default GruposEmpresas;
