import React, { useState } from 'react';

const Clases = () => {
  // Estado para controlar la visibilidad del botón "Crear clase"
  const [mostrarBoton, setMostrarBoton] = useState(false);

  // Función para manejar el clic en el ícono "+"
  const handleMostrarBoton = () => {
    setMostrarBoton(true); // Mostrar el botón al hacer clic en "+"
  };

  return (
    <div className="flex-1 p-10 bg-gray-100">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">Clases</h1>

        {/* Ícono "+" */}
        {!mostrarBoton && (
          <button
            onClick={handleMostrarBoton}
            className="bg-blue-900 text-white font-bold py-2 px-4 rounded-full"
          >
            +
          </button>
        )}

        {/* Botón "Crear clase" que se muestra después de presionar "+" */}
        {mostrarBoton && (
          <button className="bg-blue-900 text-white font-bold py-2 px-4 rounded">
            Crear clase
          </button>
        )}
      </div>

      {/* Class card */}
      <div className="flex justify-center">
        <div className="bg-blue-900 text-white p-5 rounded-lg w-80 relative shadow-lg">
          <h2 className="text-lg font-semibold mb-2">Taller de Ingeniería de Software</h2>
          <p className="text-sm mb-4">David Escalera Fernandez<br />II-2024</p>
          <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
            <div className="bg-blue-500 h-2.5 rounded-full w-3/4"></div>
          </div>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Ver clase
          </button>
          <div className="absolute top-2 right-2">
            <button className="text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 12a.75.75 0 010-1.5h10.5a.75.75 0 010 1.5H6.75zM6.75 9a.75.75 0 010-1.5h10.5a.75.75 0 010 1.5H6.75zM6.75 15a.75.75 0 010-1.5h10.5a.75.75 0 010 1.5H6.75z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clases;
