import Sidebar from '../../Components/Sidebar'
function Home (){
    return (
        <div>
             <Sidebar />
      <div className="flex-grow p-4">
        {/* Aquí va el contenido de la página principal */}
        <h1 className="text-2xl font-bold">Página Principal</h1>
        {/* Más contenido */}
      
      </div>
        </div>
    )
}
export default Home;