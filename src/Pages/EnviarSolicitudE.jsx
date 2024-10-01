import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importar el hook useNavigate

function EnviarSolicitudE() {
  const [email, setEmail] = useState('');
  const [codigoSis, setCodigoSis] = useState(''); 
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/email/enviar-correo-restablecer', { 
        correo: email,  
        codigoSis       
      });

      // Mostrar el modal con el mensaje de éxito
      setIsModalOpen(true); 
      setError('');

    } catch (err) {
      setError('Error al enviar el correo de restablecimiento.');
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false); // Cerrar el modal
    navigate('/LoginEstudiantes'); // Redirigir al Login Estudiantes
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Restablecer Contraseña</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <div className="mb-4">
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
        <div className="mb-4">
          <label htmlFor="codigoSis" className="block text-gray-700">Código SIS</label>
          <input
            type="text"
            id="codigoSis"
            value={codigoSis}
            onChange={(e) => setCodigoSis(e.target.value)}
            required
            className="border rounded w-full py-2 px-3 text-gray-700"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">Enviar Correo</button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* Modal para mostrar el mensaje de éxito */}
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
  );
}

export default EnviarSolicitudE;
