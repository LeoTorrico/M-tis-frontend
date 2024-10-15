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
            <a
              href={evaluacion.archivo_evaluacion}  // Suponiendo que evaluacion.archivo sea la URL del archivo
              className="text-blue-600 underline"
              download
            >
              Descargar archivo
            </a>
          ) : (
            <p>No hay archivo adjunto.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetallesEvaluacion;
