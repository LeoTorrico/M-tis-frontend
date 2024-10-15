import React, { useState } from "react";
import { MdGroups } from "react-icons/md"; 

const TrabajoGrupo = ({ evaluacion }) => {
  // Estado para los grupos
  const [grupos] = useState([
    { nombre: "Grupo 1", entregado: true, logotipo: null, nombre_largo: "Grupo de Desarrollo" },
    { nombre: "Grupo 2", entregado: false, logotipo: null, nombre_largo: "Grupo de Diseño" },
    { nombre: "Grupo 3", entregado: true, logotipo: null, nombre_largo: "Grupo de Marketing" },
    { nombre: "Grupo 4", entregado: false, logotipo: null, nombre_largo: "Grupo de Investigación" },
    { nombre: "Grupo 5", entregado: true, logotipo: null, nombre_largo: "Grupo de Ciencia" },
    { nombre: "Grupo 6", entregado: false, logotipo: null, nombre_largo: "Grupo de Historia" },
    { nombre: "Grupo 7", entregado: true, logotipo: null, nombre_largo: "Grupo de Literatura" },
    { nombre: "Grupo 8", entregado: false, logotipo: null, nombre_largo: "Grupo de Música" },
  ]);

  const [search1, setSearch1] = useState("");
  const [search2, setSearch2] = useState("");

  // Filtrar grupos por búsqueda
  const filteredGrupos1 = grupos.filter((grupo) =>
    grupo.nombre.toLowerCase().includes(search1.toLowerCase())
  );

  const filteredGrupos2 = grupos.filter((grupo) =>
    grupo.nombre.toLowerCase().includes(search2.toLowerCase())
  );

  return (
    <div className="p-6 h-screen flex flex-col" style={{ maxHeight: 'calc(100vh - 60px)' }}>
      <h2 className="text-xl font-bold mb-4">{evaluacion.evaluacion}</h2>
      <p className="mb-4">Aquí están los detalles del trabajo grupal para esta evaluación.</p>

      {/* Contenedor principal para columnas */}
      <div className="flex-grow flex overflow-hidden">
        {/* Primer contenedor de búsqueda */}
        <div className="border p-4 rounded-lg shadow flex flex-col w-full mr-2">
          <h3 className="font-bold mb-2">Buscar Grupos - Columna 1</h3>
          <input
            type="text"
            placeholder="Buscar grupo..."
            value={search1}
            onChange={(e) => setSearch1(e.target.value)}
            className="border rounded p-2 w-full mb-4"
          />
          <div className="flex-grow overflow-y-auto" style={{ maxHeight: 'calc(100vh - 150px)' }}>
            {filteredGrupos1.length > 0 ? (
              filteredGrupos1.map((grupo, index) => (
                <div
                  key={index}
                  className="bg-light-blue rounded-lg p-4 flex justify-between items-center mb-4"
                >
                  <div className="flex items-center">
                    {grupo.logotipo ? (
                      <img
                        src={`data:image/png;base64,${grupo.logotipo}`}
                        alt={grupo.nombre_largo}
                        className="w-16 h-16 rounded-full object-cover mr-4"
                      />
                    ) : (
                      <span className="bg-white p-2 rounded-full text-semi-blue mr-4">
                        <MdGroups size={32} />
                      </span>
                    )}
                    <span className="text-lg font-medium">{grupo.nombre_largo}</span>
                  </div>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded">
                    Evaluar
                  </button>
                </div>
              ))
            ) : (
              <p>No se encontraron grupos.</p>
            )}
          </div>
        </div>

        {/* Segundo contenedor de búsqueda */}
        <div className="border p-4 rounded-lg shadow flex flex-col w-full">
          <h3 className="font-bold mb-2">Buscar Grupos - Columna 2</h3>
          <input
            type="text"
            placeholder="Buscar grupo..."
            value={search2}
            onChange={(e) => setSearch2(e.target.value)}
            className="border rounded p-2 w-full mb-4"
          />
          <div className="flex-grow overflow-y-auto" style={{ maxHeight: 'calc(100vh - 150px)' }}>
            {filteredGrupos2.length > 0 ? (
              filteredGrupos2.map((grupo, index) => (
                <div
                  key={index}
                  className="bg-light-blue rounded-lg p-4 flex justify-between items-center mb-4"
                >
                  <div className="flex items-center">
                    {grupo.logotipo ? (
                      <img
                        src={`data:image/png;base64,${grupo.logotipo}`}
                        alt={grupo.nombre_largo}
                        className="w-16 h-16 rounded-full object-cover mr-4"
                      />
                    ) : (
                      <span className="bg-white p-2 rounded-full text-semi-blue mr-4">
                        <MdGroups size={32} />
                      </span>
                    )}
                    <span className="text-lg font-medium">{grupo.nombre_largo}</span>
                  </div>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded">
                    Evaluar
                  </button>
                </div>
              ))
            ) : (
              <p>No se encontraron grupos.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrabajoGrupo;
