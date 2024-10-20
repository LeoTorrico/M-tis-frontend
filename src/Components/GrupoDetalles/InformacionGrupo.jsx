import React from "react";

const InformacionGrupo = ({ grupo, user }) => {
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
          </div>
        </div>
      </div>

      <div className="mt-2 p-6">
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">Codigo sis</th>
              <th className="px-4 py-2">Integrantes</th>
              <th className="px-4 py-2">Rol asignado</th>
            </tr>
          </thead>
          <tbody>
            {grupo.integrantes.map((integrante, index) => (
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
  );
};

export default InformacionGrupo;
