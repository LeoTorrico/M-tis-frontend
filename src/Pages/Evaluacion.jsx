import React, { useState, useEffect } from "react";
import HeaderCurso from "../Components/HeaderCurso";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import getDetailsFromToken from "./Utils";
import ConfirmationModal from "../Components/ConfirmationModal";

const Evaluacion = () => {
  const { cod_clase } = useParams();
  const navigate = useNavigate();
  const [curso, setCurso] = useState({
    nombre: "",
    gestion: "",
    cod_docente: "",
    cod_gestion: "",
  });

  const [cargando, setCargando] = useState(true);
  const [nombreEvaluacion, setNombreEvaluacion] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaEntrega, setFechaEntrega] = useState("");
  const [tema, setTema] = useState("");
  const [asignarA, setAsignarA] = useState(0);
  const [tipoEvaluacion, setTipoEvaluacion] = useState("");
  const [archivoAdjunto, setArchivoAdjunto] = useState(null);
  const token = localStorage.getItem("token");
  const { codigoSis, rol } = getDetailsFromToken(token);
  const [activeTab, setActiveTab] = useState("Tablon");
  const [temas, setTemas] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [errores, setErrores] = useState({});
  const [mostrarModal, setmostrarModal] = useState(false);
  const [openModalOfExit, setOpenModalOfExit] = useState(false);
  
  const textOfModal = "¿Quieres guardar tus cambios?";
  const titleOfModal = "Confirmación";

  useEffect(() => {
    const fetchClase = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/clases/obtener`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const clase = response.data.clases.find((c) => c.cod_clase === cod_clase);
        if (clase) {
          setCurso({
            nombre: clase.nombre_clase,
            gestion: clase.gestion,
            cod_docente: clase.cod_docente,
            cod_gestion: clase.cod_gestion,
          });
        }
      } catch (error) {
        console.error("Error al obtener datos del curso:", error);
      } finally {
        setCargando(false);
      }
    };
    const fetchTema = async () => {
      try {
      const response = await axios.get(`http://localhost:3000/temas/${cod_clase}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const tema = response.data;
      if (tema) {
       setTemas(tema);
      }
    } catch (error) {
      console.error("Error al obtener datos del curso:", error);
    } finally {
      setCargando(false);
    }
  };
  const fetchGrupos = async () => {
    try {
    const response = await axios.get(`http://localhost:3000/api/grupos/${cod_clase}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const grupos = response.data;
    if (grupos) {
     setGrupos(grupos);
    }
  } catch (error) {
    console.error("Error al obtener datos del curso:", error);
  } finally {
    setCargando(false);
  }
};
    fetchClase();
    fetchTema();
    fetchGrupos();
  }, [cod_clase, token]);
  
  useEffect(() => {
    validarCampos();
  } , [nombreEvaluacion,descripcion,fechaEntrega,tema,asignarA,tipoEvaluacion]) 
  const validarCampos = () => {
    const nuevosErrores = {};
    if (!nombreEvaluacion) {
      nuevosErrores.nombreEvaluacion = 'Este campo es requerido';
    }
    if (!descripcion) {
      nuevosErrores.descripcion = 'Este campo es requerido';
    }
    if (!fechaEntrega) {
      nuevosErrores.fecha = 'Este campo es requerido';
    }
    if (!tema) {
      nuevosErrores.tema = 'Este campo es requerido';
    }
    if (!asignarA) {
      nuevosErrores.asignados = 'Este campo es requerido';
    }
    if (!tipoEvaluacion) {
      nuevosErrores.evaluacion = 'Este campo es requerido';
    }
    setErrores(nuevosErrores);
  };
  const handleArchivoChange = (e) => {
    const file = e.target.files[0];
    setArchivoAdjunto(file);
  };

  const handleSubmitEvaluacion = async () => {
    const formData = { 
      codClase: cod_clase, 
      tema: tema,
      nombreEvaluacion: nombreEvaluacion,
      tipoEvaluacion: tipoEvaluacion, 
      fechaEntrega: fechaEntrega, 
      archivo: archivoAdjunto,
      descripcion: descripcion,
      codigosGrupos: [asignarA]
    };
    try {
      const response = await axios.post(
        "http://localhost:3000/evaluaciones/registrar-evaluacion",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setNombreEvaluacion("");
        setDescripcion("");
        setFechaEntrega("");
        setTema("");
        setAsignarA("");
        setTipoEvaluacion("");
        setArchivoAdjunto(null);
      }
      Swal.fire({
        title: "Éxito",
        text: "Evaluación registrada correctamente",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
      //navigate(`/Vista-Curso/${cod_clase}`); //Me redirige aqui despues de crear la evaluacion?
    } catch (error) {
      console.error("Error al registrar la evaluación:", error);
    }
  };

  const handleSave = () => {
    handleSubmitEvaluacion();
    setmostrarModal(false);
  };

  const handleClose = () => {
    setmostrarModal(false);
  };

  const handleCancelar = () => {
    if (Object.keys(errores).length < 6) {
        setOpenModalOfExit(true);
    }
    else{
      navigate(`/Vista-Curso/${cod_clase}`);
    }
    
  };

  const handleCrear = () => {
    if (Object.keys(errores).length === 0) {
      setmostrarModal(true);
    }

  };
  const displayModalOfExit = () => {
    const text = "¿Estás seguro de que salir del registro?";
    const title = "Guardar cambios";
    const handleClose = () => setOpenModalOfExit(false);
    const handleSave = () => navigate(`/Vista-Curso/${cod_clase}`);
    return <ConfirmationModal show={true} text={text} title={title} onClose={handleClose} onSave={handleSave} />
  };

  return (
    <div className="flex flex-col w-full">
  <ConfirmationModal show={mostrarModal} text={textOfModal} title={titleOfModal} onClose={handleClose} onSave={handleSave} />
  {/*<HeaderCurso activeTab={activeTab} setActiveTab={setActiveTab} />*/}
  {openModalOfExit && displayModalOfExit()}

  <div className="bg-semi-blue text-white p-6 rounded-lg m-4">
    <h1 className="text-3xl font-bold">{curso.nombre}</h1>
    <p className="text-xl">{curso.gestion}</p>
  </div>

  <div className="bg-white p-6 rounded-lg shadow-lg m-4">
    <h2 className="text-2xl font-bold mb-4">Nueva Evaluación</h2>

    <div className="grid grid-cols-2 gap-6">
      {/* Columna Izquierda */}
      <div>
        <div className="mb-4">
          <label htmlFor="nombreEvaluacion" className="block text-sm font-bold mb-2">
            Nombre de la evaluación:
          </label>
          <input
            type="text"
            id="nombreEvaluacion"
            value={nombreEvaluacion}
            onChange={(e) => setNombreEvaluacion(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            style={{ backgroundColor: '#D1DDED' }} // Color de fondo del campo
          />
          {errores.nombreEvaluacion && (
            <p className="text-red-500 text-xs mt-1">{errores.nombreEvaluacion}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="descripcion" className="block text-sm font-bold mb-2">
            Descripción:
          </label>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            style={{ backgroundColor: '#D1DDED', height: '120px' }} // Más alto verticalmente
          ></textarea>
          {errores.descripcion && (
            <p className="text-red-500 text-xs mt-1">{errores.descripcion}</p>
          )}
        </div>

        <div className="flex justify-start space-x-4">
          <button
            type="submit"
            onClick={handleCrear}
            className="text-white px-4 py-2 rounded hover:opacity-90"
            style={{ backgroundColor: '#223A59' }} // Color de fondo del botón
          >
            Crear
          </button>
          <button
            type="button"
            onClick={handleCancelar}
            className="text-white px-4 py-2 rounded hover:opacity-90"
            style={{ backgroundColor: '#223A59' }} // Color de fondo del botón
          >
            Salir
          </button>
        </div>
      </div>

      {/* Columna Derecha */}
      <div>
        <div className="mb-4">
          <label htmlFor="fechaEntrega" className="block text-sm font-bold mb-2">
            Fecha de entrega:
          </label>
          <input
            type="date"
            id="fechaEntrega"
            value={fechaEntrega}
            onChange={(e) => setFechaEntrega(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-black"
            style={{ backgroundColor: '#D1DDED' }} // Color de fondo del campo
            placeholder="dd/mm/aaaa" // Placeholder en blanco
          />
          {errores.fecha && (
            <p className="text-red-500 text-xs mt-1">{errores.fecha}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="tema" className="block text-sm font-bold mb-2">
            Tema:
          </label>
          <select
            id="tema"
            value={tema}
            onChange={(e) => setTema(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-black"
            style={{ backgroundColor: '#D1DDED' }} // Color de fondo del campo
          >
            <option value="" className="text-white">
              Selecciona una opción
            </option>
            {temas.map((temaObj, index) => (
              <option key={index} value={temaObj.nombre_tema}>
                {temaObj.nombre_tema}
              </option>
            ))}
          </select>
          {errores.tema && (
            <p className="text-red-500 text-xs mt-1">{errores.tema}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="asignarA" className="block text-sm font-bold mb-2">
            Asignar a:
          </label>
          <select
            id="asignarA"
            value={asignarA}
            onChange={(e) => setAsignarA(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-black"
            style={{ backgroundColor: '#D1DDED' }} // Color de fondo del campo
          >
            <option value="" className="text-white">
              Selecciona una opción
            </option>
            {grupos.map((grupo) => (
              <option key={grupo.cod_grupoempresa} value={grupo.cod_grupoempresa}>
                {grupo.nombre_largo}
              </option>
            ))}
          </select>
          {errores.asignados && (
            <p className="text-red-500 text-xs mt-1">{errores.asignados}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="tipoEvaluacion" className="block text-sm font-bold mb-2">
            Tipo de evaluación:
          </label>
          <select
            id="tipoEvaluacion"
            value={tipoEvaluacion}
            onChange={(e) => setTipoEvaluacion(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-black"
            style={{ backgroundColor: '#D1DDED' }} // Color de fondo del campo
          >
            <option value="" className="text-white">
              Selecciona una opción
            </option>
            <option value="Autoevaluación">Autoevaluación</option>
            <option value="Evaluación cruzada">Evaluación cruzada</option>
            <option value="Evaluación de pares">Evaluación de pares</option>
            <option value="Evaluación semanal">Evaluación semanal</option>
          </select>
          {errores.evaluacion && (
            <p className="text-red-500 text-xs mt-1">{errores.evaluacion}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="archivo" className="block text-sm font-bold mb-2">
            Adjuntar archivo (opcional):
          </label>
          <input
            type="file"
            id="archivo"
            onChange={handleArchivoChange}
            className="w-full p-2 border border-gray-300 rounded"
            style={{ backgroundColor: '#D1DDED' }} // Color de fondo del campo
          />
        </div>

        {/* Label de Rúbrica debajo del campo de archivo */}
        <div className="mb-4">
          <label htmlFor="rubrica" className="block text-sm font-bold mb-2">
            Rúbrica:
          </label>
        </div>

        <div className="flex space-x-4">
          <button
            type="button"
            className="text-white px-4 py-2 rounded hover:opacity-90"
            style={{ backgroundColor: '#223A59' }} // Color de fondo del botón
          >
            Añadir rúbrica
          </button>
          <button
            type="button"
            className="text-white px-4 py-2 rounded hover:opacity-90"
            style={{ backgroundColor: '#D9D9D9' }} // Color de fondo del botón
          >
            Rúbrica añadida
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
  )
};

export default Evaluacion;
