class Pais {
    constructor(nombrePais, nombreCapital, poblacion) {
        this.nombrePais = nombrePais
        this.nombreCapital = nombreCapital
        this.poblacion = poblacion
    }

    rellenar(tipoGobierno, coordenadasCapital, religion) {
        this.tipoGobierno = tipoGobierno
        this.coordenadasCapital = coordenadasCapital
        this.religion = religion
    }

    getNombrePais() {
        return this.nombrePais
    }

    getNombreCapital() {
        return this.nombreCapital
    }

    getPoblacion() {
        return this.poblacion
    }

    getTipoGobierno() {
        return this.tipoGobierno
    }

    getReligion() {
        return this.religion
    }

    writeLista() {
        this.text = "<ul>\n"
        this.text += this.toListElement(this.getPoblacion())
        this.text += this.toListElement(this.getTipoGobierno())
        this.text += this.toListElement(this.getReligion())
        this.text += "</ul>"
        return this.text
    }

    toListElement(elemento) {
        return "<li>" + elemento + "</li>\n"
    }

    toParagraph(content) {
        return "<p>" + content + "</p>\n"
    } 

    writeCoordenadas() {
        document.write(this.toParagraph("Longitud: " + this.coordenadasCapital["longitud"]))
        document.write(this.toParagraph("Latitud: " + this.coordenadasCapital["latitud"]))        
        document.write(this.toParagraph("Altitud: " + this.coordenadasCapital["altitud"]))
    }
}

var pais = new Pais("Serbia", "Belgrado", 6834000)
pais.rellenar("Republica parlamentaria", {"longitud": 20.456944, "latitud": 44.817778, "altitud": 117}, "Ortodoxa-cristiana")

document.write("<p>Nombre de pais: " + pais.getNombrePais() + "</p>\n")
document.write("<p>Nombre de pais: " + pais.getNombreCapital() + "</p>\n")
document.write(pais.writeLista())
pais.writeCoordenadas()