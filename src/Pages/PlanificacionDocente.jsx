import React from 'react'
import TablaActividades from '../Components/TablaActividades';

function PlanificacionDocente() {
    const actividades = [
        { nombre: 'Diseño interfaz', responsable: 'Juan', fechas: '01/09/2024 - 05/09/2024', categoria: 'Diseño', peso: '10%' },
        { nombre: 'Desarrollar backend', responsable: 'María', fechas: '06/09/2024 - 15/09/2024', categoria: 'Desarrollo', peso: '5%' },
        { nombre: 'Documentar código', responsable: 'Pedro', fechas: '01/09/2024 - 05/09/2024', categoria: 'Documentación', peso: '5%' },
        { nombre: 'Diseño Bd', responsable: 'Michelle', fechas: '06/09/2024 - 15/09/2024', categoria: 'Diseño', peso: '10%' },
      ];
    
      const cronograma = [
        { nombre: 'Diseño interfaz', semana1: true, semana2: true, semana3: false },
        { nombre: 'Desarrollar backend', semana1: false, semana2: true, semana3: true },
        { nombre: 'Documentar código', semana1: true, semana2: false, semana3: false },
        { nombre: 'Diseño Bd', semana1: false, semana2: true, semana3: false },
      ];
      
      const dataEmpresa = 
        {nombre: 'codecraft'};

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-4">Grupo: {dataEmpresa.nombre}</h1>
      <h2 className="text-2xl font-semibold mb-6">Planificación de grupo</h2>
      <div className="flex justify-end my-4">
        <button className="bg-semi-blue text-white p-2 rounded-xl shadow-lg hover:bg-light-gray flex justify-center items-center">
                  Nueva Actividad
        </button>
      </div>
      <TablaActividades actividades={actividades} />
    </div>
  )
}

export default PlanificacionDocente