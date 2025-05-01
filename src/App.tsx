import { Route, Routes } from "react-router-dom"
import IndexVentanChat from "./components/IndexVentanChat"
import Documentos from "./pages/Documentos"

function App() {
  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <Routes>
        <Route path="/" element={<IndexVentanChat/>}/> 
        <Route path="/documentos" element={<Documentos/>}/>    
      </Routes>
    </div>
  )
}

export default App
