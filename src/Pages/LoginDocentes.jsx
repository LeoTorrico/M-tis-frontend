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
      const response = await axios.post("https://backend-tis-silk.vercel.app/login/docente", {
        password: formState.password,
        correo: formState.email,
        captchaToken: captchaValue
      });

      localStorage.setItem("token", response.data.docente.token);
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("Error al iniciar sesión", error);
      setCredentialError("Credenciales incorrectas.");
    }
  };

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  return (
    <motion.div
      className="flex flex-col md:flex-row h-[calc(100vh-5rem)]"
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex-1 bg-white flex flex-col justify-center items-center p-6 md:p-12 mt-6 md:mt-0">
        <div className="flex flex-col w-full md:w-2/3">
          <h1 className="text-5xl text-dark-blue font-bold mb-2 text-center">Bienvenidos a</h1>
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
              ¿No tienes cuenta aún? Regístrate ahora
            </a>
          </div>

          <button
            type="submit"
            className="flex justify-center w-full md:w-1/3 mx-auto bg-sky-blue text-white py-2 rounded-lg mt-4"
            onClick={() => navigate("/RegistroDocentes")}
          >
            Registrarse
          </button>
        </div>
      </div>

      <div className="flex-1 bg-sky-blue text-white flex flex-col justify-center p-6 md:p-12 rounded-none md:rounded-tl-custom-md md:rounded-bl-custom-md">
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
                href="/EnviarSolicitud"
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
              sitekey="6LeFdWsqAAAAAMBCYWmyLeFhaLCGtZRkJqCmFJ7G"
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
    </motion.div>
  );
}

export default LoginDocentes;
