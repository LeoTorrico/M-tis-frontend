import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
//import axios from "axios";
import logo from "../../assets/images/logo.png";
import logoGrande from "../../assets/images/logo-grande.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function RegistroDocentes() {
  const [formData, setFormData] = useState({
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
    if (!formData.correo || !/^[\w-.]+@umss\.edu$/.test(formData.correo)) {
      newErrors.correo = "El correo debe tener el formato correcto de la UMSS.";
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

      <div className="flex h-full">
        <div className="flex flex-col justify-start p-12 w-[48%] bg-[#3684DB] text-white rounded-r-[250px]">
          <h2 className="text-2xl mb-6 font-bold text-center">
            Registro Docentes
          </h2>
          <form onSubmit={handleSubmit}>
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
                <div className="text-red-500 text-sm">{errors.nombres}</div>
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
                <div className="text-red-500 text-sm">{errors.apellidos}</div>
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
                className="w-[90%] py-2 px-3 border-none rounded-full text-base text-black bg-white shadow-md"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-20 top-11 text-gray-500"
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
                className="p-3 bg-[#00204A] text-white rounded-lg text-base w-1/3 mt-70 transition-transform duration-200 hover:bg-[#001737] hover:-translate-y-1 hover:shadow-lg"
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
            src={logoGrande}
            alt="Logo Grande"
            className="w-[350px] h-auto mt-110"
          />
          <div className="max-w-full mx-auto px-32">
    <p className="text-4xl text-gray-800 mb-8 text-center whitespace-pre-wrap">
        MTIS es una plataforma de 
        gestionamiento de proyectos
    </p>
</div>


          <a href="/iniciar-sesion" className="text-black underline mb-6">
            <strong>¿Ya tienes cuenta? Inicia sesión ahora.</strong>
          </a>
          <button
            onClick={handleCancel}
            className="p-3 bg-[#3684DB] text-white rounded-lg text-lg w-1/3 transition-transform duration-200 hover:bg-[#2a6ab1] hover:-translate-y-1 hover:shadow-lg"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>

      {/* Modal de confirmación de registro */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Registro Exitoso</h3>
            <p className="mb-4">El docente ha sido registrado correctamente.</p>
            <button
              onClick={handleModalClose}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
            >
              Iniciar sesión
            </button>
          </div>
        </div>
      )}

      {/* Modal de confirmación de cancelar */}
      {showCancelModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">
              Confirmación de Cancelación
            </h3>
            <p className="mb-4">
              ¿Estás seguro de que deseas cancelar el registro?
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => handleCancelModalClose(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-700 mr-4"
              >
                No
              </button>
              <button
                onClick={() => handleCancelModalClose(true)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700"
              >
                Sí, cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RegistroDocentes;
