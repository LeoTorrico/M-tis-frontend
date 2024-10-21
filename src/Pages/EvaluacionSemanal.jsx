import React, { useEffect, useState } from "react";
import { PiNewspaper } from "react-icons/pi";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EvaluacionSemanal = () => {
  const navigate = useNavigate();
  const { cod_grupoempresa, cod_clase } = useParams();

  // Estado para la información del curso
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
  const [rubricas, setRubricas] = useState([]); // Para las rúbricas obtenidas del backend
  const [selectedStudentIndex, setSelectedStudentIndex] = useState(null);

  useEffect(() => {
    // Obtener datos de la clase
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
    // Obtener estudiantes del grupo
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

  useEffect(() => {
    // Obtener rúbricas desde el backend
    const fetchRubricas = async () => {
      try {
        const token = localStorage.getItem("token"); // Obtener el token de localStorage
        if (!token) {
          console.error("No se obtuvo el token");
          return;
        }

        const response = await axios.get(
          `http://localhost:3000/api/grupos/evaluaciones/4/rubricas`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Enviar el token en las cabeceras
            },
          }
        );
        setRubricas(response.data); // Actualiza el estado con las rúbricas reales
      } catch (error) {
        console.error("Error al obtener las rúbricas:", error);
      }
    };

    fetchRubricas();
  }, []);

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
      updatedScores[selectedStudentIndex] = Array(rubricas.length).fill(0);
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

    if (totalScore === 0) {
      updatedIntegrantes[selectedStudentIndex].asistencia =
        "ausente_sin_justificacion";
    } else if (totalScore >= 1) {
      updatedIntegrantes[selectedStudentIndex].asistencia = "presente";
    }

    setIntegrantes(updatedIntegrantes);
    setSelectedStudentIndex(null);
  };
  function verificarToken() {
    const token = localStorage.getItem("token"); // Suponiendo que el token está almacenado con la clave 'token'

    if (token) {
      console.log("Token obtenido:", token);
      // Aquí puedes agregar cualquier otra lógica si es necesario
    } else {
      console.log("No se obtuvo el token");
    }
  }

  // Llamar a la función para verificar el token
  verificarToken();

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
                    onClick={() => openRubricModal(index)}
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
                integrantes.map((integrante, index) => (
                  <select
                    key={index}
                    value={integrante.asistencia || "presente"}
                    onChange={(e) => {
                      const updatedIntegrantes = [...integrantes];
                      updatedIntegrantes[index].asistencia = e.target.value; // Actualiza el estado del estudiante
                      setIntegrantes(updatedIntegrantes); // Actualiza el estado
                    }}
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
                  <input type="text" value={fecha || "00/00/00"} readOnly />
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
      </div>

      {selectedStudentIndex !== null && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="bg-[#3684DB] p-4 rounded-t-lg text-white w-full text-center">
              Evaluar a {integrantes[selectedStudentIndex]?.nombre_estudiante}
            </h2>

            <div className="max-h-60 overflow-y-auto mb-4">
              {" "}
              {/* Aquí se añade el contenedor con scrollbar */}
              {rubricas.length > 0 ? (
                rubricas.map((rubrica, rubricIndex) => (
                  <div key={rubricIndex} className="mb-4">
                    <label className="font-bold mb-2">
                      {rubrica.nombre_rubrica}
                    </label>
                    <p className="mb-2 text-sm">
                      {rubrica.descripcion_rubrica}
                    </p>
                    <input
                      type="number"
                      min="0"
                      max={rubrica.peso}
                      value={
                        rubricScores[selectedStudentIndex]?.[rubricIndex] || ""
                      }
                      onChange={(e) =>
                        handleRubricChange(rubricIndex, e.target.value)
                      }
                      className="border border-gray-300 p-2 w-full"
                      placeholder={`Peso máximo: ${rubrica.peso}`}
                    />
                  </div>
                ))
              ) : (
                <p>No hay rúbricas disponibles</p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                className="bg-[#3684DB] text-white py-2 px-4 rounded-lg mr-2"
                onClick={() => setSelectedStudentIndex(null)}
              >
                Cancelar
              </button>
              <button
                className="bg-[#3684DB] text-white py-2 px-4 rounded-lg"
                onClick={saveRubricScores}
              >
                Calificar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvaluacionSemanal;
////////
