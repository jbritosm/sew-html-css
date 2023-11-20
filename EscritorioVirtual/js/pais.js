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

    query() {
        let api_key = "d84f666e1708d46677ae7b37e7ad8e73";
        let units = "metric"
        let lat = this.coordenadasCapital["latitud"]
        let lon = this.coordenadasCapital["longitud"]
        let url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${api_key}`
        $.ajax({
            dataType: "json",
            url: url,
            method: 'GET',
            success: function(datos){
                // Every 8 elements is a new day.
                /*
                Por cada día de pronóstico se debe incluir al menos la siguiente información: temperatura máxima, temperatura mínima, porcentaje de humedad, un icono que represente el tiempo que va a hacer y la cantidad de lluvia del día.*/
                let list = datos["list"]
                let forecasts = []

                // Add <ul> element to the end of the body
                let icon_url = ""
                console.log(list)
                
                for (let i = 0; i <= list.length; i++) {
                    if (i % 8 == 0 && list[i] !== undefined) {          
                        icon_url = `https://openweathermap.org/img/wn/${list[i]["weather"][0]["icon"]}@2x.png`
                        // Add h2 con fecha
                        $("body").append(`<h2>${list[i]["dt_txt"]}</h2>`)
                        // Add ul con datos
                        $("body").append(`<img src=\"${icon_url}\" alt=\"icono que representa el clima actual\"></img>`)
                        $("body").append("<ul>")
                        $("body ul:last-child").append(`<li>Temperatura maxima: ${list[i]["main"]["temp_max"]}</li>`)
                        $("body ul:last-child").append(`<li>Temperatura minima: ${list[i]["main"]["temp_min"]}</li>`)
                        $("body ul:last-child").append(`<li>Porcentaje de humedad: ${list[i]["main"]["humidity"]}%</li>`)
                        $("body ul:last-child").append(`<li>Precipitaciones: ${list[i]["pop"] * 100.0}%</li>`)
                    }
                }
            }
        })
    }
}

var pais = new Pais("Serbia", "Belgrado", 6834000)
pais.rellenar("Republica parlamentaria", {"longitud": 20.456944, "latitud": 44.817778, "altitud": 117}, "Ortodoxa-cristiana")

document.write("<p>Nombre de pais: " + pais.getNombrePais() + "</p>\n")
document.write("<p>Nombre de pais: " + pais.getNombreCapital() + "</p>\n")
document.write(pais.writeLista())
pais.writeCoordenadas()
pais.query()