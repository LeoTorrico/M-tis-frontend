import React, { useEffect, useState } from "react";
import { PiNewspaper } from "react-icons/pi"; 
import { useNavigate } from "react-router-dom"; 

const EvaluacionSemanal = () => {
  const navigate = useNavigate(); // Inicializamos el hook para navegar
  const [curso, setCurso] = useState({
    nombre: "",
    gestion: "",
  });

  useEffect(() => {
    const datosClase = {
      nombre: "Tis",
      gestion: "II-2024",
    };

    setCurso(datosClase);
  }, []);

  const integrantes = [
    "Mauricio Nestor Apaza Callapa",
    "Valeria Michelle Barriga Rios",
    "Erick Alejandro Garcia Avila",
    "Leonardo Enrique Torrico Martinez",
    "Teresa Villanueva Zapata",
    "Daniela Zapata Pari",
  ];
  const rubricas = ["Rúbrica 1", "Rúbrica 2", "Rúbrica 3"];

  const handleRubroChange = (event) => {
    const value = Math.max(0, Math.min(100, parseInt(event.target.value, 10)));
    event.target.value = isNaN(value) ? "" : value;
  };

  // Función para manejar la navegación al hacer clic en "Tomar lista"
  const handleTomarLista = () => {
    navigate("/asistencia"); // Redirige a la ruta de Asistencia
  };

  return (
    <div className="flex flex-col w-full p-4">
      <div className="bg-semi-blue text-white p-6 rounded-lg mb-6">
        <h2 className="text-2xl font-semibold">{curso.nombre}</h2>
        <p className="text-xl">{curso.gestion}</p>
      </div>

      <div className="bg-white rounded-lg p-6 border border-black">
        <div className="flex items-center mb-4">
          <PiNewspaper className="text-2xl mr-2" />
          <h1 className="text-lg font-bold">
            Presentación del Grupo y elección de horarios
          </h1>
        </div>
        <hr className="border-black my-4" />

        <div className="mb-6">
          <h2 className="font-bold text-md mb-2">Integrantes</h2>
          <div className="grid grid-cols-1 gap-4">
            {integrantes.map((integrante, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4"
              >
                <input
                  type="text"
                  value={integrante}
                  readOnly
                  className="bg-[#D1DDED] rounded-lg p-2 flex-1"
                />
                {rubricas.map((_, rubricaIndex) => (
                  <div
                    key={rubricaIndex}
                    className="flex flex-col items-center"
                  >
                    {index === 0 && (
                      <span className="font-bold text-sm mb-1">{`Rúbrica ${
                        rubricaIndex + 1
                      }`}</span>
                    )}
                    <input
                      type="number"
                      className="bg-[#D1DDED] border border-gray-300 rounded-lg p-1 w-full h-10 text-center"
                      placeholder="/..."
                      onChange={handleRubroChange}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-start mt-6 space-y-2 md:space-y-0 md:space-x-4">
          <button className="bg-[#223A59] text-white px-4 py-2 rounded-lg flex-1 md:flex-none">
            Ver archivo
          </button>
          <button
            className="bg-[#223A59] text-white px-4 py-2 rounded-lg flex-1 md:flex-none"
            onClick={handleTomarLista} // Manejar el clic para redirigir
          >
            Tomar lista
          </button>
        </div>
      </div>
    </div>
  );
};

export default EvaluacionSemanal;
