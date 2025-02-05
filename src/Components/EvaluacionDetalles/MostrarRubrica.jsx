import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from "../../context/UserContext";
import axios from 'axios';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const MostrarRubrica = ({ evaluacion }) => {
  const { user } = useContext(UserContext);
  const [rubricas, setRubricas] = useState(null);
  const [notaTotal, setNotaTotal] = useState(null);
  const [error, setError] = useState(null);
  const [activeRubricas, setActiveRubricas] = useState({});
  const { cod_clase } = useParams(); 

  useEffect(() => {
    const fetchRubrica = async () => {
      try {
        const response = await axios.get(
          `https://backend-tis-silk.vercel.app/evaluaciones/${evaluacion.cod_evaluacion}/${cod_clase}/nota-total`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setNotaTotal(response.data.nota_total || null); // Nota total o null si no existe
        if (response.data.rubricas && Array.isArray(response.data.rubricas)) {
          setRubricas(response.data.rubricas);
        } else {
          setError('Datos de rúbrica no válidos');
          console.error('Respuesta de la API:', response.data);
        }
      } catch (error) {
        setError('Error al obtener la rúbrica');
        console.error('Error al obtener la rúbrica:', error);
      }
    };    

    fetchRubrica();
  }, [user.token, evaluacion.cod_evaluacion, cod_clase]);

  const toggleRubricaDetails = (index) => {
    setActiveRubricas((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!rubricas) {
    return <p>Cargando rúbrica...</p>;
  }

  return (
    <div className="overflow-x-auto p-0">
      {user.rol === 'estudiante' && (
        <h3 className="text-sm font-bold p-4 text-right">
          {notaTotal !== null ? `Calificación: ${notaTotal} puntos` : 'Sin calificar'}
        </h3>
      )}
      <div className="space-y-1">
        {rubricas.map((rubrica, index) => (
          <div key={index} className="border-b bg-gray-100 rounded-lg">
            <div
              className="flex items-center text-gray p-4 py-2 justify-between cursor-pointer"
              onClick={() => toggleRubricaDetails(index)}
            >
              <div className="flex items-center">
                <h3 className="text-sm font-semibold">{rubrica.nombre_rubrica}</h3>
              </div>
              <div className="flex items-center">
                <span className="ml-4 text-sm text-gray-600">{rubrica.calificacion}/{rubrica.peso}</span>
                <div className="ml-2">
                  {activeRubricas[index] ? (
                    <FaChevronUp className="text-gray-500" />
                  ) : (
                    <FaChevronDown className="text-gray-500" />
                  )}
                </div>
              </div>
            </div>

            {activeRubricas[index] && (
              <div className="mt-0 bg-gray-100">
                <p className="text-sm p-4 py-0 text-gray-700">{rubrica.descripcion_rubrica}</p>
                <div className="mt-2 flex flex-wrap gap-4 m-2 p-2 pt-0">
                  {rubrica.detalles && rubrica.detalles.map((detalle, i) => (
                    <div key={i} className="bg-gray-100 border border-gray-300 rounded-lg shadow-md p-2 flex-1 min-w-[250px]">
                      <div className="flex items-center space-x-1">
                        <div className="w-3/4 bg-gray-100 text-sm p-2 rounded font-medium">{detalle.clasificacion_rubrica}</div>
                        <div className="w-1/4 text-gray-600 text-sm font-medium">Puntos: {detalle.peso_rubrica}</div>
                      </div>
                      <div className="bg-gray-100 text-sm p-2 rounded">
                        {detalle.descripcion}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MostrarRubrica;
