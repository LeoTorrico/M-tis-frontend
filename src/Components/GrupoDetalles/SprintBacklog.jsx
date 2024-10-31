import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import RequerimientosModal from "./RequerimientosModal";
const SprintBacklog = () => {
  const [sprints, setSprints] = useState([]); // Nuevo estado para almacenar los sprints
  const [requerimientos, setRequerimientos] = useState([]);
  const token = localStorage.getItem("token");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [requerimientosModalOpen, setRequerimientosModalOpen] = useState(false); // Nuevo estado
  const [selectedSprint, setSelectedSprint] = useState(null);
  const [sprintData, setSprintData] = useState({
    numero: "",
    fechaInicio: "",
    fechaFin: "",
    objetivo: "",
  });
  const { cod_grupoempresa } = useParams();
  const [error, setError] = useState("");
  // Obtener el product backlog
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(
          `https://backend-tis-silk.vercel.app/planificacion/productbacklog/sin-sprint/${cod_grupoempresa}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (data.length > 0) {
          setRequerimientos(data);
        }
      } catch (error) {
        console.error("Error al cargar los requerimientos:", error);
      }
    };
    fetchTasks();
  }, [cod_grupoempresa]);

  // Obtener los sprints registrados
  useEffect(() => {
    const fetchSprints = async () => {
      try {
        const response = await fetch(
          `https://backend-tis-silk.vercel.app/planificacion/sprints/${cod_grupoempresa}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setSprints(data); // Almacenar los sprints en el estado
      } catch (error) {
        console.error("Error al cargar los sprints:", error);
      }
    };
    fetchSprints();
  }, [cod_grupoempresa]);

  // Función para manejar el cambio de inputs del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSprintData({ ...sprintData, [name]: value });
  };

  const validateObjetivo = (Objetivo) => {
    if (Objetivo.length < 20 || Objetivo.length > 150) {
      setError("El objetivo debe tener entre 20 y 150 caracteres.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValidateObjetivo = validateObjetivo(sprintData.objetivo);
    if (!isValidateObjetivo) return;

    const sprintPayload = {
      cod_grupoempresa, // Lo pasamos desde las props
      sprint: sprintData.numero,
      fechaInicio: sprintData.fechaInicio,
      fechaFin: sprintData.fechaFin,
      objetivo: sprintData.objetivo,
    };

    try {
      const response = await axios.post(
        "https://backend-tis-silk.vercel.app/planificacion/registrar-sprint",
        sprintPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Sprint registrado:", response.data);
      setModalIsOpen(false);
      await Swal.fire({
        title: "Éxito!",
        text: "Sprint registrado correctamente.",
        icon: "success",
        iconColor: "#3684DB",
        confirmButtonText: "Aceptar",
        customClass: {
          confirmButton:
            "text-white bg-blue-modal hover:bg-semi-blue px-4 py-2 rounded",
        },
      });
      window.location.reload();
    } catch (error) {
      console.error("Error al registrar el sprint:", error);
    }
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

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
        setSprintData({
          numero: "",
          fechaInicio: "",
          fechaFin: "",
          objetivo: "",
        });
      }
    });
  };

  const openRequerimientosModal = (sprint) => {
    setSelectedSprint(sprint);
    setRequerimientosModalOpen(true);
  };

  const closeRequerimientosModal = () => {
    setRequerimientosModalOpen(false);
  };

  const handleRequerimientosSubmit = async (e) => {
    e.preventDefault();

    // Verificar si 'e.target.requerimientos' es un array o un único elemento
    const checkboxes = e.target.requerimientos.length
      ? Array.from(e.target.requerimientos)
      : [e.target.requerimientos];

    // Obtener los requerimientos seleccionados
    const selectedRequerimientos = checkboxes
      .filter((input) => input.checked)
      .map((input) => ({
        codRequerimiento: Number(input.value), // Convertir a número
      }));

    const dataToSend = {
      codSprint: selectedSprint.cod_sprint,
      requerimientos: selectedRequerimientos,
    };

    console.log(dataToSend); // Asegúrate de que los datos se están construyendo correctamente

    try {
      // Realizar la solicitud POST con la estructura correcta
      await axios.put(
        "https://backend-tis-silk.vercel.app/planificacion/requerimientos/registrar-sprint",
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      closeRequerimientosModal();
      await Swal.fire({
        title: "¡Éxito!",
        text: "Requerimiento agregado correctamente.",
        icon: "success",
        iconColor: "#3684DB",
        confirmButtonText: "Aceptar",
        customClass: {
          confirmButton:
            "text-white bg-blue-modal hover:bg-semi-blue px-4 py-2 rounded",
        },
      });

      window.location.reload();
    } catch (error) {
      console.error("Error al registrar requerimientos:", error);
    }
  };

  return (
    <div className="p-4">
      <div className="p-6 bg-light-blue rounded-lg shadow-md w-full">
        <h2 className="text-xl font-semibold text-dark-blue">Sprint Backlog</h2>

        <button
          onClick={openModal}
          className="mt-4 bg-semi-blue text-white p-2 px-4 py-2 rounded-lg"
        >
          Registrar Sprint
        </button>

        {/* Mostrar lista de sprints */}
        <div className="mt-6">
          {sprints.length > 0 ? (
            sprints.map((sprintItem) => (
              <div
                key={sprintItem.sprint.cod_sprint}
                className="mb-4 p-4 bg-white shadow rounded-lg"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">
                    Sprint {sprintItem.sprint.sprint} - Objetivo:{" "}
                    {sprintItem.sprint.objetivo_sprint}
                  </h3>
                  <button
                    onClick={() => openRequerimientosModal(sprintItem.sprint)}
                    className="mt-4 bg-semi-blue text-white p-2 px-4 py-2 rounded-lg"
                  >
                    Registrar Requerimientos
                  </button>
                </div>
                <p>
                  Fecha de inicio:{" "}
                  {new Date(
                    sprintItem.sprint.fecha_inicio_sprint
                  ).toLocaleDateString()}
                </p>
                <p>
                  Fecha de fin:{" "}
                  {new Date(
                    sprintItem.sprint.fecha_fin_sprint
                  ).toLocaleDateString()}
                </p>
                {/* Mostrar requerimientos del sprint */}
                {sprintItem.requerimientos.length > 0 ? (
                  <ul className="mt-2">
                    {sprintItem.requerimientos.map((req) => (
                      <li
                        key={req.cod_requerimiento}
                        className="ml-4 list-disc"
                      >
                        {req.requerimiento} - {req.decripcion_hu}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="italic mt-2">
                    No hay requerimientos para este sprint.
                  </p>
                )}
              </div>
            ))
          ) : (
            <p>No hay sprints registrados.</p>
          )}
        </div>

        {/* Modal para registrar un nuevo sprint */}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          className="fixed inset-0 flex items-center justify-center"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
          <div className="bg-blue-modal w-[700px] h-[500px] rounded-xl flex flex-col font-title">
            <div className="relative">
              <h2 className="text-2xl font-semibold text-center text-white p-4">
                Registrar Sprint
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="absolute top-4 right-4 text-white px-2 py-2 hover:text-black"
              >
                <IoMdClose className="w-6 h-6" />
              </button>
            </div>
            <form
              id="sprintForm"
              onSubmit={handleSubmit}
              className="flex flex-1 bg-white p-6 space-x-4"
            >
              {/* Izquierda - Número de sprint, fecha de inicio y fin */}
              <div className="flex flex-col w-1/2 space-y-4">
                <div>
                  <label className="block font-semibold mb-2">
                    Número de Sprint*
                  </label>
                  <input
                    type="number"
                    name="numero"
                    value={sprintData.numero}
                    onChange={handleInputChange}
                    className="border rounded-lg w-full p-2"
                    min="0"
                    max="100"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">
                    Fecha de Inicio*
                  </label>
                  <input
                    type="date"
                    name="fechaInicio"
                    value={sprintData.fechaInicio}
                    onChange={handleInputChange}
                    className="border rounded-lg w-full p-2"
                    required
                    min="2024-01-01"
                    max="2050-12-31"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">
                    Fecha de Fin*
                  </label>
                  <input
                    type="date"
                    name="fechaFin"
                    value={sprintData.fechaFin}
                    onChange={handleInputChange}
                    className="border rounded-lg w-full p-2"
                    required
                    min="2024-01-01"
                    max="2050-12-31"
                  />
                </div>
              </div>

              {/* Derecha - Objetivo del sprint */}
              <div className="flex flex-col w-1/2">
                <label className="block font-semibold mb-2">
                  Objetivo del Sprint*
                </label>
                <textarea
                  name="objetivo"
                  value={sprintData.objetivo}
                  onChange={handleInputChange}
                  className="mt-1 block w-full h-full border rounded shadow-sm"
                  required
                />
                {error && <p className="text-red-500 mt-2">{error}</p>}{" "}
              </div>
            </form>

            {/* Botones para cancelar o registrar el sprint */}
            <div className="bg-blue-modal flex justify-end p-4 rounded-xl">
              <button
                type="button"
                onClick={closeModal}
                className="bg-white text-black px-4 py-2 rounded-lg mr-4 hover:bg-red-500 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="submit"
                form="sprintForm"
                className="bg-white text-black px-4 py-2 rounded-lg hover:bg-semi-blue hover:text-white"
              >
                Registrar Sprint
              </button>
            </div>
          </div>
        </Modal>
        <RequerimientosModal
          isOpen={requerimientosModalOpen}
          onClose={closeRequerimientosModal}
          requerimientos={requerimientos}
          onSubmit={handleRequerimientosSubmit}
        />
      </div>
    </div>
  );
};

export default SprintBacklog;
