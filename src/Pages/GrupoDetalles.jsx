import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const GrupoDetalles = () => {
  const { cod_clase, cod_grupoempresa } = useParams();
  const [grupo, setGrupo] = useState(null);

  const fetchGrupo = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/grupos/${cod_clase}/grupo/${cod_grupoempresa}`
      );
      const data = await response.json();
      setGrupo(data);
    } catch (error) {
      console.error("Error al obtener los detalles del grupo:", error);
    }
  };

  useEffect(() => {
    fetchGrupo();
  }, [cod_clase, cod_grupoempresa]);

  if (!grupo) {
    return <p>Cargando detalles del grupo...</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">{grupo.nombre_largo}</h1>
      <p>Código del Grupo: {grupo.cod_grupoempresa}</p>
      <p>Descripción: {grupo.descripcion}</p>
    </div>
  );
};

export default GrupoDetalles;
