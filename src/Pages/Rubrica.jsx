import React, { useState } from "react";
import Criterio from "../Components/RubricaDetalles/Criterio";
import Swal from "sweetalert2";
import axios from "axios";
const Rubrica = () => {
  const [criterios, setCriterios] = useState([]);
  const token = localStorage.getItem("token");
  const agregarCriterio = () => {
    setCriterios([
      ...criterios,
      {
        titulo: "",
        descripcion: "",
        niveles: [{ puntos: "", tituloNivel: "", descripcion: "" }],
      },
    ]);
  };

  const actualizarCriterio = (index, nuevoCriterio) => {
    const nuevosCriterios = [...criterios];
    nuevosCriterios[index] = nuevoCriterio;
    setCriterios(nuevosCriterios);
  };

  const eliminarCriterio = (index) => {
    setCriterios(criterios.filter((_, i) => i !== index));
  };

  const registrarRubrica = async () => {
    const rubrica = {
      codEvaluacion: 9,
      rubricas: criterios.map((criterio) => {
        // Calcular el peso como el número mayor de los niveles
        const pesoRubrica = Math.max(
          ...criterio.niveles.map((nivel) => parseFloat(nivel.puntos) || 0)
        );

        return {
          nombreRubrica: criterio.titulo,
          descripcionRubrica: criterio.descripcion,
          pesoRubrica, // Incluir el peso en la estructura
          detallesRubrica: criterio.niveles.map((nivel) => ({
            peso: parseFloat(nivel.puntos) || 0,
            clasificacion: nivel.tituloNivel,
            descripcion: nivel.descripcion,
          })),
        };
      }),
    };

    console.log("Datos de la rúbrica a enviar:", rubrica);

    try {
      const response = await axios.post(
        "http://localhost:3000/rubricas/registrar-rubrica",
        rubrica,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        await Swal.fire({
          title: "Éxito!",
          text: "Rúbrica registrada correctamente",
          icon: "success",
          iconColor: "#3684DB",
          confirmButtonText: "Aceptar",
          customClass: {
            confirmButton:
              "text-white bg-blue-modal hover:bg-semi-blue px-4 py-2 rounded",
          },
        });
      }
    } catch (error) {
      console.error("Error al registrar la rúbrica:", error);
      await Swal.fire({
        title: "Error!",
        text: "No se pudo registrar la rúbrica. Inténtalo de nuevo.",
        icon: "error",
        confirmButtonText: "Aceptar",
        customClass: {
          confirmButton:
            "text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded",
        },
      });
    }
  };

  return (
    <div className="p-6">
      <div className="bg-semi-blue text-white p-6 rounded-lg mb-4 flex justify-between">
        <h1 className="text-3xl font-bold">Rubrica</h1>
        <button
          onClick={registrarRubrica}
          className="bg-white text-dark-blue px-4 py-2 rounded-lg border border-blue-800 flex items-center mt-6"
        >
          Registrar rúbrica
        </button>
      </div>
      <div className="bg-light-blue p-6 rounded-lg">
        {criterios.map((criterio, index) => (
          <Criterio
            key={index}
            criterio={criterio}
            onChange={(nuevoCriterio) =>
              actualizarCriterio(index, nuevoCriterio)
            }
            onDelete={() => eliminarCriterio(index)}
          />
        ))}

        <button
          onClick={agregarCriterio}
          className="bg-dark-blue text-white px-4 py-2 rounded mt-4 hover:bg-semi-blue"
        >
          + Añadir un criterio
        </button>
      </div>
    </div>
  );
};

export default Rubrica;
