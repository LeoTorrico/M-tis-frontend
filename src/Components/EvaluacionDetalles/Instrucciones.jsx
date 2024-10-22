import React, { useState, useContext } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai"; 
import { MdLibraryBooks } from "react-icons/md";
import { UserContext } from "../../context/UserContext";

const Instrucciones = ({ evaluacion }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const { user } = useContext(UserContext);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const fileURL = URL.createObjectURL(file);
      setFilePreview(fileURL);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
  };

  const handleFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]); // Obtiene la parte Base64
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (selectedFile) {
      try {
        const base64File = await handleFileToBase64(selectedFile);

        const response = await axios.post(
          `http://localhost:3000/evaluaciones/${evaluacion.cod_evaluacion}/entregables`,
          {
            archivo_grupo: base64File,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        const backendMessage = response.data.message;

        if (backendMessage === "Este entregable ya ha sido subido anteriormente") {
          Swal.fire({
            icon: "error",  
            title: "Archivo Duplicado",
            text: "Este entregable ya ha sido subido anteriormente.",
          });
        } else if (backendMessage === "Entregable subido exitosamente") {
          Swal.fire({
            icon: "success", 
            title: "Éxito",
            text: "Archivo subido con éxito.",
          });
          console.log("Archivo subido:", response.data);
          setSelectedFile(null);  // Limpiar el archivo después de subirlo
          setFilePreview(null);
        }
      } catch (error) {
        console.error("Error al subir el archivo:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un problema al subir el archivo. Inténtalo de nuevo.",
        });
      }
    } else {
      Swal.fire({
        icon: "warning",
        title: "Advertencia",
        text: "Por favor selecciona un archivo antes de entregar.",
      });
    }
  };

  const renderFilePreview = () => {
    if (!selectedFile || !filePreview) return null;

    const fileType = selectedFile.type.split("/")[0];

    return (
      <div className="flex flex-col border border-gray-300 bg-white rounded-lg p-2 shadow-sm relative h-full">
        <div className="w-full mb-2">
          <a
            href={filePreview}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-600 hover:underline block truncate"
          >
            {selectedFile.name}
          </a>
        </div>

        <div className="flex-grow overflow-auto">
          {fileType === "image" ? (
            <img
              src={filePreview}
              alt="Vista previa"
              className="w-full h-auto max-h-64 object-contain rounded"
            />
          ) : fileType === "application" ? (
            selectedFile.type === "application/pdf" ? (
              <iframe
                src={filePreview}
                title="Vista previa de PDF"
                className="w-full h-full rounded"
                style={{ border: "none", minHeight: "200px" }}
              />
            ) : (
              <iframe
                src={`https://docs.google.com/gview?url=${filePreview}&embedded=true`}
                title="Vista previa de DOCX/PPTX"
                className="w-full h-full rounded"
                style={{ border: "none", minHeight: "200px" }}
              />
            )
          ) : null}
        </div>

        <AiOutlineClose
          className="absolute top-2 right-2 text-gray-500 cursor-pointer hover:text-gray-700"
          onClick={handleRemoveFile}
          size={24}
        />
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen" style={{ maxHeight: "calc(100vh - 60px)" }}>
      <div className="bg-semi-blue text-white p-6 rounded-lg m-4">
        <div className="flex items-center">
          <span className="bg-white p-2 rounded-full text-black mr-4">
            <MdLibraryBooks size={32} />
          </span>
          <div>
            <h1 className="text-3xl font-bold">{evaluacion.evaluacion}</h1>
            <p className="text-xl">{evaluacion.tipo_evaluacion}</p>
          </div>
        </div>
      </div>

      <div className="border p-6 rounded-lg m-4 flex-grow grid grid-cols-2 gap-4">
        <div className="bg-blue-gray p-4 rounded-lg">
          <p className="text-xm">{evaluacion.descripcion_evaluacion}</p>
        </div>

        <div className="bg-blue-gray p-4 rounded-lg flex flex-col h-full">
          {user.rol === "estudiante" ? (
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
              <label className="inline-block w-full">
                <button
                  type="button"
                  className="border border-gray-300 text-blue-500 bg-white py-2 px-4 rounded-lg w-full cursor-pointer flex items-center justify-center"
                  onClick={() => document.getElementById('file-input').click()}
                >
                  <AiOutlinePlus className="mr-2" />
                  Añadir archivo
                </button>
                <input
                  id="file-input"
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*,.pdf,.docx,.pptx"
                />
              </label>

              {selectedFile && (
                <div className="relative mt-4 flex-grow">
                  {renderFilePreview()}
                </div>
              )}

              <button
                type="submit"
                className="bg-semi-blue text-white px-4 py-2 rounded-lg w-full mt-4"
              >
                Entregar
              </button>
            </form>
          ) : (
            evaluacion.archivo_evaluacion ? (
              <>
                <a
                  href={`data:application/octet-stream;base64,${evaluacion.archivo_evaluacion}`}
                  className="text-blue-600 underline"
                  download
                >
                  Descargar archivo
                </a>

                {evaluacion.archivo_evaluacion.startsWith("JVBERi0") ? (
                  <iframe
                    src={`data:application/pdf;base64,${evaluacion.archivo_evaluacion}`}
                    title="Previsualización de PDF"
                    className="flex flex-col h-full"
                    style={{ border: "none" }}
                  />
                ) : evaluacion.archivo_evaluacion.startsWith("/9j/") || 
                  evaluacion.archivo_evaluacion.startsWith("iVBORw0KGgo") ? (
                  <img
                    src={`data:image/jpeg;base64,${evaluacion.archivo_evaluacion}`}
                    alt="Previsualización del archivo"
                    className="mt-4"
                    style={{ maxWidth: "100%", maxHeight: "400px" }}
                  />
                ) : (
                  <p className="mt-4">Este tipo de archivo no se puede previsualizar.</p>
                )}
              </>
            ) : (
              <p>No hay archivo adjunto.</p>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Instrucciones;
