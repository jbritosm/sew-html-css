class Noticias {
    constructor() {
        this.checkNavigator()
        this.fileContent = ""
    }

    checkNavigator() {
        if (window.File && window.FileReader && window.FileList && window.Blob) {  
        //El navegador soporta el API File
            $("body header").after("<p>Este navegador soporta el API File </p>");
        } else {
            $("body header").after("<p>¡¡¡ Este navegador NO soporta el API File y este programa puede no funcionar correctamente !!!</p>");
        }
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
                noticias.array.forEach(noticia => {
                    let text = `
                        <section>
                            <p>Titulo: ${noticia["titulo"]}</p>
                            <p>Subtitulo: ${noticia["titulo"]}</p>
                            <p></p>
                            <p></p>
                        </section>
                    `
                    $("body form").before()
                });
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
}

let noticias = new Noticias()