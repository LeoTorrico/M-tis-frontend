import React from "react";

const DetallesEvaluacion = ({ evaluacion, user }) => {
  return (
    <div className="p-6">
      {/* Información de la evaluación */}
      <div className="p-4 mb-6 border-b">
        <h1 className="text-3xl font-bold mb-4">{evaluacion.evaluacion}</h1>
        <p>Código de la evaluación: {evaluacion.cod_evaluacion}</p>
        <p>Descripción: {evaluacion.descripcion_evaluacion}</p>
      </div>
    </div>
  );
};

export default DetallesEvaluacion;
