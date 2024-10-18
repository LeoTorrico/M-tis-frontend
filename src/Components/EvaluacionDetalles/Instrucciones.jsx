import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { MdLibraryBooks } from "react-icons/md";

const Instrucciones = ({ evaluacion, user }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

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

  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedFile) {
      console.log("Archivo seleccionado:", selectedFile.name);
      // Lógica para enviar el archivo al servidor
    } else {
      alert("Por favor selecciona un archivo antes de entregar.");
    }
  };

  const renderFilePreview = () => {
    if (!selectedFile || !filePreview) return null;

    const fileType = selectedFile.type.split("/")[0];

    return (
      <div className="flex flex-col border border-gray-300 rounded p-2 shadow-sm relative">
        {/* Nombre del archivo como enlace arriba */}
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

        {/* Vista previa del archivo debajo del nombre */}
        <div className="flex-grow">
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
                className="w-full h-auto max-h-64 rounded"
                style={{ border: "none" }}
              />
            ) : (
              <iframe
                src={`https://docs.google.com/gview?url=${filePreview}&embedded=true`}
                title="Vista previa de DOCX/PPTX"
                className="w-full h-auto max-h-64 rounded"
                style={{ border: "none" }}
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
    <div>
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

      {/* Contenedor de dos columnas */}
      <div className="border p-6 rounded-lg m-4 grid grid-cols-2 gap-4">
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-xm">{evaluacion.descripcion_evaluacion}</p>
        </div>

        {/* Cambiar contenido en función del rol del usuario */}
        <div className="bg-gray-100 p-4 rounded-lg">
          {user.rol === "estudiante" ? (
            <form onSubmit={handleSubmit}>
              <label className="inline-block w-full">
                <button
                  type="button"
                  className="border border-gray-300 text-blue-500 bg-white py-2 px-4 rounded w-full cursor-pointer hover:bg-gray-100 transition-all"
                  onClick={() => document.getElementById('file-input').click()}
                >
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
                <div className="relative mt-4">
                  {renderFilePreview()}
                </div>
              )}

              <button
                type="submit"
                className="bg-dark-blue text-white px-4 py-2 rounded hover:bg-blue-600 w-full mt-4"
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

                {/* Previsualización del archivo en Base64 */}
                {evaluacion.archivo_evaluacion.startsWith("JVBERi0") ? (
                  <iframe
                    src={`data:application/pdf;base64,${evaluacion.archivo_evaluacion}`}
                    title="Previsualización de PDF"
                    className="w-full h-auto max-h-64 rounded"
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
