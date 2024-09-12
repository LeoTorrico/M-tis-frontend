import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import React from 'react';

function TablaActividades({ actividades }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse block md:table">
        <thead className="block md:table-header-group bg-semi-blue text-white">
          <tr className="border-b md:border-none block md:table-row">
            <th className="p-4 text-left  block md:table-cell">Nombre de actividad</th>
            <th className="p-4 text-left  block md:table-cell">Responsable(s)</th>
            <th className="p-4 text-left  block md:table-cell">Fechas (inicio-fin)</th>
            <th className="p-4 text-left  block md:table-cell">Categoría</th>
            <th className="p-4 text-left  block md:table-cell">Peso</th>
            <th className="p-4 text-left  block md:table-cell">Acciones</th>
          </tr>
        </thead>
        <tbody className="block md:table-row-group">
          {actividades.map((actividad, index) => (
            <tr key={index} className="border-b block md:table-row">
              <td className="p-4 block md:table-cell">{actividad.nombre}</td>
              <td className="p-4 block md:table-cell">{actividad.responsable}</td>
              <td className="p-4 block md:table-cell">{actividad.fechas}</td>
              <td className="p-4 block md:table-cell">{actividad.categoria}</td>
              <td className="p-4 block md:table-cell">{actividad.peso}</td>
              <td className="p-4 block md:table-cell gap-2">
                <button className="text-blue-500">
                  <FaEdit />
                </button>
                <button className="text-red-500">
                  <FaTrashAlt />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TablaActividades