import {jwtDecode} from 'jwt-decode';
const getDetailsFromToken = (token) => {
  try {
      // Decodifica el token
      const decoded = jwtDecode(token);
      
      // Asegúrate de que se decodificó correctamente
      if (decoded) {
          const codigoSis = decoded.codigoSis || null; // Obtén codigoSis, o null si no existe
          const rol = decoded.role || null; // Obtén el rol, o null si no existe

          return { codigoSis, rol }; // Devuelve ambos valores en un objeto
      } else {
          return { codigoSis: null, rol: null }; // Si no hay datos en el payload, devuelve null
      }
  } catch (error) {
      console.error('Error al decodificar el token:', error);
      return { codigoSis: null, rol: null }; // Si hay un error, devuelve null
  }
};
export default getDetailsFromToken;
