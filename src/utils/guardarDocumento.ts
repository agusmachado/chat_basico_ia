import { useDocumentosStore } from "../store/useDocumentosStore";
import { Documento, TipoDocumento } from "../types/documento";

export function guardarDocumento(tipo: TipoDocumento, contenido: string) {

    const agregarDocumento = useDocumentosStore.getState().agregarDocumento

    const documento: Documento = {
        id: Date.now(),
        tipo,
        contenido,
        titulo: contenido.slice(0, 40).replace(/\s+/g,"_"),
        fecha: new Date().toISOString()
    }

    agregarDocumento(documento)
}