import React from 'react';
import logo from '../../assets/images/logo.png';
import logoGrande from '../../assets/images/logo-grande.png';

function RegistroEstudiante() {
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
          <form>
            <div className="relative mb-4">
              <label htmlFor="codigoSIS" className="block font-bold mb-2">Código SIS*</label>
              <input id="codigoSIS" type="text" placeholder="Ingrese su código SIS" required className="w-[90%] py-2 px-3 border-none rounded-full text-base text-black bg-white shadow-md"  />
            </div>

            <div className="relative mb-4">
              <label htmlFor="nombre" className="block font-bold mb-2">Nombre(s)*</label>
              <input id="nombre" type="text" placeholder="Ingrese su nombre(s)" required className="w-[90%] py-2 px-3 border-none rounded-full text-base text-black bg-white shadow-md"  />
            </div>

            <div className="relative mb-4">
              <label htmlFor="apellidos" className="block font-bold mb-2">Apellidos*</label>
              <input id="apellidos" type="text" placeholder="Ingrese sus apellidos" required className="w-[90%] py-2 px-3 border-none rounded-full text-base text-black bg-white shadow-md"  />
            </div>

            <div className="relative mb-4">
              <label htmlFor="correo" className="block font-bold mb-2">Correo Electrónico*</label>
              <input id="correo" type="email" placeholder="Ingrese su correo institucional" required className="w-[90%] py-2 px-3 border-none rounded-full text-base text-black bg-white shadow-md"  />
            </div>

            <div className="relative mb-4">
              <label htmlFor="contraseña" className="block font-bold mb-2">Contraseña*</label>
              <input id="contraseña" type="password" placeholder="Ingrese su contraseña" required className="w-[90%] py-2 px-3 border-none rounded-full text-base text-black bg-white shadow-md"  />
            </div>

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
          <a href="#" className="text-black underline mb-6"><strong>¿Ya tienes cuenta? Inicia sesión ahora.</strong></a>

          <button className="p-3 bg-[#3684DB] text-white rounded-lg text-lg w-1/3 transition-transform duration-200 hover:bg-[#001737] hover:-translate-y-1 hover:shadow-lg">
            Iniciar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegistroEstudiante;
