class Crucigrama {
    constructor() {
        this.dificultad = "facil"
        this.setBoard()
        this.columns = 9
        this.rows = 11
        this.init_time
        this.end_time
        this.boardArray = [...Array(this.rows)].map(e => Array(this.columns))
        this.tiempo
        this.start()
    }

    setBoard() {
        switch(this.dificultad) {
            case "facil":
                this.board = "4,*,.,=,12,#,#,#,5,#,#,*,#,/,#,#,#,*,4,- ,.,=,.,#,15,#,.,*,#,=,#,=,#,/,#,=,.,#,3,#,4,*,.,=,20,=,#,#,#,#,#,=,#,#,8,#,9,-,.,=,3,#,.,#,#,- ,#,+,#,#,#,*,6,/,.,=,.,#,#,#,.,#,#,=,#,=,#,#,#,=,#,#,6,#,8,*,.,=,16"
                break
            case "medio":
                this.board = "12,*,.,=,36,#,#,#,15,#,#,*,#,/,#,#,#,*,.,- ,.,=,.,#,55,#,.,*,#,=,#,=,#,/,#,=,.,#,15,#,9,*,.,=,45,=,#,#,#,#,#,=,#,#,72,#,20,-,.,=,11,#,.,#,#,- ,#,+,#,#,#,*,56,/,.,=,.,#,#,#,.,#,#,=,#,=,#,#,#,=,#,#,12,#,16,*,.,=,32"
                break
            default:
                this.board = "4,.,.,=,36,#,#,#,25,#,#,*,#,.,#,#,#,.,.,- ,.,=,.,#,15,#,.,*,#,=,#,=,#,.,#,=,.,#,18,#,6,*,.,=,30,=,#,#,#,#,#,=,#,#,56,#,9,- ,.,=,3,#,.,#,#,*,#,+,#,#,#,*,20,.,.,=,18,#,#,#,.,#,#,=,#,=,#,#,#,=,#,#,18,#,24,.,.,=,72"
        }
    }

    start() {
        // Esta variable hace referencia al indice en la cadena
        let cadena = this.board.split(",")
        let index = 0
        for(let i = 0; i < this.rows; i++) {
            for(let j = 0; j < this.columns; j++) {
                switch(cadena[index]) {
                    case '.':
                        this.boardArray[i][j] = 0
                        break
                    case '#':
                        this.boardArray[i][j] = -1
                        break
                    default:
                        this.boardArray[i][j] = cadena[index]
                }
                index++
            }
        }
    }

    paintMathword() {
        let main = $("main")     

        let col
        let row = -1
        let paragraph
        for(let i = 0; i < this.rows * this.columns; i++) {            
            col = i % this.columns

            if(i % this.columns == 0)
                row++

            paragraph = $("<p></p>")
            paragraph.attr("data-row", row)
            paragraph.attr("data-col", col)
            
            switch(this.boardArray[row][col]) {
                case 0:
                    
                    paragraph.click(function() {
                        let clicked = $('p[data-state="clicked"]')

                        if(clicked != null) {
                            clicked.attr("data-state", "")
                        }
                        
                        this.attr("data-state", "clicked")                        
                    }.bind(paragraph, this))
                    break
                case -1:
                    paragraph.attr("data-state", "empty")
                    break
                default:
                    paragraph.html(this.boardArray[row][col])
                    paragraph.attr("data-state", "blocked")
            }

            main.append(paragraph)
        }
        this.init_time = Date.now()
    }

    check_win_conditions() {
        for(let i = 0; i < this.rows; i++) {
            for(let j = 0; j < this.columns; j++) {
                if(this.boardArray[i][j] == 0)
                    return false
            }
        }
        return true
    }

    calculate_date_difference() {
        let milliseconds = Math.abs(this.end_time - this.init_time);
        this.tiempo = milliseconds

        let seconds = Math.floor((milliseconds / 1000) % 60);
        let minutes = Math.floor((milliseconds / 1000 / 60) % 60);
        let hours = Math.floor((milliseconds / 1000 / 60 / 60) % 24);
        

        return `${hours}:${minutes}:${seconds}`
    }

    introduceElement(key) {
        if(/^[0-9]+|[\+\-\*\/\=]$/.test(key)) {
            let expression_row = true
            let expression_col = true
            let cell = $('p[data-state="clicked"]')
            let initRow = cell.data("row")
            let initCol = cell.data("col")
            let row = initRow
            let col = initCol
            this.boardArray[row][col] = key
            

            let first_number
            let second_number
            let expression
            let result

            let exp
            let evalExp

            // Comprobar expresion horizontal
            if((col + 1) < this.columns && this.boardArray[row][col + 1] != -1) {
                // Encontrar primer caracter "=" a la derecha
                // Y si esta en el extremo derecho o abajo del todo????
                do {
                    col++
                } while(this.boardArray[row][col] != "=")
                first_number = this.boardArray[row][col - 3]
                second_number = this.boardArray[row][col - 1]
                expression = this.boardArray[row][col - 2]
                result = this.boardArray[row][col + 1]

                if(first_number != 0 && second_number != 0 && expression != 0 && result != 0) {
                    exp = [first_number, expression, second_number].join('')
                    evalExp = eval(exp)
                    if(evalExp != result)
                        expression_row = false
                }
            }

            col = initCol

            // Comprobar expresion vertical
            if((row + 1) < this.columns && this.boardArray[row + 1][col] != -1) {
                // Encontrar primer caracter "=" a la derecha
                do {
                    row++
                } while(this.boardArray[row][col] != "=")
                first_number = this.boardArray[row - 3][col]
                second_number = this.boardArray[row - 1][col]
                expression = this.boardArray[row - 2][col]
                result = this.boardArray[row + 1][col]

                if(first_number != 0 && second_number != 0 && expression != 0 && result != 0) {
                    exp = [first_number, expression, second_number].join('')
                    evalExp = eval(exp)
                    if(evalExp != result)
                        expression_row = false
                }
            }

            if(expression_row && expression_col) {
                cell.html(key)
                cell.attr("data-state", "correct")
            } else {
                cell.html("") // Cuando el valor es incorrecto que data state???
                this.boardArray[initRow][initCol] = 0
            }
        } else {
            alert("Solo son válidos valores del 1 al 9 y los operadores matematios +,-,*,/.")
        }

        if(this.check_win_conditions()) {
            this.end_time = Date.now()
            alert(`Has completado el crucigrama en un tiempo de: ${this.calculate_date_difference()}`)
            this.createRecordForm()
        }

    }

    createRecordForm() {
        let form = $("<form action='#' method='POST' name='record'></form>")        
        // Añadir nombre
        form.append("<label for='nombre'>Nombre:</label>")
        form.append("<input id='nombre' name='nombre' type='text' value='aaa' />")
        // Añadir apellidos
        form.append("<label for='apellidos'>Apellidos:</label>")
        form.append("<input id='apellidos' name='apellidos' type='text' value='aaa' />")
        // Añadir Dificultad
        form.append("<label for='dificultad'>Dificultad:</label>")
        form.append(`<input id='dificultad' name='dificultad' type='text' value='${this.dificultad}' readonly />`)
        // Añadir Tiempo
        form.append("<label for='tiempo'>Tiempo:</label>")
        form.append(`<input id='tiempo' name='tiempo' type='number' value='${this.tiempo}' readonly />`)
        form.append("<input type='submit' value='Enviar'/>")

        $("main").after(form)
    }
}



let crucigrama = new Crucigrama()