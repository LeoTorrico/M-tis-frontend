import React, { useState, useEffect } from "react";
import { FileText, CheckSquare } from "lucide-react";
import GradesReportModal from "../Components/Reportes/ModalReportes";
const Reportes = () => {
  const [modalOpen, setModalOpen] = useState(true); // Controla la visibilidad del modal de cursos
  const [groupModalOpen, setGroupModalOpen] = useState(false); // Controla la visibilidad del modal de grupos
  const [selectedCourse, setSelectedCourse] = useState(null); // Guarda el curso seleccionado
  const [selectedGroup, setSelectedGroup] = useState(null); // Guarda el grupo seleccionado
  const [courses, setCourses] = useState([]); // Guarda las clases obtenidas
  const [groups, setGroups] = useState([]); // Guarda los grupos obtenidos
  const [loading, setLoading] = useState(true); // Indica si los datos están cargando
  const [loadingGroups, setLoadingGroups] = useState(false); // Indica si los grupos están cargando
  const [showGradesReport, setShowGradesReport] = useState(false);
  const token = localStorage.getItem("token");

  // Fetch de las clases
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:3000/clases/obtener", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setCourses(data.clases);
      } catch (error) {
        console.error("Error al obtener las clases:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleCourseSelection = (course) => {
    setSelectedCourse(course);
    console.log("Curso seleccionado:", course);
    setModalOpen(false); // Cierra el modal de cursos
    setGroupModalOpen(true); // Abre el modal de grupos
    fetchGroups(course.cod_clase); // Obtiene los grupos del curso seleccionado
  };

  const fetchGroups = async (cod_clase) => {
    setLoadingGroups(true);
    console.log(cod_clase);
    try {
      const response = await fetch(
        `http://localhost:3000/api/grupos/${cod_clase}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      console.log(data);
      setGroups(data);
    } catch (error) {
      console.error("Error al obtener los grupos:", error);
    } finally {
      setLoadingGroups(false);
    }
  };

  const handleGroupSelection = (group) => {
    setSelectedGroup(group);
    setGroupModalOpen(false); // Cierra el modal de grupos
  };
  const handleOpenGradesReport = () => {
    setShowGradesReport(true);
  };
  const renderGradesReportButton = () => {
    return (
      <button
        onClick={handleOpenGradesReport}
        disabled={!selectedGroup}
        className={`px-4 py-2 ${
          selectedGroup
            ? "bg-semi-blue text-white hover:bg-[#2a3b4f]"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        } rounded transition-colors`}
      >
        Visualizar reporte
      </button>
    );
  };
  if (modalOpen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
        <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full">
          <h2 className="text-xl font-semibold mb-4">Seleccionar Curso</h2>
          {loading ? (
            <p className="text-gray-500">Cargando cursos...</p>
          ) : (
            <ul className="space-y-2">
              {courses.length > 0 ? (
                courses.map((course) => (
                  <li key={course.cod_clase}>
                    <button
                      onClick={() => handleCourseSelection(course)}
                      className="w-full text-left px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 transition"
                    >
                      {course.nombre_clase} - {course.gestion}
                    </button>
                  </li>
                ))
              ) : (
                <p className="text-gray-500">No se encontraron cursos.</p>
              )}
            </ul>
          )}
        </div>
      </div>
    );
  }

  if (groupModalOpen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
        <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full">
          <h2 className="text-xl font-semibold mb-4">Seleccionar Grupo</h2>
          {loadingGroups ? (
            <p className="text-gray-500">Cargando grupos...</p>
          ) : (
            <ul className="space-y-2">
              {groups.length > 0 ? (
                groups.map((group) => (
                  <li key={group.cod_grupoempresa}>
                    <button
                      onClick={() => handleGroupSelection(group)}
                      className="w-full text-left px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 transition"
                    >
                      {group.nombre_largo}
                    </button>
                  </li>
                ))
              ) : (
                <p className="text-gray-500">No se encontraron grupos.</p>
              )}
            </ul>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="bg-semi-blue text-white p-6 rounded-lg">
        <div className="flex justify-between items-center">
          {/* Lado izquierdo - Información del curso */}
          <div className="flex-1">
            <h1 className="text-2xl font-semibold">
              {selectedCourse?.nombre_clase || "Curso no seleccionado"}
            </h1>
            <p className="text-gray-300 mt-1">
              Gestión: {selectedCourse?.gestion || "No especificada"}
            </p>
          </div>

          {/* Lado derecho - Información del grupo y logotipo */}
          <div className="flex-1 flex items-center justify-end gap-4">
            <div className="text-right">
              <h2 className="text-xl font-semibold">
                {selectedGroup?.nombre_largo || "Grupo no seleccionado"}
              </h2>
              <p className="text-gray-300 mt-1">
                {selectedGroup?.nombre_corto || ""}
              </p>
            </div>
            {selectedGroup?.logotipo && (
              <div className="w-16 h-16 rounded-full overflow-hidden bg-white p-1">
                <img
                  src={`data:image/jpeg;base64,${selectedGroup.logotipo}`}
                  alt="Logo del grupo"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        <h2 className="text-xl font-semibold mb-6">Reportes</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex justify-center mb-4">
              <FileText size={250} className="text-semi-blue" />
            </div>
            <p className="text-sm text-gray-600 text-center mb-4">
              Lista de estudiantes con sus respectivas calificaciones parciales
              separadas por los tipos de evaluaciones, con resultados parciales
              y totales.
            </p>
            <div className="flex gap-2 justify-center">
              {renderGradesReportButton()}
              <button className="px-4 py-2 border border-semi-blue text-[#1e2a3b] rounded hover:bg-gray-50 transition-colors">
                Descargar reporte
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex justify-center mb-4">
              <CheckSquare size={250} className="text-semi-blue" />
            </div>
            <p className="text-sm text-gray-600 text-center mb-4">
              Lista de asistencia de los estudiantes, indicando las cantidades y
              porcentajes de los que estuvieron: Presentes, Retrasos, Ausentes
              sin Justificación y Ausentes con Justificación
            </p>
            <div className="flex gap-2 justify-center">
              <button className="px-4 py-2 bg-semi-blue text-white rounded hover:bg-[#2a3b4f] transition-colors">
                Visualizar reporte
              </button>
              <button className="px-4 py-2 border border-semi-blue text-[#1e2a3b] rounded hover:bg-gray-50 transition-colors">
                Descargar reporte
              </button>
            </div>
          </div>
        </div>
      </div>
      {showGradesReport && selectedGroup && (
        <GradesReportModal
          selectedGroup={selectedGroup}
          onClose={() => setShowGradesReport(false)}
        />
      )}
    </div>
  );
};

export default Reportes;
