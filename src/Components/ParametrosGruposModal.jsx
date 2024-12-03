import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { IoMdClose } from "react-icons/io";
import { RingLoader } from "react-spinners";
import axios from "axios";
import Swal from "sweetalert2";
import ConfirmationModal from "../Components/ConfirmationModal";

const ParametrosGruposModal = ({
  isParametrosModalOpen,
  onClose,
  codClase,
}) => {
  const [maxGroupSize, setMaxGroupSize] = useState(2);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (isParametrosModalOpen) {
      setMaxGroupSize(2);
      setError("");
    }
  }, [isParametrosModalOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (maxGroupSize < 2) {
      setError("El tamaño mínimo del grupo debe ser 2");
      return;
    }

    setIsLoading(true);
    try {
      await axios.put(
        `http://localhost:3000/clases/${codClase}/integrantes`, // URL dinámica
        {
          nroIntegrantes: maxGroupSize, // Clave ajustada según el formato requerido
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      Swal.fire({
        title: "Éxito",
        text: "Parámetros de grupo guardados correctamente",
        icon: "success",
        iconColor: "#3684DB",
        confirmButtonText: "Aceptar",
        customClass: {
          confirmButton:
            "text-white bg-blue-modal hover:bg-semi-blue px-4 py-2 rounded",
        },
      });
      onClose();
    } catch (error) {
      console.error("Error al guardar parámetros:", error);
      setError(
        error.response?.data?.error || "No se pudieron guardar los parámetros"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (maxGroupSize !== 2) {
      setIsConfirming(true);
    } else {
      onClose();
    }
  };

  const handleClose = () => {
    if (maxGroupSize !== 2) {
      setIsConfirming(true);
    } else {
      onClose();
    }
  };

  const handleConfirmClose = () => {
    setMaxGroupSize(2);
    setError("");
    setIsConfirming(false);
    onClose();
  };

  return (
    <>
      <Modal
        isOpen={isParametrosModalOpen}
        onRequestClose={handleClose}
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white w-[600px] rounded-xl flex flex-col font-title relative">
          {/* Header Superior */}
          <div className="bg-[#3684DB] rounded-t-xl p-4 flex justify-center items-center relative">
            <h2 className="text-2xl font-semibold text-white text-center">
              Parámetros Grupos Empresas
            </h2>
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-2 right-2 text-white hover:text-black"
            >
              <IoMdClose className="w-6 h-6" />
            </button>
          </div>

          {/* Contenido del Modal */}
          <div className="p-4">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <RingLoader color={"#3684DB"} size={150} />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                <div>
                  <label
                    htmlFor="maxGroupSize"
                    className="block font-semibold mb-2"
                  >
                    Tamaño Máximo de Grupo*
                  </label>
                  <input
                    type="number"
                    id="maxGroupSize"
                    min="2"
                    value={maxGroupSize}
                    onChange={(e) => setMaxGroupSize(parseInt(e.target.value))}
                    required
                    className="border rounded-lg w-full p-2 bg-[#B3D6F9]"
                  />
                </div>
                {error && <p className="text-red-500 font-semibold">{error}</p>}
              </form>
            )}
          </div>

          {/* Header Inferior */}
          <div className="bg-[#3684DB] rounded-b-xl p-4 flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-white text-[#3684DB] px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="registerForm"
              className="bg-white text-[#3684DB] px-4 py-2 rounded-lg hover:bg-semi-blue hover:text-white"
              onClick={handleSubmit}
            >
              Registrar
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmationModal
        show={isConfirming}
        title="Confirmación"
        text="¿Estás seguro de que deseas salir?"
        onClose={() => setIsConfirming(false)}
        onSave={handleConfirmClose}
      />
    </>
  );
};

export default ParametrosGruposModal;
