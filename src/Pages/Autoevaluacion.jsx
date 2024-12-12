import React, { useEffect, useState, useContext } from "react";
import { PiNewspaper } from "react-icons/pi";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import Swal from "sweetalert2";


const Autoevaluacion = () => {
  const { cod_clase, cod_evaluacion } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [grupoData, setGrupoData] = useState({});
  const [rubricScores, setRubricScores] = useState({});
  const [selectedStudentIndex, setSelectedStudentIndex] = useState(null);
  const [rubricDetails, setRubricDetails] = useState(null); // Nuevo estado
  const [error, setError] = useState("");
  const [selectedRubricCode, setSelectedRubricCode] = useState(null);
  const handleRubricChange = (index, value) => {
    setRubricScores((prevScores) => ({
      ...prevScores,
      [index]: value,
    }));
  };
  const estudiante = grupoData?.estudiantes?.find(integrante => integrante.codigo_sis === user.codigoSis);
  
  useEffect(() => {
    // Validar el rol del usuario
    if (user?.rol === "docente") {
      setError("Esta es una evaluación para estudiantes. Serás redirigido.");
      setTimeout(() => {
        navigate(-1); // Redirige al usuario a la página anterior
      }, 3000);
      return;
    }

    const fetchGrupoData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:3000/eval-pares/${cod_clase}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setGrupoData(response.data);
      } catch (error) {
        console.error("Error al obtener los datos del grupo:", error);
      }
    };

    if (cod_clase) {
      fetchGrupoData();
    }
  }, [cod_clase]);

  const openRubricModal = async (index) => {
    setSelectedStudentIndex(index);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:3000/evaluaciones/${cod_evaluacion}/${cod_clase}/nota-total`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const rubricas = response.data.rubricas || [];
      console.log("Rubricas:", rubricas);  // Verifica las rúbricas
  
      if (rubricas.length > 0) {
        const rubrica = rubricas[0];  // El primer elemento en el array
        console.log("Cod Rubrica:", rubrica.cod_rubrica);  // Verifica el valor de 'cod_rubrica'
  
        setSelectedRubricCode(rubrica.cod_rubrica);  // Guarda el cod_rubrica en el estado
        setRubricDetails(rubrica.detalles || []);  // Establecer detalles de la primera rúbrica
      } else {
        setRubricDetails([]);  // Si no hay rúbricas, limpiar los detalles
      }
    } catch (error) {
      console.error("Error al obtener los detalles de la rúbrica:", error);
    }
  };
  
  

  const saveRubricScores = async () => {
    const estudiante = grupoData.estudiantes[selectedStudentIndex];
    
    // Obtenemos la nota correspondiente al estudiante y a la rúbrica
    const nota = rubricScores[selectedStudentIndex]; // Nota ingresada
  
    // Usamos el cod_rubrica guardado en el estado
    const codRubrica = selectedRubricCode;  // Usar el cod_rubrica del estado
  
    const data = {
      codEvaluacion: cod_evaluacion, // Código de la evaluación
      codigoSis: estudiante.codigo_sis, // Código del estudiante
      notas: [
        {
          codRubrica: codRubrica, // Usar el cod_rubrica guardado
          nota: nota, // Nota ingresada para el estudiante
        },
      ],
      comentario: "Buen desempeño en la evaluación.", // Comentario general
    };
  
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:3000/evaluacion/calificar", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Mostrar el mensaje de éxito con SweetAlert2
      Swal.fire({
        icon: "success",
        title: "¡Calificación guardada!",
        text: "La calificación se ha guardado correctamente.",
        confirmButtonText: "Aceptar",
      });
  
      // Si la calificación se guarda correctamente, podemos cerrar el modal y actualizar el estado
      setSelectedStudentIndex(null);
    } catch (error) {
      console.error("Error al guardar la calificación:", error);
    }
  };
  
 
  

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg max-w-md text-center">
          <p className="font-semibold text-lg">Error</p>
          <p className="mt-2">{error}</p>
          <p className="mt-4 text-sm text-gray-600">
            Serás redirigido en unos segundos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full p-6 bg-white"> <div className="bg-semi-blue text-white p-6 mb-6 rounded-lg"> <h2 className="text-2xl font-semibold">Autoevaluación</h2> <p className="text-xl">{grupoData.nombre_largo}</p> </div> <div className="border border-black rounded-lg p-6 mb-6 overflow-x-auto"> <div className="flex items-center mb-4"> <PiNewspaper className="text-2xl mr-2" /> <h1 className="text-lg font-bold">Calificación a usted mismo bajo honestidad</h1> </div> <hr className="border-black my-2" /> <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> <div> <h2 className="font-bold text-md mb-2">Autoevaluación personal</h2> {estudiante ? ( <div className="mb-2"> <input type="text" value={`${estudiante.nombre_estudiante} ${estudiante.apellido_estudiante} (${estudiante.rol})`} readOnly className="bg-[#D1DDED] rounded-lg p-2 w-full" /> </div> ) : ( <div>No se encontró al estudiante.</div> )}
          </div>

          <div>
            <h2 className="font-bold text-md mb-2 text-center">Nota</h2>
            <div className="flex flex-col space-y-2"> {estudiante ? ( <div className="relative" onClick={() => openRubricModal(0)}> <input type="text" value={ estudiante.score !== undefined ? estudiante.score : "/..." } readOnly className="bg-[#D1DDED] border border-gray-300 rounded-lg p-1 w-full h-10 text-center cursor-pointer" /> </div> ) : ( <div>No se encontró al estudiante.</div> )} </div>
          </div>
        </div>
      </div>
      {selectedStudentIndex !== null && grupoData.estudiantes[selectedStudentIndex] && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-0 rounded-t-lg rounded-b-lg shadow-lg max-w-4xl w-full mx-4 lg:mx-auto max-h-[90vh] overflow-y-auto">
          <h2 className="bg-[#3684DB] p-4 rounded-t-lg text-white font-bold w-full text-center">
            Evaluar a{" "}
            {grupoData.estudiantes[selectedStudentIndex]?.nombre_estudiante}{" "}
            {grupoData.estudiantes[selectedStudentIndex]?.apellido_estudiante}
          </h2>
      
          <div className="mb-4 p-4">
            {rubricDetails && rubricDetails.length > 0 && (
              <div className="mb-4">
                <h3 className="font-bold">Detalles de la Rúbrica</h3>
                <table className="w-full border-collapse border border-gray-300 mt-2">
                  <thead>
                    <tr>
                      <th className="border border-gray-300 px-4 py-2">Peso</th>
                      <th className="border border-gray-300 px-4 py-2">Clasificación</th>
                      <th className="border border-gray-300 px-4 py-2">Descripción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rubricDetails.map((detalle, idx) => (
                      <tr key={idx}>
                        <td className="border border-gray-300 px-4 py-2">{detalle.peso_rubrica}</td>
                        <td className="border border-gray-300 px-4 py-2">{detalle.clasificacion_rubrica}</td>
                        <td className="border border-gray-300 px-4 py-2">{detalle.descripcion}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="mb-4 p-4">
              <label className="font-bold mb-2 block">Ingrese la nota</label>
              <input
  type="number"
  min="0"
  max="100"
  value={rubricScores[selectedStudentIndex] || ""}
  onChange={(e) =>
    handleRubricChange(selectedStudentIndex, e.target.value)
  }
  className="border border-gray-300 p-2 w-full bg-[#B3D6FF] rounded-xl mb-4"
  placeholder="Ingrese la nota"
/>
            </div>
            <div className="mb-4 p-4">
  </div>
          </div>
      
          <div className="bg-[#3684DB] p-3 rounded-b-lg flex justify-end gap-x-4">
  <button
    className="bg-white text-[#3684DB] px-6 py-2 rounded-lg hover:bg-red-500 hover:text-white"
    onClick={() => setSelectedStudentIndex(null)}
  >
    Cancelar
  </button>
  <button
    className="bg-white text-[#3684DB] px-4 py-2 rounded-lg hover:bg-semi-blue hover:text-white"
    onClick={saveRubricScores}
  >
    Calificar
  </button>
</div>

        </div>
      </div>
      
      )}
    </div>
  );
};

export default Autoevaluacion;