import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function LoginDocentes() {
  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [captchaValue, setCaptchaValue] = useState(null);
  const navigate = useNavigate();
  const [credentialError, setCredentialError] = useState("");
  const [showModal, setShowModal] = useState(false); // Estado para el modal
  const [resetEmail, setResetEmail] = useState(""); // Estado para el correo de recuperación
  const [resetError, setResetError] = useState(""); // Estado para los errores del modal

  const validateForm = () => {
    let newErrors = {};

    if (!formState.email) {
      newErrors.email = "El correo electrónico es obligatorio.";
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      newErrors.email = "El correo electrónico no es válido.";
    }

    if (!formState.password) {
      newErrors.password = "La contraseña es obligatoria.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });

    // Limpia el error
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }

    if (credentialError) {
      setCredentialError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    if (!captchaValue) {
      alert("Por favor, completa el CAPTCHA.");
      return;
    }
    try {
      const response = await axios.post("http://localhost:3000/login/docente", {
        password: formState.password,
        correo: formState.email,
      });

      console.log("Autenticación exitosa:", response.data);
      localStorage.setItem("token", response.data.docente.token);
      navigate("/Inicio");
    } catch (error) {
      console.error("Error al iniciar sesión", error);
      setCredentialError("Credenciales incorrectas.");
    }
  };

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  // Función para abrir el modal de restablecer contraseña
  const handleForgotPassword = () => {
    setShowModal(true);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setShowModal(false);
    setResetError("");
  };

  // Función para manejar el envío del formulario de restablecimiento
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!resetEmail) {
      setResetError("El correo electrónico es obligatorio.");
      return;
    }

    try {
      await axios.post("http://localhost:3000/reset-password", {
        email: resetEmail,
      });
      alert("Correo de restablecimiento enviado.");
      setShowModal(false);
    } catch (error) {
      setResetError("Error al enviar el correo de restablecimiento.");
    }
  };

  // Función para manejar el cambio del input del correo de recuperación
  const handleResetEmailChange = (e) => {
    setResetEmail(e.target.value);

    // Limpia el mensaje de error cuando el usuario escribe
    if (resetError) {
      setResetError("");
    }
  };

  return (
    <motion.div
      className="flex flex-col md:flex-row h-[calc(100vh-5rem)]"
      initial={{ opacity: 0, x: -100 }} // Animación inicial
      animate={{ opacity: 1, x: 0 }} // Animación de entrada
      exit={{ opacity: 0, x: 100 }} // Animación de salida
      transition={{ duration: 0.5 }} // Duración de la animación
    >
      <div className="flex h-full">
        {/* Formulario a la izquierda */}
        <div className="flex-1 bg-white flex flex-col justify-center items-center p-12 mt-6 md:mt-0">
          <div className="flex flex-col w-full md:w-2/3">
            <h1 className="text-5xl font-bold mb-2 text-center">
              Bienvenidos a
            </h1>
            <img
              src="/LogoColor.svg"
              alt="Logo Color"
              className="w-full h-auto"
            />
            <p className="text-xl mb-2 text-center">
              MTIS es la plataforma de gestión de proyectos para organizar,
              colaborar y seguir el progreso en tiempo real. Inicia sesión y
              optimiza tus proyectos de manera eficiente y segura.
            </p>

            <div className="flex justify-center mt-4">
              <a className="text-black text-sm font-Montserrat font-bold">
                ¿No tienes cuenta aun? Regístrate ahora
              </a>
            </div>

            <button
              type="submit"
              className="flex justify-center w-full md:w-1/3 mx-auto bg-dark-blue text-white py-2 rounded-lg mt-4"
              onClick={() => navigate("/RegistroDocentes")}
            >
              Registrarse
            </button>
          </div>
        </div>

        {/* Contenido derecha */}
        <div className="flex-1 bg-sky-blue text-white flex flex-col justify-center p-12 rounded-md md:rounded-tl-custom-md md:rounded-bl-custom-md">
          <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto">
            <h2 className="text-2xl font-Montserrat text-center font-bold mb-6">
              Inicio Sesión Docentes
            </h2>

            <div className="mb-4 relative">
              <label className="block text-white text-sm font-Montserrat font-bold mb-2">
                Correo Electrónico*
              </label>

              <input
                type="email"
                name="email"
                placeholder="Correo Electrónico"
                value={formState.email}
                onChange={handleInputChange}
                className="w-full px-2 py-2 text-black border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && (
                <div className="absolute top-1/2 right-0 mt-1 w-64 bg-white text-red-500 p-2 rounded-md shadow-lg text-sm border border-red-500">
                  <span>{errors.email}</span>
                  <div className="absolute top-0 right-4 transform -translate-y-full border-8 border-transparent border-b-red-500"></div>
                </div>
              )}
            </div>

            <div className="mb-6 relative">
              <label className="block text-white text-sm font-Montserrat font-bold mb-2">
                Contraseña*
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Contraseña"
                value={formState.password}
                onChange={handleInputChange}
                className="w-full px-2 py-2 text-black border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FaEyeSlash className="text-black" />
                ) : (
                  <FaEye className="text-black" />
                )}
              </button>
              {errors.password && (
                <div className="absolute top-1/2 right-0 mt-1 w-64 bg-white text-red-500 p-2 rounded-md shadow-lg text-sm border border-red-500">
                  <span>{errors.password}</span>
                  <div className="absolute top-0 right-4 transform -translate-y-full border-8 border-transparent border-b-red-500"></div>
                </div>
              )}
              <div className="flex justify-end mt-2">
                <a
                  href="EnviarSolicitud"
                  onClick={handleForgotPassword}
                  className="text-white text-sm font-Montserrat font-bold underline"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </div>

            {credentialError && (
              <div className="mb-4 w-full bg-white text-red-500 p-2 rounded-md text-sm border border-red-500 text-center">
                {credentialError}
              </div>
            )}
            <div className="flex mb-6 justify-center">
              <ReCAPTCHA
                sitekey="6LeW-EIqAAAAAKzpUQfxGq7wtwr-37KO-bpSA8lJ"
                onChange={handleCaptchaChange}
              />
            </div>
            <button
              type="submit"
              className="flex justify-center w-full md:w-1/3 mx-auto bg-dark-blue text-white py-2 rounded-lg mt-14"
            >
              Iniciar Sesión
            </button>
          </form>
        </div>

        {/* Modal de restablecer contraseña */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-md w-96">
              <h2 className="text-xl font-bold mb-4">Restablecer Contraseña</h2>
              <form onSubmit={handlePasswordReset}>
                <label className="block text-sm font-bold mb-2">
                  Ingresa tu correo electrónico
                </label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={handleResetEmailChange}
                  className="w-full px-2 py-2 text-black border border-gray-300 rounded-lg mb-4"
                  placeholder="Correo Electrónico"
                />
                {resetError && (
                  <div className="mb-4 text-red-500">{resetError}</div>
                )}
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded-md w-full"
                >
                  Enviar Correo de Restablecimiento
                </button>
              </form>
              <button
                onClick={handleCloseModal}
                className="mt-4 text-blue-500 underline"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default LoginDocentes;
