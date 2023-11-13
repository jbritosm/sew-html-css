class Memoria {
    constructor() {
        this.elements = {
            "element1": {
                "nombre": "HTML5",
                "source": "https://upload.wikimedia.org/wikipedia/commons/3/38/HTML5_Badge.svg"
            },
            "element2": {
                "nombre": "HTML5",
                "source": "https://upload.wikimedia.org/wikipedia/commons/3/38/HTML5_Badge.svg"
            },
            "element3": {
                "nombre": "CSS3",
                "source": "https://upload.wikimedia.org/wikipedia/commons/6/62/CSS3_logo.svg"
            },
            "element4": {
                "nombre": "CSS3",
                "source": "https://upload.wikimedia.org/wikipedia/commons/6/62/CSS3_logo.svg"
            },
            "element5": {
                "nombre": "JS",
                "source": "https://upload.wikimedia.org/wikipedia/commons/b/ba/Javascript_badge.svg"
            },
            "element6": {
                "nombre": "JS",
                "source": "https://upload.wikimedia.org/wikipedia/commons/b/ba/Javascript_badge.svg"
            },
            "element7": {
                "nombre": "PHP",
                "source": "https://upload.wikimedia.org/wikipedia/commons/2/27/PHP-logo.svg"
            },
            "element8": {
                "nombre": "PHP",
                "source": "https://upload.wikimedia.org/wikipedia/commons/2/27/PHP-logo.svg"
            },
            "element9": {
                "nombre": "SVG",
                "source": "https://upload.wikimedia.org/wikipedia/commons/4/4f/SVG_Logo.svg"
            },
            "element10": {
                "nombre": "SVG",
                "source": "https://upload.wikimedia.org/wikipedia/commons/4/4f/SVG_Logo.svg"
            },
            "element11": {
                "nombre": "W3C",
                "source": "https://upload.wikimedia.org/wikipedia/commons/5/5e/W3C_icon.svg"
            },
            "element12": {
                "nombre": "W3C",
                "source": "https://upload.wikimedia.org/wikipedia/commons/5/5e/W3C_icon.svg"
            }             
        }
        this.hasFlipped = false
        this.lockBoard = false
        this.firstCard = null
        this.secondCard = null
    }

    shuffleElements() {
        let newJson = {}

        let array = Object.keys(this.elements)
        let currentIndex = array.length,  randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex > 0) {

            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
        
        array.forEach(
            element => newJson[element] = this.elements[element]
        )

        return newJson
    }
}

var memoria = new Memoria()
console.log(memoria.elements)
