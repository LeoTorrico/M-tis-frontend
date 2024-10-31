import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Modal from "react-modal";
import { IoMdClose } from "react-icons/io";
import { UserContext } from "../../context/UserContext";
const MostrarRequerimientos = () => {
  const [tasks, setTasks] = useState([]);
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newRequirement, setNewRequirement] = useState({
    requerimiento: "",
    descripcion: "",
    prioridad: "",
    estimacion: "",
  });
  const [error, setError] = useState("");
  const [error2, setError2] = useState("");
  const { cod_grupoempresa } = useParams();
  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 1:
        return "Must";
      case 2:
        return "Should";
      case 3:
        return "Could";
      case 4:
        return "Would";
      default:
        return "No definido";
    }
  };
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:3000/planificacion/productbacklog/${cod_grupoempresa}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        const formattedTasks = data.map((item) => ({
          id: item.cod_requerimiento,
          name: item.requerimiento,
          description: item.decripcion_hu,
          priority: item.prioridad_hu,
          points: item.estimacion_hu,
          status: item.estado_hu,
        }));

        setTasks(formattedTasks);
      } catch (error) {
        console.error("Error al cargar los requerimientos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [cod_grupoempresa]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRequirement({ ...newRequirement, [name]: value });
  };

  // Función para validar el campo de requerimiento
  const validateRequirement = () => {
    const { requerimiento } = newRequirement;
    const regex = /^[a-zA-Z0-9-' ]+$/; // Permite letras, números, guiones y apóstrofes

    if (requerimiento.length < 3) {
      setError("El requerimiento debe tener al menos 3 caracteres.");
      return false;
    }

    if (!regex.test(requerimiento)) {
      setError(
        "El requerimiento solo puede contener letras, números, espacios, guiones y apóstrofes."
      );
      return false;
    }

    setError(""); // Si pasa todas las validaciones, no hay error
    return true;
  };
  const validateDescription = (description) => {
    if (description.length < 20 || description.length > 300) {
      setError2("La descripción debe tener entre 20 y 300 caracteres.");
      return false;
    }
    setError2("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isRequirementValid = validateRequirement(
      newRequirement.requerimiento
    );
    const isDescriptionValid = validateDescription(newRequirement.descripcion);

    if (!isRequirementValid || !isDescriptionValid) return;

    try {
      const response = await fetch(
        "http://localhost:3000/planificacion/requerimientos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            codigoGrupo: cod_grupoempresa,
            requerimientos: [
              {
                requerimiento: newRequirement.requerimiento,
                descripcion: newRequirement.descripcion,
                prioridad: parseInt(newRequirement.prioridad),
                estimacion: parseInt(newRequirement.estimacion),
              },
            ],
          }),
        }
      );

      if (response.ok) {
        setModalIsOpen(false);
        setNewRequirement({
          requerimiento: "",
          descripcion: "",
          prioridad: "",
          estimacion: "",
        });
        await Swal.fire({
          title: "Éxito!",
          text: "Requerimiento registrado correctamente.",
          icon: "success",
          iconColor: "#3684DB",
          confirmButtonText: "Aceptar",
          customClass: {
            confirmButton:
              "text-white bg-blue-modal hover:bg-semi-blue px-4 py-2 rounded",
          },
        });
        window.location.reload();
      } else {
        console.error("Error al registrar el requerimiento");
      }
    } catch (error) {
      console.error("Error al enviar el requerimiento:", error);
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
        setNewRequirement({
          requerimiento: "",
          descripcion: "",
          prioridad: "",
          estimacion: "",
        });
      }
    });
    setError("");
    setError2("");
  };

  return (
    <div className="p-4">
      <div className="p-6 bg-light-blue rounded-lg shadow-md w-full">
        <h2 className="text-xl font-semibold text-dark-blue">
          Product Backlog
        </h2>

        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          className="fixed inset-0 flex items-center justify-center"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
          <div className="bg-blue-modal w-[600px] h-[500 px] rounded-xl flex flex-col font-title">
            <div className="relative">
              <h2 className="text-2xl font-semibold text-center text-white p-4">
                Nuevo Requerimiento
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
              id="reqform"
              onSubmit={handleSubmit}
              className="flex flex-col flex-1 bg-white p-6"
            >
              <div className="p-6 flex flex-col justify-between">
                <div className="mb-4">
                  <label className="block font-semibold mb-2">
                    Requerimiento*
                  </label>
                  <input
                    type="text"
                    name="requerimiento"
                    value={newRequirement.requerimiento}
                    onChange={handleInputChange}
                    maxLength="50" // Limita a 50 caracteres
                    className="border rounded-lg w-full p-2"
                    required
                  />
                  {error && <p className="text-red-500 mt-2">{error}</p>}{" "}
                  {/* Muestra el mensaje de error */}
                </div>
                <div className="mb-4">
                  <label className="block font-semibold mb-2">
                    Descripción*
                  </label>
                  <textarea
                    name="descripcion"
                    value={newRequirement.descripcion}
                    onChange={handleInputChange}
                    className="border rounded-lg w-full p-2"
                    required
                  />
                  {error2 && <p className="text-red-500 mt-2">{error2}</p>}
                </div>
                <div className="mb-4 flex justify-between">
                  <div className="w-1/2 pr-2">
                    <label className="block font-semibold mb-2">
                      Prioridad*
                    </label>
                    <select
                      name="prioridad"
                      value={newRequirement.prioridad}
                      onChange={handleInputChange}
                      className="border rounded-lg w-full p-2"
                      required
                    >
                      <option value="">Selecciona una prioridad</option>
                      <option value="1">Must</option>
                      <option value="2">Should</option>
                      <option value="3">Could</option>
                      <option value="4">Would</option>
                    </select>
                  </div>
                  <div className="w-1/2 pl-2">
                    <label className="block font-semibold mb-2">
                      Estimación*
                    </label>
                    <input
                      type="number"
                      name="estimacion"
                      value={newRequirement.estimacion}
                      onChange={handleInputChange}
                      className="border rounded-lg w-full p-2"
                      min="0" // Valor mínimo permitido
                      max="100" // Valor máximo permitido
                      required
                    />
                  </div>
                </div>
              </div>
            </form>
            <div className="bg-blue-modal flex justify-end p-4 rounded-xl">
              <button
                type="button"
                onClick={closeModal}
                form="reqform"
                className="bg-white text-black px-4 py-2 rounded-lg mr-4 hover:bg-red-500 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="submit"
                form="reqform"
                className="bg-white text-black px-4 py-2 rounded-lg hover:bg-semi-blue hover:text-white"
              >
                Registrar
              </button>
            </div>
          </div>
        </Modal>

        <div className="overflow-x-auto mt-4">
          <table className="min-w-full table-auto bg-white rounded-lg shadow-md">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Requerimiento</th>
                <th className="px-4 py-2 border">Descripción</th>
                <th className="px-4 py-2 border">Prioridad</th>
                <th className="px-4 py-2 border">Estimación</th>
                <th className="px-4 py-2 border">Estado</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    Cargando...
                  </td>
                </tr>
              ) : tasks.length > 0 ? (
                tasks.map((task) => (
                  <tr key={task.id}>
                    <td className="px-4 py-2 border">{task.name}</td>
                    <td className="px-4 py-2 border">{task.description}</td>
                    <td className="px-4 py-2 border">
                      {getPriorityLabel(task.priority)}
                    </td>
                    <td className="px-4 py-2 border">{task.points}</td>
                    <td className="px-4 py-2 border">{task.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    No hay requerimientos disponibles.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="flex justify-end ">
            {user.rol === "estudiante" && (
              <button
                className="mt-4 bg-semi-blue text-white p-2 px-4 py-2 rounded-lg"
                onClick={openModal}
              >
                Agregar Requerimiento +
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MostrarRequerimientos;
