import React, { useState, useEffect, useContext } from "react";
import { MdGroups } from "react-icons/md";
import { UserContext } from "../../context/UserContext";

const TrabajoGrupo = ({ evaluacion }) => {
  const [gruposEntregados, setGruposEntregados] = useState([]);
  const [search1, setSearch1] = useState("");
  const [search2, setSearch2] = useState("");
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchGrupos = async () => {
      try {
        const response = await fetch(
          `https://mtis.netlify.app/evaluaciones/${evaluacion.cod_evaluacion}/entregas`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Error en la petición");
        }
        const data = await response.json();
        console.log("Datos recibidos:", data); //Verifica los datos recibidos
        setGruposEntregados(data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los grupos:", error);
        setLoading(false);
      }
    };

    if (evaluacion && user.token) {
      fetchGrupos();
    }
  }, [evaluacion, user.token]);

  // Filtrar los grupos que han entregado
  const filteredGruposEntregados = gruposEntregados.filter(
    (grupo) => grupo.ha_entregado && grupo.nombre_largo.toLowerCase().includes(search1.toLowerCase())
  );

  // Filtrar los grupos que no han entregado
  const filteredGruposNoEntregados = gruposEntregados.filter(
    (grupo) => !grupo.ha_entregado && grupo.nombre_largo.toLowerCase().includes(search2.toLowerCase())
  );

  if (loading) {
    return <p>Cargando grupos...</p>;
  }

  return (
    <div className="p-6 h-screen flex flex-col" style={{ maxHeight: "calc(100vh - 60px)" }}>
      <h2 className="text-xl font-bold mb-4">{evaluacion.evaluacion}</h2>
      <p className="mb-4">Aquí están los detalles del trabajo grupal que entregaron para esta evaluación.</p>

      <div className="flex-grow flex overflow-hidden">
        <div className="border p-4 rounded-lg shadow flex flex-col w-full mr-2">
          <h3 className="font-bold mb-2">Grupos que entregaron</h3>
          <input
            type="text"
            placeholder="Buscar grupo..."
            value={search1}
            onChange={(e) => setSearch1(e.target.value)}
            className="border rounded p-2 w-full mb-4"
          />
          <div className="flex-grow overflow-y-auto" style={{ maxHeight: "calc(100vh - 150px)" }}>
            {filteredGruposEntregados.length > 0 ? (
              filteredGruposEntregados.map((grupo, index) => (
                <div key={index} className="bg-blue-gray rounded-lg p-4 flex justify-between items-center mb-4">
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
                  <button className="bg-dark-blue text-white px-4 py-2 rounded">Evaluar</button>
                </div>
              ))
            ) : (
              <p>No se encontraron grupos que hayan entregado.</p>
            )}
          </div>
        </div>

        <div className="border p-4 rounded-lg shadow flex flex-col w-full">
          <h3 className="font-bold mb-2">Grupos que no entregaron</h3>
          <input
            type="text"
            placeholder="Buscar grupo..."
            value={search2}
            onChange={(e) => setSearch2(e.target.value)}
            className="border rounded p-2 w-full mb-4"
          />
          <div className="flex-grow overflow-y-auto" style={{ maxHeight: "calc(100vh - 150px)" }}>
            {filteredGruposNoEntregados.length > 0 ? (
              filteredGruposNoEntregados.map((grupo, index) => (
                <div key={index} className="bg-blue-gray rounded-lg p-4 flex justify-between items-center mb-4">
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
                  <button className="bg-dark-blue text-white px-4 py-2 rounded">Evaluar</button>
                </div>
              ))
            ) : (
              <p>No se encontraron grupos que no hayan entregado.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrabajoGrupo;
