import { VType } from "./ValidationType.js";

export const validations = {
  [VType.isRequired]: (value) =>
    value.trim() !== "" || "Este campo es obligatorio.",
  [VType.maxLength]: (value, max) =>
    value.length <= max || `Máximo ${max} caracteres permitidos.`,
  [VType.isAlpha]: (value) =>
    /^[A-Za-z]+$/.test(value) || "Solo letras permitidas.",
  [VType.hasSpecialCharacters]: (value) =>
    /^[A-Za-z0-9áéíóúÁÉÍÓÚñÑ .,]*$/.test(value) || "No se permiten caracteres especiales.",
  [VType.isNumeric]: (value) =>
    /^\d+$/.test(value) || "Solo números permitidos."
};
