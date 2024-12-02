import React, { useState } from "react";
import { FaFilePdf, FaImage, FaExternalLinkAlt, FaDownload } from "react-icons/fa";

const ArchivoAdjunto = ({ evaluacion }) => {
  const [filePreview, setFilePreview] = useState(null);
  const [retrievedFile, setRetrievedFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Ejecutar cuando el componente se monta y la evaluación tiene un archivo
  React.useEffect(() => {
    if (evaluacion.archivo_evaluacion) {
      const archivo = evaluacion.archivo_evaluacion;
      const fileType = archivo.startsWith("JVBERi0")
        ? "application/pdf"
        : archivo.startsWith("/9j/") || archivo.startsWith("iVBORw0KGgo")
        ? "image/jpeg"
        : "unknown";

      const fileName = fileType === "application/pdf" ? "archivo_entregado.pdf" : "archivo_entregado.jpg";

      setRetrievedFile({
        name: fileName,
        base64: archivo,
        type: fileType,
      });

      // Convertir base64 a un Blob y crear URL para la vista previa
      const byteCharacters = atob(archivo);
      const byteNumbers = new Uint8Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const blob = new Blob([byteNumbers], { type: fileType });
      setFilePreview(URL.createObjectURL(blob));
    }
  }, [evaluacion.archivo_evaluacion]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDownload = () => {
    if (retrievedFile?.base64) {
      const link = document.createElement("a");
      link.href = `data:${retrievedFile.type};base64,${retrievedFile.base64}`;
      link.download = retrievedFile.name;
      link.click();
    } else {
      console.error("No se puede descargar, el archivo no está disponible.");
    }
  };

  const handleOpenInNewWindow = () => {
    if (retrievedFile?.base64) {
      const newWindow = window.open();
      const blob = new Blob([Uint8Array.from(atob(retrievedFile.base64), c => c.charCodeAt(0))], { type: retrievedFile.type });
      const url = URL.createObjectURL(blob);
      newWindow.document.write(`
        <html>
          <head>
            <title>Archivo</title>
          </head>
          <body>
            ${retrievedFile.type.startsWith("image/") ? 
              `<img src="${url}" alt="Previsualización de imagen" style="width:100%; height:auto;" />` 
              : 
              `<iframe src="${url}" style="width:100%; height:100vh;"></iframe>`
            }
            <button onclick="window.close()">Cerrar</button>
          </body>
        </html>
      `);
      newWindow.document.close();
    } else {
      console.error("No se puede abrir el archivo en una nueva ventana, el archivo no está disponible.");
    }
  };

  return (
    <div className="archivo-adjunto p-4 border rounded-lg bg-gray-50">
      {retrievedFile ? (
        <>
          <div className="flex items-center justify-between mb-0">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={handleOpenModal}>
              {retrievedFile.type === "application/pdf" ? (
                <FaFilePdf className="text-red-600 w-8 h-8" />
              ) : retrievedFile.type.startsWith("image/") ? (
                <FaImage className="text-blue-600 w-8 h-8" />
              ) : (
                <span className="text-gray-400">Archivo</span>
              )}
              <span className="text-blue-600 underline">Ver archivo</span>
            </div>
          </div>
        </>
      ) : (
        <p className="text-gray-400 italic">No se ha subido un archivo de evaluación.</p>
      )}

      {/* Modal de previsualización */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-4xl w-full relative h-[90vh]">
            {/* Botón de cierre (X) */}
            <button className="absolute top-4 right-4 text-black font-bold text-xl hover:text-gray-600" onClick={handleCloseModal}>
              X
            </button>
            {/* Botones de descarga y abrir en nueva ventana */}
            <div className="absolute top-4 left-4 flex items-center space-x-4">
              <button onClick={handleDownload} className="text-gray-600 flex items-center space-x-1">
                <FaDownload />
                <span>Descargar</span>
              </button>
              <button onClick={handleOpenInNewWindow} className="text-gray-600 flex items-center space-x-1">
                <FaExternalLinkAlt />
                <span>Abrir en ventana</span>
              </button>
            </div>
            <div className="preview-container mt-10 h-[calc(100%-40px)]"> 
              {retrievedFile.type.startsWith("image/") ? (
                <img
                  src={filePreview}
                  alt="Previsualización de imagen"
                  className="w-full h-full object-contain"
                />
              ) : retrievedFile.type === "application/pdf" ? (
                <iframe
                  src={filePreview}
                  title="Previsualización de PDF"
                  className="w-full h-full"
                />
              ) : (
                <p>Vista previa no disponible para este tipo de archivo.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArchivoAdjunto;
