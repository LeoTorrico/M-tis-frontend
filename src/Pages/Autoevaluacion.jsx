import React, { useEffect, useState, useContext } from "react";
import { PiNewspaper } from "react-icons/pi";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import Swal from "sweetalert2";

const Autoevaluacion = () => {
  const { cod_clase, cod_evaluacion } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [rubricScores, setRubricScores] = useState({});
  const [rubricDetails, setRubricDetails] = useState(null);
  const [error, setError] = useState("");
  const [selectedRubricCode, setSelectedRubricCode] = useState(null);

  const handleRubricChange = (value) => {
    setRubricScores(value);
  };

  useEffect(() => {
    // Validar el rol del usuario
    if (user?.rol === "docente") {
      setError("Esta es una evaluación para estudiantes. Serás redirigido.");
      setTimeout(() => {
        navigate(-1); // Redirige al usuario a la página anterior
      }, 3000);
      return;
    }

    const fetchRubricData = async () => {
      try {
        const token = localStorage.getItem("token");
        const { codigo_sis } = JSON.parse(atob(token.split(".")[1])); // Decodificar el token

        const response = await axios.get(
          `http://localhost:3000/evaluaciones/${cod_evaluacion}/${cod_clase}/nota-total`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const rubricas = response.data.rubricas || [];

        // Filtrar rúbrica específica al codigo_sis
        const rubrica = rubricas.find((item) => item.codigo_sis === codigo_sis);

        if (rubrica) {
          setSelectedRubricCode(rubrica.cod_rubrica);
          setRubricDetails(rubrica.detalles || []);
          setRubricScores(rubrica.nota || "");
        } else {
          setError("No se encontraron datos para tu autoevaluación.");
        }
      } catch (error) {
        console.error("Error al obtener los datos de la rúbrica:", error);
      }
    };

    if (cod_clase && cod_evaluacion) {
      fetchRubricData();
    }
  }, [cod_clase, cod_evaluacion]);

  const saveRubricScores = async () => {
    const data = {
      codEvaluacion: cod_evaluacion, // Código de la evaluación
      codigoSis: user.codigo_sis, // Código del estudiante del contexto
      notas: [
        {
          codRubrica: selectedRubricCode, // Código de la rúbrica seleccionada
          nota: rubricScores, // Nota ingresada
        },
      ],
      comentario: "Autoevaluación completada.",
    };

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:3000/evaluacion/calificar", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Mostrar el mensaje de éxito con SweetAlert2
      Swal.fire({
        icon: "success",
        title: "¡Autoevaluación guardada!",
        text: "La autoevaluación se ha guardado correctamente.",
        confirmButtonText: "Aceptar",
      });

      // Redirigir después de guardar
      navigate(-1);
    } catch (error) {
      console.error("Error al guardar la autoevaluación:", error);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg max-w-md text-center">
          <p className="font-semibold text-lg">Error</p>
          <p className="mt-2">{error}</p>
          <p className="mt-4 text-sm text-gray-600">
            Serás redirigido en unos segundos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full p-6 bg-white">
      <div className="bg-semi-blue text-white p-6 mb-6 rounded-lg">
        <h2 className="text-2xl font-semibold">Autoevaluación</h2>
      </div>

      <div className="border border-black rounded-lg p-6 mb-6 overflow-x-auto">
        <div className="flex items-center mb-4">
          <PiNewspaper className="text-2xl mr-2" />
          <h1 className="text-lg font-bold">Detalles de Autoevaluación</h1>
        </div>
        <hr className="border-black my-2" />

        {rubricDetails && rubricDetails.length > 0 ? (
          <div className="mb-4">
            <h3 className="font-bold">Detalles de la Rúbrica</h3>
            <table className="w-full border-collapse border border-gray-300 mt-2">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2">Peso</th>
                  <th className="border border-gray-300 px-4 py-2">
                    Clasificación
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    Descripción
                  </th>
                </tr>
              </thead>
              <tbody>
                {rubricDetails.map((detalle, idx) => (
                  <tr key={idx}>
                    <td className="border border-gray-300 px-4 py-2">
                      {detalle.peso_rubrica}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {detalle.clasificacion_rubrica}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {detalle.descripcion}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-red-500">
            No hay detalles disponibles para esta rúbrica.
          </p>
        )}

        <div className="mb-4 p-4">
          <label className="font-bold mb-2 block">Ingrese la nota</label>
          <input
            type="number"
            min="0"
            max="100"
            value={rubricScores || ""}
            onChange={(e) => handleRubricChange(e.target.value)}
            className="border border-gray-300 p-2 w-full bg-[#B3D6FF] rounded-xl mb-4"
            placeholder="Ingrese la nota"
          />
        </div>

        <div className="bg-[#3684DB] p-3 rounded-lg flex justify-end gap-x-4">
          <button
            className="bg-white text-[#3684DB] px-4 py-2 rounded-lg hover:bg-semi-blue hover:text-white"
            onClick={saveRubricScores}
          >
            Guardar Autoevaluación
          </button>
        </div>
      </div>
    </div>
  );
};

export default Autoevaluacion;
