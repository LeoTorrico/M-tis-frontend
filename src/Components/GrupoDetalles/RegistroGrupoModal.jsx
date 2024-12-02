import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";
import { IoMdClose } from "react-icons/io";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2"; // Importa SweetAlert2

const rolesDisponibles = ["Backend", "Diseño", "Frontend", "Gestión de calidad", "Documentación"];

const RegistroGrupoModal = ({ isGrupoModalOpen, onClose }) => {
  const { cod_clase, cod_grupoempresa } = useParams();
  const [cargando, setCargando] = useState(true);
  const [estudiantes, setEstudiantes] = useState([]);
  const [selecciones, setSelecciones] = useState({});
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (isGrupoModalOpen) {
      setError("");
      setSelecciones({});
    }
  }, [isGrupoModalOpen]);

  useEffect(() => {
    const fetchEstudiantes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/grupos/${cod_clase}/estudiantes-sin-grupo`,
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
      } finally {
        setCargando(false);
      }
    };

    fetchEstudiantes();
  }, [cod_clase, token]);

  const handleSeleccionarEstudiante = (codigoSis) => {
    setSelecciones((prev) => ({
      ...prev,
      [codigoSis]: { ...prev[codigoSis], seleccionado: !prev[codigoSis]?.seleccionado },
    }));
  };

  const handleSeleccionarRol = (codigoSis, rol) => {
    setSelecciones((prev) => ({
      ...prev,
      [codigoSis]: { ...prev[codigoSis], rol },
    }));
  };

  const handleAñadirIntegrante = async () => {
    const seleccionados = Object.entries(selecciones)
      .filter(([, value]) => value.seleccionado && value.rol)
      .map(([codigoSis, value]) => ({
        codigoSis: Number(codigoSis),
        rol: value.rol,
      }));

    if (seleccionados.length === 0) {
      setError("Por favor, selecciona al menos un estudiante y asigna un rol.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:3000/api/grupos/${cod_clase}/grupo/${cod_grupoempresa}/agregarIntegrantes`,
        {
          codigoSis: seleccionados.map((item) => item.codigoSis),
          roles: seleccionados.map((item) => item.rol),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);

      // Mostrar mensaje de éxito con el fondo personalizado del botón
      Swal.fire({
        title: "¡Éxito!",
        text: "Los estudiantes fueron añadidos correctamente.",
        icon: "success",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#3684DB", // Fondo personalizado para el botón de éxito
      }).then(() => {
        // Recargar la página después de que el usuario acepte el mensaje
        window.location.reload();
      });
    } catch (error) {
      console.error("Error al añadir estudiantes:", error);
      setError("Hubo un error al añadir los estudiantes.");
    }
  };

  const handleCancel = () => {
    setSelecciones({});
    setError("");
    onClose();
  };

  const handleClose = () => {
    setSelecciones({});
    setError("");
    onClose();
  };

  return (
    <Modal
      isOpen={isGrupoModalOpen}
      onRequestClose={handleClose}
      className="fixed inset-0 flex items-center justify-center"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <div className="bg-white w-[700px] rounded-xl flex flex-col font-title relative">
        <div className="bg-[#3684DB] rounded-t-xl p-4 flex justify-center items-center relative">
          <h2 className="text-2xl font-semibold text-white text-center">
            Añadir nuevos integrantes
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-2 right-2 text-white hover:text-black"
          >
            <IoMdClose className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4">
          <form className="flex flex-col space-y-4">
            <div>
              <label className="block font-semibold mb-2">
                Estudiantes sin Grupo
              </label>
              {cargando ? (
                <p>Cargando estudiantes...</p>
              ) : estudiantes.length === 0 ? (
                <p>No hay estudiantes disponibles para asignar.</p>
              ) : (
                <ul className="list-disc pl-6">
                  {estudiantes.map((estudiante) => (
                    <li key={estudiante.codigo_sis} className="flex items-center space-x-4">
                      <input
                        type="checkbox"
                        id={`estudiante-${estudiante.codigo_sis}`}
                        checked={selecciones[estudiante.codigo_sis]?.seleccionado || false}
                        onChange={() => handleSeleccionarEstudiante(estudiante.codigo_sis)}
                        className="mr-2"
                      />
                      <label htmlFor={`estudiante-${estudiante.codigo_sis}`} className="flex-1">
                        {`${estudiante.nombre_estudiante} ${estudiante.apellido_estudiante}`}
                      </label>
                      <select
                        value={selecciones[estudiante.codigo_sis]?.rol || ""}
                        onChange={(e) => handleSeleccionarRol(estudiante.codigo_sis, e.target.value)}
                        className="border rounded px-2 py-1"
                        disabled={!selecciones[estudiante.codigo_sis]?.seleccionado}
                      >
                        <option value="" disabled>
                          Seleccionar Rol
                        </option>
                        {rolesDisponibles.map((rol) => (
                          <option key={rol} value={rol}>
                            {rol}
                          </option>
                        ))}
                      </select>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {error && <p className="text-red-500 font-semibold">{error}</p>}
          </form>
        </div>

        <div className="bg-[#3684DB] rounded-b-xl p-4 flex justify-end space-x-4">
          <button
            type="button"
            onClick={handleCancel}
            className="bg-white text-[#3684DB] px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleAñadirIntegrante}
            className="bg-white text-[#3684DB] px-4 py-2 rounded-lg hover:bg-semi-blue hover:text-white"
          >
            Añadir Integrante
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RegistroGrupoModal;
