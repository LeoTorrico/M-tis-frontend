import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EvaluacionDetalles from "./EvaluacionDetalles";
import EvaluacionCruzada from "./EvaluacionCruzada";
import EvaluacionPares from "./EvaluacionPares";

const VistaEvaluacion = () => {
  const { cod_evaluacion } = useParams();
  const [evaluacionTipo, setEvaluacionTipo] = useState(null);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  // Función auxiliar para normalizar strings
  const normalizarTexto = (texto) => {
    if (!texto) return "";
    return texto
      .trim()
      .toLowerCase()
      .replace(/["'\u200B-\u200D\uFEFF]/g, "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ");
  };

  useEffect(() => {
    const fetchEvaluacionTipo = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/evaluaciones/${cod_evaluacion}/tipo`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        let data = await response.text();
        const tipoNormalizado = normalizarTexto(data);

        setEvaluacionTipo(tipoNormalizado);
        setError(null);
      } catch (error) {
        console.error("Error fetching evaluation type:", error);
        setError(error.message);
      }
    };

    fetchEvaluacionTipo();
  }, [cod_evaluacion, token]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!evaluacionTipo) {
    return <div>Loading...</div>;
  }
  console.log(normalizarTexto(evaluacionTipo));
  // Utilizamos el texto normalizado para las comparaciones
  const isEvaluacionCruzada =
    normalizarTexto(evaluacionTipo) === "evaluacion cruzada";
  const isEvaluacionSemanal =
    normalizarTexto(evaluacionTipo) === "evaluacion semanal";
  const isEvaluacionPares =
    normalizarTexto(evaluacionTipo) === "evaluacion de pares";

  return (
    <div>
      {isEvaluacionCruzada && <EvaluacionCruzada />}
      {isEvaluacionSemanal && <EvaluacionDetalles />}
      {isEvaluacionPares && <EvaluacionPares />}
      {!isEvaluacionCruzada && !isEvaluacionSemanal && !isEvaluacionPares &&(
        <div>Tipo de evaluación no reconocido: {evaluacionTipo}</div>
      )}
    </div>
  );
};

export default VistaEvaluacion;
