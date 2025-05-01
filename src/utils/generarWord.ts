
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

export function generarWord(contenido: string, titulo: string){
    
    // 1 - Creamos el documento
    const docx = new Document({
        // 2 - Definimos las distintas "secciones"
        sections: [
            {
                // 3 - Dentro de cada sección dividimos el contenido del mensaje en líneas usando split
                children: contenido.split("\n").map((linea) => 
                    // 4 - Para cada línea, creamos un nuevo párrafo
                    new Paragraph({
                        children: [
                            // 5 - Vemos si cada fragmento del texto tiene algún estilo propio (cursiva, negrita, etc...). 
                            // Utilizamos un arreglo porque podríamos tener varios TextRuns
                            new TextRun(linea)
                        ],
                        // 6 - Configuramos el espacio después de cada párrafo. 100 es aprox 7px
                        spacing: { after: 100}
                    })
                )
            }
        ]
    })
    // 7 - Usamos Packer para comnvertir el doc en un blob
    Packer.toBlob(docx).then((blob) => { saveAs(blob, `${titulo}.docx`)})
}