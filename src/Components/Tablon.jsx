import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { MdLibraryBooks } from "react-icons/md";
import axios from "axios";

const Tablon = () => {
  const { cod_clase } = useParams();
  const [tareas, setTareas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTareas = async () => {
      setCargando(true);
      try {
        const response = await axios.get(`https://backend-tis-silk.vercel.app/evaluaciones/${cod_clase}`, {
          headers: {
            Authorization: `Bearer ${user?.token}`
          }
        });
        setTareas(response.data);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setError("No se crearon evaluaciones para esta clase.");
        } else {
          setError("Error al cargar las evaluaciones.");
        }
      } finally {
        setCargando(false);
      }
    };

    if (cod_clase && user?.token) { 
      fetchTareas();
    }
  }, [cod_clase, user?.token]);

  if (cargando) {
    return <div>Cargando tareas...</div>;
  }

  if (error) {
    return <div className="text-center text-gray-600">{error}</div>;
  }

  if (!user) {
    return <div>No está autenticado.</div>;
  }

  // Agrupar las tareas por tema y excluir temas sin evaluaciones
  const temasAgrupados = tareas.reduce((acc, t) => {
    const evaluacionesValidas = t.evaluaciones.filter((e) => e.cod_evaluacion);
    if (evaluacionesValidas.length > 0) {
      acc[t.nombre_tema] = evaluacionesValidas;
    }
    return acc;
  }, {});

  const handleVerEvaluacion = (cod_evaluacion) => {
    navigate(`/Vista-Curso/${cod_clase}/evaluacion/${cod_evaluacion}`);
  };

  return (
    <div className="p-2">
      {Object.entries(temasAgrupados).map(([nombreTema, evaluaciones]) => (
        <div key={nombreTema} className="mb-6">
          <h3 className="text-xl font-semibold font-Montserrat mb-2">{nombreTema}</h3>
          {evaluaciones.length > 0 ? (
            evaluaciones.map((e) => (
              <div
                key={e.cod_evaluacion}
                className="bg-blue-gray rounded-lg p-4 flex justify-between items-center mb-4 shadow-md"
              >
                <div className="flex items-center">
                  <span className="bg-white p-2 rounded-full text-black mr-4">
                    <MdLibraryBooks size={32} />
                  </span>
                  <div>
                    <span className="text-lg font-semibold font-Montserrat">
                      {e.evaluacion}
                    </span>
                    <div className="text-sm text-gray-600">Día de entrega: {e.fecha_fin}</div>
                  </div>
                </div>

                {user.rol === "docente" ? (
                  <button
                    onClick={() => handleVerEvaluacion(e.cod_evaluacion)}
                    className="bg-dark-blue text-white font-Montserrat px-4 py-2 rounded-lg"
                  >
                    Ver Evaluación subida
                  </button>
                ) : (
                  <button
                    onClick={() => handleVerEvaluacion(e.cod_evaluacion)}
                    className="bg-dark-blue text-white font-Montserrat px-4 py-2 rounded-lg"
                  >
                    Ver Evaluación
                  </button>
                )}
              </div>
            ))
          ) : (
            <p>No hay tareas registradas para este tema.</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default Tablon;
