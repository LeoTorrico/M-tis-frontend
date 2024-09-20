import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Importar Axios para realizar la solicitud HTTP
import logo from '../../assets/images/logo.png';
import logoGrande from '../../assets/images/logo-grande.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Importar los íconos

function RegistroEstudiante() {
  const [formData, setFormData] = useState({
    codigo_sis: '', // Cambiado de codigoSIS a codigo_sis
    nombres: '',    // Cambiado de nombre a nombres
    apellidos: '',
    correo: '',
    contraseña: ''
  });
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar contraseña
  const navigate = useNavigate(); // Hook de navegación

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Alternar entre mostrar y ocultar la contraseña
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validar formulario
    const newErrors = {};
    if (!formData.nombres || formData.nombres.length < 3 || formData.nombres.length > 60 || /[^a-zA-Z\s']/.test(formData.nombres)) {
      newErrors.nombres = 'Nombre debe tener entre 3 y 60 caracteres y solo contener letras, espacios y apóstrofes.';
    }
    if (!formData.apellidos || formData.apellidos.length < 3 || formData.apellidos.length > 80 || /[^a-zA-Z\s']/.test(formData.apellidos)) {
      newErrors.apellidos = 'Apellidos debe tener entre 3 y 80 caracteres y solo contener letras, espacios y apóstrofes.';
    }
    if (!formData.codigo_sis || formData.codigo_sis.length < 6 || formData.codigo_sis.length > 10) {
      newErrors.codigo_sis = 'Código SIS debe tener entre 6 y 10 caracteres.';
    }
    if (!formData.correo || !/^[\w-.]+@est\.umss\.edu$/.test(formData.correo)) {
      newErrors.correo = 'Correo debe seguir el formato: [códigoSIS]@umss.edu.bo';
    }
    if (!formData.contraseña || formData.contraseña.length < 12 || formData.contraseña.length > 30 || !/[A-Z]/.test(formData.contraseña) || !/[a-z]/.test(formData.contraseña)) {
      newErrors.contraseña = 'Contraseña debe tener entre 12 y 30 caracteres, y contener mayúsculas y minúsculas.';
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        // Enviar los datos al backend usando Axios
        const response = await axios.post('http://localhost:4000/estudiantes/registro', formData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        // Mostrar modal de éxito si el registro fue exitoso
        if (response.status === 201) {
          setShowModal(true);
        }
      } catch (error) {
        // Mostrar errores del backend (por ejemplo, si el correo ya está registrado)
        if (error.response && error.response.data) {
          setErrors({ api: error.response.data.detalle || 'Error al registrar el estudiante' });
        }
      }
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    navigate('/iniciar-sesion'); // Redirigir al inicio de sesión
  };

  const handleCancel = () => {
    if (Object.values(formData).some(val => val !== '')) {
      setShowCancelModal(true); // Mostrar modal de confirmación
    } else {
      navigate('/iniciar-sesion');
    }
  };

  const handleCancelModalClose = (confirm) => {
    if (confirm) {
      navigate('/iniciar-sesion');
    } else {
      setShowCancelModal(false); // Cerrar modal sin redirigir
    }
  };

  return (
    <div className="h-screen overflow-hidden">
      {/* Barra superior */}
      <header className="flex justify-between items-center p-4 bg-[#00204A] text-white shadow-lg">
        <div className="logo">
          <img src={logo} alt="Logo MTIS" className="h-12" />
        </div>
        <nav className="flex gap-6">
          <a href="#estudiantes" className="text-white text-lg font-bold hover:text-[#A9CCE3]" aria-label="Sección Estudiantes">Estudiantes</a>
          <a href="#docentes" className="text-white text-lg font-bold hover:text-[#A9CCE3]" aria-label="Sección Docentes">Docentes</a>
        </nav>
      </header>

      {/* Contenedor principal */}
      <div className="flex h-full">
        {/* Contenedor izquierdo (formulario) */}
        <div className="flex flex-col justify-start p-12 w-[48%] bg-[#3684DB] text-white rounded-r-[250px]">
          <h2 className="text-2xl mb-6 font-bold text-center">Registro Estudiantes</h2>
          <form onSubmit={handleSubmit}>
            <div className="relative mb-4">
              <label htmlFor="codigo_sis" className="block font-bold mb-2">Código SIS*</label>
              <input id="codigo_sis" type="text" value={formData.codigo_sis} onChange={handleChange} placeholder="Ingrese su código SIS" required className="w-[90%] py-2 px-3 border-none rounded-full text-base text-black bg-white shadow-md" />
              {errors.codigo_sis && <div className="text-red-500 text-sm">{errors.codigo_sis}</div>}
            </div>

            <div className="relative mb-4">
              <label htmlFor="nombres" className="block font-bold mb-2">Nombre(s)*</label>
              <input id="nombres" type="text" value={formData.nombres} onChange={handleChange} placeholder="Ingrese su nombre(s)" required className="w-[90%] py-2 px-3 border-none rounded-full text-base text-black bg-white shadow-md" />
              {errors.nombres && <div className="text-red-500 text-sm">{errors.nombres}</div>}
            </div>

            <div className="relative mb-4">
              <label htmlFor="apellidos" className="block font-bold mb-2">Apellidos*</label>
              <input id="apellidos" type="text" value={formData.apellidos} onChange={handleChange} placeholder="Ingrese sus apellidos" required className="w-[90%] py-2 px-3 border-none rounded-full text-base text-black bg-white shadow-md" />
              {errors.apellidos && <div className="text-red-500 text-sm">{errors.apellidos}</div>}
            </div>

            <div className="relative mb-4">
              <label htmlFor="correo" className="block font-bold mb-2">Correo Electrónico*</label>
              <input id="correo" type="email" value={formData.correo} onChange={handleChange} placeholder="Ingrese su correo institucional" required className="w-[90%] py-2 px-3 border-none rounded-full text-base text-black bg-white shadow-md" />
              {errors.correo && <div className="text-red-500 text-sm">{errors.correo}</div>}
            </div>

            <div className="relative mb-4">
              <label htmlFor="contraseña" className="block font-bold mb-2">Contraseña*</label>
              <input
                id="contraseña"
                type={showPassword ? "text" : "password"} // Cambiar entre 'text' y 'password' según el estado
                value={formData.contraseña}
                onChange={handleChange}
                placeholder="Ingrese su contraseña"
                required
                className="w-[90%] py-2 px-3 border-none rounded-full text-base text-black bg-white shadow-md"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility} // Alternar visibilidad
                className="absolute right-20 top-11 text-gray-500" // Ajustar el estilo para posicionar el botón al lado del input
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Ícono que cambia según el estado */}
              </button>
              {errors.contraseña && <div className="text-red-500 text-sm">{errors.contraseña}</div>}
            </div>

            {errors.api && <div className="text-red-500 text-sm">{errors.api}</div>} {/* Error del backend */}

            <div className="flex flex-col items-center">
              <button type="submit" className="p-3 bg-[#00204A] text-white rounded-lg text-base w-1/3 mt-8 transition-transform duration-200 hover:bg-[#001737] hover:-translate-y-1 hover:shadow-lg">
                Registrarse
              </button>
            </div>
          </form>
        </div>

        {/* Contenedor derecho */}
        <div className="flex flex-col items-center justify-center p-12 w-[50%] bg-white text-center">
          <h2 className="text-6xl text-[#00204A] mb-6 -mt-16">
            <strong>Bienvenidos de</strong> <br />
            <strong>nuevo a</strong> <br />
          </h2>
          <img src={logoGrande} alt="Logo Grande" className="w-[350px] h-auto mt-110" /> {/* Logo más grande */}
          <p className="text-lg text-gray-800 mb-8">
            Regístrate en MTIS y comienza a gestionar tus proyectos de forma eficiente. Únete a una plataforma diseñada para facilitar la colaboración y el seguimiento en tiempo real.
          </p>
          <a href="/iniciar-sesion" className="text-black underline mb-6"><strong>¿Ya tienes cuenta? Inicia sesión ahora.</strong></a>
          <button onClick={handleCancel} className="p-3 bg-[#3684DB] text-white rounded-lg text-lg w-1/3 transition-transform duration-200 hover:bg-[#2a6ab1] hover:-translate-y-1 hover:shadow-lg">
            Iniciar Sesión
          </button>
        </div>
      </div>

      {/* Modal de éxito */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 text-center">
            <h3 className="text-lg font-bold mb-4">Registro Exitoso</h3>
            <p className="mb-4">Tu registro se ha completado exitosamente. Ahora puedes iniciar sesión.</p>
            <button onClick={handleModalClose} className="p-3 bg-[#00204A] text-white rounded-lg transition-transform duration-200 hover:bg-[#001737] hover:-translate-y-1 hover:shadow-lg">
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
            <p className="mb-4">¿Estás seguro de que deseas cancelar? Los datos ingresados se perderán.</p>
            <div className="flex justify-around">
              <button onClick={() => handleCancelModalClose(true)} className="p-3 bg-[#E74C3C] text-white rounded-lg transition-transform duration-200 hover:bg-[#c0392b] hover:-translate-y-1 hover:shadow-lg">
                Sí, cancelar
              </button>
              <button onClick={() => handleCancelModalClose(false)} className="p-3 bg-[#2ECC71] text-white rounded-lg transition-transform duration-200 hover:bg-[#27ae60] hover:-translate-y-1 hover:shadow-lg">
                No, continuar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RegistroEstudiante;
