import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { IoMdClose } from "react-icons/io";
import { RingLoader } from "react-spinners";
import axios from "axios";
import ConfirmationModal from "../Components/ConfirmationModal";

const RegistroHorarioModal = ({ 
  isHorarioModalOpen, 
  onClose,
  codClase,
}) => {
  const [dia, setDia] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isConfirming, setIsConfirming] = useState(false); // Estado para el modal de confirmación
  const token = localStorage.getItem("token");
  const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

  useEffect(() => {
    if (isHorarioModalOpen) {
      setDia("");
      setHoraInicio("");
      setHoraFin("");
      setError("");
    }
  }, [isHorarioModalOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!dia || !horaInicio || !horaFin) {
      setError("Por favor, completa todos los campos requeridos.");
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(`http://localhost:3000/clases/${codClase}/horarios`, {
        hora_inicio: horaInicio, 
        hora_fin: horaFin, 
        dia_horario: dia, 
      },{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onClose();
    } catch (error) {
      console.error("Error registrando horario:", error);
      setError(error.response.data.error || "Hubo un problema al registrar el horario.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (dia || horaInicio || horaFin) {
      setIsConfirming(true); // Muestra el modal de confirmación
    } else {
      onClose();
    }
  };

  const handleClose = () => {
    if (dia || horaInicio || horaFin) {
      setIsConfirming(true); // Muestra el modal de confirmación
    } else {
      onClose();
    }
  };

  const handleConfirmClose = () => {
    setDia("");
    setHoraInicio("");
    setHoraFin("");
    setError("");
    setIsConfirming(false);
    onClose();
  };

  return (
    <>
      <Modal
        isOpen={isHorarioModalOpen}
        onRequestClose={handleClose}
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white w-[600px] rounded-xl flex flex-col font-title relative">
          
          {/* Header Superior */}
          <div className="bg-[#3684DB] rounded-t-xl p-4 flex justify-center items-center relative">
            <h2 className="text-2xl font-semibold text-white text-center">
              Registro horario
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
                  <label htmlFor="dia" className="block font-semibold mb-2">
                    Día*
                  </label>
                  <select
                    id="dia"
                    value={dia}
                    onChange={(e) => setDia(e.target.value)}
                    required
                    className="border rounded-lg w-full p-2 bg-[#B3D6F9]"
                  >
                    <option value="" disabled>
                      Seleccionar día
                    </option>
                    {dias.map((dia) => (
                      <option key={dia} value={dia}>
                        {dia}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="horaInicio" className="block font-semibold mb-2">
                    Hora de Inicio*
                  </label>
                  <input
                    type="time"
                    id="horaInicio"
                    value={horaInicio}
                    onChange={(e) => setHoraInicio(e.target.value)}
                    required
                    className="border rounded-lg w-full p-2 bg-[#B3D6F9]"
                  />
                </div>
                <div>
                  <label htmlFor="horaFin" className="block font-semibold mb-2">
                    Hora de Fin*
                  </label>
                  <input
                    type="time"
                    id="horaFin"
                    value={horaFin}
                    onChange={(e) => setHoraFin(e.target.value)}
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

      {/* Confirmación del Modal */}
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

export default RegistroHorarioModal;
