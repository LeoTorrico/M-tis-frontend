import React, { useState, useEffect } from 'react';
import { MdLibraryBooks, MdMoreVert } from 'react-icons/md';
import { AiOutlinePlus, AiOutlineClose } from 'react-icons/ai';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import MostarRubrica from './MostrarRubrica';

const EvaluacionDetails = ({ evaluacion, user, submitted, retrievedFile, isPastDueDate, handleFileChange, handleSubmit, renderFilePreview, renderRetrievedFile }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [comentario, setComentario] = useState(null);
    const [comentarioIndividual, setComentarioIndividual] = useState(null);
    const { cod_clase } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchComentarios = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/evaluaciones/${evaluacion.cod_evaluacion}/${cod_clase}/nota-total`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                });
                console.log('Respuesta del backend:', response.data);

                if (response.data) {
                    if (response.data.retroalimentacion && response.data.retroalimentacion.comentario) {
                        setComentario(response.data.retroalimentacion.comentario);
                    } else {
                        setComentario(null); 
                    }

                    if (response.data.comentario_individual) {
                        setComentarioIndividual(response.data.comentario_individual);
                    } else {
                        setComentarioIndividual(null);
                    }
                }
            } catch (error) {
                console.error('Error al obtener los comentarios:', error);
                setComentario(null);
                setComentarioIndividual(null);
            }
        };

        if (evaluacion.cod_evaluacion && cod_clase) {
            fetchComentarios();
        }
    }, [evaluacion.cod_evaluacion, cod_clase, user.token]);

    const onFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        handleFileChange(event);
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleDelete = async () => {
        try {
            if (!user?.token) {
                throw new Error('Token de autenticación no disponible');
            }

            const response = await axios.delete(`http://localhost:3000/evaluaciones/${evaluacion.cod_evaluacion}`, {
                headers: {
                    Authorization: `Bearer ${user.token}` 
                }
            });

            console.log('Evaluación eliminada con éxito:', response.data);
            setMenuOpen(false); 
            navigate(`/Vista-Curso/${cod_clase}`);
        } catch (error) {
            console.error('Error al eliminar la evaluación:', error);
            alert(`Error al eliminar la evaluación: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div className="flex flex-col min-h-[calc(100vh-60px)] h-full">
            <div className="bg-semi-blue text-white p-6 rounded-lg m-4 relative">
                <div className="flex items-center">
                    <span className="bg-white p-2 rounded-full text-black mr-4">
                        <MdLibraryBooks size={32} />
                    </span>
                    <div>
                        <h1 className="text-3xl font-bold font-Montserrat">{evaluacion.evaluacion}</h1>
                        <p className="text-xl font-Montserrat">{evaluacion.tipo_evaluacion}</p>
                    </div>
                </div>

                {user.rol === 'docente' && (
                    <div className="absolute top-4 right-4">
                        <button onClick={toggleMenu} className="text-white">
                            <MdMoreVert size={24} />
                        </button>
                        {menuOpen && (
                            <div className="absolute right-0 mt-2 w-28 bg-white rounded-lg shadow-lg z-10">
                                <button
                                    onClick={() => {
                                        setMenuOpen(false);
                                    }}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg w-full text-left"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg w-full text-left"
                                >
                                    Eliminar
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="border p-4 rounded-lg mt-0 m-4 flex-grow grid grid-cols-[minmax(0,2fr),minmax(0,1fr)] gap-4">
                <div className="bg-blue-gray p-4 rounded-lg flex flex-col h-full">
                    <p className="text-xm font-semibold font-Montserrat">Descripción de la evaluación:</p>
                    <p className="text-xm font-Montserrat">{evaluacion.descripcion_evaluacion}</p>

                    <div className="col-span-2 overflow-y-auto mt-2">
                        <MostarRubrica evaluacion={evaluacion} />
                    </div>
                </div>

                <div className="bg-blue-gray p-4 rounded-lg flex flex-col h-full">
                    <p className={`text-xm font-semibold font-Montserrat ${isPastDueDate ? "text-red-400" : ""}`}>
                        Fecha de entrega: {new Date(evaluacion.fecha_fin).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                        })}
                    </p>

                    {user.rol === "estudiante" ? (
                        <form onSubmit={handleSubmit} className="flex flex-col h-full">
                            {submitted && retrievedFile && renderRetrievedFile()}

                            {!submitted && (
                                <label className="inline-block w-full mt-2">
                                    <button
                                        type="button"
                                        className="border border-gray-300 text-blue-500 bg-white py-2 px-4 rounded-lg w-full cursor-pointer flex items-center justify-center"
                                        onClick={() => document.getElementById('file-input').click()}
                                    >
                                        <AiOutlinePlus className="mr-2 font-Montserrat" />
                                        Añadir archivo
                                    </button>
                                    <input
                                        id="file-input"
                                        type="file"
                                        onChange={onFileChange}
                                        className="hidden"
                                        accept="image/*,.pdf"
                                    />
                                </label>
                            )}

                            {selectedFile && renderFilePreview && (
                                <div className="relative mt-4 flex-grow">
                                    {renderFilePreview()}
                                    {!submitted && (
                                        <AiOutlineClose
                                            className="absolute top-2 right-2 text-gray-500 cursor-pointer hover:text-gray-700"
                                            onClick={handleRemoveFile}
                                            size={24}
                                        />
                                    )}
                                </div>
                            )}

                            <button
                                type="submit"
                                className={`px-4 py-2 rounded-lg w-full mt-4 ${submitted ? 'bg-gray-400 text-white' : isPastDueDate ? 'bg-white text-red-500 border border-red-500' : 'bg-semi-blue text-white'}`}
                                disabled={submitted || isPastDueDate}
                            >
                                {submitted ? "Entregado" : isPastDueDate ? "Sin entregar" : "Entregar"}
                            </button>

                            {comentario && (
                                <p className="mt-2 text-sm text-black font-Montserrat">
                                    <strong>Comentario grupal:</strong> {comentario}
                                </p>
                            )}

                            {comentarioIndividual && (
                                <p className="mt-2 text-sm text-black font-Montserrat">
                                    <strong>Comentario individual:</strong> {comentarioIndividual}
                                </p>
                            )}
                        </form>
                    ) : (
                        evaluacion.archivo_evaluacion ? (
                            <>
                                <a
                                    href={`data:application/octet-stream;base64,${evaluacion.archivo_evaluacion}`}
                                    className="text-blue-600 underline"
                                    download
                                >
                                    Descargar archivo
                                </a>

                                {evaluacion.archivo_evaluacion.startsWith("JVBERi0") ? (
                                    <iframe
                                        src={`data:application/pdf;base64,${evaluacion.archivo_evaluacion}`}
                                        title="Previsualización de PDF"
                                        className="flex flex-col h-full"
                                    />
                                ) : (
                                    <div>Vista previa no disponible para este tipo de archivo.</div>
                                )}
                            </>
                        ) : (
                            <div>No se ha subido un archivo de evaluación.</div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default EvaluacionDetails;
