import { Route, Routes } from 'react-router-dom';
import './App.css'
import RegistroEstudiante from './Components/Registros/RegistroEstudiantes'
import Home from './Pages/Home/Home';
function App() {
  return (
    <div className="flex">
     
      <Routes>
        <Route path='/RegistroEstudiante' element={<RegistroEstudiante></RegistroEstudiante>} />
        <Route path='/' element={<Home></Home>} />

           </Routes>
    </div>
  )
}

export default App
