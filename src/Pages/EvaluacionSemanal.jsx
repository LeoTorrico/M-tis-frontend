import React, { useEffect, useState } from "react";
import { PiNewspaper } from "react-icons/pi";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EvaluacionSemanal = () => {
  const navigate = useNavigate();
  const { cod_grupoempresa, cod_clase, cod_evaluacion } = useParams();

  useEffect(() => {
    console.log("Parámetros:", { cod_grupoempresa, cod_clase, cod_evaluacion });
  }, [cod_grupoempresa, cod_clase, cod_evaluacion]);

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
  const [comentario, setComentario] = useState(""); // Estado para el comentario
  const [errorComentario, setErrorComentario] = useState(""); 
  const [retroalimentacionGrupal, setRetroalimentacionGrupal] = useState("");

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
    const fetchRubricas = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No se obtuvo el token");
          return;
        }

        const response = await axios.get(
          `http://localhost:3000/rubricas/${cod_evaluacion}/grupos/${cod_grupoempresa}/calificaciones`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Rúbricas obtenidas:", response.data);

        setRubricas(response.data.rubricas);

        // Actualiza `integrantes` con los estudiantes que contienen la propiedad `calificacion`
        if (response.data.rubricas[0]?.estudiantes) {
          setIntegrantes(response.data.rubricas[0].estudiantes);
        }
         setRetroalimentacionGrupal(
           response.data.retroalimentacion_grupal || ""
         );
      } catch (error) {
        console.error("Error al obtener las rúbricas:", error);
      }
    };

    if (cod_evaluacion) {
      fetchRubricas();
    }
  }, [cod_evaluacion, cod_grupoempresa]);

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
    setComentario("");
    setErrorComentario("");
  };

  const handleRubricChange = (rubricIndex, value) => {
    const updatedScores = { ...rubricScores };

    if (!updatedScores[selectedStudentIndex]) {
      updatedScores[selectedStudentIndex] = Array(rubricas.length).fill(null);
    }

    updatedScores[selectedStudentIndex][rubricIndex] =
      value === "" ? "" : Number(value);

    setRubricScores(updatedScores);
  };

  const handleComentarioChange = (e) => {
    const newComentario = e.target.value;
    const wordCount = newComentario.trim().split(/\s+/).length;

    if (wordCount < 3) {
      setErrorComentario("El comentario debe tener al menos 3 palabras.");
    } else if (wordCount > 100) {
      setErrorComentario("El comentario no debe exceder las 100 palabras.");
    } else {
      setErrorComentario(""); // No hay errores
    }

    setComentario(newComentario);
  };
  const saveRubricScores = async () => {
    const selectedStudent = integrantes[selectedStudentIndex];
    const calificaciones = rubricScores[selectedStudentIndex]?.map(
      (nota, i) => ({
        codRubrica: rubricas[i].cod_rubrica,
        nota: nota || 0,
      })
    );

    // Calcula la sumatoria de las calificaciones
    const totalScore = calificaciones.reduce((sum, cal) => sum + cal.nota, 0);

    // Determina el estado de asistencia basado en la sumatoria
    let nuevoEstadoAsistencia = selectedStudent.asistencia;
    if (nuevoEstadoAsistencia !== "retraso") {
      if (totalScore >= 1) {
        nuevoEstadoAsistencia = "presente";
      } else {
        nuevoEstadoAsistencia = "ausente_sin_justificacion";
      }
    }

    try {
      const token = localStorage.getItem("token");

      // Enviar calificaciones individuales junto con comentario individual
      await axios.post(
        "http://localhost:3000/evaluacion/calificar",
        {
          codEvaluacion: cod_evaluacion,
          codigoSis: selectedStudent.codigo_sis,
          notas: calificaciones,
          comentario,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Actualizar el estado del estudiante
      const updatedIntegrantes = [...integrantes];
      updatedIntegrantes[selectedStudentIndex].score = totalScore;
      updatedIntegrantes[selectedStudentIndex].comentario = comentario;
      updatedIntegrantes[selectedStudentIndex].asistencia =
        nuevoEstadoAsistencia;

      setIntegrantes(updatedIntegrantes);
      setSelectedStudentIndex(null);
    } catch (error) {
      console.error("Error al guardar la calificación:", error);
    }
  };

  function verificarToken() {
    const token = localStorage.getItem("token");

    if (token) {
      console.log("Token obtenido:", token);
    } else {
      console.log("No se obtuvo el token");
    }
  }

  verificarToken();
  const saveRetroalimentacionGrupal = async () => {
    try {
      const token = localStorage.getItem("token");

      if (retroalimentacion.trim()) {
        await axios.post(
          "http://localhost:3000/evaluacion/retroalimentacion",
          {
            codEvaluacion: cod_evaluacion,
            codClase: cod_clase,
            codGrupo: cod_grupoempresa,
            comentario: retroalimentacion,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert("Retroalimentación grupal guardada con éxito.");
      } else {
        alert("Por favor, ingrese retroalimentación antes de guardar.");
      }
    } catch (error) {
      console.error("Error al guardar la retroalimentación grupal:", error);
      alert("Hubo un error al guardar la retroalimentación grupal.");
    }
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
                    onClick={() => openRubricModal(index)}
                  >
                    <input
                      type="text"
                      value={
                        integrante.score !== undefined
                          ? integrante.score
                          : "/..."
                      }
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
                      updatedIntegrantes[index].asistencia = e.target.value;
                      setIntegrantes(updatedIntegrantes);
                    }}
                    className="bg-[#D1DDED] border border-gray-300 rounded-lg p-1 w-full h-10 text-center"
                  >
                    <option value="presente">Presente</option>
                    <option value="retraso">Retraso</option>
                    <option value="ausente_con_justificacion">
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
        {/*Retroalimentacion grupal*/}
        <div className="mt-6">
          <h2 className="font-bold text-md mb-2">Retroalimentación grupal</h2>
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
                    value={retroalimentacionGrupal || retroalimentacion}
                    onChange={handleRetroalimentacionChange}
                    placeholder="Ingrese retroalimentación grupal..."
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>{" "}
        {/* Botón alineado a la derecha */}
        <div className="flex justify-end mt-4">
          <button
            onClick={saveRetroalimentacionGrupal}
            className="bg-blue-500 text-white rounded-lg px-6 py-2"
          >
            Guardar retroalimentación grupal
          </button>
        </div>
      </div>

      {selectedStudentIndex !== null && integrantes[selectedStudentIndex] && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-4xl w-full mx-4 lg:mx-auto max-h-[90vh] overflow-y-auto">
            <h2 className="bg-[#3684DB] p-4 rounded-t-lg text-white font-bold w-full text-center">
              Evaluar a {integrantes[selectedStudentIndex]?.nombre_estudiante}{" "}
              {integrantes[selectedStudentIndex]?.apellido_estudiante}
            </h2>

            <div className="mb-4">
              {rubricas.length > 0 ? (
                rubricas.map((rubrica, rubricIndex) => (
                  <div
                    key={`${rubrica.nombre_rubrica}-${rubricIndex}`}
                    className="mb-4"
                  >
                    <div className="flex justify-between items-center">
                      <label className="font-bold mb-2">
                        {rubrica.nombre_rubrica}
                      </label>
                      <span className="text-sm">{rubrica.peso} Punto/s</span>
                    </div>
                    <p className="mb-2 text-sm">
                      {rubrica.descripcion_rubrica}
                    </p>

                    {/* Aquí se añaden los datos de detalle_rubrica */}
                    <div className="flex mb-2 space-x-4">
                      {rubrica.detalles.map((detalle) => (
                        <div
                          key={detalle.cod_detalle}
                          className="border border-gray-300 rounded-md p-2"
                        >
                          <span className="text-sm">
                            {detalle.clasificacion_rubrica} :{" "}
                            {detalle.peso_rubrica}
                          </span>
                        </div>
                      ))}
                    </div>
                    {/* Campo de calificacion */}
                    <input
                      type="number"
                      min="0"
                      max={rubrica.peso}
                      value={
                        rubricScores[selectedStudentIndex]?.[rubricIndex] !==
                        undefined
                          ? rubricScores[selectedStudentIndex][rubricIndex]
                          : integrantes[selectedStudentIndex]?.calificacion ||
                            ""
                      }
                      onChange={(e) =>
                        handleRubricChange(rubricIndex, e.target.value)
                      }
                      className="border border-gray-300 p-2 w-full bg-[#B3D6FF] rounded-xl"
                      placeholder={`Peso máximo: ${rubrica.peso}`}
                    />
                  </div>
                ))
              ) : (
                <p>No hay rúbricas disponibles</p>
              )}

              {/* Campo de comentarios */}
              <div className="mb-4">
                <label className="font-bold mb-2">Comentarios</label>
                <textarea
                  value={
                    comentario !== undefined && comentario !== ""
                      ? comentario
                      : integrantes[selectedStudentIndex]
                          ?.retroalimentacion_individual || ""
                  }
                  onChange={handleComentarioChange}
                  placeholder="Ingrese un comentario..."
                  className="border border-gray-300 p-2 w-full rounded-lg"
                />
                {errorComentario && (
                  <p className="text-red-500 mt-2">{errorComentario}</p>
                )}
              </div>
            </div>

            {/* Footer con el mismo color del header */}
            <div className="bg-[#3684DB] p-4 rounded-b-lg flex justify-end">
              <button
                className="bg-white text-[#3684DB] py-2 px-4 rounded-lg mr-2 border border-[#3684DB]"
                onClick={() => setSelectedStudentIndex(null)}
              >
                Cancelar
              </button>
              <button
                className="bg-white text-[#3684DB] py-2 px-4 rounded-lg border border-[#3684DB]"
                onClick={saveRubricScores}
                disabled={
                  !!errorComentario || comentario.trim().split(/\s+/).length < 3
                }
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
