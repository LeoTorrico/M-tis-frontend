import React, { useState } from 'react';

const Clases = () => {
  const [mostrarBoton, setMostrarBoton] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nombreClase, setNombreClase] = useState('');
  const [gestion, setGestion] = useState('');
  const [clases, setClases] = useState([]);

  const handleMostrarBoton = () => {
    setMostrarBoton(true);
  };

  const handleAbrirModal = () => {
    setMostrarModal(true);
  };

  const handleCerrarModal = () => {
    setMostrarModal(false);
  };

  const handleCrearClase = () => {
    if (nombreClase.trim() !== '' && gestion.trim() !== '') {
      setClases([...clases, { nombreClase, gestion }]);
      setNombreClase('');
      setGestion('');
      setMostrarModal(false);
    }
  };

  return (
    <div className="h-screen bg-gray-50 p-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">Clases</h1>
        {!mostrarBoton && (
          <button onClick={handleMostrarBoton} className="bg-blue-800 text-white font-bold py-2 px-4 rounded-full">
            +
          </button>
        )}
        {mostrarBoton && (
          <button onClick={handleAbrirModal} className="bg-blue-800 text-white font-bold py-2 px-4 rounded">
            Crear clase
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clases.map((clase, index) => (
          <div key={index} className="bg-blue-800 text-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-2">{clase.nombreClase}</h2>
            <p className="text-sm mb-4">{clase.gestion}</p>
            <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
              <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '75%' }}></div>
            </div>
            <button className="bg-blue-700 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded">
              Ver clase
            </button>
          </div>
        ))}
      </div>

      {mostrarModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Crear clase</h2>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Nombre de la clase*</label>
              <input type="text" className="w-full p-2 border border-gray-300 rounded-lg" placeholder="Introduce el nombre de la clase" value={nombreClase} onChange={(e) => setNombreClase(e.target.value)} />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Gestión*</label>
              <input type="text" className="w-full p-2 border border-gray-300 rounded-lg" placeholder="Introduce la gestión" value={gestion} onChange={(e) => setGestion(e.target.value)} />
            </div>
            <div className="flex justify-between">
              <button onClick={handleCerrarModal} className="bg-gray-400 text-white font-bold py-2 px-4 rounded">
                Cancelar
              </button>
              <button onClick={handleCrearClase} className="bg-blue-800 text-white font-bold py-2 px-4 rounded">
                Crear clase
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clases;
