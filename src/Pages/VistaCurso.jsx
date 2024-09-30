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
    { codigo_sis: "20211036", nombre: "Michelle Barriga" },
    { codigo_sis: "20211037", nombre: "Omar Mamani" },
    { codigo_sis: "20111037", nombre: "Mauricio Vallejos" },
  ];

  const rolesPosibles = [
    "Scrum master",
    "Backend",
    "Diseño",
    "Frontend",
    "Gestión de calidad",
    "Documentación",
  ];

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGroupData({ ...groupData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      // Guardar el archivo en base64 en el estado
      const base64String = reader.result.replace(
        /^data:image\/[a-z]+;base64,/,
        ""
      );
      setGroupData({ ...groupData, logo: base64String });
    };

    // Verificar si el archivo fue seleccionado antes de intentar leerlo
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleIntegranteChange = (index, value) => {
    const newIntegrantes = [...groupData.integrantes];
    newIntegrantes[index] = { ...newIntegrantes[index], codigo_sis: value };
    setGroupData({ ...groupData, integrantes: newIntegrantes });
  };

  const handleRolChange = (index, value) => {
    const newIntegrantes = [...groupData.integrantes];
    newIntegrantes[index] = { ...newIntegrantes[index], rol: value };
    setGroupData({ ...groupData, integrantes: newIntegrantes });
  };

  const handleAddIntegrante = () => {
    setGroupData({
      ...groupData,
      integrantes: [...groupData.integrantes, { codigo_sis: "", rol: "" }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const groupDataToSend = {
      logo: groupData.logo,
      nombreLargo: groupData.nombreLargo,
      nombreCorto: groupData.nombreCorto,
      cod_clase: "123", // Cambia esto por el valor correcto
      cod_docente: "1", // Cambia esto por el valor correcto
      integrantes: groupData.integrantes,
    };
    console.log("Datos enviados al backend:", groupDataToSend);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/grupos/registrarGrupo",
        groupDataToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        console.log("Grupo registrado exitosamente", response.data);
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
              className="bg-white text-dark-blue px-4 py-2 rounded-lg border border-blue-800 flex items-center mt-6"
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
        handleIntegranteChange={handleIntegranteChange}
        handleRolChange={handleRolChange}
        handleAddIntegrante={handleAddIntegrante}
        handleSubmit={handleSubmit}
        integrantesPosibles={estudiantes}
        rolesPosibles={rolesPosibles}
      />
    </div>
  );
};

export default VistaCurso;
