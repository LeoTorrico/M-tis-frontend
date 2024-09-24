import React, { useState } from "react";
import HeaderCurso from "../Components/HeaderCurso";
import { MdGroups } from "react-icons/md";
import Modal from "react-modal"; // Importar el modal

// Curso y grupos simulados
const curso = {
  nombre: "Taller de Ingeniería de Software",
  gestion: "II-2024",
};

const grupos = [
  { id: 1, nombre: "CodeCraft" },
  { id: 2, nombre: "ActionSoft" },
  { id: 3, nombre: "Agile Action" },
  { id: 4, nombre: "AiraSoft" },
  { id: 5, nombre: "Compusoft" },
  { id: 6, nombre: "DevSociety" },
];

// Simulación de las secciones (componentes individuales)
const Tablon = () => <div className="p-4">Contenido del Tablón</div>;

const GruposEmpresas = () => (
  <div className="p-4">
    {grupos.map((grupo) => (
      <div
        key={grupo.id}
        className="bg-light-blue rounded-lg p-4 flex justify-between items-center mb-4"
      >
        <div className="flex items-center">
          <span className="bg-white p-2 rounded-full text-semi-blue mr-4">
            <MdGroups />
          </span>
          <span className="text-lg font-medium">{grupo.nombre}</span>
        </div>
        <button className="bg-semi-blue text-white px-4 py-2 rounded-lg">
          Ver Grupo
        </button>
      </div>
    ))}
  </div>
);

const Alumnos = () => <div className="p-4">Lista de Alumnos</div>;

function VistaCurso() {
  const [activeTab, setActiveTab] = useState("GruposEmpresas");
  const [modalIsOpen, setModalIsOpen] = useState(false); // Estado para controlar el modal
  const [groupData, setGroupData] = useState({
    logo: null,
    nombreLargo: "",
    nombreCorto: "",
    integrantes: [],
  });

  const integrantesPosibles = [
    "Michelle Barriga",
    "Omar Mamani",
    "Mauricio Vallejos",
  ];

  // Función para abrir/cerrar el modal
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  // Función para manejar los cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGroupData({
      ...groupData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setGroupData({
      ...groupData,
      logo: e.target.files[0],
    });
  };

  const handleCheckboxChange = (integrante) => {
    const newIntegrantes = groupData.integrantes.includes(integrante)
      ? groupData.integrantes.filter((i) => i !== integrante)
      : [...groupData.integrantes, integrante];

    setGroupData({
      ...groupData,
      integrantes: newIntegrantes,
    });
  };

  // Función para enviar datos al backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("logo", groupData.logo);
    formData.append("nombreLargo", groupData.nombreLargo);
    formData.append("nombreCorto", groupData.nombreCorto);
    formData.append("integrantes", JSON.stringify(groupData.integrantes));

    try {
      const response = await fetch("http://localhost:5000/api/grupos", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Grupo creado exitosamente");
        closeModal(); // Cerrar el modal tras enviar los datos
      } else {
        alert("Error al crear el grupo");
      }
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      alert("Error al crear el grupo");
    }
  };

  // Función para renderizar el contenido basado en la pestaña activa
  const renderContent = () => {
    switch (activeTab) {
      case "Tablon":
        return <Tablon />;
      case "GruposEmpresas":
        return <GruposEmpresas />;
      case "Alumnos":
        return <Alumnos />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Header con las pestañas */}
      <HeaderCurso activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Encabezado de la clase */}
      <div className="bg-semi-blue text-white p-6 rounded-lg m-4">
        <h1 className="text-3xl font-bold">{curso.nombre}</h1>
        <p className="text-xl">{curso.gestion}</p>

        {/* Mostrar el botón "Crear grupo" solo si la pestaña activa es "GruposEmpresas" */}
        {activeTab === "GruposEmpresas" && (
          <div className="flex justify-end">
            <button
              className="bg-white text-dark-blue font-semibold px-4 py-2 rounded-lg border border-blue-800 flex items-center"
              onClick={openModal} // Abrir modal al hacer clic
            >
              Crear grupo
              <span className="ml-2 text-xl">+</span>
            </button>
          </div>
        )}
      </div>

      {/* Contenido dinámico basado en la pestaña activa */}
      {renderContent()}

      {/* Modal para crear grupo */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white p-6 rounded-lg w-1/2">
          <h2 className="text-2xl font-semibold mb-4">
            Registrar Grupo empresa
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-semibold mb-2">Logotipo*</label>
              <input
                type="file"
                name="logo"
                onChange={handleFileChange}
                className="block w-full"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Nombre Largo*</label>
              <input
                type="text"
                name="nombreLargo"
                value={groupData.nombreLargo}
                onChange={handleInputChange}
                className="block w-full border border-gray-300 rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Nombre Corto*</label>
              <input
                type="text"
                name="nombreCorto"
                value={groupData.nombreCorto}
                onChange={handleInputChange}
                className="block w-full border border-gray-300 rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Integrantes*</label>
              {integrantesPosibles.map((integrante) => (
                <div key={integrante} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={groupData.integrantes.includes(integrante)}
                    onChange={() => handleCheckboxChange(integrante)}
                    className="mr-2"
                  />
                  <span>{integrante}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={closeModal}
                className="bg-gray-300 text-black px-4 py-2 rounded-lg"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}

export default VistaCurso;
