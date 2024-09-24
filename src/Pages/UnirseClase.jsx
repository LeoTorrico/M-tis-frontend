import React, { useState } from 'react';

const UnirseClase = () => {
  const [mostrarBotonUnirse, setMostrarBotonUnirse] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [codigoClase, setCodigoClase] = useState('');
  const [clases, setClases] = useState([]);

  const handleMostrarBotonUnirse = () => {
    setMostrarBotonUnirse(true);
  };

  const handleAbrirModal = () => {
    setMostrarModal(true);
  };

  const handleCerrarModal = () => {
    setMostrarModal(false);
    setMostrarBotonUnirse(false); // Vuelve al estado original mostrando solo el botón "+"
  };

  const handleUnirseClase = () => {
    if (codigoClase.trim() !== '') {
      // Datos de la clase a añadir
      const nuevaClase = {
        nombreClase: 'Taller de Ingeniería de Software',
        gestion: '2-2024',
        codigoClase,
      };
      setClases([...clases, nuevaClase]);
      setCodigoClase('');
      setMostrarModal(false);
      setMostrarBotonUnirse(false); // Vuelve al estado original después de unirse a la clase
    }
  };

  // Verifica si el campo está completo para habilitar el botón
  const isFormValid = codigoClase.trim() !== '';

  return (
    <div className="h-screen bg-gray-50 p-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">Clases</h1>
        <div className="flex space-x-4">
          {/* Botón "+" */}
          {!mostrarBotonUnirse && (
            <button
              onClick={handleMostrarBotonUnirse}
              className="bg-dark-blue text-white font-bold py-2 px-4 rounded-full hover:bg-light-blue"
            >
              +
            </button>
          )}
          {/* Botón "Unirse a clase" aparece al presionar "+" */}
          {mostrarBotonUnirse && (
            <button
              onClick={handleAbrirModal}
              className="bg-dark-blue text-white font-bold py-2 px-4 rounded hover:bg-light-blue"
            >
              Unirse a clase
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clases.map((clase, index) => (
          <div
            key={index}
            className="bg-dark-blue text-white p-6 rounded-lg shadow-lg"
          >
            <h2 className="text-xl font-semibold mb-2">{clase.nombreClase}</h2>
            <p className="text-sm mb-4">{clase.gestion}</p>
            <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
              <div
                className="bg-blue-500 h-2.5 rounded-full"
                style={{ width: '75%' }}
              ></div>
            </div>
            <p className="text-sm mb-4">Código: {clase.codigoClase}</p>
            <button className="bg-blue-700 hover:bg-light-blue text-white font-bold py-2 px-4 rounded">
              Ver clase
            </button>
          </div>
        ))}
      </div>

      {mostrarModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Unirse a clase</h2>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">
                Código de clase*
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Introduce el código de la clase"
                value={codigoClase}
                onChange={(e) => setCodigoClase(e.target.value)}
              />
            </div>
            <div className="flex justify-between space-x-4">
              <button
                onClick={handleCerrarModal}
                className="bg-dark-blue text-white font-bold py-2 px-4 rounded w-full hover:bg-light-blue"
              >
                Cancelar
              </button>
              <button
                onClick={handleUnirseClase}
                className={`${
                  isFormValid ? 'bg-dark-blue hover:bg-light-blue' : 'bg-gray-400 cursor-not-allowed'
                } text-white font-bold py-2 px-4 rounded w-full`}
                disabled={!isFormValid}
              >
                Unirse a clase
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnirseClase;
