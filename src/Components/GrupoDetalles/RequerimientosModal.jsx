import React from "react";
import Modal from "react-modal";
import { IoMdClose } from "react-icons/io";

const RequerimientosModal = ({ isOpen, onClose, requerimientos, onSubmit }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="fixed inset-0 flex items-center justify-center"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <div className="bg-blue-modal w-[700px] h-[500px] rounded-xl flex flex-col font-title">
        <div className="relative">
          <h2 className="text-2xl font-semibold text-center text-white p-4">
            Registrar Requerimientos al sprint
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-white px-2 py-2 hover:text-black"
          >
            <IoMdClose className="w-6 h-6" />
          </button>
        </div>

        <form
          onSubmit={onSubmit}
          id="reqForm"
          className="flex-1 overflow-y-auto p-4 bg-white"
        >
          {requerimientos.length > 0 ? (
            requerimientos.map((req) => (
              <div
                key={req.cod_requerimiento}
                className="flex items-center mb-4"
              >
                <input
                  type="checkbox"
                  id={`requerimiento-${req.cod_requerimiento}`}
                  name="requerimientos"
                  value={req.cod_requerimiento}
                  className="mr-2"
                />
                <label
                  htmlFor={`requerimiento-${req.cod_requerimiento}`}
                  className="flex-grow"
                >
                  <span>{req.requerimiento}</span>
                  <span className="ml-4">Prioridad: {req.prioridad_hu}</span>
                  <span className="ml-4">Estimación: {req.estimacion_hu}</span>
                </label>
              </div>
            ))
          ) : (
            <p>No hay requerimientos disponibles.</p>
          )}
        </form>
        <div className="bg-blue-modal flex justify-end p-4 rounded-xl">
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-white text-black px-4 py-2 rounded-lg mr-4 hover:bg-red-500 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="reqForm"
              className="bg-white text-black px-4 py-2 rounded-lg hover:bg-semi-blue hover:text-white"
            >
              Registrar Requerimientos
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default RequerimientosModal;
