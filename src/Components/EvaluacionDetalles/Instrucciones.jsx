import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { UserContext } from "../../context/UserContext";
import EvaluacionDetails from "./EvaluacionDetails";
import FilePreview from "./FilePreview";
import { FaLink } from 'react-icons/fa';

const Instrucciones = ({ evaluacion }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [retrievedFile, setRetrievedFile] = useState(null);
  const [linkInput, setLinkInput] = useState("");
  const [retrievedLink, setRetrievedLink] = useState("");
  const { user } = useContext(UserContext);

  const isPastDueDate = new Date(evaluacion.fecha_fin) < new Date();

  const handleLinkChange = (newLink) => {
    setLinkInput(newLink);
  };

  useEffect(() => {
    const fetchSubmittedFile = async () => {
      if (user.rol === "estudiante") {
        try {
          const response = await axios.get(
            `http://localhost:3000/evaluaciones/${evaluacion.cod_evaluacion}/entregado`,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            }
          );
          console.log(response.data);
          if (response.data && response.data.archivo) {
            const archivoBase64 = response.data.archivo;

            // Determinar el tipo de archivo
            const fileType = archivoBase64.startsWith("JVBERi0") ? "application/pdf" :
              archivoBase64.startsWith("/9j/") || archivoBase64.startsWith("iVBORw0KGgo") ? "image/jpeg" :
                "unknown";

            const fileName = fileType === "application/pdf" ? "archivo_entregado.pdf" : "archivo_entregado.jpg";

            setSubmitted(true);
            setRetrievedFile({
              name: fileName,
              base64: archivoBase64,
              type: fileType,
            });

            // Crear Blob y URL
            const byteCharacters = atob(archivoBase64);
            const byteNumbers = new Uint8Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const blob = new Blob([byteNumbers], { type: fileType });
            setFilePreview(URL.createObjectURL(blob));
          } if (response.data && response.data.link_entregable) {
            setRetrievedLink(response.data.link_entregable); // Guardar el enlace recuperado
          }
        } catch (error) {
          console.error("Error al cargar el archivo entregado:", error);
        }
      }
    };

    fetchSubmittedFile();
  }, [evaluacion.cod_evaluacion, user.token, user.rol]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const fileURL = URL.createObjectURL(file);
      setFilePreview(fileURL);
    }
  };

  const handleFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (selectedFile || linkInput.trim() !== "") {
      try {
        // Convertir el archivo a base64 solo si hay un archivo seleccionado
        const base64File = selectedFile ? await handleFileToBase64(selectedFile) : null;

        const requestData = {
          archivo_grupo: base64File,
          link_entregable: linkInput,
        };
        console.log("Datos enviados:", requestData);

        const response = await axios.post(
          `http://localhost:3000/evaluaciones/${evaluacion.cod_evaluacion}/entregables`,
          requestData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        if (response.data.message === "Archivo del entregable actualizado exitosamente") {
          Swal.fire({
            icon: "success",
            title: "Éxito",
            text: "Archivo subido con éxito.",
            iconColor: "#3684DB", 
            confirmButtonColor: "#3085d6", 
          });
          setSubmitted(true);
        }
      } catch (error) {
        console.error("Error al subir el archivo:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Por favor selecciona un archivo.",
          iconColor: "#d33",
          confirmButtonColor: "#d33", 
        });
      }
    } else {
      Swal.fire({
        icon: "warning",
        title: "Advertencia",
        text: "Por favor selecciona un archivo o introduce un enlace antes de entregar.",
        iconColor: "#3684DB", 
        confirmButtonColor: "#3085d6", 
      });
    }
  };

  const renderRetrievedFile = () => {
    if (!retrievedFile || !retrievedFile.base64) return null;

    // Crear Blob y URL para el archivo recuperado
    const byteCharacters = atob(retrievedFile.base64);
    const byteNumbers = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const blob = new Blob([byteNumbers], { type: retrievedFile.type });
    const fileURL = URL.createObjectURL(blob);

    return (
      <>
        <div className="flex flex-col border border-gray-300 bg-white rounded-lg p-2 shadow-sm relative h-full">
          <a
            href={fileURL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-600 hover:underline block truncate"
          >
            {retrievedFile.name}
          </a>
          {retrievedFile.type === "application/pdf" ? (
            <iframe
              src={fileURL}
              title="Vista previa de PDF"
              className="w-full h-full rounded"
              style={{ border: "none", minHeight: "200px" }}
            />
          ) : (
            <img
              src={fileURL}
              alt="Vista previa"
              className="w-full h-auto max-h-64 object-contain rounded"
            />
          )}
        </div>

        {retrievedLink && (
          <div className="mt-2 bg-white p-2 border rounded-lg flex flex-col items-start">
            <div className="flex flex-col items-start w-full">
              <div className="flex items-center w-full">
                <div className="flex-shrink-0">
                  <FaLink className="text-black-600 mr-2" size={16} />
                </div>
                <a
                  href={retrievedLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 underline font-semibold break-words w-full"
                  title={retrievedLink}
                >
                  {retrievedLink}
                </a>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <EvaluacionDetails
      evaluacion={evaluacion}
      user={user}
      submitted={submitted}
      retrievedFile={retrievedFile}
      isPastDueDate={isPastDueDate}
      handleFileChange={handleFileChange}
      handleSubmit={handleSubmit}
      linkInput={linkInput}
      handleLinkChange={handleLinkChange}
      renderFilePreview={() => (
        <FilePreview
          file={selectedFile}
          filePreview={filePreview}
        />
      )}
      renderRetrievedFile={renderRetrievedFile}
      selectedFile={selectedFile}
    />
  );
};

export default Instrucciones;
