import { valibotResolver } from "@hookform/resolvers/valibot"
import { useForm } from "react-hook-form"
import { minLength, object, pipe, string } from "valibot"
import { useChatStore } from "../store/useChatStore"
import { useEffect, useRef, useState } from "react"
import { consultarIA } from "../lib/consultarIA"

// - Esquema de validación con Valibot
const schema = object({
    texto: pipe(
        string(),
        minLength(1, "El mensaje no puede estar vacío")
    )
})

type Formulario = { texto: string }

export default function IndexVentanChat() {

    const mensajes = useChatStore((state) => state.mensajes)
    const agregarMensaje = useChatStore((state) => state.agregarMensaje)

    // React-Hook-Forma
   const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
   } = useForm<Formulario>({
    resolver: valibotResolver(schema)
   })

const [cargando, setCargando ] = useState(false)

const scrollRef = useRef<HTMLDivElement | null>(null)

   const manejarEnvio = async (entrada: string) => {
    agregarMensaje({
        id: Date.now(),
        rol: "usuario",
        texto: entrada
    })
    setCargando(true)
    try {
        const respuesta = await consultarIA({
            soloUsuario: entrada,
            incluirHistorial: true
        })
        agregarMensaje({
            id: Date.now() + 1,
            rol: "bot",
            texto: respuesta
        })
    } catch (error) {
       console.error(error) 
    } finally {
        setCargando(false)
    }
   }  
   
   useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth"})
   }, [mensajes])

  return (
    <div className="flex flex-col h-screen bg-zinc-900 text-white">
        <header className="bg-zinc-800 px-4 py-3 flex justify-between items-center shadow-md">
            <h1 className="text-xl font-semibold">Este el el CHAT - IA</h1>
        </header>
        <main className="flex-1 grid grid-cols-3 gap-4 py-6 overflow-y-auto">
            <div/>
            <div className="flex flex-col space-y-4">
                {mensajes.map((mensaje) => (
                <div
                   key={mensaje.id} 
                   className={`flex 
                    ${mensaje.rol === "usuario" ? "justify-end" : "justify-start"}`}
                >
                    <div
                        className={`w-fit max-w-[95%] px-4 py-2 rounded-xl shadow
                            ${mensaje.rol === "usuario" ? "bg-zinc-500" : "bg-zinc-700"}`}
                    >
                        {mensaje.texto}
                    </div>
                    
                </div> 
                ))} 

                {cargando && (
                    <div className="italic text-gray-400">
                        El bot está escribiendo...
                    </div>
                )} 
                <div ref={scrollRef} />
            </div>  
        </main>
        <footer className="px-4 py-3 border-t border-zinc-700 space-y-4">
            <form 
                onSubmit={handleSubmit((data) => {
                    manejarEnvio(data.texto)
                    reset()
                })}
                className="flex gap-2"
            >
                <input   
                    {...register("texto")}    
                    placeholder="Escribí tu consulta..."               
                    className="flex-1 px-4 rounded-lg bg-zinc-800 text-white placeholder-gray-400"
                />
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
                >
                    Enviar
                </button>
            </form>
            {errors.texto && (
                <p className="text-white bg-red-500 text-center">{errors.texto.message}</p>
            )}
        </footer>
    </div>
  )
}
