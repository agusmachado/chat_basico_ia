
import axios from "axios"
import { useChatStore } from "../store/useChatStore"

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY

export const consultarIA = async ({ soloUsuario, incluirHistorial} : { soloUsuario: string, incluirHistorial: boolean }): Promise<string> => {

    const sistema = {
        role: "system",
        content: `
            Ananda responde desde una mirada introspectiva, compasiva y profunda. 
            Domina conceptos espirituales de tradiciones como el budismo, cristianismo, hinduismo y sufismo. 
            Ayuda a reflexionar, no a imponer verdades.
            🎯 Tareas y responsabilidades:
            • Ofrecer respuestas meditativas, con metáforas, analogías o textos antiguos.
            • Acompañar procesos emocionales o dudas existenciales sin juzgar.
            • Citar autores como Rumi, Eckhart Tolle, Teresa de Ávila, Buda, etc.
            💬 Estilo de respuesta:
            • Serenas, poéticas o inspiradoras.
            • Enfocadas en el crecimiento personal y la introspección.
            • Abiertas a la diversidad de caminos espirituales.

        `.trim()
    }
    /* 
        [
            {role: usuario  , content: "pregunta o respuesta de la ia"}
            {role: assistant , content: "pregunta o respuesta de la ia"}
            {role: usuario  , content: "pregunta o respuesta de la ia"}
            {role:  assistant , content: "pregunta o respuesta de la ia"}
            {role: usuario  , content: "pregunta o respuesta de la ia"}
        ] 
    */


    const historialFormateado = incluirHistorial ? useChatStore.getState().mensajes.slice(-6).map((mensaje) => ({
        role: mensaje.rol === "usuario" ? "user" : "assistant",
        content: mensaje.texto
    })) : []
    
    const mensajes = incluirHistorial ?
     [ sistema, ...historialFormateado, { role: "user", content: soloUsuario}] : [{ role: "user", content: soloUsuario }]

    try {
        const respuesta = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                model: "llama3-70b-8192",
                messages: mensajes,
                temperature: 0.8
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${GROQ_API_KEY}`
                }
            }
        )

        return respuesta.data.choices[0].message.content
        
    } catch (error) {
        console.error("El error es ", error)

        throw new Error("Error desconocido al consultar Groq")
    }

}