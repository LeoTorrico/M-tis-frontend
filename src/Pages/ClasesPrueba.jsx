import React, { useState } from 'react';

const ClasesPrueba = () => {
  const rol = 'estudiante'; // Asignar el rol directamente para pruebas
  const [mostrarBoton, setMostrarBoton] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nombreClase, setNombreClase] = useState('');
  const [gestion, setGestion] = useState('');
  const [codigoClase, setCodigoClase] = useState('');
  const [clases, setClases] = useState([]);

  const handleMostrarBoton = () => {
    setMostrarBoton(true);
  };

  const handleAbrirModal = () => {
    setMostrarModal(true);
  };

  const handleCerrarModal = () => {
    setMostrarModal(false);
    setMostrarBoton(false); // Vuelve al estado original
  };

  const handleCrearClase = () => {
    if (nombreClase.trim() !== '' && gestion.trim() !== '') {
      setClases([...clases, { nombreClase, gestion }]);
      setNombreClase('');
      setGestion('');
      setMostrarModal(false);
      setMostrarBoton(false);
    }
  };

  const handleUnirseClase = () => {
    if (codigoClase.trim() !== '') {
      const nuevaClase = {
        nombreClase: 'Taller de Ingeniería de Software', // Puedes personalizar el nombre
        gestion: '2-2024', // Puedes personalizar la gestión
      };
      setClases([...clases, nuevaClase]);
      setCodigoClase('');
      setMostrarModal(false);
      setMostrarBoton(false);
    }
  };

  // Verifica si los campos están completos para habilitar los botones
  const isFormValidCrear = nombreClase.trim() !== '' && gestion.trim() !== '';
  const isFormValidUnirse = codigoClase.trim() !== '';

  return (
    <div className="h-screen bg-gray-50 p-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">Clases</h1>
        <div className="flex space-x-4">
          {/* Botón "+" */}
          {!mostrarBoton && (
            <button
              onClick={handleMostrarBoton}
              className="bg-dark-blue text-white font-bold py-2 px-4 rounded-full hover:bg-light-blue"
            >
              +
            </button>
          )}
          {/* Botón para crear o unirse a clase */}
          {mostrarBoton && (
            <button
              onClick={handleAbrirModal}
              className="bg-dark-blue text-white font-bold py-2 px-4 rounded hover:bg-light-blue"
            >
              {rol === 'docente' ? 'Crear clase' : 'Unirse a clase'}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clases.map((clase, index) => (
          <div key={index} className="bg-dark-blue text-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-2">{clase.nombreClase || 'Clase no especificada'}</h2>
            <p className="text-sm mb-4">{clase.gestion || 'Gestión no especificada'}</p>
            <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
              <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '75%' }}></div>
            </div>
            <button className="bg-blue-700 hover:bg-light-blue text-white font-bold py-2 px-4 rounded">
              Ver clase
            </button>
          </div>
        ))}
      </div>

      {mostrarModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#B3D6F9] p-8 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{rol === 'docente' ? 'Crear clase' : 'Unirse a clase'}</h2>
            {rol === 'docente' ? (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-bold mb-2">Nombre de la clase*</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="Introduce el nombre de la clase"
                    value={nombreClase}
                    onChange={(e) => setNombreClase(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-bold mb-2">Gestión*</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="Introduce la gestión"
                    value={gestion}
                    onChange={(e) => setGestion(e.target.value)}
                  />
                </div>
                <div className="flex justify-between space-x-4">
                  <button
                    onClick={handleCrearClase}
                    className={`${
                      isFormValidCrear ? 'bg-dark-blue hover:bg-light-blue' : 'bg-gray-400 cursor-not-allowed'
                    } text-white font-bold py-2 px-4 rounded w-full`}
                    disabled={!isFormValidCrear}
                  >
                    Crear clase
                  </button>
                  <button onClick={handleCerrarModal} className="bg-dark-blue text-white font-bold py-2 px-4 rounded w-full hover:bg-light-blue">
                    Cancelar
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-bold mb-2">Código de clase*</label>
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
                    onClick={handleUnirseClase}
                    className={`${
                      isFormValidUnirse ? 'bg-dark-blue hover:bg-light-blue' : 'bg-gray-400 cursor-not-allowed'
                    } text-white font-bold py-2 px-4 rounded w-full`}
                    disabled={!isFormValidUnirse}
                  >
                    Unirse a clase
                  </button>
                  <button onClick={handleCerrarModal} className="bg-dark-blue text-white font-bold py-2 px-4 rounded w-full hover:bg-light-blue">
                    Cancelar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClasesPrueba;
