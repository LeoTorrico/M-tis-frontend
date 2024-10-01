import React from 'react';

const GanttChart = () => {
  const actividades = [
    { nombre: 'Diseño interfaz', responsable: 'Juan', fechas: '01/09/2024 - 05/09/2024', categoria: 'Diseño', peso: '10%' },
    { nombre: 'Desarrollar backend', responsable: 'María', fechas: '06/09/2024 - 15/09/2024', categoria: 'Desarrollo', peso: '5%' },
    { nombre: 'Documentar código', responsable: 'Pedro', fechas: '01/09/2024 - 05/09/2024', categoria: 'Documentación', peso: '5%' },
    { nombre: 'Diseño Bd', responsable: 'Michelle', fechas: '06/09/2024 - 15/09/2024', categoria: 'Diseño', peso: '10%' },
  ];

  const fechas = ['01/09', '02/09', '03/09', '04/09', '05/09', '06/09', '07/09', '08/09', '09/09', '10/09', '11/09', '12/09', '13/09', '14/09', '15/09'];

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full table-fixed border-collapse border border-gray-200">
        <thead>                                                       
          <tr>
            <th className="w-1/4 border border-gray-200 px-4 py-2">Actividad</th>
            {fechas.map(fecha => (
              <th key={fecha} className="w-1/12 border border-gray-200 px-2 py-2 text-sm">{fecha}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {actividades.map((actividad, index) => (
            <tr key={index}>
              <td className="border border-gray-200 px-4 py-2">{actividad.nombre}</td>
              {fechas.map(fecha => {
                const [fechaInicio, fechaFin] = actividad.fechas.split(' - ').map(f => new Date(f.split('/').reverse().join('/')));
                const fechaActual = new Date(`2024-${fecha.split('/').reverse().join('-')}`);
                const isInRange = fechaActual >= fechaInicio && fechaActual <= fechaFin;
                return (
                  <td key={fecha} className={`border border-gray-200 ${isInRange ? 'bg-blue-500' : ''} px-2 py-2`} />
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GanttChart;
