import React, { useState } from "react";
import HeaderCurso from "../Components/HeaderCurso";
import GruposEmpresas from "../Components/GruposEmpresas";
import Tablon from "../Components/Tablon";
import Alumnos from "../Components/Alumnos";
import ModalRegistroGrupo from "../Components/ModalRegistroGrupo";
import axios from "axios";

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

const VistaCurso = () => {
  const [activeTab, setActiveTab] = useState("GruposEmpresas");
  const [loading, setLoading] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [groupData, setGroupData] = useState({
    logo: null,
    nombreLargo: "",
    nombreCorto: "",
    integrantes: [],
  });
  const estudiantes = [
    { codigo_sis: "202108211", nombre: "Michelle Barriga" },
    { codigo_sis: "202108212", nombre: "Omar Mamani" },
    { codigo_sis: "202108213", nombre: "Mauricio Vallejos" },
  ];
  const integrantesPosibles = [
    "Michelle Barriga",
    "Omar Mamani",
    "Mauricio Vallejos",
  ];
  const rolesPosibles = ["lider", "Desarrollador", "Analista", "Tester"];

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGroupData({ ...groupData, [name]: value });
  };
  const handleFileChange = (e) => {
    setGroupData({ ...groupData, logo: e.target.files[0] });
  };
  const handleCheckboxChange = (integrante) => {
    const newIntegrantes = groupData.integrantes.includes(integrante)
      ? groupData.integrantes.filter((i) => i !== integrante)
      : [...groupData.integrantes, integrante];
    setGroupData({ ...groupData, integrantes: newIntegrantes });
  };
  const handleSubmit = async (e) => {
    console.log("Submitting form...");
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("logo", groupData.logo);
    formData.append("nombreLargo", groupData.nombreLargo);
    formData.append("nombreCorto", groupData.nombreCorto);
    formData.append("integrantes", JSON.stringify(groupData.integrantes));

    try {
      const response = await axios.post(
        "http://localhost:5000/api/grupos",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        console.log("Grupo registrado exitosamente", response.data);
        // Aquí podrías resetear el formulario y cerrar el modal
        setGroupData({
          logo: null,
          nombreLargo: "",
          nombreCorto: "",
          integrantes: [],
        });
        closeModal();
      } else {
        console.error("Error al registrar el grupo");
      }
    } catch (error) {
      console.error("Error en el envío al backend:", error);
    } finally {
      setLoading(false);
    }
  };
  const renderContent = () => {
    switch (activeTab) {
      case "Tablon":
        return <Tablon />;
      case "GruposEmpresas":
        return <GruposEmpresas grupos={grupos} />;
      case "Alumnos":
        return <Alumnos />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col w-full">
      <HeaderCurso activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="bg-semi-blue text-white p-6 rounded-lg m-4">
        <h1 className="text-3xl font-bold">{curso.nombre}</h1>
        <p className="text-xl">{curso.gestion}</p>
        {activeTab === "GruposEmpresas" && (
          <div className="flex justify-end">
            <button
              className="bg-white text-dark-blue  px-4 py-2 rounded-lg border border-blue-800 flex items-center mt-6"
              onClick={openModal}
            >
              Registrar grupo empresa
            </button>
          </div>
        )}
      </div>
      <div className="p-4">{renderContent()}</div>
      <ModalRegistroGrupo
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
        groupData={groupData}
        handleFileChange={handleFileChange}
        handleInputChange={handleInputChange}
        handleCheckboxChange={handleCheckboxChange}
        handleSubmit={handleSubmit}
        integrantesPosibles={estudiantes}
        rolesPosibles={rolesPosibles}
      />
    </div>
  );
};

export default VistaCurso;
