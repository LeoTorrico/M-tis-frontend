import React from "react";
import Modal from "react-modal";
import { IoMdClose } from "react-icons/io";
import { RingLoader } from "react-spinners";
const ModalRegistroGrupo = ({
  modalIsOpen,
  closeModal,
  groupData,
  handleFileChange,
  handleInputChange,
  handleSubmit,
  integrantesPosibles,
  rolesPosibles,
  loading,
  handleIntegranteChange,
  handleRolChange,
  handleAddIntegrante,
}) => {
  // Limit the number of integrantes to 6
  const addIntegrante = () => {
    if (groupData.integrantes.length < 6) {
      handleAddIntegrante();
    } else {
      alert("Se ha alcanzado el límite máximo de 6 integrantes.");
    }
  };

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      className="fixed inset-0 flex items-center justify-center"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <div className="bg-blue-modal w-[1050px] h-[650px] rounded-xl flex flex-col font-title">
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
        {loading ? (
          <div className="flex justify-center items-center flex-1">
            <RingLoader color={"#ffffff"} size={150} />
          </div>
        ) : (
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
                    src={`data:image/jpeg;base64,${groupData.logo}`}
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

            <div className="w-1/2 bg-white p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <label className="block font-semibold mb-2">
                    Nombre Largo*
                  </label>
                  <input
                    type="text"
                    name="nombreLargo"
                    value={groupData.nombreLargo}
                    onChange={handleInputChange}
                    className="border rounded-lg w-full p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">
                    Nombre Corto*
                  </label>
                  <input
                    type="text"
                    name="nombreCorto"
                    value={groupData.nombreCorto}
                    onChange={handleInputChange}
                    className="border rounded-lg w-full p-2"
                    required
                  />
                </div>

                {/* Scrollable area for integrantes */}
                <div className="max-h-[200px] overflow-y-auto border p-2 rounded-lg">
                  {groupData.integrantes.map((integrante, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 p-2"
                    >
                      <select
                        value={integrante.codigo_sis || ""}
                        onChange={(e) =>
                          handleIntegranteChange(index, e.target.value)
                        }
                        className="border rounded-lg w-1/2 p-2"
                        required
                      >
                        <option value="" disabled>
                          Seleccionar integrante
                        </option>
                        {integrantesPosibles.map((estudiante) => (
                          <option
                            key={estudiante.codigo_sis}
                            value={estudiante.codigo_sis}
                          >
                            {estudiante.nombre}
                          </option>
                        ))}
                      </select>
                      <select
                        value={integrante.rol || ""}
                        onChange={(e) => handleRolChange(index, e.target.value)}
                        className="border rounded-lg w-1/2 p-2"
                        required
                      >
                        <option value="" disabled>
                          Seleccionar rol
                        </option>
                        {rolesPosibles.map((rol) => (
                          <option key={rol} value={rol}>
                            {rol}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addIntegrante}
                  className="mt-4 bg-blue-modal text-white px-4 py-2 rounded-lg hover:bg-semi-blue"
                >
                  Agregar Integrante
                </button>
              </div>
            </div>
          </form>
        )}
        <div className="bg-blue-modal flex justify-end p-4 rounded-xl">
          <button
            type="button"
            onClick={closeModal}
            form="grupoForm"
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
};

export default ModalRegistroGrupo;
