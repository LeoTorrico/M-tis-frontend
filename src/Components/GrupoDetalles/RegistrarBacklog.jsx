import React, { useState } from "react";

const RegistrarBacklog = () => {
  const [tasks, setTasks] = useState([]);

  // Función para manejar el cambio de cualquier campo de una tarea
  const handleTaskChange = (id, field, value) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, [field]: value } : task
    );
    setTasks(updatedTasks);
  };

  // Función para agregar una nueva tarea (requerimiento)
  const addNewTask = () => {
    const newTask = {
      id: tasks.length + 1,
      name: `Nuevo requerimiento ${tasks.length + 1}`,
      status: "Pendiente",
      points: 3,
    };
    setTasks([...tasks, newTask]);
  };

  // Función para enviar los datos al backend
  const enviarBacklog = () => {
    console.log("Enviando backlog al servidor:", tasks);
    // Aquí puedes agregar el código de envío al backend
  };

  return (
    <div className="p-6 bg-light-blue rounded-lg shadow-md w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-dark-blue">
          Product Backlog
        </h2>
        <button
          className="bg-dark-blue text-white px-4 py-2 rounded-lg"
          onClick={enviarBacklog}
        >
          Enviar Backlog
        </button>
      </div>

      {/* Tabla de tareas */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto bg-white rounded-lg shadow-md">
          <thead>
            <tr className="text-left text-dark-blue font-medium bg-light-blue">
              <th className="p-4">Tarea</th>
              <th className="p-4">Estado</th>
              <th className="p-4">Puntos</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="border-b">
                <td className="p-4">
                  <input
                    type="text"
                    value={task.name}
                    className="border bg-white rounded-lg px-2 py-1 w-full"
                    onChange={(e) =>
                      handleTaskChange(task.id, "name", e.target.value)
                    }
                  />
                </td>
                <td className="p-4">
                  <select
                    value={task.status}
                    className="border bg-white rounded-lg px-2 py-1"
                    onChange={(e) =>
                      handleTaskChange(task.id, "status", e.target.value)
                    }
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="En progreso">En progreso</option>
                    <option value="Completado">Completado</option>
                  </select>
                </td>
                <td className="p-4 text-center">
                  <input
                    type="number"
                    value={task.points}
                    className="border bg-white rounded-lg px-2 py-1 w-16 text-center"
                    onChange={(e) =>
                      handleTaskChange(task.id, "points", e.target.value)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Botón para agregar nuevo requerimiento */}
      <div className="mt-4">
        <button
          className="bg-dark-blue text-white flex items-center px-4 py-2 rounded-lg"
          onClick={addNewTask}
        >
          <span className="mr-2">+</span>
          Crear requerimiento
        </button>
      </div>
    </div>
  );
};

export default RegistrarBacklog;
