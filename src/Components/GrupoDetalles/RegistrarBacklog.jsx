import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Modal from "react-modal";
import { IoMdClose } from "react-icons/io"; // Asegúrate de tener instalada esta librería

const MostrarRequerimientos = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newRequirement, setNewRequirement] = useState({
    requerimiento: "",
    descripcion: "",
    prioridad: "",
    estimacion: "",
  });

  const { cod_grupoempresa } = useParams();

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:3000/planificacion/productbacklog/${cod_grupoempresa}`
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:3000/planificacion/requerimientos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
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
    setModalIsOpen(false);
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
                    className="border rounded-lg w-full p-2"
                    required
                  />
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
                </div>
                <div className="mb-4 flex justify-between">
                  <div className="w-1/2 pr-2">
                    <label className="block font-semibold mb-2">
                      Prioridad*
                    </label>
                    <input
                      type="number"
                      name="prioridad"
                      value={newRequirement.prioridad}
                      onChange={handleInputChange}
                      className="border rounded-lg w-full p-2"
                      required
                    />
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
              <tr className="text-left text-dark-blue font-medium bg-light-blue">
                <th className="p-4">Tarea</th>
                <th className="p-4">Descripción</th>
                <th className="p-4">Prioridad</th>
                <th className="p-4">Estimacion</th>
                <th className="p-4">Estado</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center p-4">
                    Cargando...
                  </td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <tr key={task.id} className="border-b">
                    <td className="p-4">{task.name}</td>
                    <td className="p-4">{task.description}</td>
                    <td className="p-4">{task.priority}</td>
                    <td className="p-4 text-center">{task.points}</td>
                    <td className="p-4">{task.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="flex justify-end ">
            <button
              onClick={openModal}
              className="mt-4 bg-semi-blue text-white p-2 px-4 py-2 rounded-lg "
            >
              Agregar Requerimiento +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MostrarRequerimientos;
