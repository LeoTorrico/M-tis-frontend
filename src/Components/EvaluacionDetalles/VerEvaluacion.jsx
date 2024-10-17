import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

const VerEvaluacion = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Crear vista previa solo para tipos de archivo compatibles
      const fileURL = URL.createObjectURL(file);
      setFilePreview(fileURL);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreview(null); // Eliminar la vista previa cuando se elimine el archivo
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
      <div className="flex items-center border border-gray-300 rounded p-2 shadow-sm relative">
        {fileType === "image" ? (
          // Vista previa para imágenes
          <img src={filePreview} alt="Vista previa" className="w-24 h-24 object-cover rounded" />
        ) : fileType === "application" ? (
          selectedFile.type === "application/pdf" ? (
            // Vista previa para PDF usando un iframe para la primera página
            <iframe
              src={filePreview}
              title="Vista previa de PDF"
              className="w-24 h-24 border rounded"
              style={{ overflow: "hidden" }}
            />
          ) : (
            // Vista previa para DOCX/PPTX (usando un iframe para la primera página)
            <iframe
              src={`https://docs.google.com/gview?url=${filePreview}&embedded=true`}
              title="Vista previa de DOCX/PPTX"
              className="w-24 h-24 border rounded"
            />
          )
        ) : null}

        {/* Nombre del archivo como enlace */}
        <div className="ml-4">
          <a
            href={filePreview}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-600 hover:underline"
          >
            {selectedFile.name}
          </a>
        </div>
        {/* Icono de Cruz para eliminar el archivo, centrado a la derecha dentro de la tarjeta */}
        <AiOutlineClose
          className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500 cursor-pointer hover:text-gray-700"
          onClick={handleRemoveFile}
          size={24}
        />
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Ver Evaluación</h1>
      <div className="grid grid-cols-2 gap-4">
        
        {/* Columna de Descripción */}
        <div className="border border-gray-300 p-4 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-2">Descripción de la Evaluación</h2>
          <p>
            Aquí puedes agregar la descripción detallada de la evaluación, incluyendo instrucciones y objetivos. Asegúrate de revisar los requisitos antes de entregar tu archivo.
          </p>
        </div>

        {/* Columna de Subir Archivo */}
        <div className="border border-gray-300 p-4 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-2">Subir Archivo</h2>
          <form onSubmit={handleSubmit}>
            {/* Botón "Añadir archivo" estilo blanco con borde plomito */}
            <label className="inline-block w-full">
              <button
                type="button"
                className="border border-gray-300 text-blue-500 bg-white py-2 px-4 rounded w-full cursor-pointer hover:bg-gray-100 transition-all"
                onClick={() => document.getElementById('file-input').click()} // Al hacer clic en el botón, se activa el input
              >
                Añadir archivo
              </button>
              <input
                id="file-input" // ID para poder referenciar el input
                type="file"
                onChange={handleFileChange}
                className="hidden"  // Ocultar el input real
                accept="image/*,.pdf,.docx,.pptx" // Especifica los tipos de archivos permitidos
              />
            </label>

            {/* Previsualización del archivo */}
            {selectedFile && (
              <div className="relative mt-4">
                {/* Vista previa del archivo */}
                {renderFilePreview()}
              </div>
            )}

            {/* Botón Entregar */}
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full mt-4"
            >
              Entregar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerEvaluacion;
