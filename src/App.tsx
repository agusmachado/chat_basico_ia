import { Route, Routes } from "react-router-dom"
import IndexVentanChat from "./components/IndexVentanChat"

function App() {
  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <Routes>
        <Route path="/" element={<IndexVentanChat/>}/>        
      </Routes>
    </div>
  )
}

export default App
