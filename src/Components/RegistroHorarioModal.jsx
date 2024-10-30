import React, { useState } from "react";
import Modal from "react-modal";
import { IoMdClose } from "react-icons/io";
import { RingLoader } from "react-spinners";
import axios from "axios";

//Modal.setAppElement("#root"); // Asegura la accesibilidad del modal

const RegistroHorarioModal = ({ 
  isHorarioModalOpen, 
  onClose,
  codClase,
  loading, // Si necesitas un estado de carga
}) => {
  const [dia, setDia] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(""); // Para mostrar errores
  const token = localStorage.getItem("token");
  const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
console.log("Entro al componente",isHorarioModalOpen);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(""); // Limpiar errores previos
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
      // Aquí puedes mostrar un mensaje de éxito o realizar alguna acción adicional
      onClose(); // Cierra el modal después de registrar
    } catch (error) {
      console.error("Error registrando horario:", error);
      setError(error.response.data.error); // Manejo de errores
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isHorarioModalOpen}
      onRequestClose={onClose}
      className="fixed inset-0 flex items-center justify-center"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <div className="bg-blue-modal w-[600px] rounded-xl flex flex-col font-title p-4">
        <div className="relative">
          <h2 className="text-2xl font-semibold text-center text-white">
            Registro horario
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-white px-2 py-2 hover:text-black"
          >
            <IoMdClose className="w-6 h-6" />
          </button>
        </div>

        {isLoading ? ( // Comprueba si se está cargando
          <div className="flex justify-center items-center h-full">
            <RingLoader color={"#ffffff"} size={150} />
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
                className="border rounded-lg w-full p-2"
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
                className="border rounded-lg w-full p-2"
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
                className="border rounded-lg w-full p-2"
              />
            </div>
            {error && <p className="text-red-500">{error}</p>} {/* Mensaje de error */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="bg-white text-black px-4 py-2 rounded-lg mr-4 hover:bg-red-500 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-white text-black px-4 py-2 rounded-lg hover:bg-semi-blue hover:text-white"
              >
                Registrar
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};

export default RegistroHorarioModal;
