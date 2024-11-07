import React, { useEffect, useState } from "react";
import { PiNewspaper } from "react-icons/pi";
import { useParams } from "react-router-dom";
import axios from "axios";

const EvaluacionCruzada = () => {
  const { cod_grupoempresa, cod_clase, cod_evaluacion } = useParams();

  // Estado para la información del curso
  const [curso, setCurso] = useState({
    nombre: "",
    gestion: "",
    cod_docente: "",
    cod_gestion: "",
  });

  const [integrantes, setIntegrantes] = useState([]);
  const [rubricScores, setRubricScores] = useState({});
  const [rubricas, setRubricas] = useState([]);
  const [selectedStudentIndex, setSelectedStudentIndex] = useState(null);
  const [comentario, setComentario] = useState("");
  const [errorComentario, setErrorComentario] = useState("");

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

  useEffect(() => {
    const fetchRubricas = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No se obtuvo el token");
          return;
        }

        const response = await axios.get(
          `http://localhost:3000/rubricas/${cod_evaluacion}/grupos/${cod_grupoempresa}/rubricas`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setRubricas(response.data);
      } catch (error) {
        console.error("Error al obtener las rúbricas:", error);
      }
    };

    if (cod_evaluacion) {
      fetchRubricas();
    }
  }, [cod_evaluacion]);

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
      setErrorComentario("");
    }

    setComentario(newComentario);
  };

  const saveRubricScores = () => {
    const totalScore = rubricScores[selectedStudentIndex]?.reduce(
      (sum, score) => sum + score,
      0
    );

    const updatedIntegrantes = [...integrantes];
    updatedIntegrantes[selectedStudentIndex].score = totalScore;
    updatedIntegrantes[selectedStudentIndex].comentario = comentario;
    setIntegrantes(updatedIntegrantes);
    setSelectedStudentIndex(null);
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
          <h1 className="text-lg font-bold">Evaluacion cruzada</h1>
        </div>
        <hr className="border-black my-2" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
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

          <div>
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

                    <input
                      type="number"
                      min="0"
                      max={rubrica.peso}
                      value={
                        rubricScores[selectedStudentIndex]?.[rubricIndex] !==
                        undefined
                          ? rubricScores[selectedStudentIndex][rubricIndex]
                          : ""
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

              <div className="mb-4">
                <label className="font-bold mb-2">Comentarios</label>
                <textarea
                  value={comentario}
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

export default EvaluacionCruzada;
