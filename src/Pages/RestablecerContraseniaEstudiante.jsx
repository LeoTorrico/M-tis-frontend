import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function RestablecerContraseniaEstudiante() {
  const { token } = useParams(); // Captura el token desde la URL
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (nuevaContrasena !== confirmarContrasena) {
      setError('Las contraseñas no coinciden.');
      setMensaje('');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/estudiantes/cambiar-password', {
        token,
        nuevaContrasena,
      });
      setMensaje(response.data.message);
      setError('');
    } catch (err) {
      setError('Error al restablecer la contraseña. Por favor, intenta nuevamente.');
      setMensaje('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Restablecer Contraseña</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <div className="mb-4">
          <label htmlFor="nuevaContrasena" className="block text-gray-700">Nueva Contraseña</label>
          <input
            type="password"
            id="nuevaContrasena"
            value={nuevaContrasena}
            onChange={(e) => setNuevaContrasena(e.target.value)}
            required
            className="border rounded w-full py-2 px-3 text-gray-700"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="confirmarContrasena" className="block text-gray-700">Confirmar Nueva Contraseña</label>
          <input
            type="password"
            id="confirmarContrasena"
            value={confirmarContrasena}
            onChange={(e) => setConfirmarContrasena(e.target.value)}
            required
            className="border rounded w-full py-2 px-3 text-gray-700"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">Restablecer Contraseña</button>
      </form>
      {mensaje && <p className="text-green-500 mt-4">{mensaje}</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}

export default RestablecerContraseniaEstudiante;
