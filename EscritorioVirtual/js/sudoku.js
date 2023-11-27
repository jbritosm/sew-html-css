class Sudoku {
    constructor(cadena) {
        this.tablero = cadena
        this.rows = 9
        this.columns = 9
        this.tableroArray = [...Array(this.rows)].map(e => Array(this.columns))
        this.start()
    }

    start() {
        // Esta variable hace referencia al indice en la cadena
        let index = 0
        for(let i = 0; i < this.rows; i++) {
            for(let j = 0; j < this.columns; j++) {
                if(this.tablero[index] != '.') {
                    this.tableroArray[i][j] = parseInt(this.tablero[index])
                } else {
                    this.tableroArray[i][j] = 0
                }
                index++
            }
        }
    }

    /*
        Este metodo genera parrafos que representan las celdas
        del Sudoku.  
    */
    createStructure() {
        let main = document.getElementsByTagName("main")[0]
        
        for(let i = 0; i < this.rows * this.columns; i++) {
            main.innerHTML += "\t<p></p>\n"
        }
    }

    /*
        Este metodo rellena cada uno de esos parrafos
    */
    paintSudoku() {
        this.createStructure()
        let paragraphs = document.getElementsByTagName("p")

        // Esta variable hace referencia al parrafo a modificar
        let pCounter = 0
        for(let i = 0; i < this.rows; i++) {
            for(let j = 0; j < this.columns; j++) {
                if(this.tableroArray[i][j] === 0) {
                    /*
                        Cada vez que el elemento "p" designado
                        se clique con el puntero del raton la funcion 
                        anonima se ejecutara cambiando el "state" de dicho
                        elemento a "clicked"

                        Solo puede haber un estado de "clicked"
                    */                   
                    paragraphs[pCounter].onclick = function() {
                        this.dataset.state = "clicked"
                    }.bind(paragraphs[pCounter], this)
                } else {
                    paragraphs[pCounter].innerHTML = this.tableroArray[i][j]
                    paragraphs[pCounter].dataset.state = "blocked"
                }
                pCounter++
            }
        }
    }

    introduceNumber(key) {
        
    } 
}

