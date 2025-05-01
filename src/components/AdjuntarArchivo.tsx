/* 
    usuario selecciona un archivo 
        => valida + extraer el texto 
            => vista previa 
                => 
                no => Borra el texto
                si => Se envía la información al chat
*/

const EXTENSIONES_MIME_VALIDAS = [
    "application/pdf", // PDF
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
    "text/plain", // TXT
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // XLSX
]

import { useState } from "react"
import { LIMITE_TEXTO } from "../config/limites"
import { leerDocx } from "../utils/leerDocx"
import { leerPdf } from "../utils/leerPdf"
import { leerXlsx } from "../utils/leerXlsx"

const MAX_SIZE_BYTES = 5 * 1024 * 1024

const EXTENSIONES_VALIDAS = ["pdf", "docx", "txt", "xlsx"]

type PropAdjuntarArchivo = {
    envioTextoExtraido: (
        entrada: {
            texto: string
            esArchivo: boolean
        }
    ) => void
} 

export default function AdjuntarArchivo({envioTextoExtraido}: PropAdjuntarArchivo) {
    
   const [ texto, setTexto ] = useState("")

   const manejarArchivo = async (e: React.ChangeEvent<HTMLInputElement>) => {

    const archivo = e.target.files?.[0]
    if (!archivo) return 

    const extension = archivo.name.split(".").pop()?.toLowerCase()

    // Validaciones Generales

    if (!extension || !EXTENSIONES_VALIDAS.includes(extension)) {
        alert("Formato de archivo no permitido")
        return
    }

    if (!EXTENSIONES_MIME_VALIDAS.includes(archivo.type)) {
        alert("Tipo MIME no permitido")
        return
    }

    if (archivo.size > MAX_SIZE_BYTES) {
        alert("El archivo excede el tamaño máximo permitido (5 mb)")
        return
    }

    // Procesamos archivos por su tipo

    // TXT
    if (extension === "txt") {
        const lector = new FileReader()
        lector.onload = () => {
            const resultado = (lector.result as string).slice(0, LIMITE_TEXTO)
            setTexto(resultado)
        }
        lector.readAsText(archivo)
        return
    }

    // DOCX
    if (extension === "docx") {
        const lector = new FileReader() // 1 - Nuevo archivo
        // 2 - Cómo vamos a procesar el archivo y por ende, cómo se tiene que leer el archivo
        // 4 - readAsArrayBuffer nos devuelve el contenido crudo y ya estamo listos para procesar el contenido y enviarlo a IndexVentanaChat, a través de setTexto
        lector.onload = async () => {
            const resultado = await leerDocx(archivo)
            setTexto(resultado)
        }
        // 3 - Leemos el archiov de acuerdo a las especificaciones que nos indican en lector.onload
        lector.readAsArrayBuffer(archivo)
        return
    }

    // PDF
    if (extension === "pdf") {
        const resultado = await leerPdf(archivo)
        setTexto(resultado)
        return
    }

    // XLSX
    if (extension === "xlsx") {
        const lector = new FileReader()
        lector.onload = async () => {
            const resultado = await leerXlsx(archivo)
            setTexto(resultado)
        }
        lector.readAsArrayBuffer(archivo)
    }

   }


   // Función para confirmar
   const confirmar = () => {    
    envioTextoExtraido({
        texto,
        esArchivo: true
    })
    setTexto("")
   }


   // Función para cancelar
   const cancelar = () => {
    setTexto("")
   }


  return (
    <div className="mt-4 space-y-2">
        <label
            className="inline-block cursor-pointer text-sm bg-zinc-700 text-white px-3 py-1 rounded hover:bg-zinc-500"
        >
            Elegir archivo
            <input 
                type="file" 
                accept=".txt, .pdf, .docx, .xlsx"
                className="hidden"
                onChange={manejarArchivo}
            />
        </label>

        {texto &&(
            <div className="text-sm bg-zinc-800 p-3 rounded text-center">
            <p className="mb-2">¿Querés analizar este archivo?</p>
            <div className="flex justify-center gap-2">
                <button
                    onClick={confirmar}
                    className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600"
                >
                    Sí
                </button>

                <button
                    onClick={cancelar}
                    className="bg-amber-700 px-3 py-1 rounded hover:bg-amber-800"
                >
                    No
                </button>
            </div>
        </div>
        )}
        
    </div>
  )
}
