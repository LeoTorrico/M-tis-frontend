import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";

function AsistenciaReporte() {
  const { cod_clase, cod_grupoempresa } = useParams();
  const { user } = useContext(UserContext);
  const [asistenciaData, setAsistenciaData] = useState([]);
  const [nombreClase, setNombreClase] = useState("");
  const [grupo, setGrupo] = useState("");
  const [horario, setHorario] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchAsistencia = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/asistencia/reporte/${cod_clase}/${cod_grupoempresa}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setAsistenciaData(response.data.reporteAsistencia);
      setNombreClase(response.data.nombreClase);
      setGrupo(response.data.grupo);
      setHorario(response.data.horario);
      console.log("Respuesta del backend:", response.data);
    } catch (error) {
      console.error("Error al obtener el reporte:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAsistencia();
  }, [cod_clase, user.token]);

  const generarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(`Reporte de Asistencia - Clase: ${nombreClase}`, 10, 10);
    doc.text(`Grupo: ${grupo}`, 10, 20);
    doc.text(
      `Horario: ${horario.dia_horario || ""} de ${
        horario.hora_inicio || ""
      } a ${horario.hora_fin || ""}`,
      10,
      30
    );

    // Modifica las columnas del reporte eliminando "Código SIS" y "Fecha Asistencia"
    const tableColumn = [
      "Nombre Estudiante",
      "Correo",
      "Presente",
      "Retraso",
      "Ausente sin Justificación",
      "Ausente con Justificación",
      "Estado Final",
    ];

    const tableRows = asistenciaData.map((estudiante) => {
      // Elimina la fecha y el código SIS de las filas
      return [
        `${estudiante.nombre_estudiante} ${estudiante.apellido_estudiante}`,
        estudiante.correo_estudiante,
        estudiante.resumenAsistencia.Presente,
        estudiante.resumenAsistencia.Retraso,
        estudiante.resumenAsistencia["Ausente sin Justificación"],
        estudiante.resumenAsistencia["Ausente con Justificación"],
        estudiante.estado || "",
      ];
    });

    // Genera la tabla en el PDF sin las fechas ni el código SIS
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      styles: {
        fillColor: [3, 25, 48], // RGB del color #031930
        textColor: [255, 255, 255], // Blanco para el texto
        halign: "center", // Centrar el texto en las celdas
      },
      headStyles: {
        fillColor: [3, 25, 48], // Fondo de la cabecera
        textColor: [255, 255, 255], // Texto blanco
      },
      bodyStyles: {
        fillColor: [255, 255, 255], // Fondo blanco para las filas
        textColor: [0, 0, 0], // Texto negro para las filas
      },
    });

    doc.save(`Reporte_Asistencia_${nombreClase}.pdf`);
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (asistenciaData.length === 0) {
    return (
      <div className="flex flex-col w-full p-4">
        <div className="border p-4 rounded-lg flex-grow grid grid-cols-1 gap-2">
          <h2 className="text-xl font-bold mb-4 text-center">
            Reporte de Asistencia para Clase: {nombreClase}
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
          Reporte de Asistencia para Clase: {nombreClase}
        </h2>

        <div className="mb-4">
          <p className="text-lg font-medium">
            <strong>Grupo:</strong> {grupo}
          </p>
          <p className="text-lg font-medium">
            <strong>Horario:</strong> {horario.dia_horario} de{" "}
            {horario.hora_inicio} a {horario.hora_fin}
          </p>
        </div>

        <div className="overflow-x-auto" style={{ maxHeight: "60vh" }}>
          <table className="min-w-max border-collapse border border-gray-200">
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-center">
                  Código SIS
                </th>
                <th className="border border-gray-300 px-4 py-2 text-center">
                  Nombre Estudiante
                </th>
                <th className="border border-gray-300 px-4 py-2 text-center">
                  Correo Estudiante
                </th>
                {fechasAsistencia.map((fecha, index) => (
                  <th
                    key={index}
                    className="border border-gray-300 px-4 py-2 text-center"
                  >
                    {fecha}
                  </th>
                ))}
                <th className="border border-gray-300 px-4 py-2 text-center">
                  Presente
                </th>
                <th className="border border-gray-300 px-4 py-2 text-center">
                  Retraso
                </th>
                <th className="border border-gray-300 px-4 py-2 text-center">
                  Ausente sin Justificación
                </th>
                <th className="border border-gray-300 px-4 py-2 text-center">
                  Ausente con Justificación
                </th>
                <th className="border border-gray-300 px-4 py-2 text-center">
                  Estado Final
                </th>
              </tr>
            </thead>
            <tbody>
              {asistenciaData.map((estudiante, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {estudiante.codigo_sis}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {`${estudiante.nombre_estudiante} ${estudiante.apellido_estudiante}`}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {estudiante.correo_estudiante}
                  </td>
                  {fechasAsistencia.map((fecha, fechaIndex) => {
                    const asistencia = estudiante.asistencia.find(
                      (item) => item.fecha === fecha
                    );
                    return (
                      <td
                        key={fechaIndex}
                        className="border border-gray-300 px-4 py-2 text-center"
                      >
                        {asistencia ? asistencia.estadoAsistencia : ""}
                      </td>
                    );
                  })}
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {estudiante.resumenAsistencia.Presente}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {estudiante.resumenAsistencia.Retraso}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {estudiante.resumenAsistencia["Ausente sin Justificación"]}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {estudiante.resumenAsistencia["Ausente con Justificación"]}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {estudiante.estado || ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={generarPDF}
            className="bg-[#031930] text-white py-2 px-4 rounded-lg hover:opacity-80"
          >
            Descargar en PDF
          </button>
        </div>
      </div>
    </div>
  );
}

export default AsistenciaReporte;
