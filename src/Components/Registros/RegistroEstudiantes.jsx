import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";
function RegistroEstudiante() {
  const [formData, setFormData] = useState({
    codigo_sis: "",
    nombres: "",
    apellidos: "",
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

    // Permitir solo números en el campo 'codigo_sis' y limitar a 10 caracteres
    if (id === "codigo_sis") {
      if (!/^\d*$/.test(value) || value.length > 10) {
        return;
      }
    }
    if (id === "nombres" && value.length > 60) {
      return;
    }
    if (id === "apellidos" && value.length > 80) {
      return;
    }

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

    // Validaciones existentes
    if (
      !formData.nombres ||
      formData.nombres.length < 3 ||
      formData.nombres.length > 60 ||
      /[^a-zA-Z\s']/.test(formData.nombres)
    ) {
      newErrors.nombres =
        "Nombre debe tener entre 3 y 60 caracteres y solo contener letras, espacios y apóstrofes.";
    }
    if (
      !formData.apellidos ||
      formData.apellidos.length < 3 ||
      formData.apellidos.length > 80 ||
      /[^a-zA-Z\s']/.test(formData.apellidos)
    ) {
      newErrors.apellidos =
        "Apellidos debe tener entre 3 y 80 caracteres y solo contener letras, espacios y apóstrofes.";
    }
    if (
      !formData.codigo_sis ||
      formData.codigo_sis.length < 6 ||
      formData.codigo_sis.length > 10
    ) {
      newErrors.codigo_sis = "Código SIS debe tener entre 6 y 10 caracteres.";
    }

    // Validar que el correo tenga el formato adecuado y que sea equivalente al código SIS
    if (
      !formData.correo ||
      !/^[\w-.]+@est\.umss\.edu$/.test(formData.correo) ||
      !formData.correo.startsWith(formData.codigo_sis)
    ) {
      newErrors.correo =
        "El código SIS y el correo deben ser equivalentes y seguir con  el formato [CodSis]@est.umss.edu";
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
          "http://localhost:4000/estudiantes/registro",
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
            api:
              error.response.data.detalle || "Error al registrar el estudiante",
          });
        }
      }
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    navigate("/LoginEstudiantes");
  };

  const handleCancel = () => {
    if (Object.values(formData).some((val) => val !== "")) {
      setShowCancelModal(true);
    } else {
      navigate("/LoginEstudiantes");
    }
  };

  const handleCancelModalClose = (confirm) => {
    if (confirm) {
      navigate("/LoginEstudiantes");
    } else {
      setShowCancelModal(false);
    }
  };

  return (
    <motion.div
      className="h-screen overflow-hidden"
      initial={{ opacity: 0, x: 100 }} // Animación inicial
      animate={{ opacity: 1, x: 0 }} // Animación de entrada
      exit={{ opacity: 0, x: -100 }} // Animación de salida
      transition={{ duration: 0.5 }} // Duración de la animación
    >
      <div className="h-screen overflow-hidden">
        <div className="flex h-full">
          <div className="flex flex-col justify-start p-12 w-[48%] bg-[#3684DB] text-white rounded-r-[250px]">
            <h2 className="text-2xl mb-6 font-bold text-center">
              Registro Estudiantes
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="relative mb-4">
                <label htmlFor="codigo_sis" className="block font-bold mb-2">
                  Código SIS*
                </label>
                <input
                  id="codigo_sis"
                  type="text"
                  value={formData.codigo_sis}
                  onChange={handleChange}
                  placeholder="Ingrese su código SIS"
                  required
                  className="w-[90%] py-2 px-3 border-none rounded-full text-base text-black bg-white shadow-md"
                />
                {errors.codigo_sis && (
                  <div className="absolute left-1/2 transform -translate-y-1/2 mt-1 bg-white text-red-500 border border-red-500 p-2 rounded-lg shadow-md">
                    <span role="alert" className="text-sm font-semibold">
                      {errors.codigo_sis}
                    </span>
                    <div className="absolute top-[-10px] left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white border-l border-t border-red-500 rotate-45"></div>
                  </div>
                )}
              </div>

              <div className="relative mb-4">
                <label htmlFor="nombres" className="block font-bold mb-2">
                  Nombre(s)*
                </label>
                <input
                  id="nombres"
                  type="text"
                  value={formData.nombres}
                  onChange={handleChange}
                  placeholder="Ingrese su nombre(s)"
                  required
                  className="w-[90%] py-2 px-3 border-none rounded-full text-base text-black bg-white shadow-md"
                />
                {errors.nombres && (
                  <div className="absolute left-1/2 transform -translate-y-1/2 mt-1 bg-white text-red-500 border border-red-500 p-2 rounded-lg shadow-md">
                    <span role="alert" className="text-sm font-semibold">
                      {errors.nombres}
                    </span>
                    <div className="absolute top-[-10px] left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white border-l border-t border-red-500 rotate-45"></div>
                  </div>
                )}
              </div>

              <div className="relative mb-4">
                <label htmlFor="apellidos" className="block font-bold mb-2">
                  Apellidos*
                </label>
                <input
                  id="apellidos"
                  type="text"
                  value={formData.apellidos}
                  onChange={handleChange}
                  placeholder="Ingrese sus apellidos"
                  required
                  className="w-[90%] py-2 px-3 border-none rounded-full text-base text-black bg-white shadow-md"
                />
                {errors.apellidos && (
                  <div className="absolute left-1/2 transform -translate-y-1/2 mt-1 bg-white text-red-500 border border-red-500 p-2 rounded-lg shadow-md">
                    <span role="alert" className="text-sm font-semibold">
                      {errors.apellidos}
                    </span>
                    <div className="absolute top-[-10px] left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white border-l border-t border-red-500 rotate-45"></div>
                  </div>
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
                  className="w-[90%] py-2 px-3 border-none rounded-full text-base text-black bg-white shadow-md"
                />
                {errors.correo && (
                  <div className="absolute left-1/2 transform -translate-y-1/2 mt-1 bg-white text-red-500 border border-red-500 p-2 rounded-lg shadow-md">
                    <span role="alert" className="text-sm font-semibold">
                      {errors.correo}
                    </span>
                    <div className="absolute top-[-10px] left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white border-l border-t border-red-500 rotate-45"></div>
                  </div>
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
                  className="w-[90%] py-2 px-3 border-none rounded-full text-base text-black bg-white shadow-md"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-20 top-11 text-gray-500"
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-black" />
                  ) : (
                    <FaEye className="text-black" />
                  )}
                </button>
                {errors.contraseña && (
                  <div className="absolute left-1/2 transform -translate-y-1/2 mt-1 bg-white text-red-500 border border-red-500 p-2 rounded-lg shadow-md">
                    <span role="alert" className="text-sm font-semibold">
                      {errors.contraseña}
                    </span>
                    <div className="absolute top-[-10px] left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white border-l border-t border-red-500 rotate-45"></div>
                  </div>
                )}
              </div>

              {errors.api && (
                <div className="text-red-500 text-sm">{errors.api}</div>
              )}

              <div className="flex flex-col items-center">
                <button
                  type="submit"
                  className="p-3 bg-[#00204A] text-white rounded-lg text-base w-1/3 mt-70 transition-transform duration-200"
                >
                  Registrarse
                </button>
              </div>
            </form>
          </div>

          <div className="flex flex-col items-center justify-center p-12 w-[50%] bg-white text-center">
            <h2 className="text-6xl text-[#00204A] mb-6 -mt-16">
              <strong>Bienvenidos de</strong> <br />
              <strong>nuevo a</strong> <br />
            </h2>
            <img
              src="/LogoColor.svg"
              alt="Logo Color"
              className="w-[450px] h-auto mt-110"
            />
            <p className="text-lg text-gray-800 mb-8">
              Regístrate en MTIS y comienza a gestionar tus proyectos de forma
              eficiente. Únete a una plataforma diseñada para facilitar la
              colaboración y el seguimiento en tiempo real.
            </p>
            <a className="text-black mb-6">
              <strong>¿Ya tienes cuenta? Inicia sesión ahora.</strong>
            </a>
            <button
              onClick={handleCancel}
              className="p-3 bg-[#3684DB] text-white rounded-lg text-lg w-1/3 transition-transform duration-200 "
            >
              Iniciar Sesión
            </button>
          </div>
        </div>

        {/* Modal de éxito */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 text-center">
              <h3 className="text-lg font-bold mb-4">Registro Exitoso</h3>
              <p className="mb-4">
                Tu registro se ha 1do exitosamente. Ahora puedes iniciar sesión.
              </p>
              <button
                onClick={handleModalClose}
                className="p-3 bg-[#00204A] text-white rounded-lg transition-transform duration-200"
              >
                Aceptar
              </button>
            </div>
          </div>
        )}

        {/* Modal de cancelación */}
        {showCancelModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 text-center">
              <h3 className="text-lg font-bold mb-4">Confirmar Cancelación</h3>
              <p className="mb-4">
                ¿Estás seguro de que deseas cancelar? Los datos ingresados se
                perderán.
              </p>
              <div className="flex justify-around">
                <button
                  onClick={() => handleCancelModalClose(true)}
                  className="p-3 bg-[#E74C3C] text-white rounded-lg transition-transform duration-200"
                >
                  Sí, cancelar
                </button>
                <button
                  onClick={() => handleCancelModalClose(false)}
                  className="p-3 bg-[#2ECC71] text-white rounded-lg transition-transform duration-200"
                >
                  No, continuar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default RegistroEstudiante;
