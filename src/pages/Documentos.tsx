import { Link } from "react-router-dom";
import { useDocumentosStore } from "../store/useDocumentosStore";
import { useState } from "react";
import { saveAs } from "file-saver";
import { generarPdf } from "../utils/generarPdf";
import { generarWord } from "../utils/generarWord";
import { generarXlsx } from "../utils/generarXlsx";


export default function Documentos() {

  const documentos = useDocumentosStore((state) => state.documentos)
  const eliminarDocumento = useDocumentosStore((state) => state.eliminarDocumento)
  const borrarTodo = useDocumentosStore((state) => state.borrarTodo)
  const renombrarDocumento = useDocumentosStore((state) => state.renombrarDocumento)

  // - Guardamos el ID del documento que estamos editando
 const [ editandoId, setEditandoId ] = useState<number | null>(null)

 // Guardamos el nuevo título, mientras que el usuario escribe en el input
 const [ nuevoTitulo, setNuevoTitulo ] = useState("")

const descargar = (doc: (typeof documentos) [number]) => {
  const { contenido, tipo, titulo } = doc

          if (tipo === "txt") {
                      const blob = new Blob( [contenido], { type: "text/plain;charset=utf-8" })
                      saveAs(blob, `${titulo}.txt`)
                  }
  
          if (tipo === "pdf") {
             generarPdf(contenido, titulo) 
          }
  
          if (tipo === "word") {
              generarWord(contenido, titulo)
          }
  
          if (tipo === "xlsx") {
              generarXlsx(contenido, titulo)
          }
}

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6">
        <div className="mb-4">
            <Link
                to="/"
                className="text-sm bg-zinc-700 hover:bg-zinc-600 px-3 py-1 rounded"
            >
                Volver al Chat
            </Link>
        </div>

        <h1 className="text-2xl font-semibold mb-4">Documentos Generados</h1>
        
          { documentos.length === 0 ?

          ( <p className="text-gray-400">No hay documentos guardados todavía</p>)
          :
          (
            <ul className="space-y-4 mt-6">
              {documentos.map((doc) => ( 
                <li 
                  key={doc.id}
                  className="bg-zinc-700 p-4 rounded-lg flex justify-between items-start"
                >
                  <div>
                    {editandoId === doc.id ? (
                      <div>
                        <input 
                          type="text" 
                          value={nuevoTitulo}
                          onChange={(e) => setNuevoTitulo(e.target.value)}
                          className="text-sm bg-zinc-700 text-white px-2 py-1 rounded"
                        />

                        <button
                          onClick={() => {
                            renombrarDocumento(doc.id, nuevoTitulo)
                            setEditandoId(null)
                          }}
                          className="bg-green-600 hover:bg-green-700 text-sm px-2 py-1 rounded"
                        > 
                          Aceptar
                        </button>
                        <button
                          onClick={() => setEditandoId(null)}
                          className="bg-zinc-600-600 hover:bg-zinc-700 text-sm px-2 py-1 rounded"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 mb-2">
                        <h2 className="font-semibold text-lg">{doc.titulo}</h2>
                        <button
                          onClick={() =>{
                            setEditandoId(doc.id)
                            setNuevoTitulo(doc.titulo)
                          }} 
                          className="text-sm text-blue-400 hover:underline cursor-pointer"
                        >
                          Editar
                        </button>               
                      </div>
                    )}
                    

                      <p className="text-sm text-gray-400 mb-2">{doc.fecha}</p>
                      <p className="text-sm line-clamp-3 max-w-xl text-gray-300">{doc.contenido}</p>

                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <button 
                      onClick={() => descargar(doc)}
                      className="text-sm bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded cursor-pointer"
                    >
                      Descargar
                    </button>
                    <button 
                      onClick={() => eliminarDocumento(doc.id)}
                      className="text-sm bg-red-600 hover:bg-red-700 px-3 py-1 rounded cursor-pointer"
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )
        }

        <div className="mt-6">
          <button 
            onClick={borrarTodo}
            className="text-sm bg-red-700 hover:bg-red-800 px-3 py-1 rounded cursor-pointer"
          >
            Borrar todo
          </button>
        </div>
        
    </div>
  )
}
