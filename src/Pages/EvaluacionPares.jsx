import React, { useEffect, useState } from "react";
import { PiNewspaper } from "react-icons/pi";
import { useParams } from "react-router-dom";
import axios from "axios";

const EvaluacionPares = () => {
  const { cod_clase } = useParams();

  const [grupoData, setGrupoData] = useState({});
  const [rubricScores, setRubricScores] = useState({});
  const [selectedStudentIndex, setSelectedStudentIndex] = useState(null);
  const [comentario, setComentario] = useState("");
  const [errorComentario, setErrorComentario] = useState("");

  useEffect(() => {
    const fetchGrupoData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `https://backend-tis-silk.vercel.app/eval-pares/${cod_clase}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setGrupoData(response.data);
      } catch (error) {
        console.error("Error al obtener los datos del grupo:", error);
      }
    };

    if (cod_clase) {
      fetchGrupoData();
    }
  }, [cod_clase]);

  const openRubricModal = (index) => {
    setSelectedStudentIndex(index);
    setComentario("");
    setErrorComentario("");
  };

  const handleRubricChange = (index, value) => {
    setRubricScores((prev) => ({
      ...prev,
      [index]: value === "" ? "" : Number(value),
    }));
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
    const updatedEstudiantes = [...grupoData.estudiantes];
    updatedEstudiantes[selectedStudentIndex].score =
      rubricScores[selectedStudentIndex];
    updatedEstudiantes[selectedStudentIndex].comentario = comentario;

    setGrupoData((prev) => ({
      ...prev,
      estudiantes: updatedEstudiantes,
    }));
    setSelectedStudentIndex(null);
  };

  return (
    <div className="flex flex-col w-full p-6 bg-white">
      <div className="bg-semi-blue text-white p-6 mb-6 rounded-lg">
        <h2 className="text-2xl font-semibold">Evaluación de Pares</h2>
        <p className="text-xl">{grupoData.nombre_largo}</p>
      </div>

      <div className="border border-black rounded-lg p-6 mb-6 overflow-x-auto">
        <div className="flex items-center mb-4">
          <PiNewspaper className="text-2xl mr-2" />
          <h1 className="text-lg font-bold">Evaluación de Integrantes</h1>
        </div>
        <hr className="border-black my-2" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h2 className="font-bold text-md mb-2">Integrantes</h2>
            {grupoData.estudiantes &&
              grupoData.estudiantes.map((integrante, index) => (
                <div key={index} className="mb-2">
                  <input
                    type="text"
                    value={`${integrante.nombre_estudiante} ${integrante.apellido_estudiante} (${integrante.rol})`}
                    readOnly
                    className="bg-[#D1DDED] rounded-lg p-2 w-full"
                  />
                </div>
              ))}
          </div>

          <div>
            <h2 className="font-bold text-md mb-2 text-center">Nota</h2>
            <div className="flex flex-col space-y-2">
              {grupoData.estudiantes &&
                grupoData.estudiantes.map((integrante, index) => (
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
                ))}
            </div>
          </div>
        </div>
      </div>

      {selectedStudentIndex !== null &&
        grupoData.estudiantes[selectedStudentIndex] && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded-lg shadow-lg max-w-4xl w-full mx-4 lg:mx-auto max-h-[90vh] overflow-y-auto">
              <h2 className="bg-[#3684DB] p-4 rounded-t-lg text-white font-bold w-full text-center">
                Evaluar a{" "}
                {grupoData.estudiantes[selectedStudentIndex]?.nombre_estudiante}{" "}
                {
                  grupoData.estudiantes[selectedStudentIndex]
                    ?.apellido_estudiante
                }
              </h2>

              <div className="mb-4 p-4">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={rubricScores[selectedStudentIndex] || ""}
                  onChange={(e) =>
                    handleRubricChange(selectedStudentIndex, e.target.value)
                  }
                  className="border border-gray-300 p-2 w-full bg-[#B3D6FF] rounded-xl mb-4"
                  placeholder="Ingrese la nota (0-100)"
                />

                <div className="mb-4">
                  <label className="font-bold mb-2 block">Comentarios</label>
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
                    !!errorComentario ||
                    comentario.trim().split(/\s+/).length < 3
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

export default EvaluacionPares;
