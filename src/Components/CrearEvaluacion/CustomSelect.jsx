import { useState } from "react";

export default function CustomSelect({
  label,
  name,
  value,
  options,
  onChange,
  validation = [],
  allowCreate = false,
  onCreate,
  isEnable = false
}) {
  const [inputValue, setInputValue] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");

  const handleSelectChange = (e) => {
    const value = e.target.value;
    onChange(value, validation, setError, name);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleCreate = () => {
    if (inputValue.trim() === "") {
      setError("Por favor escribe un tema para crear.");
      setInputValue("");
      setIsCreating(false);
      return;
    }
    onChange(inputValue,validation,setError,name);
    onCreate(inputValue);
    setInputValue("");
    setIsCreating(false);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-bold mb-2">{label}:</label>
      {isCreating && allowCreate ? (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Escribe o selecciona un tema..."
            className="w-full p-2 border border-gray-300 rounded text-black "
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCreate();
            }}
            className="bg-[#223A59] text-white rounded-full flex items-center justify-center"
            style={{ width: "45px", height: "38px" }}
          >
            +
          </button>
          <button
            onClick={() => setIsCreating(false)}
            className="bg-[#223A59] text-white rounded-full flex items-center justify-center"
            style={{ width: "45px", height: "38px" }}
          >
            x
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <select
            value={value}
            onChange={handleSelectChange}
            disabled={isEnable}
            className="w-full p-2 border rounded"
          >
            <option value="">Selecciona una opción</option>
            {options.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {allowCreate && (
            <div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCreating(true);
                }}
                className="text-white rounded-2xl bg-[#223A59] px-4 py-2"
              >
                Crear
              </button>
            </div>
          )}
        </div>
      )}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}