import React from "react";
import { MdLibraryBooks } from "react-icons/md";

const DetallesEvaluacion = ({ evaluacion }) => {
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

        <div className="bg-gray-100 p-4 rounded-lg">
          {evaluacion.archivo_evaluacion ? (
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
                // Si el archivo es PDF (cadenas Base64 de PDFs a menudo comienzan con "JVBERi0")
                <iframe
                  src={`data:application/pdf;base64,${evaluacion.archivo_evaluacion}`}
                  title="Previsualización de PDF"
                  className="w-full h-auto max-h-64 rounded"
                  style={{ border: "none" }} 
                />
              ) : evaluacion.archivo_evaluacion.startsWith("/9j/") || // Para imágenes JPEG
                evaluacion.archivo_evaluacion.startsWith("iVBORw0KGgo") ? ( // Para imágenes PNG
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
          )}
        </div>
      </div>
    </div>
  );
};

export default DetallesEvaluacion;
