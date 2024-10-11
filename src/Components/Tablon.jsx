import React, { useContext, useEffect, useState } from "react";
import { MdLibraryBooks } from "react-icons/md"; // Importar el ícono de libros
import { useParams } from "react-router-dom";
import { UserContext } from "../context/UserContext"; // Importar el UserContext

const Tablon = () => {
  const { cod_clase } = useParams(); // Obtener cod_clase de la URL
  const [tareas, setTareas] = useState([]); // Cambiar el estado a "tareas"
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(UserContext); // Obtener el usuario del contexto

  // Simular datos de tareas por clases
  const tareasPorClase = {
    PRUEBA: [
      { codigo_tarea: 1, nombre_tarea: "Tarea 1 - Introducción a React" },
      { codigo_tarea: 2, nombre_tarea: "Tarea 2 - Estado y Props en React" },
    ],
    CJ7XWP: [
      { codigo_tarea: 3, nombre_tarea: "Tarea 3 - Manejo de Efectos y Hooks" },
      { codigo_tarea: 4, nombre_tarea: "Tarea 4 - Manejo de Rutas en React" },
    ],
  };

  useEffect(() => {
    setCargando(true);
    // Simular una carga de datos de tareas según el código de clase después de 1 segundo
    setTimeout(() => {
      try {
        if (tareasPorClase[cod_clase]) {
          setTareas(tareasPorClase[cod_clase]); // Asignar las tareas correspondientes a la clase
        } else {
          setTareas([]); // Si no hay tareas para la clase, vaciar el estado
        }
      } catch (error) {
        setError("No se pudieron obtener las tareas.");
      } finally {
        setCargando(false); // Cambiar el estado de carga
      }
    }, 1000); // Simular un retardo de 1 segundo
  }, [cod_clase]); // Ejecutar cuando cambie cod_clase

  if (cargando) {
    return <div>Cargando tareas...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>No está autenticado.</div>;
  }

  return (
    <div className="p-2">
      <h2 className="text-xl font-bold mb-4">Tablón de Evaluaciones</h2>

      {user.rol === "docente" ? ( // Si el usuario es docente, mostrar vista del docente
        <div>
          {tareas.length > 0 ? (
            tareas.map((tarea) => (
              <div
                key={tarea.codigo_tarea}
                className="bg-light-blue rounded-lg p-4 flex justify-between items-center mb-4 shadow-md"
              >
                <div className="flex items-center">
                  <span className="bg-white p-2 rounded-full text-semi-blue mr-4">
                    <MdLibraryBooks size={32} />
                  </span>
                  <span className="text-lg font-medium">{tarea.nombre_tarea}</span>
                </div>
                <button className="bg-semi-blue text-white px-4 py-2 rounded-lg">
                  Evaluar Tarea
                </button>
              </div>
            ))
          ) : (
            <p>No hay evaluaciones registradas para esta clase.</p>
          )}
        </div>
      ) : user.rol === "estudiante" ? ( // Si el usuario es estudiante, mostrar vista del estudiante
        <div>
          {tareas.length > 0 ? (
            tareas.map((tarea) => (
              <div
                key={tarea.codigo_tarea}
                className="bg-light-blue rounded-lg p-4 flex justify-between items-center mb-4 shadow-md"
              >
                <div className="flex items-center">
                  <span className="bg-white p-2 rounded-full text-semi-blue mr-4">
                    <MdLibraryBooks size={32} />
                  </span>
                  <span className="text-lg font-medium">{tarea.nombre_tarea}</span>
                </div>
                <button className="bg-semi-blue text-white px-4 py-2 rounded-lg">
                  Ver Tarea
                </button>
              </div>
            ))
          ) : (
            <p>No hay evaluaciones registradas para esta clase.</p>
          )}
        </div>
      ) : (
        <p>No tiene un rol válido para acceder a esta información.</p>
      )}
    </div>
  );
};

export default Tablon;
