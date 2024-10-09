import React, { useState, useEffect } from "react";
import HeaderCurso from "../Components/HeaderCurso";
import GruposEmpresas from "../Components/GruposEmpresas";
import Tablon from "../Components/Tablon";
import Alumnos from "../Components/Alumnos";
import ModalRegistroGrupo from "../Components/ModalRegistroGrupo";
import axios from "axios";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import getDetailsFromToken from "./Utils";

const VistaCurso = () => {
  const { cod_clase } = useParams();
  const [curso, setCurso] = useState({
    nombre: "",
    gestion: "",
    cod_docente: "",
    cod_gestion: "",
  });
  const [cargando, setCargando] = useState(true);
  const token = localStorage.getItem("token");
  const { codigoSis, rol } = getDetailsFromToken(token);
  const [activeTab, setActiveTab] = useState("GruposEmpresas");
  const [loading, setLoading] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [groupData, setGroupData] = useState({
    logo: null,
    nombreLargo: "",
    nombreCorto: "",
    integrantes: [],
    cod_horario: "",
  });
  const [estudiantes, setEstudiantes] = useState([]);
  const rolesPosibles = [
    "Scrum master",
    "Backend",
    "Diseño",
    "Frontend",
    "Gestión de calidad",
    "Documentación",
  ];

  useEffect(() => {
    const fetchClase = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/clases-estudiante/obtener-clases",
          {
            params: { codigoSis: codigoSis },
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const clase = response.data.clases.find(
          (c) => c.cod_clase === cod_clase
        ); // Buscar la clase correspondiente
        if (clase) {
          setCurso({
            nombre: clase.nombre_clase,
            gestion: clase.gestion,
            cod_docente: clase.cod_docente,
            cod_gestion: clase.cod_gestion,
          });
        }
      } catch (error) {
        console.error("Error fetching clase:", error);
      } finally {
        setCargando(false);
      }
    };

    const fetchEstudiantes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/grupos/${cod_clase}/estudiantes-sin-grupo`
        );
        setEstudiantes(response.data);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          // Si recibes un 404, muestra un mensaje en lugar del error
          setEstudiantes([]); // O cualquier lógica para cuando no haya estudiantes
        } else {
          console.error("Error fetching estudiantes:", error);
        }
      }
    };
    fetchClase();
    fetchEstudiantes();
  }, [cod_clase, codigoSis, token]);

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
  const handleRemoveIntegrante = (index) => {
    const nuevosIntegrantes = [...groupData.integrantes];
    nuevosIntegrantes.splice(index, 1); // Elimina el integrante por su índice
    setGroupData({ ...groupData, integrantes: nuevosIntegrantes });
  };
  const handleHorarioChange = (cod_horario) => {
    setGroupData({ ...groupData, cod_horario });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const groupDataToSend = {
      logo: groupData.logo,
      nombreLargo: groupData.nombreLargo,
      nombreCorto: groupData.nombreCorto,
      cod_clase: cod_clase, // Cambia esto por el valor correcto
      cod_docente: curso.cod_docente, // Cambia esto por el valor correcto
      integrantes: groupData.integrantes,
      cod_gestion: curso.cod_gestion,
      cod_horario: groupData.cod_horario,
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
          cod_horario: "",
        });
        closeModal();
        await Swal.fire({
          title: "Éxito!",
          text: "Grupo registrado correctamente.",
          icon: "success",
          iconColor: "#3684DB",
          confirmButtonText: "Aceptar",
          customClass: {
            confirmButton:
              "text-white bg-blue-modal hover:bg-semi-blue px-4 py-2 rounded",
          },
        });

        // Recargar la página
        window.location.reload();
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
        return <GruposEmpresas curso={curso} />;
      case "Alumnos":
        return <Alumnos curso={curso} />;
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
        loading={loading} //
        integrantesPosibles={estudiantes}
        rolesPosibles={rolesPosibles}
        handleRemoveIntegrante={handleRemoveIntegrante}
        handleHorarioChange={handleHorarioChange}
        cod_clase={cod_clase}
      />
    </div>
  );
};

export default VistaCurso;
