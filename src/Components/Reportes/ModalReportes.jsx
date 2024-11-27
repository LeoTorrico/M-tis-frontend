import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const GradesReportModal = ({ selectedGroup, onClose }) => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchGradesReport = async () => {
      if (!selectedGroup) return;

      try {
        const response = await fetch(
          `http://localhost:3000/reportes/grupos/${selectedGroup.cod_grupoempresa}/reporte-notas`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch grades report");
        }

        const data = await response.json();
        setReportData(data);
      } catch (err) {
        console.error("Error fetching grades report:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGradesReport();
  }, [selectedGroup, token]);

  const getAllEvaluations = () => {
    if (!reportData || !reportData.estudiantes) return [];
    const evaluationsSet = new Set();
    reportData.estudiantes.forEach((student) => {
      student.notas.forEach((nota) => {
        evaluationsSet.add(nota.evaluacion);
      });
    });
    return Array.from(evaluationsSet);
  };

  const findGrade = (student, evaluationName) => {
    const nota = student.notas.find((n) => n.evaluacion === evaluationName);
    return nota ? nota.calificacion : "-";
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const evaluations = getAllEvaluations();

    // Título del reporte
    doc.setFontSize(16);
    doc.text(`Reporte de Notas - ${selectedGroup.nombre_largo}`, 10, 10);

    // Preparar datos para la tabla
    const tableData = reportData.estudiantes.map((student) => {
      const grades = evaluations.map((evaluation) =>
        findGrade(student, evaluation)
      );
      const total = student.notas.reduce(
        (total, nota) => total + nota.calificacion,
        0
      );
      return [
        student.estudiante.codigo_sis,
        `${student.estudiante.nombre_estudiante} ${student.estudiante.apellido_estudiante}`,
        student.estudiante.rol,
        ...grades,
        total,
      ];
    });

    // Encabezados de la tabla
    const tableHeaders = [
      "Código SIS",
      "Nombre Estudiante",
      "Rol",
      ...evaluations,
      "Total",
    ];

    // Crear tabla con jsPDF
    doc.autoTable({
      head: [tableHeaders],
      body: tableData,
      startY: 20,
    });

    // Descargar el archivo
    doc.save(`Reporte_Notas_${selectedGroup.nombre_largo}.pdf`);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg">
          <p>Cargando reporte de notas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg">
          <p className="text-red-500">Error: {error}</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-semi-blue text-white rounded hover:bg-[#2a3b4f]"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  const evaluations = getAllEvaluations();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-11/12 max-w-6xl max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Reporte de Notas - {selectedGroup.nombre_largo}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
          >
            <X size={24} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Código SIS</th>
                <th className="border p-2">Nombre Estudiante</th>
                <th className="border p-2">Rol</th>
                {evaluations.map((evaluation, index) => (
                  <th key={index} className="border p-2">
                    {evaluation}
                  </th>
                ))}
                <th className="border p-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {reportData.estudiantes.map((student, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border p-2 text-center">
                    {student.estudiante.codigo_sis}
                  </td>
                  <td className="border p-2">
                    {student.estudiante.nombre_estudiante}{" "}
                    {student.estudiante.apellido_estudiante}
                  </td>
                  <td className="border p-2 text-center">
                    {student.estudiante.rol}
                  </td>
                  {evaluations.map((evaluation, evalIndex) => (
                    <td key={evalIndex} className="border p-2 text-center">
                      {findGrade(student, evaluation)}
                    </td>
                  ))}
                  <td className="border p-2 text-center font-bold">
                    {student.notas.reduce(
                      (total, nota) => total + nota.calificacion,
                      0
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={generatePDF}
            className="px-4 py-2 bg-[#031930] text-white rounded hover:bg-blue-600 mr-2"
          >
            Descargar PDF
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default GradesReportModal;
