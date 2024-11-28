import React, { useEffect, useState } from "react";
import { PiNewspaper } from "react-icons/pi";
import { useNavigate } from "react-router-dom";

const Asistencia = () => {
  const navigate = useNavigate();
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
          <div className="grid grid-cols-6 gap-1 mb-2 items-center">
            <h2 className="font-bold text-md col-span-2">Alumnos</h2>
            <h2 className="font-bold text-md text-center">Presente</h2>
            <h2 className="font-bold text-md text-center">Retraso</h2>
            <h2 className="font-bold text-md text-center whitespace-pre-line">
              Ausente sin justificación
            </h2>
            <h2 className="font-bold text-md text-center whitespace-pre-line">
              Ausente con justificación
            </h2>
          </div>

          <div className="space-y-7">
            {integrantes.map((integrante, index) => (
              <div key={index} className="grid grid-cols-6 gap-1 items-center">
                <input
                  type="text"
                  value={integrante}
                  readOnly
                  className="bg-[#D1DDED] rounded-lg p-1 flex-1 min-w-[450px]"
                />
                
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Asistencia;
