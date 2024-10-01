import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

function EnviarSolicitud() {
  const [email, setEmail] = useState('');
  const [rol, setRol] = useState('Estudiante'); 
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/email/enviar-correo-restablecer', { 
        correo: email,  
        rol       
      });

      setIsModalOpen(true); 
      setError('');

    } catch (err) {
      setError('Error al enviar el correo de restablecimiento.');
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false); 
    navigate('/LoginEstudiantes'); 
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-200">
      <div className='relative'>
        <div className="absolute top-[10px] left-1/2 transform -translate-x-1/2 w-32 h-32 flex items-center justify-center rounded-full bg-white border-2 border-dark-blue">
          <img src="/LogoMTis.svg" alt="Logo Color" className="w-28 h-26" />
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-16 rounded-xl shadow-custom mt-20">
          <div className="mb-4">
            <h1 className="text-2xl font-bold mb-4">Enviar Solicitud de Restablecimiento</h1>
            <label htmlFor="email" className="block text-gray-700">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border rounded w-full py-2 px-3 text-gray-700"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-left">Selecciona tu rol</label>
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
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">Enviar Correo</button>
          </div>
        </form>
        
        {error && <p className="text-red-500 mt-4">{error}</p>}

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-md w-80">
              <h2 className="text-lg font-bold mb-4">Éxito</h2>
              <p>Correo enviado exitosamente. Revise su bandeja de GMAIL.</p>
              <button onClick={handleModalClose} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">Aceptar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EnviarSolicitud;
