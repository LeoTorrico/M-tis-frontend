import React, { useState } from 'react';
import axios from 'axios';

function EnviarSolicitud() {
  const [email, setEmail] = useState('');
  const [rol, setRol] = useState('Estudiante'); 
  const [error, setError] = useState('');
  const [mensajeExitoso, setMensajeExitoso] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://backend-tis-silk.vercel.app/email/enviar-correo-restablecer', { 
        correo: email,  
        rol       
      });

      setError(''); 
      setMensajeExitoso('Correo enviado exitosamente. Revisa tu bandeja de entrada.'); 
    } catch (err) {
      setError('Error al enviar el correo de restablecimiento.');
      setMensajeExitoso(''); 
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-200">
      <div className='relative'>
        <div className="absolute top-[10px] left-1/2 transform -translate-x-1/2 w-36 h-36 flex items-center justify-center rounded-full bg-gray-200">
          <div className="w-32 h-32 flex items-center justify-center rounded-full bg-white border-2 border-shadow-custom">
            <img src="/LogoMTis.svg" alt="Logo Color" className="w-28 h-26" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-16 rounded-xl shadow-custom mt-20">
          <div className="mb-4 mt-10">
            <h1 className="text-2xl font-Montserrat font-bold mb-4">Enviar Solicitud de Restablecimiento</h1>
            <p className="text-sm font-Montserrat font-medium max-w-md mx-auto mb-4">Introduzca el email asociado a la cuenta y te 
              enviaremos las instrucciones para restablecer tu contraseña, revise su bandeja de correos.
            </p>
            <label htmlFor="email" className="block text-gray-700 font-Montserrat font-bold text-sm">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-2 rounded-lg w-full py-2 px-3 text-gray-700"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-Montserrat font-bold text-sm">Selecciona tu rol</label>
            <div className="flex justify-center items-left">
              <input
                type="radio"
                id="estudiante"
                name="rol"
                value="Estudiante"
                checked={rol === 'Estudiante'}
                onChange={(e) => setRol(e.target.value)}
                className="mr-2"
              />
              <label htmlFor="estudiante" className="mr-4">Estudiante</label>
              <input
                type="radio"
                id="docente"
                name="rol"
                value="Docente"
                checked={rol === 'Docente'}
                onChange={(e) => setRol(e.target.value)}
                className="mr-2"
              />
              <label htmlFor="docente">Docente</label>
            </div>
          </div>

          <div className="flex justify-center mt-4">
            <button type="submit" className="bg-sky-blue text-white text-sm font-Montserrat font-bold py-2 px-4 rounded">Enviar Correo</button>
          </div>

          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
          {mensajeExitoso && <p className="text-green-500 mt-4 text-center font-Montserrat font-medium">{mensajeExitoso}</p>}

        </form>
      </div>
    </div>
  );
}

export default EnviarSolicitud;
