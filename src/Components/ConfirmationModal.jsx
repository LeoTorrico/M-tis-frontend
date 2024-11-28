import React, { useState } from "react";

const ConfirmationModal = ({ show, text, title, onClose, onSave }) => {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      style={{ zIndex: 1000 }}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <p className="mb-6">{text}</p>
        <div className="flex justify-end space-x-4">
          <button
           className="bg-[#B52C2C] text-white px-4 py-2 rounded hover:bg-[#992626]"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="bg-[#223A59] text-white px-4 py-2 rounded hover:bg-[#1b2e44]"
            onClick={onSave}
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
};
export default ConfirmationModal;