import React, { useEffect, useState, useContext } from "react";
import { PiNewspaper } from "react-icons/pi";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext";

const EvaluacionCruzada = () => {
  const { cod_clase } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [grupoData, setGrupoData] = useState({
    nombre_corto: "",
    nombre_largo: "",
    horario: {
      dia_horario: "",
      hora_inicio: "",
      hora_fin: "",
    },
    integrantes: [],
  });

  const [rubricScores, setRubricScores] = useState({});
  const [selectedStudentIndex, setSelectedStudentIndex] = useState(null);
  const [comentario, setComentario] = useState("");
  const [errorComentario, setErrorComentario] = useState("");

  // Verificar rol del usuario
  useEffect(() => {
    if (user?.rol === "docente") {
      alert("Esta es una evaluación para estudiantes. Serás redirigido.");
      navigate(-1); // Redirige al usuario a la página anterior
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchGrupoData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:3000/eval-cruzada/${cod_clase}`,
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
    const updatedIntegrantes = [...grupoData.integrantes];
    updatedIntegrantes[selectedStudentIndex].score =
      rubricScores[selectedStudentIndex];
    updatedIntegrantes[selectedStudentIndex].comentario = comentario;

    setGrupoData((prev) => ({
      ...prev,
      integrantes: updatedIntegrantes,
    }));
    setSelectedStudentIndex(null);
  };

  return (
    <div className="flex flex-col w-full p-6 bg-white">
      <div className="bg-semi-blue text-white p-6 mb-6 rounded-lg">
        <h2 className="text-2xl font-semibold">{grupoData.nombre_largo}</h2>
        <p className="text-xl">{grupoData.nombre_corto}</p>
        <p className="text-lg mt-2">
          Horario: {grupoData.horario.dia_horario}{" "}
          {grupoData.horario.hora_inicio} - {grupoData.horario.hora_fin}
        </p>
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
            {grupoData.integrantes.map((integrante, index) => (
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
              {grupoData.integrantes.map((integrante, index) => (
                <div
                  key={index}
                  className="relative"
                  onClick={() => openRubricModal(index)}
                >
                  <input
                    type="text"
                    value={
                      integrante.score !== undefined ? integrante.score : "/..."
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
    </div>
  );
};

export default EvaluacionCruzada;
