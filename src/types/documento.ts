 export type TipoDocumento = "pdf" | "word" | "xlsx" | "txt"


 export type Documento = {
    id: number
    tipo: TipoDocumento
    titulo: string
    contenido: string
    fecha: string
 }