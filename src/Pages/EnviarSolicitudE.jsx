import React, { useState } from 'react';
import axios from 'axios';

function EnviarSolicitudE() {
  const [email, setEmail] = useState('');
  const [codigoSis, setCodigoSis] = useState(''); // Estado para el código SIS
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Enviar tanto el correo como el código SIS al backend
      const response = await axios.post('http://localhost:3000/email/enviar-correo-restablecer', { 
        correo: email,  // Enviar el correo electrónico
        codigoSis       // Enviar el código SIS
      });
      setMessage(response.data.message); // Manejar el mensaje de éxito
      setError('');
    } catch (err) {
      setError('Error al enviar el correo de restablecimiento.');
      setMessage('');
    }
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
      {message && <p className="text-green-500 mt-4">{message}</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}

export default EnviarSolicitudE;
