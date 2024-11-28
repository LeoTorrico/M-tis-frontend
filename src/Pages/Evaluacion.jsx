import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmationModal from "../Components/ConfirmationModal.jsx";
import CustomLabel from "../Components/CrearEvaluacion/CustomLabel.jsx";
import ContentCard from "../Components/CrearEvaluacion/ContentCard.jsx";
import EvaluationForm from "./EvaluationForm.jsx";
import {
  fetchClase,
  fetchGrupos,
  fetchTema,
  registrarEvaluacion
} from "../Components/CrearEvaluacion/apiController.js";
import { opcionesEvaluacion } from "../utils/Constants.js";

export default function Evaluacion() {
  const [grupos, setGrupos] = useState([]);
  const [temas, setTemas] = useState([]);
  const [clase, setClase] = useState([]);
  const [modalConfig, setModalConfig] = useState({
    show: false,
    title: "",
    text: "",
    onSave: () => {}
  });

  const navigate = useNavigate();
  const { cod_clase } = useParams();

  useEffect(() => {
    const loadClaseData = async () => {
      try {
        const response = await fetchClase(cod_clase);        
        const clase = response.clases.find(
          (c) => c.cod_clase === cod_clase
        );
        if (clase) {          
          setClase({
            nombre: clase.nombre_clase,
            gestion: clase.gestion,
            cod_docente: clase.cod_docente,
            cod_gestion: clase.cod_gestion
          });
        }
      } catch (error) {
        console.error("Error al obtener datos del curso:", error);
      }
    };

    const loadTemaData = async () => {
      try {
        const tema = await fetchTema(cod_clase);
        setTemas(tema);
      } catch (error) {
        console.error("Error al obtener datos del tema:", error);
      }
    };

    const loadGruposData = async () => {
      try {
        const grupos = await fetchGrupos(cod_clase);
        
        if (grupos) {
          setGrupos([
            ...grupos,
            {
              cod_grupoempresa: 0,
              nombre_largo: "Seleccionar todos",
              nombre_corto: "Seleccionar todos",
              logotipo: null
            }
          ]);
        }
      } catch (error) {
        console.error("Error al obtener datos del grupo:", error);
      }
    };

    loadClaseData();
    loadTemaData();
    loadGruposData();
  }, [cod_clase]);

  const createEvaluation = async (formDataInput) => {
    try {
      return await registrarEvaluacion(formDataInput);
    } catch (error) {
      console.error("Error al crear la evaluacion:", error);
    }
  };

  const showCreateModal = (params) => {
    setModalConfig({
      show: true,
      title: "Confirmación",
      text: "¿Quieres guardar tus cambios?",
      onSave: () => handleCreate(params)
    });
  };

  const showExitModal = () => {
    setModalConfig({
      show: true,
      title: "Guardar cambios",
      text: "¿Estás seguro de que salir del registro?",
      onSave: handleExit
    });
  };

  const handleCreate = async (formSubmitted) => {
    const cod = await createEvaluation({ ...formSubmitted, codClase: cod_clase });
    setModalConfig({ ...modalConfig, show: false });
    navigate(`/Rubrica/${cod}`);
  };

  const handleExit = () => {
    navigate(`/Vista-Curso/${cod_clase}`);
    setModalConfig({ ...modalConfig, show: false });
  };

  const addNewTema = (tema) => {
    setTemas((prevTemas) => [...prevTemas, tema]);
  };

  return (
    <div className="flex flex-col w-full h-full">
      <ConfirmationModal
        show={modalConfig.show}
        title={modalConfig.title}
        text={modalConfig.text}
        onClose={() => setModalConfig({ ...modalConfig, show: false })}
        onSave={modalConfig.onSave}
      />
      <ContentCard
        header={clase.nombre}
        content={clase.gestion}
      ></ContentCard>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <CustomLabel className="text-2xl font-bold mb-4">
          Nueva Evaluación
        </CustomLabel>
        <div>
          <EvaluationForm
            temas={temas}
            grupos={grupos}
            evaluaciones={opcionesEvaluacion}
            showExitModal={showExitModal}
            showCreateModal={showCreateModal}
            addTema = {addNewTema}
          />
        </div>
      </div>
    </div>
  );
}
