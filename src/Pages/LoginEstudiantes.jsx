import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function LoginEstudiantes() {
  const [formState, setFormState] = useState({
    codsis:'',
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted', formState);
  };

  return (
    <div className="flex h-[calc(100vh-5rem)]">
      {/* Formulario a la izquierda */}
      <div className="flex-1 bg-white flex flex-col justify-center items-center p-12 mt-6">
        <div className='flex flex-col w-2/3'>      
        <h1 className="text-5xl font-bold mb-2">Bienvenidos a</h1>
        <img src="/LogoColor.svg" alt="Logo Color" className="w-full h-full" />
        <p className="text-xl mb-2 text-center">MTIS es la plataforma de gestión de proyectos para organizar, colaborar y seguir el progreso en tiempo real. Inicia sesión y optimiza tus proyectos de manera eficiente y segura.</p>

        <div className="flex justify-center mt-4">
              <a href="#" className="text-black text-sm font-Montserrat font-bold">
              ¿No tienes cuenta aun? Registrate ahora
              </a>
            </div>

          <button
            type="submit"
            className="flex justify-center w-1/3 mx-auto bg-dark-blue text-white py-2 rounded-lg mt-4"
          >
            Registrarse
          </button>
          </div>


      </div>

      {/* Contenido derecha */}
      <div className="flex-1 bg-sky-blue text-white flex flex-col justify-center p-12 rounded-tl-custom-sm rounded-bl-custom-md">
      <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto">
          <h2 className="text-2xl font-Montserrat text-center font-bold mb-6">Inicio Sesión Estudiantes</h2>

          <div className="mb-4">
          <label 
             className="block text-white text-sm font-Montserrat font-bold mb-2"
          >
             Código SIS*
          </label>

            <input
              type="text"
              name="codsis"
              placeholder="Codigo SIS"
              value={formState.codsis}
              onChange={handleInputChange}
              required
              className="w-full px-2 py-2 text-black border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
          <label 
             className="block text-white text-sm font-Montserrat font-bold mb-2"
          >
             Correo Electrónico*
          </label>

            <input
              type="email"
              name="email"
              placeholder="Correo Electrónico"
              value={formState.email}
              onChange={handleInputChange}
              required
              className="w-full px-2 py-2 text-black border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6 relative">
            <label className="block text-white text-sm font-Montserrat font-bold mb-2">
              Contraseña*
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Contraseña"
              value={formState.password}
              onChange={handleInputChange}
              required
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

            <div className="flex justify-end mt-2">
              <a href="#" className="text-white text-xs font-Montserrat font-bold">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>

          <button
            type="submit"
            className="flex justify-center w-1/3 mx-auto bg-dark-blue text-white py-2 rounded-lg"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginEstudiantes;