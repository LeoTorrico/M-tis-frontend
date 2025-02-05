import React, { useEffect, useState, useContext } from "react";
import { PiNewspaper } from "react-icons/pi";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext";

const EvaluacionSemanal = () => {
  const { user } = useContext(UserContext);

  const navigate = useNavigate();
  const { cod_grupoempresa, cod_clase, cod_evaluacion } = useParams();

  useEffect(() => {}, [cod_grupoempresa, cod_clase, cod_evaluacion]);
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
  const [rubricas, setRubricas] = useState([]);
  const [selectedStudentIndex, setSelectedStudentIndex] = useState(null);
  const [comentario, setComentario] = useState("");
  const [errorComentario, setErrorComentario] = useState("");
  const [retroalimentacionGrupal, setRetroalimentacionGrupal] = useState("");
  const [comentariosPorEstudiante, setComentariosPorEstudiante] = useState({});
  const [asistenciaDisponible, setAsistenciaDisponible] = useState(false);
  const [selectedCriteria, setSelectedCriteria] = useState({});
  const handleCriteriaClick = (rubricIndex, value) => {
    const updatedCriteria = { ...selectedCriteria };

    // Permitir solo una selección por rúbrica
    if (updatedCriteria[selectedStudentIndex]?.[rubricIndex]) {
      alert("Solo puedes seleccionar un criterio por rúbrica.");
      return;
    }

    if (!updatedCriteria[selectedStudentIndex]) {
      updatedCriteria[selectedStudentIndex] = {};
    }

    updatedCriteria[selectedStudentIndex][rubricIndex] = value;

    // Actualizar el input automáticamente con la calificación seleccionada
    const updatedScores = { ...rubricScores };
    if (!updatedScores[selectedStudentIndex]) {
      updatedScores[selectedStudentIndex] = Array(rubricas.length).fill(null);
    }

    updatedScores[selectedStudentIndex][rubricIndex] = value;

    setSelectedCriteria(updatedCriteria);
    setRubricScores(updatedScores);
  };

  const [updatedIntegrantes, setUpdatedIntegrantes] = useState([]);
  useEffect(() => {
    const fetchClaseData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://backend-tis-silk.vercel.app/clases/obtener",
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
    const fetchRubricas = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No se obtuvo el token");
          return;
        }

        const response = await axios.get(
          `https://backend-tis-silk.vercel.app/rubricas/${cod_evaluacion}/grupos/${cod_grupoempresa}/calificaciones`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setRetroalimentacionGrupal(
          response.data.retroalimentacion_grupal || []
        );

        setRubricas(response.data.rubricas);

        const updatedIntegrantes =
          response.data.rubricas[0]?.estudiantes?.map((integrante) => {
            let totalScore = 0;

            response.data.rubricas.forEach((rubrica) => {
              const studentGrade = rubrica.estudiantes.find(
                (estudiante) => estudiante.codigo_sis === integrante.codigo_sis
              )?.calificacion;

              if (studentGrade) {
                totalScore += studentGrade;
              }
            });

            return {
              ...integrante,
              score: totalScore,
            };
          }) || [];

        setIntegrantes(updatedIntegrantes);

        // setRetroalimentacionDisponible(!!retroalimentacionGrupal);
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
    setErrorComentario("");
    setComentario(
      comentariosPorEstudiante[integrantes[index].codigo_sis] || ""
    );
  };

  const handleRubricChange = (rubricIndex, value) => {
    const updatedScores = { ...rubricScores };

    if (!updatedScores[selectedStudentIndex]) {
      updatedScores[selectedStudentIndex] = Array(rubricas.length).fill(null);
    }

    const numericValue = parseFloat(value);

    updatedScores[selectedStudentIndex][rubricIndex] =
      value === "" ? "" : Number(value);

    if (
      isNaN(numericValue) ||
      numericValue < 0 ||
      numericValue > rubricas[rubricIndex].peso
    ) {
      alert(
        `La calificación debe estar entre 0 y ${rubricas[rubricIndex].peso}.`
      );
      updatedScores[selectedStudentIndex][rubricIndex] = "";
    } else {
      updatedScores[selectedStudentIndex][rubricIndex] = numericValue;
    }

    setRubricScores(updatedScores);
  };

  const handleComentarioChange = (e) => {
    const newComentario = e.target.value;
    const wordCount = newComentario.trim().split(/\s+/).length;

    if (wordCount < 1) {
      setErrorComentario("El comentario debe tener al menos 1 palabra.");
    } else if (wordCount > 100) {
      setErrorComentario("El comentario no debe exceder las 100 palabras.");
    } else {
      setErrorComentario("");
    }

    setComentario(newComentario);
    setComentariosPorEstudiante({
      ...comentariosPorEstudiante,
      [integrantes[selectedStudentIndex].codigo_sis]: newComentario,
    });
  };

  const saveRubricScores = async () => {
    const selectedStudent = integrantes[selectedStudentIndex];
    const calificaciones = rubricScores[selectedStudentIndex]?.map(
      (nota, i) => ({
        codRubrica: rubricas[i].cod_rubrica,
        nota: nota || 0,
      })
    );

    const totalScore = calificaciones.reduce((sum, cal) => sum + cal.nota, 0);

    let nuevoEstadoAsistencia = selectedStudent.asistencia;
    if (nuevoEstadoAsistencia !== "retraso") {
      if (totalScore >= 1) {
        nuevoEstadoAsistencia = "Presente";
      } else {
        nuevoEstadoAsistencia = "Ausente sin Justificación";
      }
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://backend-tis-silk.vercel.app/evaluacion/calificar",
        {
          codEvaluacion: cod_evaluacion,
          codigoSis: selectedStudent.codigo_sis,
          notas: calificaciones,
          comentario:
            comentariosPorEstudiante[selectedStudent.codigo_sis] || "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedIntegrantes = [...integrantes];
      updatedIntegrantes[selectedStudentIndex].score = totalScore;
      updatedIntegrantes[selectedStudentIndex].comentario =
        comentariosPorEstudiante[selectedStudent.codigo_sis] || "";
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
  }

  verificarToken();

  const saveRetroalimentacionGrupal = async () => {
    try {
      const token = localStorage.getItem("token");

      if (retroalimentacion.trim()) {
        await axios.post(
          "https://backend-tis-silk.vercel.app/evaluacion/retroalimentacion",
          {
            codEvaluacion: cod_evaluacion,
            codClase: cod_clase,
            codGrupo: cod_grupoempresa,
            fecha: fecha,
            comentario: retroalimentacion,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const nuevaRetroalimentacion = {
          fecha_registro: new Date().toISOString(),
          comentario: retroalimentacion,
        };
        setRetroalimentacionGrupal((prev) => [nuevaRetroalimentacion, ...prev]);
        setRetroalimentacion("");

        alert("Retroalimentación grupal guardada con éxito.");
      } else {
        alert("Por favor, ingrese retroalimentación antes de guardar.");
      }
    } catch (error) {
      console.error("Error al guardar la retroalimentación grupal:", error);
      alert("Hubo un error al guardar la retroalimentación grupal.");
    }
  };

  const saveAsistencia = async () => {
    try {
      const token = localStorage.getItem("token");
      const listaAsistencia = integrantes.map((integrante) => ({
        codigoSis: integrante.codigo_sis,
        estado: integrante.asistencia || "Presente",
      }));

      await axios.post(
        `https://backend-tis-silk.vercel.app/asistencia/registrar/${cod_clase}`,
        {
          fecha: fecha,
          listaAsistencia,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Asistencia guardada correctamente");
      setAsistenciaDisponible(true);
    } catch (error) {
      console.error("Error al guardar asistencia:", error);
      alert("Hubo un error al guardar la asistencia");
    }
  };

  useEffect(() => {
    const currentFecha = new Date().toLocaleDateString("en-CA");
    setFecha(currentFecha);
  }, []);

  useEffect(() => {
    if (!cod_grupoempresa || !fecha) return;
    if (fecha === "") return;

    const fetchAsistencia = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `https://backend-tis-silk.vercel.app/asistencia?codGrupo=${cod_grupoempresa}&fecha=${fecha}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const asistenciaData = response.data.data || [];
        setAsistenciaDisponible(asistenciaData.length > 0);

        const updatedIntegrantes = integrantes.map((integrante) => {
          const asistenciaIntegrante = asistenciaData.find(
            (a) => a.codigo_sis === integrante.codigo_sis
          );
          return {
            ...integrante,
            asistencia: asistenciaIntegrante
              ? asistenciaIntegrante.tipo_asistencia
              : integrante.asistencia || "Presente",
          };
        });

        setUpdatedIntegrantes(updatedIntegrantes);
      } catch (error) {
        console.error("Error al obtener la asistencia:", error);
      }
    };

    fetchAsistencia();
  }, [cod_grupoempresa, fecha, integrantes]);

  const handleCalificarClick = () => {
    const estudiante = integrantes[selectedStudentIndex];

    if (estudiante.score !== undefined && estudiante.score > 0) {
      alert("Ya se calificó a este estudiante.");
      return;
    }

    saveRubricScores();
  };

  const integrantesList =
    updatedIntegrantes.length > 0 ? updatedIntegrantes : integrantes;
  const handleViewClass = (codClase) => {
    navigate(`/Vista-Curso/${codClase}`);
  };
  const [isViewEvaluationOpen, setIsViewEvaluationOpen] = useState(false);

  const [entregable, setEntregable] = useState(null);
  const [loadingEntregable, setLoadingEntregable] = useState(false);
  const [errorEntregable, setErrorEntregable] = useState(null);
  const toggleViewEvaluationModal = async () => {
    setIsViewEvaluationOpen(!isViewEvaluationOpen);

    if (!isViewEvaluationOpen) {
      try {
        setLoadingEntregable(true);
        setErrorEntregable(null);

        if (!cod_evaluacion || !cod_grupoempresa) {
          throw new Error(
            "Datos insuficientes: cod_evaluacion o cod_grupoempresa no válidos."
          );
        }

        if (!user || !user.token) {
          throw new Error("Token no encontrado. Inicie sesión nuevamente.");
        }

        const response = await axios.get(
          `https://backend-tis-silk.vercel.app/evaluaciones/${cod_evaluacion}/entregas/${cod_grupoempresa}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        // Asegurarse de que la propiedad 'archivo' exista
        if (response.data && response.data.archivo) {
          const archivoBase64 = response.data.archivo;

          // Detectar tipo MIME desde el Base64
          const fileType = archivoBase64.startsWith("JVBERi0")
            ? "application/pdf"
            : archivoBase64.startsWith("/9j/") ||
              archivoBase64.startsWith("iVBORw0KGgo")
            ? "image/jpeg"
            : "unknown";

          if (fileType === "unknown") {
            throw new Error(
              "El archivo recibido no tiene un tipo MIME reconocido."
            );
          }

          // Decodificar el archivo Base64 a un Blob
          const byteCharacters = atob(archivoBase64);
          const byteNumbers = new Uint8Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const blob = new Blob([byteNumbers], { type: fileType });

          // Crear URL para el Blob
          const archivoURL = URL.createObjectURL(blob);

          setEntregable({
            archivoURL,
            fileType,
          });
        } else if (response.data && response.data.linkEntregable) {
          // Si hay un enlace al archivo, abrirlo en una nueva pestaña
          window.open(response.data.linkEntregable, "_blank");
        } else {
          throw new Error("No se encontró un archivo entregable.");
        }
      } catch (error) {
        console.error("Error al obtener el entregable:", error);

        // Mostrar mensaje de error claro
        if (error.response && error.response.data) {
          const serverError =
            error.response.data.detalle || "Error desconocido en el servidor.";
          setErrorEntregable(serverError);

          // Alertar al usuario
          alert(`Error del servidor: ${serverError}`);
        } else if (error.request) {
          setErrorEntregable("No se pudo contactar con el servidor.");
        } else {
          setErrorEntregable(error.message || "Error desconocido.");
        }
      } finally {
        setLoadingEntregable(false);
      }
    } else {
      setEntregable(null);
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

            {integrantesList.length > 0 ? (
              integrantesList.map((integrante, index) => (
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
              {integrantesList.length > 0 ? (
                integrantesList.map((integrante, index) => (
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
              {integrantesList.length > 0 ? (
                integrantesList.map((integrante, index) => (
                  <select
                    key={index}
                    value={integrante.asistencia || "Presente"}
                    onChange={(e) => {
                      const updatedIntegrantes = [...integrantes];
                      updatedIntegrantes[index].asistencia = e.target.value;
                      setIntegrantes(updatedIntegrantes);
                    }}
                    className="bg-[#D1DDED] border border-gray-300 rounded-lg p-1 w-full h-10 text-center"
                  >
                    <option value="Presente">Presente</option>
                    <option value="Retraso">Retraso</option>
                    <option value="Ausente con Justificación">
                      Ausente con justificación
                    </option>
                    <option value="Ausente sin Justificación">
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
        <div className="flex justify-end mt-4">
          {/* Botón "Guardar asistencia" */}
          <button
            onClick={saveAsistencia}
            className={`bg-[#031930] text-white rounded-lg px-6 py-2 ${
              asistenciaDisponible ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={asistenciaDisponible}
          >
            Guardar asistencia
          </button>
        </div>
        <div className="mt-6">
          <h2 className="font-bold text-md mb-2">Retroalimentación grupal</h2>

          {/* Mostrar retroalimentaciones guardadas */}
          <table className="table-auto w-full mb-6 border-collapse">
            <thead>
              <tr>
                <th className="border px-4 py-2">Fecha</th>
                <th className="border px-4 py-2">Retroalimentación</th>
              </tr>
            </thead>
            <tbody>
              {retroalimentacionGrupal.length > 0 ? (
                retroalimentacionGrupal.map((retro, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">
                      {retro.fecha_registro.split("T")[0] ||
                        "Fecha no disponible"}
                    </td>
                    <td className="border px-4 py-2">
                      {/* Reemplazar saltos de línea por <br /> */}
                      {retro.comentario
                        ? retro.comentario.split("\n").map((line, i) => (
                            <span key={i}>
                              {line}
                              <br />
                            </span>
                          ))
                        : "Sin comentario"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="border px-4 py-2 text-center" colSpan={2}>
                    No hay retroalimentaciones disponibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Espacio para agregar nueva retroalimentación */}
          <h2 className="font-bold text-md mb-2">
            Agregar nueva retroalimentación
          </h2>
          <div className="flex flex-col space-y-4">
            <textarea
              value={retroalimentacion}
              onChange={(e) => setRetroalimentacion(e.target.value)}
              placeholder="Ingrese retroalimentación grupal..."
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            <div className="flex justify-between mt-4"></div>
          </div>
        </div>

        {/* Botón alineado a la derecha */}
        <div className="flex justify-between mt-4">
          <button
            onClick={() => handleViewClass(cod_clase)}
            className="bg-[#031930] text-white px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white"
          >
            Cerrar
          </button>
          <button
            onClick={saveRetroalimentacionGrupal}
            className="bg-[#031930] text-white rounded-lg px-6 py-2"
          >
            Guardar retroalimentación grupal
          </button>
        </div>
      </div>

      {selectedStudentIndex !== null && integrantes[selectedStudentIndex] && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="flex gap-4">
            <div className="bg-white p-4 rounded-lg shadow-lg max-w-4xl w-full mx-4 lg:mx-auto max-h-[90vh] overflow-y-auto">
              <h2 className="bg-[#3684DB] p-5 rounded-t-lg text-white font-bold w-full text-center">
                Evaluar a {integrantes[selectedStudentIndex]?.nombre_estudiante}{" "}
                {integrantes[selectedStudentIndex]?.apellido_estudiante}
              </h2>

              <div className="mb-4">
                {rubricas.length > 0 ? (
                  rubricas.map((rubrica, rubricIndex) => {
                    const studentGrade =
                      rubrica.estudiantes.find(
                        (estudiante) =>
                          estudiante.codigo_sis ===
                          integrantes[selectedStudentIndex]?.codigo_sis
                      )?.calificacion || "";

                    return (
                      <div
                        key={`${rubrica.nombre_rubrica}-${rubricIndex}`}
                        className="mb-4"
                      >
                        <div className="flex justify-between items-center">
                          <label className="font-bold mb-2">
                            {rubrica.nombre_rubrica}
                          </label>
                          <span className="text-sm">
                            {rubrica.peso} Punto/s
                          </span>
                        </div>
                        <p className="mb-2 text-sm">
                          {rubrica.descripcion_rubrica}
                        </p>

                        {/* Display rubric details */}
                        <div className="flex mb-2 space-x-4">
                          {rubrica.detalles.map((detalle) => (
                            <button
                              key={detalle.cod_detalle}
                              className={`border border-gray-300 rounded-md p-2 ${
                                selectedCriteria[selectedStudentIndex]?.[
                                  rubricIndex
                                ] === detalle.peso_rubrica
                                  ? "bg-blue-300"
                                  : "bg-white"
                              }`}
                              onClick={() =>
                                handleCriteriaClick(
                                  rubricIndex,
                                  detalle.peso_rubrica
                                )
                              }
                            >
                              <span className="text-sm">
                                {detalle.clasificacion_rubrica} :{" "}
                                {detalle.peso_rubrica}
                              </span>
                            </button>
                          ))}
                        </div>

                        {/* Calificacion input for the selected student */}
                        <input
                          type="text"
                          onInput={(e) => {
                            e.target.value = e.target.value.replace(
                              /[^0-9]/g,
                              ""
                            );
                          }}
                          min="0"
                          max={rubrica.peso}
                          value={
                            rubricScores[selectedStudentIndex]?.[
                              rubricIndex
                            ] !== undefined
                              ? rubricScores[selectedStudentIndex][rubricIndex]
                              : studentGrade
                          }
                          onChange={(e) =>
                            handleRubricChange(rubricIndex, e.target.value)
                          }
                          className="border border-gray-300 p-2 w-full bg-[#B3D6FF] rounded-xl"
                          placeholder={`Peso máximo: ${rubrica.peso}`}
                        />
                      </div>
                    );
                  })
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
              <div className="bg-[#3684DB] p-4 rounded-b-lg flex justify-end">
                <button
                  className="bg-white text-[#3684DB] py-2 px-4 rounded-lg mr-2 border border-[#3684DB]"
                  onClick={() => setSelectedStudentIndex(null)}
                >
                  Cancelar
                </button>
                <div className="flex gap-x-2">
                  <button
                    onClick={handleCalificarClick}
                    className="bg-white text-[#3684DB] py-2 px-4 rounded-lg border border-[#3684DB]"
                    disabled={
                      !!errorComentario ||
                      comentario.trim().split(/\s+/).length < 1
                    }
                  >
                    Calificar
                  </button>

                  <button
                    className="bg-white text-[#3684DB] py-2 px-4 rounded-lg border border-[#3684DB]"
                    onClick={toggleViewEvaluationModal}
                  >
                    Ver evaluación subida
                  </button>
                </div>
              </div>
            </div>
            {/* Modal "Ver evaluación subida" */}
            {isViewEvaluationOpen && (
              <div className="bg-white p-4 rounded-lg shadow-lg max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
                <h2 className="bg-[#3684DB] p-3 rounded-t-lg text-white font-bold text-center">
                  Evaluación subida
                </h2>
                <div className="p-4">
                  {loadingEntregable ? (
                    <p>Cargando...</p>
                  ) : errorEntregable ? (
                    <p className="text-red-500">{errorEntregable}</p>
                  ) : (
                    entregable && (
                      <div>
                        {entregable.fileType === "application/pdf" ? (
                          <iframe
                            src={entregable.archivoURL}
                            width="100%"
                            height="470px"
                            title="Vista previa del PDF"
                          />
                        ) : entregable.fileType === "image/jpeg" ? (
                          <img
                            src={entregable.archivoURL}
                            alt="Vista previa del archivo"
                            className="max-w-full h-auto"
                          />
                        ) : (
                          <p>Tipo de archivo no compatible para mostrar.</p>
                        )}
                      </div>
                    )
                  )}
                </div>
                <div className="bg-[#3684DB] p-4 rounded-b-lg flex justify-end gap-x-2">
                  <button
                    className="bg-white text-[#3684DB] py-2 px-4 rounded-lg border border-[#3684DB]"
                    onClick={toggleViewEvaluationModal}
                  >
                    Cerrar
                  </button>
                  <button
                    className="bg-white text-[#3684DB] py-2 px-4 rounded-lg border border-[#3684DB]"
                    onClick={() => {
                      if (entregable?.archivoURL) {
                        window.open(entregable.archivoURL, "_blank");
                      } else {
                        alert("No hay un archivo disponible para visualizar.");
                      }
                    }}
                  >
                    Ver archivo
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EvaluacionSemanal;
