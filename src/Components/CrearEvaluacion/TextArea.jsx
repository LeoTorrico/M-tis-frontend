import { useState } from "react";

export default function TextArea({
  id,
  name,
  value,
  handleChange,
  validation = [],
  placeholder = "",
  label,
  required = false
}) {
  const [error, setError] = useState("");

  const onChange = (e) => {
    const value = e.target.value;
    console.log([value], value.trim() !== "");
    handleChange(value, validation, setError, name);
  };

  return (
    <div>
      <label htmlFor={id} className="block text-gray-700 font-semibold">
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={placeholder}
        required={required}
        style={{ height: "285px" }}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
