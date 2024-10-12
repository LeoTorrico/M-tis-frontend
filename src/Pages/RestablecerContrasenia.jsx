import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function RestablecerContraseniaEstudiante() {
  const { token } = useParams(); // Captura el token desde la URL
  const [newPassword, setNuevaContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [error, setError] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate(); 

  const errorMessages = {
    contrasena: "Contraseña debe tener entre 12 y 30 caracteres, y contener mayúsculas y minúsculas.",
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 

    const isNewPasswordValid = newPassword.length >= 12 && newPassword.length <= 30 && /[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword);
    const isConfirmPasswordValid = confirmarContrasena.length >= 12 && confirmarContrasena.length <= 30 && /[A-Z]/.test(confirmarContrasena) && /[a-z]/.test(confirmarContrasena);


    if (!isNewPasswordValid || !isConfirmPasswordValid) {
      setError(errorMessages.contrasena);
      return;
    }

    if (newPassword !== confirmarContrasena) {
      setError('Las contraseñas no coinciden.'); 
      return;
    }

    const datos = {
      token,
      newPassword,
    };

    try {
      const response = await axios.post('http://localhost:3000/password/reset-password', datos);
      setError(''); 
      navigate('/LoginEstudiantes'); 
    } catch (err) {
      setError('Error al restablecer la contraseña. Por favor, intenta nuevamente.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-200">
      <div className="relative">
        <div className="absolute top-[10px] left-1/2 transform -translate-x-1/2 w-36 h-36 flex items-center justify-center rounded-full bg-gray-200">
          <div className="w-32 h-32 flex items-center justify-center rounded-full bg-white border-2 border-shadow-custom">
            <img src="/LogoMTis.svg" alt="Logo Color" className="w-28 h-26" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-16 rounded-xl shadow-custom mt-20 w-[600px]">
          <div className="mb-4 mt-10">
            <h1 className="text-2xl font-Montserrat font-bold text-center mb-4">Restablecer Contraseña</h1>

            <label htmlFor="nuevaContrasena" className="block text-gray-700 font-Montserrat font-bold text-sm">
              Nueva Contraseña
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                id="nuevaContrasena"
                value={newPassword}
                onChange={(e) => setNuevaContrasena(e.target.value)}
                maxLength={30} 
                className="border-2 rounded-lg w-full py-2 px-3 text-gray-700"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <FaEyeSlash className="text-black" /> : <FaEye className="text-black" />}
              </button>
            </div>

            <div className="mb-4">
              <label htmlFor="confirmarContrasena" className="block text-gray-700 font-Montserrat font-bold text-sm">
                Confirmar Nueva Contraseña
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmarContrasena"
                  value={confirmarContrasena}
                  onChange={(e) => setConfirmarContrasena(e.target.value)}
                  maxLength={30} 
                  className="border-2 rounded-lg w-full py-2 px-3 text-gray-700"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash className="text-black" /> : <FaEye className="text-black" />}
                </button>
              </div>
            </div>

            <div className="flex justify-center mt-10">
              <button type="submit" className="bg-sky-blue text-white py-2 px-4 font-Montserrat font-bold text-sm rounded">
                Restablecer Contraseña
              </button>
            </div>

            <div className="text-red-500 mt-4 text-center">
              {error && <p>{error}</p>} 
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RestablecerContraseniaEstudiante;
