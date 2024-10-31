import React, { useState } from "react";
import Criterio from "../Components/RubricaDetalles/Criterio";
import Swal from "sweetalert2";
import axios from "axios";

const Rubrica = () => {
  const [criterios, setCriterios] = useState([]);
  const [errors, setErrors] = useState({});
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

  const validarCriterio = (criterio, index) => {
    let valid = true;
    let criterioErrors = {};

    // Validar título del criterio
    if (criterio.titulo.length < 10 || criterio.titulo.length > 50) {
      criterioErrors.titulo = "El título debe tener entre 10 y 50 caracteres.";
      valid = false;
    }

    // Validar descripción del criterio
    if (criterio.descripcion.length < 10 || criterio.descripcion.length > 200) {
      criterioErrors.descripcion =
        "La descripción debe tener entre 10 y 200 caracteres.";
      valid = false;
    }

    // Validar niveles
    criterio.niveles.forEach((nivel, nivelIndex) => {
      if (nivel.puntos < 0 || nivel.puntos > 100) {
        criterioErrors[`nivelPuntos${nivelIndex}`] =
          "Los puntos deben estar entre 0 y 100.";
        valid = false;
      }
      if (nivel.descripcion.length < 10 || nivel.descripcion.length > 300) {
        criterioErrors[`nivelDescripcion${nivelIndex}`] =
          "La descripción del nivel debe tener entre 10 y 300 caracteres.";
        valid = false;
      }
      if (!nivel.tituloNivel) {
        criterioErrors[`nivelTitulo${nivelIndex}`] = "Seleccione un nivel.";
        valid = false;
      }
    });

    setErrors((prevErrors) => ({
      ...prevErrors,
      [index]: criterioErrors,
    }));

    return valid;
  };

  const registrarRubrica = async () => {
    let valid = true;

    criterios.forEach((criterio, index) => {
      if (!validarCriterio(criterio, index)) {
        valid = false;
      }
    });

    if (!valid) {
      Swal.fire({
        title: "Error!",
        text: "Por favor, corrige los errores antes de registrar la rúbrica.",
        icon: "error",
        confirmButtonText: "Aceptar",
        customClass: {
          confirmButton:
            "text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded",
        },
      });
      return;
    }

    const rubrica = {
      codEvaluacion: 9,
      rubricas: criterios.map((criterio) => {
        const pesoRubrica = Math.max(
          ...criterio.niveles.map((nivel) => parseFloat(nivel.puntos) || 0)
        );

        return {
          nombreRubrica: criterio.titulo,
          descripcionRubrica: criterio.descripcion,
          pesoRubrica,
          detallesRubrica: criterio.niveles.map((nivel) => ({
            peso: parseFloat(nivel.puntos) || 0,
            clasificacion: nivel.tituloNivel,
            descripcion: nivel.descripcion,
          })),
        };
      }),
    };

    try {
      const response = await axios.post(
        "https://backend-tis-silk.vercel.app/rubricas/registrar-rubrica",
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
      <div className="bg-blue-table p-6 rounded-lg">
        {criterios.map((criterio, index) => (
          <Criterio
            key={index}
            criterio={criterio}
            onChange={(nuevoCriterio) =>
              actualizarCriterio(index, nuevoCriterio)
            }
            onDelete={() => eliminarCriterio(index)}
            errors={errors[index] || {}}
          />
        ))}
        <div className="flex justify-end">
          <button
            onClick={agregarCriterio}
            className="bg-semi-blue text-white px-4 py-2 rounded mt-4"
          >
            + Añadir un criterio
          </button>
        </div>
      </div>
    </div>
  );
};

export default Rubrica;
