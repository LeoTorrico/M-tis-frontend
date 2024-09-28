import React, { useState } from "react";
import HeaderCurso from "../Components/HeaderCurso";
import { MdGroups } from "react-icons/md";
import Modal from "react-modal"; // Importar el modal
import { IoMdClose } from "react-icons/io";
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
  const [modalIsOpen, setModalIsOpen] = useState(false);
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
    "Michelle Barriga",
    "Omar Mamani",
    "Mauricio Vallejos",
    "Michelle Barriga",
    "Omar Mamani",
    "Mauricio Vallejos",
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
        {/* Contenedor general del modal */}
        <div className="bg-blue-modal w-[1050px] h-[650px] rounded-lg flex flex-col font-title">
          <div className="relative">
            <h2 className="text-2xl font-semibold text-center text-white p-4">
              Registrar Grupo empresa
            </h2>
            <button
              type="button"
              onClick={closeModal}
              className="absolute top-4 right-4 text-white px-2 py-2 hover:text-black "
            >
              <IoMdClose className="w-6 h-6" />
            </button>
          </div>
          {/* Contenido del modal */}
          <form onSubmit={handleSubmit} className="flex flex-1  bg-white">
            <div className="w-1/2 flex flex-col items-center justify-center border-r">
              <label className="font-semibold mb-2">Logotipo*</label>

              {groupData.logo ? (
                <div className="bg-light-blue w-64 h-64 rounded-lg flex items-center justify-center">
                  <img
                    src={URL.createObjectURL(groupData.logo)}
                    alt="Vista previa"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              ) : (
                <div className="bg-light-blue w-64 h-64 rounded-lg flex items-center justify-center text-gray-600">
                  Subir foto
                </div>
              )}

              <input
                type="file"
                name="logo"
                onChange={handleFileChange}
                className="hidden" // Oculta el input predeterminado
                id="fileInput"
              />

              <button
                type="button"
                onClick={() => document.getElementById("fileInput").click()}
                className="mt-4 bg-blue-modal text-white px-4 py-2 rounded-lg hover:bg-semi-blue"
              >
                Seleccionar archivo
              </button>
            </div>

            {/* Sección derecha: Campos de texto e integrantes */}
            <div className="w-1/2 bg-white p-6">
              <div className="space-y-4">
                {/* Nombre largo */}
                <div>
                  <label className="block font-semibold mb-2">
                    Nombre Largo*
                  </label>
                  <input
                    type="text"
                    name="nombreLargo"
                    value={groupData.nombreLargo}
                    onChange={handleInputChange}
                    className="block w-full border border-gray-300 rounded-lg p-2 bg-light-blue"
                  />
                </div>

                {/* Nombre corto */}
                <div>
                  <label className="block font-semibold mb-2">
                    Nombre corto*
                  </label>
                  <input
                    type="text"
                    name="nombreCorto"
                    value={groupData.nombreCorto}
                    onChange={handleInputChange}
                    className="block w-full border border-gray-300 rounded-lg p-2 bg-light-blue"
                  />
                </div>

                {/* Integrantes */}
                <div>
                  <label className="block font-semibold mb-2">
                    Integrantes*
                  </label>
                  <div className="bg-light-blue border border-gray-300 rounded-lg p-4 h-48 overflow-y-auto">
                    {integrantesPosibles.map((integrante) => (
                      <div key={integrante} className="flex items-center mb-2">
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
                </div>
              </div>
            </div>
          </form>

          {/* Footer del modal */}
          <div className="bg-blue-modal flex justify-end p-4">
            <button
              type="button"
              onClick={closeModal}
              className="bg-white text-black px-4 py-2 rounded-lg mr-4 hover:bg-red-500 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-white text-black  px-4 py-2 rounded-lg hover:bg-semi-blue hover:text-white"
            >
              Registrar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default VistaCurso;
