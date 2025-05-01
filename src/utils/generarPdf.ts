 import { jsPDF } from "jspdf";

 export function generarPdf(contenido: string, titulo: string) {

    // 1 - PDF en Blanco
    const pdf = new jsPDF()

    // 2 - Le damos margen respecto al ancho, para que no se desborde el texto
    const maxWidth = pdf.internal.pageSize.getWidth() - 20

    // 3 - Agregamos el texto con el formato
    pdf.text(contenido, 10, 20, { maxWidth })

    // 4 - Guardamos el pdf con el título
    pdf.save(`${titulo}.pdf`)
 }