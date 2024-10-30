import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const Alumnos = () => {
  const { cod_clase } = useParams(); // Obtener cod_clase de la URL
  const [estudiantes, setEstudiantes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEstudiantes = async () => {
      try {
        const token = localStorage.getItem("token"); // Obtener el token del localStorage
        const response = await axios.get(
          `https://mtis.netlify.app/clases-estudiante/obtener-estudiantes?codigoClase=${cod_clase}`,
          {
            headers: { Authorization: `Bearer ${token}` }, // Enviar el token en los headers
          }
        );
        setEstudiantes(response.data.estudiantes); // Guardar la lista de estudiantes
      } catch (error) {
        console.error("Error al obtener los estudiantes:", error);
        setError("No se pudieron obtener los estudiantes.");
      } finally {
        setCargando(false);
      }
    };

    fetchEstudiantes();
  }, [cod_clase]); // Ejecutar cuando cambie cod_clase

  if (cargando) {
    return <div>Cargando estudiantes...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-2">
      <h2 className="text-xl font-bold mb-4">
        Lista de Alumnos inscritos en la materia
      </h2>
      {estudiantes.length > 0 ? (
        <ul className="list-none">
          {estudiantes.map((estudiante) => (
            <li
              key={estudiante.codigo_sis}
              className="flex items-center bg-blue-200 p-4 mb-4 rounded-lg shadow-md"
            >
              <img
                src={`https://api.dicebear.com/6.x/initials/svg?seed=${estudiante.nombre_estudiante} ${estudiante.apellido_estudiante}`}
                alt="Avatar"
                className="w-10 h-10 rounded-full mr-4"
              />
              <div>
                <p className="text-lg font-medium">
                  {`${estudiante.nombre_estudiante} ${estudiante.apellido_estudiante}`}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay estudiantes registrados para este curso.</p>
      )}
    </div>
  );
};

export default Alumnos;
