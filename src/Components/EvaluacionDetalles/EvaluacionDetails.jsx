import React, { useState, useEffect } from "react";
import { MdLibraryBooks, MdMoreVert } from "react-icons/md";
import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai";
import { FaLink } from "react-icons/fa";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import MostarRubrica from "./MostrarRubrica";
import ArchivoAdjunto from "./ArchivoAdjunto";
import EditarEvaluacion from "./EditarEvaluacion"

const EvaluacionDetails = ({
  evaluation,
  user,
  submitted,
  retrievedFile,
  isPastDueDate,
  handleFileChange,
  handleSubmit,
  linkInput,
  handleLinkChange,
  renderFilePreview,
  renderRetrievedFile,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comentario, setComentario] = useState(null);
  const [comentarioIndividual, setComentarioIndividual] = useState(null);
  const { cod_clase } = useParams();
  const [evaluacion, setEvaluacion] = useState(evaluation);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComentarios = async () => {
      try {
        const response = await axios.get(
          `https://backend-tis-silk.vercel.app/evaluaciones/${evaluacion.cod_evaluacion}/${cod_clase}/nota-total`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        const { retroalimentacion, comentario_individual } = response.data;
        setComentario(retroalimentacion?.comentario || null);
        setComentarioIndividual(comentario_individual || null);
      } catch (error) {
        console.error("Error al obtener los comentarios:", error);
        setComentario(null);
        setComentarioIndividual(null);
      }
    };

    if (evaluacion.cod_evaluacion && cod_clase) {
      fetchComentarios();
    }
  }, [evaluacion.cod_evaluacion, cod_clase, user.token]);

  useEffect(() => {
    // Recuperar el comentario asociado a la evaluación actual
    const comentarioKey = `comentario_${evaluacion.cod_evaluacion}`;
    const savedComentario = localStorage.getItem(comentarioKey);
    setComentario(savedComentario === 'null' ? null : savedComentario);
  }, [evaluacion.cod_evaluacion]);

  const onFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    handleFileChange(event);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

   // Función para abrir el modal de edición
   const onEdit = () => {
    setIsModalOpen(true);  // Abre el modal
   };

    // Función para cerrar el modal
    const closeModal = () => {
      setIsModalOpen(false);  // Cierra el modal
    };

  const handleDelete = async () => {
    try {
      if (!user?.token) {
        throw new Error("Token de autenticación no disponible");
      }

      const response = await axios.delete(
        `https://backend-tis-silk.vercel.app/evaluaciones/${evaluacion.cod_evaluacion}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      console.log("Evaluación eliminada con éxito:", response.data);
      setMenuOpen(false);
      navigate(`/Vista-Curso/${cod_clase}`);
    } catch (error) {
      console.error("Error al eliminar la evaluación:", error);
      alert(
        `Error al eliminar la evaluación: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const convertLocalHour = (fecha) => {
    return fecha.replace(/T\d{2}:\d{2}:\d{2}\.\d{3}Z$/, 'T00:00:00.000');  
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-60px)] h-full">
      <div className="bg-semi-blue text-white p-6 rounded-lg m-4 relative">
        <div className="flex items-center">
          <span className="bg-white p-2 rounded-full text-black mr-4">
            <MdLibraryBooks size={32} />
          </span>
          <div>
            <h1 className="text-3xl font-bold font-Montserrat">
              {evaluacion.evaluacion}
            </h1>
            <p className="text-xl font-Montserrat">
              {evaluacion.tipo_evaluacion}
            </p>
          </div>
        </div>

        {user.rol === "docente" && (
          <div className="absolute top-4 right-4">
            <button onClick={toggleMenu} className="text-white">
              <MdMoreVert size={24} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-28 bg-white rounded-lg shadow-lg z-10">
                <button
                  onClick={onEdit}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg w-full text-left"
                >
                  Editar evaluación
                </button>
                <button
                  onClick={() =>
                    navigate(
                      `/Vista-Curso/${cod_clase}/evaluacion/${evaluacion.cod_evaluacion}/editar-rubrica`
                    )
                  }
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg w-full text-left"
                >
                  Editar rubrica
                </button>
                <button
                  onClick={handleDelete}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg w-full text-left"
                >
                  Eliminar
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="border p-4 rounded-lg mt-0 m-4 flex-grow grid grid-cols-[minmax(0,2fr),minmax(0,1fr)] gap-4">
        <div
          className={`bg-blue-gray p-4 rounded-lg flex flex-col h-full ${
            user.rol === "docente" ? "col-span-2" : ""
          }`}
        >
          <p className="text-xm font-semibold font-Montserrat">
            Descripción de la evaluación:
          </p>
          <p className="text-xm font-Montserrat">
            {evaluacion.descripcion_evaluacion}
          </p>
          {user.rol === "docente" && (
            <div className="flex justify-end items-center mt-2">
              <label className="text-xm font-semibold font-Montserrat mr-2">
                Fecha de entrega:
              </label>
              <p className={`text-xm font-semibold font-Montserrat`}>
                {new Date(convertLocalHour(evaluacion.fecha_fin)).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                })}
              </p>
            </div>
          )}
          <div className="col-span-2 overflow-y-auto mt-2">
            <ArchivoAdjunto evaluacion={evaluacion} />
          </div>
          <div className="col-span-2 overflow-y-auto mt-2">
            <MostarRubrica evaluacion={evaluacion} />
          </div>
        </div>

        {user.rol !== "docente" && (
          <div className="bg-blue-gray p-4 rounded-lg flex flex-col h-full">
            <p
              className={`text-xm font-semibold font-Montserrat ${
                isPastDueDate ? "text-red-400" : ""
              }`}
            >
              Fecha de entrega:{" "}
              {new Date(evaluacion.fecha_fin).toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>

            {user.rol === "estudiante" && (
              <form onSubmit={handleSubmit} className="flex flex-col h-full">
                {submitted && retrievedFile && renderRetrievedFile()}

                {!submitted && (
                  <label className="inline-block w-full mt-2">
                    <button
                      type="button"
                      className="border border-gray-300 text-blue-500 bg-white py-2 px-4 rounded-lg w-full cursor-pointer flex items-center justify-center"
                      onClick={() =>
                        document.getElementById("file-input").click()
                      }
                    >
                      <AiOutlinePlus className="mr-2 font-Montserrat" />
                      Añadir archivo
                    </button>
                    <input
                      id="file-input"
                      type="file"
                      onChange={onFileChange}
                      className="hidden"
                      accept="image/*,.pdf"
                    />
                  </label>
                )}

                {selectedFile && renderFilePreview && (
                  <div className="relative mt-4 flex-grow">
                    {renderFilePreview()}
                    {!submitted && (
                      <AiOutlineClose
                        className="absolute top-2 right-2 text-gray-500 cursor-pointer hover:text-gray-700"
                        onClick={handleRemoveFile}
                        size={24}
                      />
                    )}
                  </div>
                )}

                {!submitted && (
                  <label className="inline-block w-full mt-2">
                    <span className="block font-semibold font-Montserrat">
                      Enlace de entrega:
                    </span>
                    <input
                      type="text"
                      value={linkInput}
                      onChange={(e) => handleLinkChange(e.target.value)}
                      className="border border-gray-300 p-2 rounded-lg w-full"
                      placeholder="Ingresa el enlace aquí (Opcional)"
                    />
                  </label>
                )}

                {submitted && linkInput && (
                  <div className="mt-2 bg-white p-2 border rounded-lg flex items-center">
                    <FaLink className="text-black-600 mr-2" />
                    <a
                      href={linkInput}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 underline font-semibold"
                    >
                      {linkInput}
                    </a>
                  </div>
                )}

                <button
                  type="submit"
                  className={`px-4 py-2 rounded-lg w-full mt-4 ${
                    submitted
                      ? "bg-gray-400 text-white"
                      : isPastDueDate
                      ? "bg-white text-red-500 border border-red-500"
                      : "bg-semi-blue text-white"
                  }`}
                  disabled={submitted || isPastDueDate}
                >
                  {submitted
                    ? "Entregado"
                    : isPastDueDate
                    ? "Sin entregar"
                    : "Entregar"}
                </button>

                {comentario && (
                  <div className="mt-2 p-3 bg-white rounded-lg shadow">
                    <p className="text-sm text-black font-Montserrat">
                      <strong>Comentario grupal:</strong> {comentario}
                    </p>
                  </div>
                )}

                {comentarioIndividual && (
                  <div className="mt-2 p-3 bg-white rounded-lg shadow">
                    <p className="text-sm text-black font-Montserrat">
                      <strong>Comentario individual:</strong>{" "}
                      {comentarioIndividual}
                    </p>
                  </div>
                )}
              </form>
            )}
          </div>
        )}
      </div>
      {/* Modal de edición */}
      {isModalOpen && (
            <EditarEvaluacion
                evaluacion={evaluacion}
                onCloseModal={closeModal}
                saveModal={setEvaluacion}
            />
        )}
    </div>
  );
};

export default EvaluacionDetails;
