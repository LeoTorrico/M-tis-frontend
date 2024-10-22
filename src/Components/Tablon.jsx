import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../context/UserContext"; 
import { MdLibraryBooks } from "react-icons/md";
import axios from "axios"; 

const Tablon = () => {
  const { cod_clase } = useParams();
  const [tareas, setTareas] = useState([]); 
  const [cargando, setCargando] = useState(true); 
  const [error, setError] = useState(null); 
  const { user } = useContext(UserContext); 

  useEffect(() => {
    const fetchTareas = async () => {
      setCargando(true);
      try {
        // Hacer una llamada al backend usando cod_clase
        const response = await axios.get(`http://localhost:3000/evaluaciones/${cod_clase}`, {
          headers: {
            Authorization: `Bearer ${user.token}` 
          }
        });
        setTareas(response.data); 
      } catch (error) {
        setError("Error al obtener las tareas."); 
      } finally {
        setCargando(false); 
      }
    };

    if (cod_clase) {
      fetchTareas();
    }
  }, [cod_clase, user.token]); 

  if (cargando) {
    return <div>Cargando tareas...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>No está autenticado.</div>;
  }

  // Agrupar las tareas por tema
  const temasAgrupados = tareas.reduce((acc, t) => {
    acc[t.nombre_tema] = t.evaluaciones;
    return acc;
  }, {});

  // Verificar si no hay evaluaciones en absoluto
  const noEvaluaciones = tareas.length === 0;

  return (
    <div className="p-2">
      {noEvaluaciones ? (
        <div className="text-center text-gray-600">No existen evaluaciones aún.</div>
      ) : (
        Object.entries(temasAgrupados).map(([nombreTema, evaluaciones]) => (
          <div key={nombreTema} className="mb-6">
            <h3 className="text-xl font-semibold font-Montserrat mb-2">{nombreTema}</h3>
            {evaluaciones.length > 0 ? (
              evaluaciones.map((e) => (
                <div
                  key={e.cod_evaluacion} 
                  className="bg-light-blue rounded-lg p-4 flex justify-between items-center mb-4 shadow-md"
                >
                  <div className="flex items-center">
                    <span className="bg-white p-2 rounded-full text-black mr-4">
                      <MdLibraryBooks size={32} /> 
                    </span>
                    <div>
                      <span className="text-lg font-semibold font-Montserrat">
                        {e.evaluacion} 
                      </span>
                      <div className="text-sm text-gray-600">{e.descripcion_evaluacion}</div> {/* Mostrar descripción de la evaluación */}
                    </div>
                  </div>
                  {/* Botón para editar o realizar acción */}
                  {user.rol === "docente" ? (
                    <button className="bg-semi-blue text-white font-Montserrat px-4 py-2 rounded-lg">
                      Ver Evaluación
                    </button>
                  ) : (
                    <button className="bg-semi-blue text-white font-Montserrat px-4 py-2 rounded-lg">
                      Ver Evaluación
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p>No hay tareas registradas para este tema.</p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Tablon;
