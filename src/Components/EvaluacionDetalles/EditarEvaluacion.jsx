import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";  // Importa SweetAlert2

const EditarEvaluacion = () => {
  const { cod_evaluacion } = useParams(); // Obtiene el id de la evaluación desde la URL
  const [formData, setFormData] = useState({
    nombreEvaluacion: "",
    descripcion: "",
    fecha: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(true); // Abre el modal directamente
  const [formErrors, setFormErrors] = useState({
    nombreEvaluacion: "",
    descripcion: "",
    fecha: "",
  });

  // Función para cerrar el modal y recargar la página
  const closeModal = () => {
    setIsModalOpen(false);
    window.location.reload(); // Recargar la página cuando se presiona "Cancelar"
  };

  useEffect(() => {
    const fetchEvaluacion = async () => {
      const token = localStorage.getItem("token"); // Obtener el token desde localStorage

      if (!token) {
        setError("No se ha encontrado el token de autenticación.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/evaluaciones/detalles/${cod_evaluacion}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Agregar el token al encabezado
          },
        });

        const data = await response.json();

        if (response.ok) {
          setFormData({
            nombreEvaluacion: data.evaluacion,
            descripcion: data.descripcion_evaluacion,
            fecha: data.fecha_fin.split("T")[0], // Convertir la fecha a formato YYYY-MM-DD
          });
        } else {
          throw new Error("Error al obtener la evaluación");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvaluacion();
  }, [cod_evaluacion]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Limpiar los errores cuando el usuario cambia el valor
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.nombreEvaluacion) {
      errors.nombreEvaluacion = "El nombre de la evaluación es obligatorio.";
    }

    if (!formData.descripcion) {
      errors.descripcion = "La descripción es obligatoria.";
    }

    if (!formData.fecha) {
      errors.fecha = "La fecha de entrega es obligatoria.";
    }

    setFormErrors(errors);

    // Si hay errores, devolver false
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar los campos antes de proceder
    if (!validateForm()) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("No se ha encontrado el token de autenticación.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/evaluaciones/editar/${cod_evaluacion}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombreEvaluacion: formData.nombreEvaluacion,
          descripcion: formData.descripcion,
          fechaEntrega: formData.fecha,
        }),
      });

      if (response.ok) {
        // Mostrar el mensaje de éxito
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "La evaluación se ha actualizado correctamente.",
          confirmButtonColor: "#3684DB",
        }).then(() => {
          // Recargar la página después de aceptar el mensaje
          window.location.reload();
        });
      } else {
        throw new Error("Error al guardar la evaluación.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{`Error: ${error}`}</div>;
  }

  // Obtener la fecha de hoy
  const today = new Date().toISOString().split("T")[0];

  return (
    <div>
      {/* El modal ya se muestra al cargar el componente */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-[700px] max-h-[95vh] h-[65vh] rounded-xl flex flex-col font-title relative">
            <div className="bg-[#3684DB] rounded-t-xl p-4 flex justify-center items-center relative">
              <h2 className="text-2xl font-semibold text-white text-center">Editar Evaluación</h2>
              <button
                type="button"
                onClick={closeModal}
                className="absolute top-2 right-2 text-white hover:text-black"
              >
                <span className="w-6 h-6">X</span>
              </button>
            </div>

            <div className="p-4 space-y-6 flex-grow overflow-auto mb-24">
              <form onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="nombreEvaluacion" className="block font-medium text-gray-700">
                    Nombre de la evaluación:
                  </label>
                  <input
                    type="text"
                    id="nombreEvaluacion"
                    name="nombreEvaluacion"
                    value={formData.nombreEvaluacion}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded"
                    style={{ backgroundColor: "#B3D6F9" }} // Fondo del campo
                  />
                </div>

                <div>
                  <label htmlFor="descripcion" className="block font-medium text-gray-700">
                    Descripción:
                  </label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded"
                    style={{ backgroundColor: "#B3D6F9" }} // Fondo del campo
                  />
                </div>

                <div>
                  <label htmlFor="fecha" className="block font-medium text-gray-700">
                    Fecha de entrega:
                  </label>
                  <input
                    type="date"
                    id="fecha"
                    name="fecha"
                    value={formData.fecha}
                    onChange={handleChange}
                    min={today}  // Asegura que no se puedan seleccionar fechas anteriores al día de hoy
                    className="w-full px-4 py-2 border border-gray-300 rounded"
                    style={{ backgroundColor: "#B3D6F9" }} // Fondo del campo
                  />
                </div>

                {/* Mostrar los errores debajo del formulario */}
                <div className="text-red-500 text-sm mt-2">
                  {Object.values(formErrors).map(
                    (error, index) => error && <div key={index}>{error}</div>
                  )}
                </div>

                {/* Header inferior con los botones */}
                <div className="mt-6 bg-[#3684DB] rounded-b-xl p-4 flex justify-end space-x-4 w-full absolute bottom-0 left-0 right-0">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="bg-white text-[#3684DB] px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-white text-[#3684DB] px-4 py-2 rounded-lg hover:bg-semi-blue hover:text-white"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditarEvaluacion;
