import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/images/logo.png";
import logoGrande from "../../assets/images/logo-grande.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function RegistroDocentes() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    contraseña: "",
  });
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;

    // Limitar el campo de contraseña a 30 caracteres
    if (id === "contraseña" && value.length > 30) {
      return;
    }

    setFormData({ ...formData, [id]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validaciones
    if (
      !formData.nombre ||
      formData.nombre.length < 3 ||
      formData.nombre.length > 60 ||
      /[^a-zA-Z\s']/.test(formData.nombre)
    ) {
      newErrors.nombre =
        "Nombre debe tener entre 3 y 60 caracteres y solo contener letras, espacios y apóstrofes.";
    }
    if (
      !formData.apellido ||
      formData.apellido.length < 3 ||
      formData.apellido.length > 80 ||
      /[^a-zA-Z\s']/.test(formData.apellido)
    ) {
      newErrors.apellido =
        "Apellido debe tener entre 3 y 80 caracteres y solo contener letras, espacios y apóstrofes.";
    }
    if (
      !formData.correo ||
      !/^[\w-.]+@(umss\.edu\.bo|fcyt\.umss\.edu\.bo)$/.test(formData.correo)
    ) {
      newErrors.correo =
        "El correo debe ser institucional y terminar en @umss.edu.bo o @fcyt.umss.edu.bo.";
    }
    if (
      !formData.contraseña ||
      formData.contraseña.length < 12 ||
      formData.contraseña.length > 30 ||
      !/[A-Z]/.test(formData.contraseña) ||
      !/[a-z]/.test(formData.contraseña)
    ) {
      newErrors.contraseña =
        "Contraseña debe tener entre 12 y 30 caracteres, y contener mayúsculas y minúsculas.";
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await axios.post(
          "http://localhost:4000/docentes/registro",
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 201) {
          setShowModal(true);
        }
      } catch (error) {
        if (error.response && error.response.data) {
          setErrors({
            api: error.response.data.detalle || "Error al registrar el docente",
          });
        }
      }
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    navigate("/iniciar-sesion");
  };

  const handleCancel = () => {
    if (Object.values(formData).some((val) => val !== "")) {
      setShowCancelModal(true);
    } else {
      navigate("/iniciar-sesion");
    }
  };

  const handleCancelModalClose = (confirm) => {
    if (confirm) {
      navigate("/iniciar-sesion");
    } else {
      setShowCancelModal(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden">
      <header className="flex justify-between items-center p-4 bg-[#00204A] text-white shadow-lg">
        <div className="logo">
          <img src={logo} alt="Logo MTIS" className="h-12" />
        </div>
        <nav className="flex gap-6">
          <a
            href="#estudiantes"
            className="text-white text-lg font-bold hover:text-[#A9CCE3]"
            aria-label="Sección Estudiantes"
          >
            Estudiantes
          </a>
          <a
            href="#docentes"
            className="text-white text-lg font-bold hover:text-[#A9CCE3]"
            aria-label="Sección Docentes"
          >
            Docentes
          </a>
        </nav>
      </header>

      <div className="flex flex-col md:flex-row h-full">
        <div className="flex flex-col justify-start p-8 md:p-12 w-full md:w-[50%] bg-[#3684DB] text-white rounded-r-[50px] md:rounded-r-[250px]">
          <h2 className="text-xl md:text-2xl mb-6 font-bold text-center">
            Registro Docentes
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="relative mb-4">
              <label htmlFor="nombre" className="block font-bold mb-2">
                Nombre(s)*
              </label>
              <input
                id="nombre"
                type="text"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ingrese su nombre(s)"
                required
                className="w-full md:w-[90%] py-2 px-3 border-none rounded-full text-base text-black bg-white shadow-md"
              />
              {errors.nombre && (
                <div className="text-red-500 text-sm">{errors.nombre}</div>
              )}
            </div>

            <div className="relative mb-4">
              <label htmlFor="apellido" className="block font-bold mb-2">
                Apellido*
              </label>
              <input
                id="apellido"
                type="text"
                value={formData.apellido}
                onChange={handleChange}
                placeholder="Ingrese sus apellidos"
                required
                className="w-full md:w-[90%] py-2 px-3 border-none rounded-full text-base text-black bg-white shadow-md"
              />
              {errors.apellido && (
                <div className="text-red-500 text-sm">{errors.apellido}</div>
              )}
            </div>

            <div className="relative mb-4">
              <label htmlFor="correo" className="block font-bold mb-2">
                Correo Electrónico*
              </label>
              <input
                id="correo"
                type="email"
                value={formData.correo}
                onChange={handleChange}
                placeholder="Ingrese su correo institucional"
                required
                className="w-full md:w-[90%] py-2 px-3 border-none rounded-full text-base text-black bg-white shadow-md"
              />
              {errors.correo && (
                <div className="text-red-500 text-sm">{errors.correo}</div>
              )}
            </div>

            <div className="relative mb-4">
              <label htmlFor="contraseña" className="block font-bold mb-2">
                Contraseña*
              </label>
              <input
                id="contraseña"
                type={showPassword ? "text" : "password"}
                value={formData.contraseña}
                onChange={handleChange}
                placeholder="Ingrese su contraseña"
                required
                className="w-full md:w-[90%] py-2 px-3 border-none rounded-full text-base text-black bg-white shadow-md"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-5 top-10 text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {errors.contraseña && (
                <div className="text-red-500 text-sm">{errors.contraseña}</div>
              )}
            </div>

            {errors.api && (
              <div className="text-red-500 text-sm">{errors.api}</div>
            )}

            <div className="flex flex-col items-center">
              <button
                type="submit"
                className="p-3 bg-[#00204A] text-white rounded-lg text-base w-full md:w-1/3 mt-6 transition-transform duration-200 hover:bg-[#001737] hover:-translate-y-1 hover:shadow-lg"
              >
                Registrarse
              </button>
            </div>
          </form>
        </div>

        <div className="flex flex-col items-center justify-center p-8 md:p-12 w-full md:w-[50%] bg-white text-center">
          <h2 className="text-3xl md:text-6xl text-[#00204A] mb-16">
            <strong>Bienvenidos de nuevo a</strong>
          </h2>
          <img
            src={logoGrande}
            alt="Logo Grande"
            className="h-auto md:w-[40%] mb-8"
          />
          <div className="max-w-full mx-auto px-32">
            <p className="text-4xl text-gray-800 mb-8 text-center whitespace-normal">
              MTIS es una plataforma de gestionamiento de proyectos
            </p>
          </div>
          <button
            onClick={handleCancel}
            className="px-5 py-3 bg-[#3684DB] text-white rounded-lg transition-transform duration-200 hover:bg-[#2e6cbb] hover:-translate-y-1 hover:shadow-lg"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>

      {/* Modal de éxito */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-lg font-bold mb-4">Registro Exitoso</h2>
            <p>El docente ha sido registrado exitosamente.</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleModalClose}
                className="px-4 py-2 bg-[#00204A] text-white rounded-lg"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de cancelación */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-lg font-bold mb-4">¿Estás seguro?</h2>
            <p>
              Tienes cambios sin guardar. ¿Quieres cancelar el registro y volver
              a la pantalla de inicio de sesión?
            </p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => handleCancelModalClose(false)}
                className="px-4 py-2 bg-gray-300 text-black rounded-lg mr-2"
              >
                No
              </button>
              <button
                onClick={() => handleCancelModalClose(true)}
                className="px-4 py-2 bg-[#00204A] text-white rounded-lg"
              >
                Sí
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RegistroDocentes;
