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
                    this.tableroArray[i][j] = this.tablero[index]
                } else {
                    this.tableroArray[i][j] = "0"
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

        let col
        let row = -1
        for(let i = 0; i < this.rows * this.columns; i++) {            
            col = i % this.columns

            if(i % this.columns == 0)
                row++

            main.innerHTML += `\t<p data-row="${row}" data-col="${col}"></p>\n`
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
                if(this.tableroArray[i][j] === "0") {
                    /*
                        Cada vez que el elemento "p" designado
                        se clique con el puntero del raton la funcion 
                        anonima se ejecutara cambiando el "state" de dicho
                        elemento a "clicked"

                        Solo puede haber un estado de "clicked"
                    */                   
                    paragraphs[pCounter].onclick = function() {
                        let paragraph = document.querySelector('p[data-state="clicked"]')
                        if(paragraph != null) {
                            paragraph.dataset.state = "blocked"
                            this.dataset.state = "clicked"
                        } else {
                            this.dataset.state = "clicked"
                        }
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
        let clickedParagraph = document.querySelector('p[data-state="clicked"]')
        let row = clickedParagraph.dataset.row
        let col = clickedParagraph.dataset.col

        //1. No existe un número igual en la misma fila de la casilla seleccionada
        if(this.tableroArray[row].includes(key))
            return        
        //2. No existe un número igual en la misma columna de la casilla seleccionada
        if(this.tableroArray.map(e => e[col]).includes(key))
            return
        //3. No existe un número igual en la sub-cuadrícula de 3 x 3 en la que se encuentra la celda 
        let quadrant = new Array();
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {                
                quadrant.push(this.tableroArray[3 * Math.floor(row / 3) + i][3 * Math.floor(col / 3) + j]);
            }
        }
        if(quadrant.includes(key))
            return
        
        // Numero válido
        clickedParagraph.onclick = function(){return}
        clickedParagraph.dataset.state = "correct"
        clickedParagraph.innerHTML = key
    } 
}

