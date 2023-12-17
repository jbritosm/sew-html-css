class Noticias {
    constructor() {
        this.fileContent = ""
    }

    leerArchivoTexto(files) 
    { 
        //Solamente toma un archivo
        //var archivo = document.getElementById("archivoTexto").files[0];
        let archivo = files[0];
        let tipoTexto = /text.*/;
        if (archivo.type.match(tipoTexto)) {
            var lector = new FileReader();
            lector.onload = function (evento) {
                //El evento "onload" se lleva a cabo cada vez que se completa con éxito una operación de lectura
                //La propiedad "result" es donde se almacena el contenido del archivo
                //Esta propiedad solamente es válida cuando se termina la operación de lectura
                let noticias = this.parseFile(lector.result)
                for(let i = 0; i < noticias.length; i++) {
                    let text = `
                        <section>\n
                            <h3>Titulo: ${noticias[i]["titulo"]}</h3>\n
                            <p>Subtitulo: ${noticias[i]["titulo"]}</p>\n
                            <p>Texto: ${noticias[i]["texto"]}</p>\n
                            <p>Autor: ${noticias[i]["autor"]}</p>\n
                        </section>\n
                    `
                    $("body form").before(text)
                }                
            }.bind(this)
            lector.readAsText(archivo);
        } else {
            errorArchivo.innerText = "Error : ¡¡¡ Archivo no válido !!!";
        }       
    };

    parseFile(texto) {
        let resultado = []
        let noticias = texto.split("\n")

        let elementos
        for (let noticia in noticias) {
            elementos = noticias[noticia].split("_")
            resultado.push({
                "titulo": elementos[0],
                "subtitulo": elementos[1],
                "texto": elementos[2],
                "autor": elementos[3]
            })
        }
        return resultado
    }

    anadirNoticia() {
        let inputs = $("form input")   
        
        for(let i = 0; i < inputs.length; i++) {
            if (inputs[i].value === "" || inputs[i].value === "") {
                alert("Por favor rellena todos los campos.")
                return
            }
        }
        
        let text = `
            <section>\n
                <h3>Titulo: ${inputs[0].value}</h3>\n
                <p>Subtitulo: ${inputs[1].value}</p>\n
                <p>Texto: ${inputs[2].value}</p>\n
                <p>Autor: ${inputs[3].value}</p>\n
            </section>\n
        `
        $("body form").before(text)                       
    }
}

let noticias = new Noticias()