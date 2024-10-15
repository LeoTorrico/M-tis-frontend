import React from 'react';

const VerEvaluacion = () => {
  const evaluacion = {
    nombre: "Evaluación de Matemáticas",
    fecha: "15 de Octubre de 2024",
    preguntas: [
      { id: 1, pregunta: "¿Cuál es el valor de Pi?", calificacion: 5 },
      { id: 2, pregunta: "Resuelve 5 + 7", calificacion: 4 },
      { id: 3, pregunta: "Deriva x^2", calificacion: 3 },
    ],
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-4">{evaluacion.nombre}</h1>
        <p className="text-gray-600 text-center mb-6">Fecha: {evaluacion.fecha}</p>

        <div className="space-y-4">
          {evaluacion.preguntas.map((pregunta) => (
            <div key={pregunta.id} className="p-4 bg-blue-50 rounded-lg shadow-md">
              <h2 className="font-semibold text-lg">{pregunta.pregunta}</h2>
              <p className="text-gray-700">Calificación: {pregunta.calificacion}/5</p>
            </div>
          ))}
        </div>

        <button className="mt-6 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
          Finalizar Evaluación
        </button>
      </div>
    </div>
  );
};

export default VerEvaluacion;
