import Sidebar from './Components/Sidebar'
import './App.css'

function App() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-grow p-4">
        {/* Aquí va el contenido de la página principal */}
        <h1 className="text-2xl font-bold">Página Principal</h1>
        {/* Más contenido */}
        <h1>Hola mundo</h1>
      </div>
    </div>
  )
}

export default App
