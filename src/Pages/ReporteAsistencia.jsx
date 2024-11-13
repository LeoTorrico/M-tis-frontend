import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import axios from "axios";

function AsistenciaReporte() {
  const { cod_clase } = useParams();
  const { user } = useContext(UserContext);
  const [asistenciaData, setAsistenciaData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAsistencia = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/asistencia/reporte/${cod_clase}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setAsistenciaData(response.data.reporteAsistencia);
    } catch (error) {
      console.error("Error al obtener el reporte:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAsistencia();
  }, [cod_clase, user.token]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (asistenciaData.length === 0) {
    return (
      <div className="flex flex-col w-full p-4">
        <div className="border p-4 rounded-lg flex-grow grid grid-cols-1 gap-2">
          <h2 className="text-xl font-bold mb-4 text-center">
            Reporte de Asistencia para Clase: {cod_clase}
          </h2>
          <div className="text-center text-gray-500 font-medium">
            No existe reporte aún.
          </div>
        </div>
      </div>
    );
  }

  const fechasAsistencia = [
    ...new Set(
      asistenciaData.flatMap((estudiante) =>
        estudiante.asistencia.map((item) => item.fecha)
      )
    ),
  ];

  return (
    <div className="flex flex-col w-full p-4">
      <div className="border p-4 rounded-lg flex-grow grid grid-cols-1 gap-2">
        <h2 className="text-xl font-bold mb-4 text-center">
          Reporte de Asistencia para Clase: {cod_clase}
        </h2>
        {/* Contenedor con scroll interno */}
        <div className="overflow-auto" style={{ maxHeight: "60vh" }}>
          <div
            className="grid gap-0 min-w-max"
            style={{
              gridTemplateColumns: `200px 250px 250px repeat(${fechasAsistencia.length}, 150px)`,
            }}
          >
            <div className="font-semibold p-2 bg-gray-200 border border-white">
              Código SIS
            </div>
            <div className="font-semibold p-2 bg-gray-200 border border-white">
              Nombre Estudiante
            </div>
            <div className="font-semibold p-2 bg-gray-200 border border-white">
              Correo Estudiante
            </div>
            {fechasAsistencia.map((fecha, index) => (
              <div
                key={index}
                className="font-semibold p-2 bg-gray-200 text-center border border-white"
              >
                {fecha}
              </div>
            ))}

            {asistenciaData.map((estudiante, index) => (
              <React.Fragment key={index}>
                <div className="p-2 border border-gray">
                  {estudiante.codigo_sis}
                </div>
                <div className="p-2 border border-gray">
                  {`${estudiante.nombre_estudiante} ${estudiante.apellido_estudiante}`}
                </div>
                <div className="p-2 border border-gray">
                  {estudiante.correo_estudiante}
                </div>
                {fechasAsistencia.map((fecha, fechaIndex) => {
                  const asistencia = estudiante.asistencia.find(
                    (item) => item.fecha === fecha
                  );
                  return (
                    <div key={fechaIndex} className="p-2 border border-gray text-center">
                      {asistencia ? asistencia.estadoAsistencia : ""}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AsistenciaReporte;
