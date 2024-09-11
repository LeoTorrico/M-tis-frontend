import Sidebar from './Components/Sidebar'
import './App.css'
import Inicio from './Pages/Inicio'

function App() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-grow p-4">
        
        <h1 className="text-2xl font-bold">Página Principal</h1>
          <Inicio />
      </div>
    </div>
  )
}

export default App
