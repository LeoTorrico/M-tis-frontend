import React, { useEffect, useState } from "react";
import { PiNewspaper } from "react-icons/pi";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EvaluacionSemanal = () => {
  const navigate = useNavigate();
  const { cod_grupoempresa, cod_clase } = useParams();
  const [curso, setCurso] = useState({
    nombre: "",
    gestion: "",
    cod_docente: "",
    cod_gestion: "",
  });

  const [integrantes, setIntegrantes] = useState([]);
  const [fecha, setFecha] = useState("");
  const [retroalimentacion, setRetroalimentacion] = useState("");
  const [rubricScores, setRubricScores] = useState({});
  const [selectedStudentIndex, setSelectedStudentIndex] = useState(null);
  const rubricas = [
    "Claridad",
    "Dominio del tema",
    "Trabajo en equipo",
    "Puntualidad",
    "Responsabilidad",
  ];

  useEffect(() => {
    const fetchClaseData = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:3000/clases/obtener",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const clase = response.data.clases.find(
          (c) => c.cod_clase === cod_clase
        );

        if (clase) {
          setCurso({
            nombre: clase.nombre_clase,
            gestion: clase.gestion,
            cod_docente: clase.cod_docente,
            cod_gestion: clase.cod_gestion,
          });
        }
      } catch (error) {
        console.error("Error fetching clase data:", error);
      }
    };

    fetchClaseData();
  }, [cod_clase]);

  useEffect(() => {
    const fetchGrupoData = async () => {
      if (!cod_grupoempresa) {
        console.error("El cod_grupo no está definido");
        return;
      }

      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `http://localhost:3000/api/grupos/${cod_grupoempresa}/estudiantes`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setIntegrantes(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error al obtener los datos del grupo:", error);
      }
    };

    fetchGrupoData();
  }, [cod_grupoempresa]);

  const handleRetroalimentacionChange = (e) => {
    setRetroalimentacion(e.target.value);
    if (e.target.value) {
      const fechaActual = new Date().toLocaleDateString();
      setFecha(fechaActual);
    } else {
      setFecha("");
    }
  };

  const openRubricModal = (index) => {
    setSelectedStudentIndex(index);
  };

  const handleRubricChange = (rubricIndex, value) => {
    const updatedScores = { ...rubricScores };
    if (!updatedScores[selectedStudentIndex]) {
      updatedScores[selectedStudentIndex] = Array(5).fill(0);
    }
    updatedScores[selectedStudentIndex][rubricIndex] = Number(value);
    setRubricScores(updatedScores);
  };

  const saveRubricScores = () => {
    const totalScore = rubricScores[selectedStudentIndex]?.reduce(
      (sum, score) => sum + score,
      0
    );
    const updatedIntegrantes = [...integrantes];
    updatedIntegrantes[selectedStudentIndex].score = totalScore;
    setIntegrantes(updatedIntegrantes);
    setSelectedStudentIndex(null); // Cerrar modal después de guardar
  };

  return (
    <div className="flex flex-col w-full p-6 bg-white">
      <div className="bg-semi-blue text-white p-6 mb-6 rounded-lg">
        <h2 className="text-2xl font-semibold">{curso.nombre}</h2>
        <p className="text-xl">{curso.gestion}</p>
      </div>

      <div className="border border-black rounded-lg p-6 mb-6 overflow-x-auto">
        <div className="flex items-center mb-4">
          <PiNewspaper className="text-2xl mr-2" />
          <h1 className="text-lg font-bold">
            Presentación del Grupo y elección de horarios
          </h1>
        </div>
        <hr className="border-black my-2" />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="col-span-2">
            <h2 className="font-bold text-md mb-2">Integrantes</h2>
            {integrantes.length > 0 ? (
              integrantes.map((integrante, index) => (
                <input
                  key={index}
                  type="text"
                  value={`${integrante.nombre_estudiante} ${integrante.apellido_estudiante}`}
                  readOnly
                  className="bg-[#D1DDED] rounded-lg p-2 w-full mb-2"
                />
              ))
            ) : (
              <p>No hay integrantes disponibles</p>
            )}
          </div>

          <div className="col-span-1">
            <h2 className="font-bold text-md mb-2 text-center">Nota</h2>
            <div className="flex flex-col space-y-2">
              {integrantes.length > 0 ? (
                integrantes.map((integrante, index) => (
                  <div
                    key={index}
                    className="relative"
                    onClick={() => openRubricModal(index)} // Abrir modal al hacer clic
                  >
                    <input
                      type="text"
                      value={integrante.score || "/..."}
                      readOnly
                      className="bg-[#D1DDED] border border-gray-300 rounded-lg p-1 w-full h-10 text-center cursor-pointer"
                    />
                  </div>
                ))
              ) : (
                <p>--</p>
              )}
            </div>
          </div>

          <div className="col-span-1">
            <h2 className="font-bold text-md mb-2 text-center">Asistencia</h2>
            <div className="flex flex-col space-y-2">
              {integrantes.length > 0 ? (
                integrantes.map((_, index) => (
                  <select
                    key={index}
                    className="bg-[#D1DDED] border border-gray-300 rounded-lg p-1 w-full h-10 text-center"
                  >
                    <option value="presente">Presente</option>
                    <option value="retraso">Retraso</option>
                    <option value="ausente_justificado">
                      Ausente con justificación
                    </option>
                    <option value="ausente_sin_justificacion">
                      Ausente sin justificación
                    </option>
                  </select>
                ))
              ) : (
                <p>--</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="font-bold text-md mb-2">Retroalimentación</h2>
          <table className="table-auto w-full mb-6 border-collapse">
            <thead>
              <tr>
                <th className="border px-4 py-2">Fecha</th>
                <th className="border px-4 py-2">Retroalimentación</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2">
                  {fecha ? fecha : "Fecha no registrada"}
                </td>
                <td className="border px-4 py-2">
                  <textarea
                    value={retroalimentacion}
                    onChange={handleRetroalimentacionChange}
                    placeholder="Ingrese retroalimentación..."
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex justify-start mt-6 space-x-4">
          <button className="bg-[#223A59] text-white px-4 py-2 rounded-lg">
            Ver archivo
          </button>
        </div>
      </div>

      {/* Modal para calificar las rúbricas, único para cada integrante */}
      {selectedStudentIndex !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">
              Rúbricas: {integrantes[selectedStudentIndex]?.nombre_estudiante}
            </h2>
            {rubricas.map((rubrica, idx) => (
              <div key={idx} className="mb-2">
                <label className="block text-sm font-bold">{rubrica}</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={
                    rubricScores[selectedStudentIndex]
                      ? rubricScores[selectedStudentIndex][idx] || 0
                      : 0
                  }
                  onChange={(e) => handleRubricChange(idx, e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 w-full"
                />
              </div>
            ))}
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
              onClick={saveRubricScores}
            >
              Guardar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvaluacionSemanal;
////////////////