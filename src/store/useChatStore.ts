import { create } from "zustand";
import { Mensaje } from "../types/mensaje";


type EstadoChat = {
    mensajes: Mensaje[]
    agregarMensaje: (mensaje: Mensaje) => void
}

export const useChatStore = create<EstadoChat>((set) =>({

    // Estado inicial de - IndexVentanaChat
    mensajes: [
        {
            id: 1,
            rol: "bot",
            texto: "Hola, soy el bot super inteligente con IA, ¿en qué te puedo ayudar?"
        }
    ],

    agregarMensaje: (mensaje) =>
        set((state) => ({
            mensajes: [
                ...state.mensajes,
                mensaje
            ]
        }))
}))