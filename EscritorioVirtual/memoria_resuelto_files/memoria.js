class Memoria {
    constructor() {
        this.elements = {
            "element1": {
                "element": "HTML5",
                "source": "https://upload.wikimedia.org/wikipedia/commons/3/38/HTML5_Badge.svg"
            },
            "element2": {
                "element": "HTML5",
                "source": "https://upload.wikimedia.org/wikipedia/commons/3/38/HTML5_Badge.svg"
            },
            "element3": {
                "element": "CSS3",
                "source": "https://upload.wikimedia.org/wikipedia/commons/6/62/CSS3_logo.svg"
            },
            "element4": {
                "element": "CSS3",
                "source": "https://upload.wikimedia.org/wikipedia/commons/6/62/CSS3_logo.svg"
            },
            "element5": {
                "element": "JS",
                "source": "https://upload.wikimedia.org/wikipedia/commons/b/ba/Javascript_badge.svg"
            },
            "element6": {
                "element": "JS",
                "source": "https://upload.wikimedia.org/wikipedia/commons/b/ba/Javascript_badge.svg"
            },
            "element7": {
                "element": "PHP",
                "source": "https://upload.wikimedia.org/wikipedia/commons/2/27/PHP-logo.svg"
            },
            "element8": {
                "element": "PHP",
                "source": "https://upload.wikimedia.org/wikipedia/commons/2/27/PHP-logo.svg"
            },
            "element9": {
                "element": "SVG",
                "source": "https://upload.wikimedia.org/wikipedia/commons/4/4f/SVG_Logo.svg"
            },
            "element10": {
                "element": "SVG",
                "source": "https://upload.wikimedia.org/wikipedia/commons/4/4f/SVG_Logo.svg"
            },
            "element11": {
                "element": "W3C",
                "source": "https://upload.wikimedia.org/wikipedia/commons/5/5e/W3C_icon.svg"
            },
            "element12": {
                "element": "W3C",
                "source": "https://upload.wikimedia.org/wikipedia/commons/5/5e/W3C_icon.svg"
            }             
        }
        this.hasFlippedCard = false
        this.lockBoard = false
        this.firstCard = null
        this.secondCard = null

        this.shuffleElements()
        this.createElements()
        this.addEventListeners()
    }

    shuffleElements() {
        let newJson = {}

        let array = Object.keys(this.elements)
        
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        
        array.forEach(element => newJson[element] = this.elements[element])

        this.elements = newJson
    }

    unflipCards() {
        this.lockBoard = true
        
        setTimeout(function() {
            this.firstCard.dataset.state = "init"
            this.secondCard.dataset.state = "init"
            this.resetBoard()
        }.bind(this), 1000)
    }

    resetBoard() {
        this.firstCard = null
        this.secondCard = null
        this.hasFlippedCard = false
        this.lockBoard = false
    }

    checkForMatch() {
        let match = this.firstCard.dataset.element == this.secondCard.dataset.element
        match ? this.disableCards() : this.unflipCards()
    }

    disableCards() {
        this.firstCard.dataset.state = "revealed";
        this.secondCard.dataset.state = "revealed";
        this.resetBoard();
    }

    addEventListeners() {
        let cards = document.getElementsByTagName("article")

        for(let i = 0 ; i < cards.length; i++) {
            cards[i].onclick = this.flipCard.bind(cards[i], this)
        }
    }

    flipCard(game) {
        if (this.dataset.state === "revealed" || game.lockBoard)
            return
        if (game.firstCard == this)
            return

        this.dataset.state = "flip"

        if (game.hasFlippedCard === true) {
            game.secondCard = this
            game.checkForMatch()
        } else {
            game.hasFlippedCard = true
            game.firstCard = this
        }
    }

    createElements() { 
        let array = Object.keys(this.elements)       
        let section = document.getElementsByTagName("section")[1]
        let content = ""
        for (let key in array) {            
            content += `<article data-element=\"${this.elements[array[key]]["element"]}\">\n`
            content += "\t<h3>Tarjeta de memoria</h3>\n"
            content += `\t<img src=\"${this.elements[array[key]]["source"]}\" alt=\"${this.elements[array[key]]["element"]}\"/>\n`
            content += "</article>\n"            
        }
        section.innerHTML += content
    }
}

var memoria = new Memoria()

