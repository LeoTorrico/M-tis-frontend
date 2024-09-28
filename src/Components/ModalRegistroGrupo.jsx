import React from "react";
import Modal from "react-modal";
import { IoMdClose } from "react-icons/io";

const ModalRegistroGrupo = ({
  modalIsOpen,
  closeModal,
  groupData,
  handleFileChange,
  handleInputChange,
  handleCheckboxChange,
  handleSubmit,
  integrantesPosibles,
}) => (
  <Modal
    isOpen={modalIsOpen}
    onRequestClose={closeModal}
    className="fixed inset-0 flex items-center justify-center"
    overlayClassName="fixed inset-0 bg-black bg-opacity-50"
  >
    <div className="bg-blue-modal w-[1050px] h-[650px] rounded-lg flex flex-col font-title">
      <div className="relative">
        <h2 className="text-2xl font-semibold text-center text-white p-4">
          Registrar Grupo empresa
        </h2>
        <button
          type="button"
          onClick={closeModal}
          className="absolute top-4 right-4 text-white px-2 py-2 hover:text-black"
        >
          <IoMdClose className="w-6 h-6" />
        </button>
      </div>
      <form
        id="grupoForm"
        onSubmit={handleSubmit}
        className="flex flex-1 bg-white"
      >
        <div className="w-1/2 flex flex-col items-center justify-center border-r">
          <label className="font-semibold mb-2">Logotipo*</label>
          {groupData.logo ? (
            <div className="bg-light-blue w-64 h-64 rounded-lg flex items-center justify-center">
              <img
                src={URL.createObjectURL(groupData.logo)}
                alt="Vista previa"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          ) : (
            <div className="bg-light-blue w-64 h-64 rounded-lg flex items-center justify-center text-gray-600">
              Subir foto
            </div>
          )}
          <input
            type="file"
            name="logo"
            onChange={handleFileChange}
            className="hidden"
            id="fileInput"
          />
          <button
            type="button"
            onClick={() => document.getElementById("fileInput").click()}
            className="mt-4 bg-blue-modal text-white px-4 py-2 rounded-lg hover:bg-semi-blue"
          >
            Seleccionar archivo
          </button>
        </div>

        <div className="w-1/2 bg-white p-6">
          <div className="space-y-4">
            <div>
              <label className="block font-semibold mb-2">Nombre Largo*</label>
              <input
                type="text"
                name="nombreLargo"
                value={groupData.nombreLargo}
                onChange={handleInputChange}
                className="block w-full border border-gray-300 rounded-lg p-2 bg-light-blue"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Nombre corto*</label>
              <input
                type="text"
                name="nombreCorto"
                value={groupData.nombreCorto}
                onChange={handleInputChange}
                className="block w-full border border-gray-300 rounded-lg p-2 bg-light-blue"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Integrantes*</label>
              <div className="bg-light-blue border border-gray-300 rounded-lg p-4 h-48 overflow-y-auto">
                {integrantesPosibles.map((integrante) => (
                  <div key={integrante} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      checked={groupData.integrantes.includes(integrante)}
                      onChange={() => handleCheckboxChange(integrante)}
                      className="mr-2"
                    />
                    <span>{integrante}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </form>
      <div className="bg-blue-modal flex justify-end p-4">
        <button
          type="button"
          onClick={closeModal}
          className="bg-white text-black px-4 py-2 rounded-lg mr-4 hover:bg-red-500 hover:text-white"
        >
          Cancelar
        </button>
        <button
          type="submit"
          form="grupoForm"
          className="bg-white text-black px-4 py-2 rounded-lg hover:bg-semi-blue hover:text-white"
        >
          Registrar
        </button>
      </div>
    </div>
  </Modal>
);

export default ModalRegistroGrupo;
