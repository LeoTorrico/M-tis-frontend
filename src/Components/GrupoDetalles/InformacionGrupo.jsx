import React, { useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import RegistroGrupo from "./RegistroGrupoModal"; // Asegúrate de importar el modal
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const InformacionGrupo = ({ grupo }) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para manejar la apertura del modal
  const { user } = useContext(UserContext); // Obtener el usuario desde el contexto
  const { cod_grupoempresa } = useParams();
  const [integrantes, setIntegrantes] = useState(grupo.integrantes);

  useEffect(() => {
    const fetchIntegrantes = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/grupos/grupo/${cod_grupoempresa}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        const data = await response.json();
        setIntegrantes(data.integrantes);
      } catch (error) {
        console.error("Error al cargar los integrantes de un grupo", error);
      }
    };

    fetchIntegrantes();
  }, [isModalOpen]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Verificar si el rol es "estudiante"
  const showAddButton = user.rol === "estudiante";

  return (
    <div>
      <div className="bg-semi-blue text-white p-6 rounded-lg m-4">
        <div className="flex items-center">
          <div className="mr-6">
            <img
              src={`data:image/png;base64,${grupo.logotipo}`}
              alt={grupo.nombre_largo}
              className="w-16 h-16 rounded-full object-cover mr-4"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{grupo.nombre_largo}</h1>
            <p className="text-xl">{grupo.nombre_corto}</p>
            <p className="text-xl">
              Horario: {grupo.horario.dia_horario} {grupo.horario.hora_inicio}-
              {grupo.horario.hora_fin}
            </p>
          </div>
        </div>
      </div>
      <div className="p-4 relative">
        <div className="p-6 bg-light-blue rounded-lg shadow-md w-full">
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto bg-white rounded-lg shadow-md">
              <thead>
                <tr>
                  <th className="px-4 py-2">Codigo sis</th>
                  <th className="px-4 py-2">Integrantes</th>
                  <th className="px-4 py-2">Rol asignado</th>
                </tr>
              </thead>
              <tbody>
                {integrantes.map((integrante, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{integrante.codigo_sis}</td>
                    <td className="border px-4 py-2">
                      {integrante.nombre_estudiante +
                        " " +
                        integrante.apellido_estudiante}
                    </td>
                    <td className="border px-4 py-2">{integrante.rol}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Botón Añadir integrantes solo visible si el rol es "estudiante" */}
        {showAddButton && (
          <div className="flex justify-end mt-6">
            <button
              className="bg-[#031930] text-white py-2 px-4 rounded-lg shadow hover:bg-[#3684DB] transition duration-200"
              onClick={handleOpenModal}
            >
              Añadir integrantes
            </button>
          </div>
        )}
      </div>

      {/* Modal para añadir integrantes */}
      <RegistroGrupo
        isGrupoModalOpen={isModalOpen}
        onClose={handleCloseModal}
        codClase={grupo.codigo} // Asumiendo que "codigo" es la clave del grupo, ajusta según sea necesario
      />
    </div>
  );
};

export default InformacionGrupo;
