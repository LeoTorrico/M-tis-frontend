import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  Modal,
  Box,
  MenuItem,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"; // Importar el icono de cerrar
import getDetailsFromToken from "./Utils";
import { useNavigate } from "react-router-dom";

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
          "http://localhost:3000/clases/obtener",
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
          "http://localhost:3000/clases-estudiante/obtener-clases",
          {
            params: {
              codigoSis: codigoSis, // Pasar el codigoSis en los query parameters
            },
            headers: {
              Authorization: `Bearer ${token}`, // Pasar el token en los headers
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
        const response = await axios.get("http://localhost:3000/gestiones/", {
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
  }, [token]);

  const handleAbrirModal = () => setMostrarModal(true);
  const handleCerrarModal = () => {
    setMostrarModal(false);
    setError(""); // Limpiar el mensaje de error al cerrar el modal
  };

  const handleCrearClase = async () => {
    if (!nombreClase && !gestion) {
      setError(
        "Por favor, ingresa el nombre de la clase y selecciona una gestión."
      ); // Mostrar mensaje de error si ambos están vacíos
      return;
    }
    if (!nombreClase) {
      setError("Por favor, ingresa el nombre de la clase."); // Mostrar mensaje de error si nombre de clase está vacío
      return;
    }
    if (!gestion) {
      setError("Por favor, selecciona una gestión."); // Mostrar mensaje de error si gestión está vacía
      return;
    }

    try {
      const requestBody = {
        codGestion: Number(gestion),
        nombreClase,
      };
      await axios.post("http://localhost:3000/clases/crear", requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const nameGestion = gestiones.find(
        (gest) => gest.cod_gestion === gestion
      );
      setClases([
        ...clases,
        { nombre_clase: nombreClase, gestion: nameGestion.gestion },
      ]);
      setNombreClase("");
      setGestion("");
      handleCerrarModal();
    } catch (error) {
      console.error("Error creating class:", error);
    }
  };

  const handleUnirseClase = async () => {
    if (codigoClase.trim() === "") {
      setError("Por favor, ingresa el código de la clase"); // Mostrar mensaje de error si está vacío
      return;
    }

    try {
      const requestBody = {
        token: token,
        codigoClase: codigoClase,
      };
      const response = await axios.post(
        `http://localhost:3000/clases-estudiante/unirse-clase`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const clase = response.data.clase;
      setClases([
        ...clases,
        { nombre_clase: clase.nombre_clase, gestion: clase.gestion },
      ]);
      setCodigoClase("");
      setError(""); // Limpiar mensaje de error al unirse correctamente
      handleCerrarModal();
      window.location.reload();
    } catch (error) {
      console.error("Error joining class:", error);
    }
  };

  const handleViewClass = (cod_clase) => {
    navigate(`/Vista-Curso/${cod_clase}`);
  };

  return (
    <Box sx={{ height: "100vh", bgcolor: "gray.50", p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Clases
        </Typography>
        <Button variant="contained" color="primary" onClick={handleAbrirModal}>
          {rol === "docente" ? "Crear clase" : "Unirse a clase"}
        </Button>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "1fr 1fr",
            lg: "repeat(3, 1fr)",
          },
          gap: 2,
        }}
      >
        {clases.map((clase, index) => (
          <Box
            key={index}
            sx={{
              bgcolor: "#031930",
              color: "white",
              p: 3,
              borderRadius: 2,
              boxShadow: 2,
            }}
          >
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {clase.nombre_clase || "Clase no especificada"}
            </Typography>
            <Typography variant="body2" gutterBottom>
              {clase.gestion || "Gestión no especificada"}
            </Typography>
            {/* Barra del medio con el color de los headers */}
            <Box
              sx={{
                bgcolor: "primary.main",
                borderRadius: 2,
                height: 10,
                mb: 2,
              }}
            />
            <Button
              variant="contained"
              color="primary"
              sx={{ bgcolor: "primary.main", color: "white", borderRadius: 2 }}
              // Botón "Ver clase" con bordes redondeados
              onClick={() => handleViewClass(clase.cod_clase)}
            >
              Ver clase
            </Button>
          </Box>
        ))}
      </Box>

      <Modal open={mostrarModal} onClose={handleCerrarModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            overflow: "hidden", // Para evitar que el contenido sobresalga
          }}
        >
          {/* Header superior con el color del botón primary y alineado a la izquierda */}
          <Box
            sx={{
              bgcolor: "primary.main",
              color: "white",
              p: 2,
              position: "relative",
            }}
          >
            <IconButton
              onClick={handleCerrarModal}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: "white", // Color de la X
              }}
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" fontWeight="bold" align="left">
              {rol === "docente" ? "Crear clase" : "Unirse a clase"}
            </Typography>
          </Box>

          {/* Contenido del modal */}
          <Box sx={{ p: 4 }}>
            {rol === "docente" ? (
              <>
                <TextField
                  fullWidth
                  label="Nombre de la clase"
                  margin="normal"
                  value={nombreClase}
                  onChange={(e) => setNombreClase(e.target.value)}
                  sx={{
                    bgcolor: "#B3D6F9", // Color de fondo para el campo de nombre de clase
                    borderRadius: 2, // Bordes redondeados
                  }}
                  InputProps={{
                    sx: {
                      borderRadius: 2, // Bordes redondeados para el input
                    },
                  }}
                />
                <TextField
                  select
                  fullWidth
                  label="Gestión"
                  margin="normal"
                  value={gestion}
                  onChange={(e) => setGestion(e.target.value)}
                  sx={{
                    bgcolor: "#B3D6F9", // Color de fondo para el campo de gestión
                    borderRadius: 2, // Bordes redondeados
                  }}
                  InputProps={{
                    sx: {
                      borderRadius: 2, // Bordes redondeados para el input
                    },
                  }}
                >
                  {gestiones.map((gestion, index) => (
                    <MenuItem key={index} value={gestion.cod_gestion}>
                      {gestion.gestion}
                    </MenuItem>
                  ))}
                </TextField>
              </>
            ) : (
              <>
                <TextField
                  fullWidth
                  label="Código de clase"
                  margin="normal"
                  value={codigoClase}
                  onChange={(e) => setCodigoClase(e.target.value)}
                  sx={{
                    bgcolor: "#B3D6F9", // Color de fondo para el campo de código de clase
                    borderRadius: 2, // Bordes redondeados
                  }}
                  InputProps={{
                    sx: {
                      borderRadius: 2, // Bordes redondeados para el input
                    },
                  }}
                />
              </>
            )}

            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
          </Box>

          {/* Footer con los botones */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              p: 2,
              bgcolor: "primary.main",
            }}
          >
            {rol === "docente" ? (
              <Button
                variant="contained"
                sx={{
                  bgcolor: "white",
                  color: "primary.main",
                  width: "45%",
                  borderRadius: 2, // Bordes redondeados
                }}
                onClick={handleCrearClase}
              >
                Crear clase
              </Button>
            ) : (
              <Button
                variant="contained"
                sx={{
                  bgcolor: "white",
                  color: "primary.main",
                  width: "45%",
                  borderRadius: 2, // Bordes redondeados
                }}
                onClick={handleUnirseClase}
              >
                Unirse a clase
              </Button>
            )}
            <Button
              variant="contained"
              sx={{
                bgcolor: "white",
                color: "primary.main",
                width: "45%",
                borderRadius: 2, // Bordes redondeados
              }}
              onClick={handleCerrarModal}
            >
              Cancelar
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default ClasesPrueba;
