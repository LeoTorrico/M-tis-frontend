import { jwtDecode } from "jwt-decode";

const getDetailsFromToken = (token) => {
  try {
    // Decodifica el token
    const decoded = jwtDecode(token);
    // Asegúrate de que se decodificó correctamente
    const codigoSis = decoded.codigoSis || null;
    const rol = decoded.role || null;

    return { codigoSis, rol };
  } catch (error) {
    console.error("Error al decodificar el token:", error);
    return { codigoSis: null, rol: null };
  }
};

export default getDetailsFromToken;
