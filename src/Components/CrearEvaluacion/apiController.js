import axios from "axios";

const API_URL = "https://backend-tis-silk.vercel.app";

axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem(
  "token"
)}`;

const handleResponse = async (request) => {
  try {
    const response = await request;
    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error("Error en la solicitud:", error);
    throw error;
  }
};

export const fetchClase = () => {
  return handleResponse(axios.get(`${API_URL}/clases/obtener`));
};

export const fetchTema = (cod_clase) => {
  return handleResponse(axios.get(`${API_URL}/temas/${cod_clase}`));
};

export const fetchGrupos = (cod_clase) => {
  return handleResponse(axios.get(`${API_URL}/api/grupos/${cod_clase}`));
};

export const registrarEvaluacion = (formData) => {
  return handleResponse(
    axios.post(`${API_URL}/evaluaciones/registrar-evaluacion`, formData)
  );
};
