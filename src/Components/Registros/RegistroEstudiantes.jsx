import React from 'react';
import './RegistroEstudiantes.css'; // Estilos específicos para este archivo
import logo from '../../assets/images/logo.png';
import logoGrande from '../../assets/images/logo-grande.png';

function RegistroEstudiante() {
  return (
    <div>
      <header className="header">
        <div className="logo">
          <img src={logo} alt="Logo MTIS" className="logo-image" />
        </div>
        <nav className="nav-links">
          <a href="#estudiantes" className="nav-link" aria-label="Sección Estudiantes">Estudiantes</a>
          <a href="#docentes" className="nav-link" aria-label="Sección Docentes">Docentes</a>
        </nav>
      </header>

      <div className="main-container">
        <div className="left-container">
          <h2>Registro Estudiantes</h2>
          <form>
            <div className="input-group">
              <label htmlFor="codigoSIS">Código SIS*</label>
              <input id="codigoSIS" type="text" placeholder="Ingrese su código SIS" required />
            </div>

            <div className="input-group">
              <label htmlFor="nombre">Nombre(s)*</label>
              <input id="nombre" type="text" placeholder="Ingrese su nombre(s)" required />
            </div>

            <div className="input-group">
              <label htmlFor="apellidos">Apellidos*</label>
              <input id="apellidos" type="text" placeholder="Ingrese sus apellidos" required />
            </div>

            <div className="input-group">
              <label htmlFor="correo">Correo Electrónico*</label>
              <input id="correo" type="email" placeholder="Ingrese su correo institucional" required />
            </div>

            <div className="input-group">
              <label htmlFor="contraseña">Contraseña*</label>
              <input id="contraseña" type="password" placeholder="Ingrese su contraseña" required />
            </div>

            <button type="submit" className="btn-register">Registrarse</button>
          </form>
        </div>

        <div className="right-container">
          <h2 className="welcome-text">
            <strong>Bienvenidos de</strong> <br />
            <strong>nuevo a</strong> <br />
          </h2>
          <img src={logoGrande} alt="Logo Grande" className="logo-grande" />
          <p>
            Regístrate en MTIS y comienza a gestionar tus proyectos de forma eficiente. 
            Únete a una plataforma diseñada para facilitar la colaboración y el seguimiento en tiempo real.
          </p>
          <a href="#" className="login-link">¿Ya tienes cuenta? Inicia sesión ahora</a>
          <button className="btn-login">Iniciar Sesión</button>
        </div>
      </div>
    </div>
  );
}

export default RegistroEstudiante;