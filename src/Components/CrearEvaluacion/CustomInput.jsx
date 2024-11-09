import { useState } from "react";

export default function CustomInput({
  id,
  type,
  name,
  value,
  validation = [],
  placeholder = "",
  label,
  required = false,
  handleChange
}) {
  const [error, setError] = useState("");

  const onChange = (e) => {
    const value = e.target.value;
    //setValue(value);
    handleChange(value, validation, setError, name);
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-gray-700 font-semibold">
        {label}
      </label>
      <input
        id={id}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={placeholder}
        required={required}
        min={type === "date" ? today : undefined}
        accept={type === "file" ? ".pdf,.png" : undefined}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
