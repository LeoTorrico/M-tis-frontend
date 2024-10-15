import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext"; 

const EvaluacionDetalles = () => {
  const { cod_clase, cod_evaluacion } = useParams(); 
  const [e, setEvaluacion] = useState(null); 
  const { user } = useContext(UserContext); 

  const fetchEvaluacion = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/evaluaciones/detalles/${cod_evaluacion}`, 
        {
          headers: {
            Authorization: `Bearer ${user.token}`, 
            "Content-Type": "application/json"
          }
        }
      );
      setEvaluacion(response.data); // Asignar los datos recibidos al estado
    } catch (error) {
      console.error("Error al obtener los detalles de la evaluacion:", error);
    }
  };

  useEffect(() => {
    fetchEvaluacion(); 
  }, [cod_clase, cod_evaluacion]); 

  if (!e) {
    return <p>Cargando detalles del grupo...</p>; 
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">{e.evaluacion}</h1> 
      <p>Código de la evaluacion: {e.cod_evaluacion}</p> 
      <p>Descripción: {e.descripcion_evaluacion}</p> 
    </div>
  );
};

export default EvaluacionDetalles;
