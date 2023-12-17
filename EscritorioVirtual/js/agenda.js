class Agenda {
    constructor() {
        this.url = "http://ergast.com/api/f1/current"
        this.last_api_call = null
        this.last_api_result = null
    }

    query() {
        if(this.last_api_call === null) {
            this.last_api_call = Date.now()
            this.makeQuery()
        } else {
            if(Date.now() - this.last_api_call > 120)
                this.makeQuery()
        }
        this.processData(this.last_api_result)        
    }

    makeQuery() {        
        $.ajax({
            dataType: "xml",
            url: this.url,
            method: 'GET',
            async: false,
            success: function(datos){
                this.last_api_result = datos
            }.bind(this)
        })        
    }

    processData(xml) {
        $(xml).find("Race").each(function(index) {
            $("body > main").append("<section>");
            $("body > main > section:last-of-type").append(`<h2>${$(this).find("RaceName").text()}</h2>`)
            $("body > main > section:last-of-type").append("<ul>")
            $("body > main > section:last-of-type > ul:last").append(`<li>Nombre del circuito: ${$(this).find("Circuit").find("CircuitName").text()}</li>`)
            $("body > main > section:last-of-type > ul:last").append(`<li>Latitud: ${$(this).find("Circuit").find("Location").attr("lat")}</li>`)
            $("body > main > section:last-of-type > ul:last").append(`<li>Longitud: ${$(this).find("Circuit").find("Location").attr("lat")}</li>`)
            $("body > main > section:last-of-type > ul:last").append(`<li>Fecha: ${$(this).find("Date:first").text()}</li>`)
            $("body > main > section:last-of-type > ul:last").append(`<li>Hora: ${$(this).find("Time:first").text()}</li>`)
        })
    }
}

let agenda = new Agenda()
agenda.query()