import TextArea from "../Components/CrearEvaluacion/TextArea.jsx";
import { validations } from "../utils/Validation.js";
import CustomInput from "../Components/CrearEvaluacion/CustomInput.jsx";
import { VType } from "../utils/ValidationType.js";
import CustomSelect from "../Components/CrearEvaluacion/CustomSelect.jsx";
import { useState, useEffect } from "react";

const initialFormData = {
  nombreEvaluacion: "",
  descripcion: "",
  fecha: "",
  tema: "",
  codigosGrupos: [],
  tipoEvaluacion: ""
};

const initialFormDataError = {
  nombreEvaluacion: false,
  descripcion: false,
  fecha: false,
  tema: false,
  codigosGrupos: false,
  tipoEvaluacion: false
};

export default function EvaluationForm({
  temas,
  grupos,
  evaluaciones,
  showCreateModal,
  showExitModal,
  addTema
}) {
  const [isEnableSend, setIsEnableSend] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [archivo, setArchivo] = useState({});
  const [formDataError, setFormDataError] = useState(initialFormDataError);

  useEffect(() => {
    if (formData.tipoEvaluacion === "Evaluación cruzada" && grupos.length > 0) {
     
      setFormData((prevData) => ({
        ...prevData,
        codigosGrupos: "0"
      }));
      const dataAux = { ...formDataError, codigosGrupos: true };
      setFormDataError(dataAux);
    }
  }, [formData.tipoEvaluacion, grupos]);  // Dependencias: formData.tipoEvaluacion y grupos
  
  useEffect(() => {
    setIsEnableSend(isFormValid(formDataError));
  },[formData]);


  const isFormValid = (form) => {
    return Object.values(form).every((value) => value === true);
  };

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        const base64 = reader.result.split(",")[1];
        resolve(base64);
      };

      reader.onerror = (error) => {
        reject(error);
      };
    });
  }

  const handleFileChange = async (e) => {
    const value = e.target.files[0];
    const archivoBase = await fileToBase64(value);
    setArchivo(archivoBase);
  };

  const handleChange = (value, validation, dispatch, key) => {
    let errorMessage = "";
    for (let rule of validation) {
      if (rule === VType.maxLength) {
        errorMessage = validations[rule](value, 50);
      } else {
        errorMessage = validations[rule](value);
      }
      if (errorMessage !== true) break;
    }

    setFormData((prevData) => ({
      ...prevData,
      [key]: value
    }));

    const newErrorState = errorMessage === true;
    const dataAux = { ...formDataError, [key]: newErrorState };
    setFormDataError(dataAux);

    setIsEnableSend(isFormValid(dataAux));

    dispatch(errorMessage !== true ? errorMessage : "");
  };

  const addNewTema = (tema) => {
    addTema({ nombre_tema: tema });
  };

  const isEmpty = (obj) => Object.keys(obj).length === 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEnableSend(isFormValid(formDataError));

    const dataForm = {
      nombreEvaluacion: formData.nombreEvaluacion.trim(),
      descripcion: formData.descripcion.trim(),
      fechaEntrega: formData.fecha,
      tema: formData.tema,
      grupos: formData.codigosGrupos,
      tipoEvaluacion: formData.tipoEvaluacion,
      archivo: !isEmpty(archivo)? archivo : null
    };

    showCreateModal(dataForm);
  };

  return (
    <div className="flex items-center justify-center mb-4">
      <div className="w-full bg-white">
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <CustomInput
              id="nombreEvaluacion"
              type="text"
              name="nombreEvaluacion"
              value={formData.nombreEvaluacion}
              handleChange={handleChange}
              validation={[
                VType.hasSpecialCharacters,
                VType.maxLength,
                VType.isRequired
              ]}
              label="Nombre de la evaluación:"
            />

            <TextArea
              id="descripcionEvaluacion"
              name="descripcion"
              handleChange={handleChange}
              value={formData.descripcion}
              validation={[
                VType.hasSpecialCharacters,
                VType.maxLength,
                VType.isRequired
              ]}
              label="Descripción:"
            />
          </div>

          <div className="space-y-4">
            <CustomInput
              id="date"
              type="date"
              name="fecha"
              handleChange={handleChange}
              validation={[VType.isRequired]}
              value={formData.fecha}
              label="Fecha de entrega:"
            />

            <CustomSelect
              label="Tema"
              name="tema"
              value={formData.tema}
              options={temas.map((t) => ({
                value: t.nombre_tema,
                label: t.nombre_tema
              }))}
              onChange={handleChange}
              required={true}
              validation={[VType.isRequired]}
              allowCreate={true}
              onCreate={addNewTema}
            />
            <CustomSelect
              label="Asignar a"
              name="codigosGrupos"
              value={formData.codigosGrupos}
              options={grupos.map((t) => ({
                value: t.cod_grupoempresa,
                label: t.nombre_largo
              }))}
              onChange={handleChange}
              required={true}
              validation={[VType.isRequired]}
              allowCreate={false}
            />

            <CustomSelect
              label="Tipo de evaluación"
              name="tipoEvaluacion"
              value={formData.tipoEvaluacion}
              options={evaluaciones.map((t) => ({
                value: t.evaluacion,
                label: t.evaluacion
              }))}
              onChange={handleChange}
              required={true}
              validation={[VType.isRequired]}
              allowCreate={false}
            />

            {formData.tipoEvaluacion !== "Evaluación cruzada" &&
              formData.tipoEvaluacion !== "Evaluación de pares" && (
                <div>
                  <label className="block text-gray-700 font-semibold">
                    Archivo:
                  </label>
                  <input
                    id="fileUpload"
                    type="file"
                    accept=".pdf,.png"
                    onChange={handleFileChange}
                  />
                </div>
              )}

            <div className="flex justify-end space-x-4 w-full mt-4 pt-4">
              <button
                type="submit"
                disabled={!isEnableSend}
                onClick={handleSubmit}
                className={`px-4 py-2 w-32 rounded ${
                  isEnableSend
                    ? "text-white hover:opacity-90"
                    : "text-gray-400 bg-gray-300"
                }`}
                style={{
                  backgroundColor: isEnableSend ? "#223A59" : "#e2e2e2"
                }}
              >
                Siguiente
              </button>
              <button
                type="button"
                onClick={showExitModal}
                className="text-white px-4 py-2 w-32 rounded hover:opacity-90"
                style={{ backgroundColor: "#223A59" }}
              >
                Salir
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
