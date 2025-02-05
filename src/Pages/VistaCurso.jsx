import React, { useState, useEffect, useContext } from "react";
import HeaderCurso from "../Components/HeaderCurso";
import GruposEmpresas from "../Components/GruposEmpresas";
import Tablon from "../Components/Tablon";
import Alumnos from "../Components/Alumnos";
import ModalRegistroGrupo from "../Components/ModalRegistroGrupo";
import RegistroHorarioModal from "../Components/RegistroHorarioModal";
import axios from "axios";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";
import getDetailsFromToken from "./Utils";
import { UserContext } from "../context/UserContext";
import ParametrosGruposModal from "../Components/ParametrosGruposModal";

const VistaCurso = () => {
  const { cod_clase } = useParams();
  const fechaActual = new Date(); // Obtiene la fecha y hora actua
  const navigate = useNavigate();
  const [curso, setCurso] = useState({
    nombre: "",
    gestion: "",
    cod_docente: "",
    cod_gestion: "",
  });
  const [cargando, setCargando] = useState(true);
  const token = localStorage.getItem("token");
  const { codigoSis, rol } = getDetailsFromToken(token);
  const [activeTab, setActiveTab] = useState("Tablon");
  const [loading, setLoading] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isHorarioModalOpen, setIsHorarioModalOpen] = useState(false);
  const openHorarioModal = () => setIsHorarioModalOpen(true);
  const closeHorarioModal = () => setIsHorarioModalOpen(false);
  const [isParametrosModalOpen, setIsParametrosModalOpen] = useState(false);
  const openParametrosModal = () => setIsParametrosModalOpen(true);
  const closeParametrosModal = () => setIsParametrosModalOpen(false);
  const [groupData, setGroupData] = useState({
    logo: null,
    nombreLargo: "",
    nombreCorto: "",
    integrantes: [],
    cod_horario: "",
  });
  const [estudiantes, setEstudiantes] = useState([]);
  const { user } = useContext(UserContext);
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
        console.log(fechaActual);
        if (rol === "estudiante") {
          const response = await axios.get(
            "https://backend-tis-silk.vercel.app/clases-estudiante/obtener-clases",
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
        } else if (rol === "docente") {
          const response = await axios.get(
            "hhttps://backend-tis-silk.vercel.app/clases/obtener",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const clase = response.data.clases.find(
            (c) => c.cod_clase === cod_clase
          );
          if (clase) {
            setCurso({
              nombre: clase.nombre_clase,
              gestion: clase.gestion,
              cod_docente: clase.cod_docente,
              cod_gestion: clase.cod_gestion,
            });
          }
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
          `https://backend-tis-silk.vercel.app/api/grupos/${cod_clase}/estudiantes-sin-grupo`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEstudiantes(response.data);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setEstudiantes([]);
        } else {
          console.error("Error fetching estudiantes:", error);
        }
      }
    };

    fetchClase();

    // Solo llamar a fetchEstudiantes si el rol es "ESTUDIANTE"
    if (rol === "estudiante") {
      fetchEstudiantes();
    }
  }, [cod_clase, codigoSis, token, rol]);
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => {
    Swal.fire({
      title: "¿Estás seguro de que deseas salir del registro?",
      text: "Perderás los cambios no guardados",
      icon: "warning",
      iconColor: "#3684DB",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        setModalIsOpen(false);
        setGroupData({
          logo: null,
          nombreLargo: "",
          nombreCorto: "",
          integrantes: [],
          cod_horario: "",
        });
      }
    });
  };

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

    // Verificar si el estudiante ya está seleccionado en otro índice
    const estudianteYaSeleccionado = newIntegrantes.some(
      (integrante, i) => integrante.codigo_sis === value && i !== index
    );

    if (estudianteYaSeleccionado) {
      alert("Este estudiante ya ha sido seleccionado.");
      return;
    }

    // Actualizar el integrante en el índice específico
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
        "https://backend-tis-silk.vercel.app/api/grupos/registrarGrupo",
        groupDataToSend,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
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
      console.log("Error capturado:", error.response);
      if (error.response && error.response.status === 500) {
        setErrorMessage(
          error.response.data.message ||
            "Ocurrió un error al registrar el grupo. Por favor, inténtelo nuevamente."
        );
      } else {
        setErrorMessage("Ocurrió un error inesperado.");
      }
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
        <div className="flex justify-between">
          <p className="text-xl">{curso.gestion}</p>
          {rol === "docente" && (
            <p className="text-xl">Codigo de clase: {cod_clase}</p>
          )}
        </div>
        {activeTab === "GruposEmpresas" && rol === "estudiante" && (
          <div className="flex justify-end">
            <button
              className="bg-white text-dark-blue px-4 py-2 rounded-lg border border-blue-800 flex items-center mt-6"
              onClick={openModal}
            >
              Registrar grupo empresa
            </button>
          </div>
        )}
        {activeTab === "Tablon" && rol === "docente" && (
          <div className="flex justify-end">
            <button
              className="bg-white text-dark-blue px-4 py-2 rounded-lg border border-blue-800 flex items-center mt-6"
              onClick={() => navigate(`/Evaluacion/${cod_clase}`)} // Redirige a la página de Evaluación
            >
              Crear Evaluación
            </button>
          </div>
        )}
        {activeTab === "GruposEmpresas" && rol === "docente" && (
          <div className="flex justify-end space-x-2">
            <button
              className="bg-white text-dark-blue px-4 py-2 rounded-lg border border-blue-800 flex items-center mt-6"
              onClick={openHorarioModal}
            >
              Registrar horario
            </button>
            <button
              className="bg-white text-dark-blue px-4 py-2 rounded-lg border border-blue-800 flex items-center mt-6"
              onClick={openParametrosModal}
            >
              Parámetros Grupos Empresas
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
      <RegistroHorarioModal
        isHorarioModalOpen={isHorarioModalOpen}
        onClose={closeHorarioModal}
        codClase={cod_clase}
      />
      <ParametrosGruposModal
        isParametrosModalOpen={isParametrosModalOpen}
        onClose={closeParametrosModal}
        codClase={cod_clase}
      />
    </div>
  );
};

export default VistaCurso;
