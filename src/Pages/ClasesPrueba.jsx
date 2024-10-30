import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import getDetailsFromToken from "./Utils";

const ClasesPrueba = () => {
  const token = localStorage.getItem("token");
  const { codigoSis, rol } = getDetailsFromToken(token);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nombreClase, setNombreClase] = useState("");
  const [gestion, setGestion] = useState("");
  const [codigoClase, setCodigoClase] = useState("");
  const [clases, setClases] = useState([]);
  const [gestiones, setGestiones] = useState([]); // Lista de gestiones para el dropdown
  const [error, setError] = useState(""); // Estado para el mensaje de error
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClasesDocente = async () => {
      try {
        const response = await axios.get(
          "https://mtis.netlify.app/clases/obtener",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setClases(response.data.clases);
      } catch (error) {
        console.error("Error fetching clases:", error);
      }
    };

    const fetchClasesEstudiante = async () => {
      try {
        const response = await axios.get(
          "https://mtis.netlify.app/clases-estudiante/obtener-clases",
          {
            params: {
              codigoSis: codigoSis,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setClases(response.data.clases);
      } catch (error) {
        console.error("Error fetching clases:", error);
      }
    };

    const fetchGestiones = async () => {
      try {
        const response = await axios.get("https://mtis.netlify.app/gestiones/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setGestiones(response.data.gestiones);
      } catch (error) {
        console.error("Error fetching gestiones:", error);
      }
    };

    if (rol === "docente") {
      fetchClasesDocente();
    } else {
      fetchClasesEstudiante();
    }

    fetchGestiones();
  }, [token, codigoSis, rol]);

  const handleAbrirModal = () => setMostrarModal(true);
  const handleCerrarModal = () => {
    setMostrarModal(false);
    setNombreClase("");
    setCodigoClase("");
    setGestion("");

    setError(""); // Limpiar el mensaje de error al cerrar el modal
  };

  const handleCrearClase = async () => {
    const nameClase = nombreClase.trim();
    if (!nameClase && !gestion) {
        setError("Por favor, ingresa el nombre de la clase y selecciona una gestión.");
        setNombreClase("");
        return;
    }
    if (!nameClase) {
        setError("Por favor ingrese un nombre válido.");
        setNombreClase("");
        return;
    }
    if (!gestion) {
        setError("Por favor, selecciona una gestión.");
        return;
    }
    console.log(nameClase);
    try {
      const requestBody = {
          codGestion: Number(gestion),
          nombreClase: nameClase,
      };
      const response = await axios.post("https://mtis.netlify.app/clases/crear", requestBody, {
          headers: {
              Authorization: `Bearer ${token}`,
          },
      });
      // Busca la gestión correspondiente en la lista de gestiones
      const nameGestion = gestiones.find((gest) => gest.cod_gestion === Number(gestion));
      // Actualiza el estado para incluir la nueva clase y su gestión
      const nuevaClase = { 
          nombre_clase: nameClase, 
          gestion: nameGestion ? nameGestion.gestion : "Gestión no especificada", 
          cod_clase: response.data.clase.cod_clase 
      };
  
      setClases([
          ...clases,
          nuevaClase,
      ]);
      
      // Resetea los valores del formulario
      setNombreClase("");
      setGestion("");
      handleCerrarModal();
      // Redirigir a la vista del curso
      navigate(`/Vista-Curso/${nuevaClase.cod_clase}`); // Redirige a la vista del curso usando el código de clase creado
  } catch (error) {
      if (error.response && error.response.data) {
          console.error("Error details:", error.response.data);
          const backendError = error.response.data.detalle?.[0]?.message || "Error desconocido";
          setError(backendError);
      } else {
          console.error("Unexpected error:", error);
      }
  }
};

const handleUnirseClase = async () => {
  if (codigoClase.trim() === "") {
      setError("Por favor, ingresa el código de la clase.");
      setCodigoClase("");
      return;
  }
  if(codigoClase.length > 6){
    setError("El codigo es invalido.");
    return;
  }
  setError(""); // Limpiar cualquier mensaje de error anterior

  try {
      const requestBody = {
          token: token,
          codigoClase: codigoClase,
      };
      const response = await axios.post(
          "https://mtis.netlify.app/clases-estudiante/unirse-clase",
          requestBody,
          {
              headers: {
                  Authorization: `Bearer ${token}`,
              },
          }
      );

      // Verificamos si la respuesta indica que se pudo unir a la clase
      const clase = response.data.clase;
      setClases([
        ...clases,
        { nombre_clase: clase.nombre_clase, gestion: clase.gestion },
      ]);
      setCodigoClase("");
      setError(""); // Limpiar el error si la unión fue exitosa
      handleCerrarModal();
      window.location.reload();
  } catch (error) {
      console.error("Error joining class:", error);
      const errorMessage = error.response.data.error;
      setError(errorMessage);
  }
};

  const handleViewClass = (cod_clase) => {
    navigate(`/Vista-Curso/${cod_clase}`);
  };

  return (
    <div className="h-screen bg-gray-50 p-3 relative">
      {/* Fondo oscuro que cubre toda la página y el contenido cuando el modal está abierto */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black opacity-50 z-40" />
      )}
  
      {/* El contenido de la página se mantiene detrás del modal */}
      <div className={`relative z-30 ${mostrarModal ? 'pointer-events-none' : ''}`}>
        <div className="flex justify-between items-center mb-3">
          <h1 className="font-title text-2xl font-bold">Clases</h1>
          <button
            className="bg-[#3684DB] text-white font-semibold py-2 px-4 rounded"
            onClick={handleAbrirModal}
          >
            {rol === "docente" ? "Crear clase" : "Unirse a clase"}
          </button>
        </div>
  
        <div className="flex flex-col-reverse md:grid md:grid-cols-2 lg:grid-cols-3 gap-2">
          {clases.slice(0).reverse().map((clase, index) => (
            <div
              key={index}
              className="bg-[#031930] text-white p-3 rounded-lg shadow-lg"
            >
              <h2 className="font-title text-lg font-bold">
                {clase.nombre_clase || "Clase no especificada"}
              </h2>
              <p className="font-title text-sm">
                {clase.gestion || "Gestión no especificada"}
              </p>
              <div className="bg-blue-500 rounded-lg h-2 mb-2" />
              <button
                className="bg-[#3684DB] text-white py-2 px-4 rounded"
                onClick={() => handleViewClass(clase.cod_clase)}
              >
                Ver clase
              </button>
            </div>
          ))}
        </div>
      </div>
  
      {/* El modal siempre se muestra encima del contenido */}
      {mostrarModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-lg w-96"> {/* Borde redondeado */}
            <div className="bg-[#3684DB] text-white p-3 rounded-t-3xl relative">
              <button
                className="absolute right-4 top-3"
                onClick={handleCerrarModal}
              >
                X
              </button>
              <h2 className="font-title text-lg font-bold text-left">
                {rol === "docente" ? "Crear clase" : "Unirse a clase"}
              </h2>
            </div>
  
            <div className="p-4">
              {rol === "docente" ? (
                <>
                  <input
                    type="text"
                    placeholder="Nombre de la clase"
                    className="border rounded-lg w-full p-2 mb-2 bg-[#B3D6F9]"
                    value={nombreClase}
                    onChange={(e) => setNombreClase(e.target.value)}
                  />
                  <select
                    className="border rounded-lg w-full p-2 mb-2 bg-[#B3D6F9]"
                    value={gestion}
                    onChange={(e) => setGestion(e.target.value)}
                  >
                    <option value="">Seleccione gestión</option>
                    {gestiones.map((gestion, index) => (
                      <option key={index} value={gestion.cod_gestion}>
                        {gestion.gestion}
                      </option>
                    ))}
                  </select>
                  {error && (
                    <div className="text-red-600 text-sm text-center mt-2 border border-red-500">
                      {error}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="Código de la clase"
                    className="border rounded-lg w-full p-2 mb-2 bg-[#B3D6F9]"
                    value={codigoClase}
                    onChange={(e) => setCodigoClase(e.target.value)}
                  />
                  {error && (
                    <div className="text-red-600 text-sm text-center mt-2 border border-red-500">
                      {error}
                    </div>
                  )}
                </>
              )}
            </div>
  
            <div className="bg-[#3684DB] text-white p-3 rounded-b-3xl">
              <div className="flex justify-end gap-2">
                <button
                  className="bg-white text-[#3684DB] font-semibold py-1.5 px-3 rounded"
                  onClick={rol === "docente" ? handleCrearClase : handleUnirseClase}
                >
                  {rol === "docente" ? "Crear" : "Unirse"}
                </button>
                <button
                  className="border rounded-lg bg-white text-[#3684DB] font-semibold py-1.5 px-3"
                  onClick={handleCerrarModal}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  
};

export default ClasesPrueba;
