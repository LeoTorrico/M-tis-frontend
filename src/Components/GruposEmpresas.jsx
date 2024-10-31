import React, { useEffect, useState } from "react";
import { MdGroups } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom"; // Importar useNavigate y useParams

const GruposEmpresas = () => {
  const [grupos, setGrupos] = useState([]);
  const navigate = useNavigate(); // Hook para navegar
  const { cod_clase } = useParams(); // Obtener el código del curso de la URL
  const token = localStorage.getItem("token");
  // Función para obtener los datos desde la API
  const fetchGrupos = async () => {
    try {
      const response = await fetch(
        `https://backend-tis-silk.vercel.app/api/grupos/${cod_clase}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ); // Ajusta la URL según tu backend
      const data = await response.json();
      setGrupos(data);
    } catch (error) {
      console.error("Error al obtener los grupos empresa:", error);
    }
  };

  useEffect(() => {
    fetchGrupos();
  }, [cod_clase]);

  // Función para manejar la navegación al hacer clic en "Ver Grupo"
  const handleVerGrupo = (cod_grupoempresa) => {
    navigate(`/Vista-Curso/${cod_clase}/grupo/${cod_grupoempresa}`); // Redirigir a la página del grupo con el código del curso y el grupo
  };

  return (
    <div className="p-2">
      {grupos.map((grupo) => (
        <div
          key={grupo.cod_grupoempresa} // Usa un identificador único
          className="bg-light-blue rounded-lg p-4 flex justify-between items-center mb-4"
        >
          <div className="flex items-center">
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
          <button
            onClick={() => handleVerGrupo(grupo.cod_grupoempresa)} // Navega a la ruta del grupo
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
