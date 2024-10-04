import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";

function RegistroDocentes() {
  // Función que devuelve las dimensiones de la ventana
  const useWindowDimensions = () => {
    const [windowDimensions, setWindowDimensions] = useState({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    useEffect(() => {
      const handleResize = () => {
        setWindowDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    return windowDimensions;
  };

  const { height } = useWindowDimensions();

  const errorMessages = {
    nombre:
      "Nombre debe tener entre 3 y 60 caracteres y solo contener letras, espacios y apóstrofes.",
    apellido:
      "Apellido debe tener entre 3 y 80 caracteres y solo contener letras, espacios y apóstrofes.",
    correo:
      "El correo debe ser institucional y terminar en @umss.edu.bo o @fcyt.umss.edu.bo.",
    contraseña:
      "Contraseña debe tener entre 12 y 30 caracteres, y contener mayúsculas y minúsculas.",
    api: "Error al registrar el docente",
  };

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
    if (id === "nombre" && value.length > 60) {
      return;
    }
    if (id === "apellido" && value.length > 80) {
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
      !formData.nombre ||
      formData.nombre.length < 3 ||
      formData.nombre.length > 60 ||
      /[^a-zA-Z\s']/.test(formData.nombre)
    ) {
      newErrors.nombre = errorMessages.nombre;
    }
    if (
      !formData.apellido ||
      formData.apellido.length < 3 ||
      formData.apellido.length > 80 ||
      /[^a-zA-Z\s']/.test(formData.apellido)
    ) {
      newErrors.apellido = errorMessages.apellido;
    }
    if (
      !formData.correo ||
      !/^[\w-.]+@(umss\.edu\.bo|fcyt\.umss\.edu\.bo)$/.test(formData.correo)
    ) {
      newErrors.correo = errorMessages.correo;
    }
    if (
      !formData.contraseña ||
      formData.contraseña.length < 12 ||
      formData.contraseña.length > 30 ||
      !/[A-Z]/.test(formData.contraseña) ||
      !/[a-z]/.test(formData.contraseña)
    ) {
      newErrors.contraseña = errorMessages.contraseña;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await axios.post(
          "http://localhost:3000/docentes/registro",
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
            api: error.response.data.detalle || errorMessages.api,
          });
        }
      }
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    navigate("/LoginDocentes");
  };

  const handleCancel = () => {
    if (Object.values(formData).some((val) => val !== "")) {
      setShowCancelModal(true);
    } else {
      navigate("/LoginDocentes");
    }
  };

  const handleCancelModalClose = (confirm) => {
    if (confirm) {
      navigate("/LoginDocentes");
    } else {
      setShowCancelModal(false);
    }
  };

  return (
    <motion.div
      className={`h-[${height - 80}px] overflow-hidden`}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`h-[calc(100vh-80px)] overflow-auto`}>
        <div className="flex flex-col md:flex-row h-full">
          <div className="flex flex-col justify-center p-6 md:p-14 w-full md:w-1/2 bg-[#3684DB] text-white rounded-none md:rounded-r-[250px] md:rounded-b-[250]">
            <h2 className="text-xl md:text-2xl mb-4 md:mb-6 font-bold text-center">
              Registro Docentes
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="relative mb-4">
                <label htmlFor="nombre" className="block font-bold mb-2">
                  Nombre(s)*
                </label>
                <input
                  type="text"
                  id="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ingrese su nombre(s)"
                  required
                  className="w-full md:w-[90%] py-2 px-3 border-none rounded-full text-base text-black bg-white shadow-md"
                />
                {errors.nombre && (
                  <div className="absolute left-1/2 transform -translate-y-1/2 mt-1 bg-white text-red-500 border border-red-500 p-2 rounded-lg shadow-md">
                    <span role="alert" className="text-sm font-semibold">
                      {errors.nombre}
                    </span>
                    <div className="absolute top-[-10px] left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white border-l border-t border-red-500 rotate-45"></div>
                  </div>
                )}
              </div>

              <div className="relative mb-4">
                <label htmlFor="apellido" className="block font-bold mb-2">
                  Apellidos*
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
                  <div className="absolute left-1/2 transform -translate-y-1/2 mt-1 bg-white text-red-500 border border-red-500 p-2 rounded-lg shadow-md">
                    <span role="alert" className="text-sm font-semibold">
                      {errors.apellido}
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
                  className="w-full md:w-[90%] py-2 px-3 border-none rounded-full text-base text-black bg-white shadow-md"
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
                <div className="relative">
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
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black-500 sm:right-8 md:right-12 lg:right-16 xl:right-20"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="text-black" />
                    ) : (
                      <FaEye className="text-black" />
                    )}
                  </button>
                </div>
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
                  className="p-2 md:p-3 bg-[#00204A] text-white rounded-lg text-sm md:text-base w-2/3 md:w-1/3 mt-4 md:mt-6 transition-transform duration-200 hover:bg-[#001737]"
                >
                  Registrarse
                </button>
              </div>
            </form>
          </div>

          <div className="flex flex-col items-center justify-center p-6 md:p-12 w-full md:w-1/2 bg-white text-center">
            <h2 className="text-3xl md:text-6xl text-[#00204A] mb-4 md:mb-6">
              <strong>Bienvenidos de</strong> <br />
              <strong>nuevo a</strong> <br />
            </h2>
            <img
              src="/LogoColor.svg"
              alt="Logo Color"
              className="w-[250px] md:w-[450px] h-auto mt-0 md:mt-0" // Cambia mt-2 a mt-0
            />

            <p className="text-2xl mb-2 text-center">
              MTIS es una plataforma de
            </p>
            <p className="text-2xl mb-2 text-center">
              gestionamiento de proyectos
            </p>

            <div className="flex justify-center mt-4">
              <a className="text-black mb-4 md:mb-6">
                <strong>¿Ya tienes cuenta? Inicia sesión ahora.</strong>
              </a>
            </div>
            <button
              type="submit"
              onClick={handleCancel}
              className="p-2 md:p-3 bg-[#3684DB] text-white rounded-lg text-base md:text-lg w-2/3 md:w-1/3 transition-transform duration-200"
            >
              Iniciar Sesión
            </button>
          </div>
        </div>
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
            <div className="bg-[#B3D6F9] p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-bold mb-4">Registro Exitoso</h3>
              <p className="mb-4">
                Tu registro se ha realizado exitosamente. Ahora puedes iniciar
                sesión.
              </p>
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleModalClose}
                  className="p-3 bg-[#00204A] text-white rounded-lg transition-transform duration-200"
                >
                  Aceptar
                </button>
              </div>
            </div>
          </div>
        )}{" "}
        {/* Modal de Cancelación */}
        {showCancelModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-[#fdfdfd] p-0 rounded-lg shadow-lg w-1/3">
              {" "}
              {/* Color de fondo del modal */}
              <div className="bg-[#3684DB] p-4 rounded-t-lg">
                {" "}
                {/* Encabezado del modal */}
                <h3 className="text-lg font-bold text-white text-center">
                  Confirmar Cancelación
                </h3>
              </div>
              <div className="p-6">
                {" "}
                {/* Espacio interno del modal */}
                <p className="mb-4">
                  ¿Estás seguro de que deseas cancelar? Los datos ingresados se
                  perderán.
                </p>
                <div className="flex justify-around">
                  <button
                    onClick={() => handleCancelModalClose(true)}
                    className="p-3 bg-[#031930] text-white rounded-lg transition-transform duration-200"
                  >
                    Sí, cancelar
                  </button>
                  <button
                    onClick={() => handleCancelModalClose(false)}
                    className="p-3 bg-[#031930] text-white rounded-lg transition-transform duration-200"
                  >
                    No, continuar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default RegistroDocentes;
