import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { IoMdClose } from "react-icons/io"; // Ícono de cerrar
import { RingLoader } from "react-spinners";
import axios from "axios";

const ModalRegistroGrupo = ({
  modalIsOpen,
  closeModal,
  groupData,
  handleFileChange,
  handleInputChange,
  handleSubmit,
  integrantesPosibles,
  rolesPosibles,
  loading,
  handleIntegranteChange,
  handleRolChange,
  handleAddIntegrante,
  handleRemoveIntegrante,
  handleHorarioChange,
  cod_clase, // Asegúrate de que este prop sea pasado correctamente
}) => {
  const [horarios, setHorarios] = useState([]); // Estado para almacenar los horarios
  const [loadingHorarios, setLoadingHorarios] = useState(true); // Estado para gestionar la carga de horarios
  const [nombreLargoError, setNombreLargoError] = useState("");
  const [nombreCortoError, setNombreCortoError] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [maxIntegrantes, setMaxIntegrantes] = useState(6);
  const token = localStorage.getItem("token");

  // Método para obtener estudiantes disponibles
  const getAvailableStudents = () => {
    // Filtrar los estudiantes que ya han sido seleccionados
    return integrantesPosibles.filter(
      (estudiante) =>
        !groupData.integrantes.some(
          (integrante) => integrante.codigo_sis === estudiante.codigo_sis
        )
    );
  };

  useEffect(() => {
    const fetchHorarios = async () => {
      try {
        const response = await axios.get(
          `https://backend-tis-silk.vercel.app/clases/${cod_clase}/obtener-horarios`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setHorarios(response.data.horarios); // Extrae el arreglo de horarios
      } catch (error) {
        console.error("Error fetching horarios:", error);
      } finally {
        setLoadingHorarios(false); // Finaliza la carga
      }
    };
    const fetchClaseInfo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/clases/${cod_clase}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMaxIntegrantes(response.data.clase.nro_integrantes);
      } catch (error) {
        console.error("Error fetching clase info:", error);
        // Mantener el valor por defecto de 6 si hay un error
        setMaxIntegrantes(6);
      }
    };
    fetchClaseInfo();
    fetchHorarios();
  }, [cod_clase]); // Dependencia para volver a ejecutar cuando cambie cod_clase

  // Limitar los integrantes a un máximo de 6
  const addIntegrante = () => {
    if (groupData.integrantes.length < maxIntegrantes) {
      handleAddIntegrante();
    } else {
      alert(
        `Se ha alcanzado el límite máximo de ${maxIntegrantes} integrantes.`
      );
    }
  };

  const handleFileValidation = (e) => {
    const file = e.target.files[0];
    const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
    if (!allowedExtensions.exec(file.name)) {
      alert("Solo se permiten archivos .png o .jpg.");
      e.target.value = ""; // Limpiar el campo de archivo
      return;
    }
    handleFileChange(e); // Llamar al manejador de archivos original
  };

  const validateNombreLargo = (value) => {
    if (value.length < 3 || value.length > 80) {
      setNombreLargoError(
        "El nombre largo debe tener entre 3 y 80 caracteres."
      );
    } else {
      setNombreLargoError("");
    }
  };

  const validateNombreCorto = (value) => {
    if (value.length < 3 || value.length > 30) {
      setNombreCortoError(
        "El nombre corto debe tener entre 3 y 30 caracteres."
      );
    } else {
      setNombreCortoError("");
    }
  };

  // Validación de submit para asegurar al menos 2 integrantes
  const handleCustomSubmit = async (e) => {
    e.preventDefault();

    if (groupData.integrantes.length < 2) {
      alert("Debe registrar al menos 2 integrantes en el grupo.");
      return;
    }

    const incompleteIntegrante = groupData.integrantes.some(
      (integrante) => !integrante.codigo_sis || !integrante.rol
    );

    if (incompleteIntegrante) {
      alert("Por favor, complete la información de todos los integrantes.");
      return;
    }

    try {
      await handleSubmit(e);
    } catch (error) {
      // Handle API error specifically
      if (error.response && error.response.status === 500) {
        setErrorMessage(
          error.response.data.message ||
            "Ocurrió un error al registrar el grupo. Por favor, inténtelo nuevamente."
        );
      } else {
        // For other types of errors
        setErrorMessage("Ocurrió un error inesperado.");
      }
    }
  };
  const closeErrorModal = () => {
    setErrorMessage(null);
  };
  return (
    <>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-blue-modal w-[1050px] h-[600px] rounded-xl flex flex-col font-title">
          <div className="relative">
            <h2 className="text-2xl font-semibold text-center text-white p-4">
              Registrar Grupo empresa
            </h2>
            <button
              type="button"
              onClick={closeModal}
              className="absolute top-4 right-4 text-white px-2 py-2 hover:text-black"
            >
              <IoMdClose className="w-6 h-6" />
            </button>
          </div>
          {loadingHorarios || loading ? ( // Comprueba si los horarios se están cargando
            <div className="flex justify-center items-center flex-1">
              <RingLoader color={"#ffffff"} size={150} />
            </div>
          ) : (
            <form
              id="grupoForm"
              onSubmit={handleCustomSubmit}
              className="flex flex-1 bg-white"
            >
              <div className="w-1/2 flex flex-col items-center justify-center border-r">
                <label className="font-semibold mb-2">Logotipo*</label>
                {groupData.logo ? (
                  <div className="bg-light-blue w-64 h-64 rounded-lg flex items-center justify-center">
                    <img
                      src={`data:image/jpeg;base64,${groupData.logo}`}
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
                  accept=".jpg,.jpeg,.png"
                  onChange={handleFileValidation}
                  className="hidden"
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

              <div className="w-1/2 bg-white p-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div>
                    <label className="block font-semibold mb-2">
                      Nombre Largo*
                    </label>
                    <input
                      type="text"
                      name="nombreLargo"
                      value={groupData.nombreLargo}
                      onChange={(e) => {
                        handleInputChange(e);
                        validateNombreLargo(e.target.value);
                      }}
                      maxLength={80}
                      className="border rounded-lg w-full p-2"
                      required
                    />
                    {nombreLargoError && (
                      <p className="text-red-500">{nombreLargoError}</p>
                    )}
                  </div>
                  <div>
                    <label className="block font-semibold mb-2">
                      Nombre Corto*
                    </label>
                    <input
                      type="text"
                      name="nombreCorto"
                      value={groupData.nombreCorto}
                      onChange={(e) => {
                        handleInputChange(e);
                        validateNombreCorto(e.target.value);
                      }}
                      maxLength={30}
                      className="border rounded-lg w-full p-2"
                      required
                    />
                    {nombreCortoError && (
                      <p className="text-red-500">{nombreCortoError}</p>
                    )}
                  </div>

                  {/* Select para seleccionar el horario */}
                  <div>
                    <label className="block font-semibold mb-2">Horario*</label>
                    <select
                      value={groupData.cod_horario || ""}
                      onChange={(e) => handleHorarioChange(e.target.value)}
                      className="border rounded-lg w-full p-2"
                      required
                    >
                      <option value="" disabled>
                        Seleccionar horario
                      </option>
                      {horarios.map((horario) => (
                        <option
                          key={horario.cod_horario}
                          value={horario.cod_horario}
                        >
                          {`${horario.dia_horario} ${horario.hora_inicio} - ${horario.hora_fin}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Área desplazable para los integrantes */}
                  <div className="max-h-[200px] overflow-y-auto border p-2 rounded-lg">
                    {groupData.integrantes.map((integrante, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-4 p-2"
                      >
                        <select
                          value={integrante.codigo_sis || ""}
                          onChange={(e) =>
                            handleIntegranteChange(index, e.target.value)
                          }
                          className="border rounded-lg w-1/2 p-2"
                          required
                        >
                          <option value="" disabled>
                            {getAvailableStudents().length === 0
                              ? "No hay estudiantes disponibles"
                              : "Seleccionar integrante"}
                          </option>
                          {getAvailableStudents().map((estudiante) => (
                            <option
                              key={estudiante.codigo_sis}
                              value={estudiante.codigo_sis}
                            >
                              {estudiante.nombre_estudiante +
                                " " +
                                estudiante.apellido_estudiante}
                            </option>
                          ))}
                        </select>
                        <select
                          value={integrante.rol || ""}
                          onChange={(e) =>
                            handleRolChange(index, e.target.value)
                          }
                          className="border rounded-lg w-1/2 p-2"
                          required
                        >
                          <option value="" disabled>
                            Seleccionar rol
                          </option>
                          {rolesPosibles.map((rol) => (
                            <option key={rol} value={rol}>
                              {rol}
                            </option>
                          ))}
                        </select>
                        {/* Botón para eliminar integrante */}
                        <button
                          type="button"
                          onClick={() => handleRemoveIntegrante(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <IoMdClose className="w-6 h-6" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={addIntegrante}
                    className="mt-4 bg-blue-modal text-white px-4 py-2 rounded-lg hover:bg-semi-blue"
                  >
                    Agregar Integrante
                  </button>
                </div>
              </div>
            </form>
          )}
          <div className="bg-blue-modal flex justify-end p-4 rounded-xl">
            <button
              type="button"
              onClick={closeModal}
              form="grupoForm"
              className="bg-white text-black px-4 py-2 rounded-lg mr-4 hover:bg-red-500 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="grupoForm"
              className="bg-white text-black px-4 py-2 rounded-lg hover:bg-semi-blue hover:text-white"
            >
              Registrar
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={!!errorMessage}
        onRequestClose={closeErrorModal}
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white w-[400px] rounded-xl p-6 text-center">
          <div className="flex justify-end">
            <button
              onClick={closeErrorModal}
              className="text-gray-600 hover:text-black"
            >
              <IoMdClose className="w-6 h-6" />
            </button>
          </div>
          <h2 className="text-xl font-semibold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{errorMessage}</p>
          <button
            onClick={closeErrorModal}
            className="bg-blue-modal text-white px-4 py-2 rounded-lg hover:bg-semi-blue"
          >
            Cerrar
          </button>
        </div>
      </Modal>
    </>
  );
};

export default ModalRegistroGrupo;
