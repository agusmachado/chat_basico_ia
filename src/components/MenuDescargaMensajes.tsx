import { useState } from "react"
import { saveAs } from "file-saver";
import { TipoDocumento } from "../types/documento"
import { generarPdf } from "../utils/generarPdf";
import { generarWord } from "../utils/generarWord";
import { generarXlsx } from "../utils/generarXlsx";
import { guardarDocumento } from "../utils/guardarDocumento";

type PropMenuDescarga = {
    contenido: string
}

export default function MenuDescargaMensajes({ contenido }: PropMenuDescarga) {

    const [abierto, setAbierto] = useState(false)

    const titulo = contenido.slice(0, 40).replace(/\s+/g,"_")

    const descargar = (tipo: TipoDocumento ) => {

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

        guardarDocumento(tipo, contenido)
        
        setAbierto(false)
    }

  return (
    <div className="relative inline-block text-left">
        <button
            onClick={() => setAbierto(!abierto)}
            className="text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded mt-1"
        >
            Descargar
        </button>

        { abierto && (
            <div className="absolute mt-1 bg-zinc-800 rounded shadow p-2 flex gap-2 z-50 min-w-[250px]">
                <button
                    onClick={() => descargar("pdf")}
                    className="bg-zinc-700 px-3 py-1 rounded hover:bg-zinc-600 text-sm"
                >
                    PDF
                </button>

                <button
                    onClick={() => descargar("word")}
                    className="bg-zinc-700 px-3 py-1 rounded hover:bg-zinc-600 text-sm"
                >
                    WORD
                </button>

                <button
                    onClick={() => descargar("txt")}
                    className="bg-zinc-700 px-3 py-1 rounded hover:bg-zinc-600 text-sm"
                >
                    TXT
                </button>

                <button
                    onClick={() => descargar("xlsx")}
                    className="bg-zinc-700 px-3 py-1 rounded hover:bg-zinc-600 text-sm"
                >
                    EXCEL
                </button>
            </div>
        )}
        
    </div>
  )
}
