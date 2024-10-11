import React, { useEffect, useState } from "react";
import { MdLibraryBooks } from "react-icons/md"; // Importar el ícono de libros
import { useParams } from "react-router-dom";

const Tablon = () => {
  const { cod_clase } = useParams(); // Obtener cod_clase de la URL
  const [tareas, setTareas] = useState([]); // Cambiar el estado a "tareas"
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Simular datos de tareas para diferentes clases
  const tareasPorClase = {
    "CJ7XWP": [
      { codigo_tarea: 1, nombre_tarea: "Tarea 1 - Introducción a React" },
      { codigo_tarea: 2, nombre_tarea: "Tarea 2 - Estado y Props en React" },
    ],
    "ABCDE": [
      { codigo_tarea: 3, nombre_tarea: "Tarea 3 - Manejo de Efectos y Hooks" },
      { codigo_tarea: 4, nombre_tarea: "Tarea 4 - Manejo de Formularios en React" },
    ],
    "PRUEBA": [
      { codigo_tarea: 5, nombre_tarea: "Tarea 5 - Introducción a Node.js" },
      { codigo_tarea: 6, nombre_tarea: "Tarea 6 - Express y Middleware" },
    ]
  };

  useEffect(() => {
    setTimeout(() => {
      try {
        const tareasClase = tareasPorClase[cod_clase] || []; // Obtener las tareas correspondientes al cod_clase
        setTareas(tareasClase);
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

  return (
    <div className="p-2">
      <h2 className="text-xl font-bold mb-4">Tablón de Tareas</h2>
      {tareas.length > 0 ? (
        tareas.map((tarea) => (
          <div
            key={tarea.codigo_tarea} // Cambiar el identificador único a codigo_tarea
            className="bg-light-blue rounded-lg p-4 flex justify-between items-center mb-4 shadow-md"
          >
            <div className="flex items-center">
              <span className="bg-white p-2 rounded-full text-semi-blue mr-4">
                <MdLibraryBooks size={32} /> {/* Icono de libros */}
              </span>
              <span className="text-lg font-medium">
                {tarea.nombre_tarea} {/* Mostrar el nombre de la tarea */}
              </span>
            </div>
            <button className="bg-semi-blue text-white px-4 py-2 rounded-lg">
              Ver Evaluación
            </button>
          </div>
        ))
      ) : (
        <p>No hay tareas registradas para esta clase.</p>
      )}
    </div>
  );
};

export default Tablon;
