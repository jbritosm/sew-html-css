class Fondo {
    constructor(nombrePais, nombreCapital, coordenadasCapital) {
        this.nombrePais = nombrePais
        this.nombreCapital = nombreCapital
        this.coordenadasCapital = coordenadasCapital
    }

    query() {        
        $.getJSON("https://www.flickr.com/services/rest/?method=flickr.photos.search&nojsoncallback=1", {
            api_key: "",
            lat: this.coordenadasCapital["latitud"],
            lon: this.coordenadasCapital["longitud"],
            format: "json",
            tags: `${this.nombreCapital},${this.nombrePais}`
        }).done(function(data) {
            let photo = data["photos"]["photo"][0]
            let server_id = photo["server"]
            let id = photo["id"]
            let secret = photo["secret"]
            let size_suffix = "b"
            let url = `url(https://live.staticflickr.com/${server_id}/${id}_${secret}_${size_suffix}.jpg)`
            $("body").css({
                "background-image": url,
                "background-size": "cover"
            })
        })
    }

    /*
        Usar $.getJSON(URL, {datos})
              .done(function(data) {
                Seleccionar foto y utilizando jquery
                $('body').css('background img', url('img'))
                Para llenar el fondo usar
                .css('background-size', 'cover')
              });
    */
}

let fondo = new Fondo("Serbia", "Belgrado", {"longitud": 20.456944, "latitud": 44.817778, "altitud": 117})
fondo.query()