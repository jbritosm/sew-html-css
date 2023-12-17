"use strict";
class Viajes {
    constructor (){
        this.apiKey = "pk.eyJ1IjoiamJyaXRvc20iLCJhIjoiY2xwamowcWh1MDBrcjJqbGJocTQ0NDBycSJ9.fIpnrp47Ldja1ZKWBFax-Q";        
        mapboxgl.accessToken = this.apiKey
        navigator.geolocation.getCurrentPosition(this.getPosicion.bind(this), this.verErrores.bind(this));
        this.planimetrias = []

        this.slides = document.querySelectorAll("article > img");
        // current slide counter
        this.curSlide = 0;
        // maximum number of slides
        this.maxSlide = this.slides.length - 1;
    }
    getPosicion(posicion){
        this.longitud         = posicion.coords.longitude; 
        this.latitud          = posicion.coords.latitude;  
    }

    verErrores(error){
        switch(error.code) {
        case error.PERMISSION_DENIED:
            this.mensaje = "El usuario no permite la petición de geolocalización"
            break;
        case error.POSITION_UNAVAILABLE:
            this.mensaje = "Información de geolocalización no disponible"
            break;
        case error.TIMEOUT:
            this.mensaje = "La petición de geolocalización ha caducado"
            break;
        case error.UNKNOWN_ERROR:
            this.mensaje = "Se ha producido un error desconocido"
            break;
        }
    }

    getMapaEstaticoMapbox(){ 
        let zoom ="12";
        let tamaño= "600x600";
        let marcador = `pin-s-j+F00(${this.longitud},${this.latitud})`        
        let url = `https://api.mapbox.com/styles/v1/mapbox/light-v11/static/${marcador}/${this.longitud},${this.latitud},${zoom},20/${tamaño}?access_token=${this.apiKey}`
        
        let img = `<img src=${url} alt="mapa estatico mapbox"/>`

        $("button").eq(0).remove()
        $("section").eq(0).append(img)
    }

    getMapaDinamicoMapbox(id) {
        $("section:eq(1) button").remove()
        this.map = new mapboxgl.Map({
            container: id, // container ID
            // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
            style: 'mapbox://styles/mapbox/streets-v12', // style URL
            center: [this.longitud, this.latitud], // starting position [lng, lat]
            zoom: 9 // starting zoom
            });
    }

    cargarRutaXML(files) {
        let archivo = files[0];

        var lector = new FileReader();
        lector.onload = function (evento) {            
            let parser = new DOMParser();
            let xml = parser.parseFromString(lector.result,"text/xml");
            this.crearRutas(xml)
        }.bind(this)
        lector.readAsText(archivo);        

    }

    crearRutas(xml) {
        let rutas = xml.getElementsByTagName("ruta")

        for(let i = 0; i < rutas.length ; i++) {
            let ruta = rutas[i]
            let nombreRuta = ruta.getElementsByTagName("nombre-ruta")[0].textContent
            let tipoRuta = ruta.getElementsByTagName("tipo-ruta")[0].textContent
            let medioTransporte = ruta.getElementsByTagName("medio-transporte")[0].textContent
            let fechaInicio = ruta.getElementsByTagName("fecha-inicio")[0].textContent
            let horaInicio = ruta.getElementsByTagName("hora-inicio")[0].textContent
            let duracion = ruta.getElementsByTagName("duracion")[0].textContent
            let agencia = ruta.getElementsByTagName("agencia")[0].textContent
            let descripcion = ruta.getElementsByTagName("descripcion")[0].textContent
            let personasAdecuadas = ruta.getElementsByTagName("personas-adecuadas")[0].textContent
            let lugarInicio = ruta.getElementsByTagName("lugar-inicio")[0].textContent
            let direccionInicio = ruta.getElementsByTagName("direccion-inicio")[0].textContent
            let coordenadasInicio = {
                "longitud": ruta.getElementsByTagName("coordenadas-inicio")[0].getAttribute("longitud"),
                "latitud": ruta.getElementsByTagName("coordenadas-inicio")[0].getAttribute("latitud"),
                "altitud": ruta.getElementsByTagName("coordenadas-inicio")[0].getAttribute("altitud")
            }
            
            let referencias = ruta.getElementsByTagName("referencias")[0].getElementsByTagName("referencia")
            let referenciasPath = []
            for(let j = 0; j < referencias.length ; j++) {
                referenciasPath.push(referencias[j].getAttribute("path"))
            }

            let recomendacion = ruta.getElementsByTagName("recomendacion")[0].getAttribute("nota")

            let hitos = ruta.getElementsByTagName("hitos")[0].getElementsByTagName("hito")
            let infoHitos = []
            for(let j = 0; j < hitos.length ; j++) {
                let hito = hitos[j]
                let fotos = hito.getElementsByTagName("fotos")[0].getElementsByTagName("foto")
                let fotosPath = []

                for(let k = 0; k < fotos.length; k++) {
                    let foto = fotos[k]
                    fotosPath.push(foto.getAttribute("path"))
                }

                infoHitos.push({
                    "nombre-hito": hito.getElementsByTagName("nombre-hito")[0].textContent,
                    "descripcion-hito": hito.getElementsByTagName("descripcion-hito")[0].textContent,
                    "coordenadas-hito": {
                        "longitud": hito.getElementsByTagName("coordenadas-hito")[0].getAttribute("longitud"),
                        "latitud": hito.getElementsByTagName("coordenadas-hito")[0].getAttribute("latitud"),
                        "altitud": hito.getElementsByTagName("coordenadas-hito")[0].getAttribute("altitud"),
                    },
                    "distancia-hito-anterior": hito.getElementsByTagName("distancia-hito-anterior")[0].getAttribute("kilometros"),
                    "fotos": fotosPath
                })
            }
            let section = $("<section></section>")
            section.append(`<h3>${nombreRuta}</h3>`)
            section.append(`<p>Tipo de ruta: ${tipoRuta}</p>`)
            section.append(`<p>Medio de transporte: ${medioTransporte}</p>`)
            section.append(`<p>Fecha de inicio: ${fechaInicio}</p>`)
            section.append(`<p>Hora de inicio: ${horaInicio}</p>`)
            section.append(`<p>Duracion: ${duracion}</p>`)
            section.append(`<p>Agencia: ${agencia}</p>`)
            section.append(`<p>Descripcion: ${descripcion}</p>`)
            section.append(`<p>Personas adecuadas: ${personasAdecuadas}</p>`)
            section.append(`<p>Lugar de inicio: ${lugarInicio}</p>`)
            section.append(`<p>Direccion de inicio: ${direccionInicio}</p>`)
            section.append(`<h4>Coordenadas de inicio:</h4>`)
            
            let liCoordenadasInicio = $("<ul></ul>") 
            liCoordenadasInicio.append(`<li>Longitud: ${coordenadasInicio["longitud"]}</li>`)
            liCoordenadasInicio.append(`<li>Latitud: ${coordenadasInicio["latitud"]}</li>`)
            liCoordenadasInicio.append(`<li>Altitud: ${coordenadasInicio["altitud"]}</li>`)
            section.append(liCoordenadasInicio)

            section.append(`<h4>Referencias:</h4>`)

            let liReferencias = $("<ul></ul>") 
            for(let k = 0; k < referenciasPath.length; k++) {
                liReferencias.append(`<li><a href=${referenciasPath[k]}>${referenciasPath[k]}</a></li>`)
            }
            section.append(liReferencias)
            
            section.append(`<p>Recomendacion: ${recomendacion}</p>`)
            section.append("<h4>Hitos:</h4>")
            for(let l = 0; l < infoHitos.length; l++) {
                let infoHito = infoHitos[l]
                section.append(`<h5>${infoHito["nombre-hito"]}</h5>`)                
                section.append(`<p>Descripcion: ${infoHito["descripcion-hito"]}</p>`)
                section.append(`<p>Longitud: ${infoHito["coordenadas-hito"]["longitud"]}</p>`)
                section.append(`<p>Latitud: ${infoHito["coordenadas-hito"]["latitud"]}</p>`)
                section.append(`<p>Altitud: ${infoHito["coordenadas-hito"]["altitud"]}</p>`)
                section.append(`<p>Distancia hito anterior: ${infoHito["distancia-hito-anterior"]}</p>`)
                for(let m = 0; m < infoHito["fotos"].length; m++) {
                    section.append(`<img src=${infoHito["fotos"][m]} alt="foto del hito" />`)
                }
            }

            $("body section:eq(3)").append(section)
        }        
    }

    getPlanimetriaMapbox(files) {
        
        for(let i = 0; i < files.length; i++) {
            let archivo = files[i]
            let lector = new FileReader();
            let parser = new DOMParser();
            lector.onload = function (evento) {
            let kml = parser.parseFromString(lector.result,"text/xml");
            let id = `map${i}`
            let name = kml.getElementsByTagName("name")[0].textContent
            $("body > section:eq(3)").append(`<h3>${name}</h3>`)
            $("body > section:eq(3)").append(`<section id=${id}></section>`)
            
            this.crearPlanimetrias(kml, id)

            }.bind(this)
            lector.readAsText(archivo);    
        }
    }

    crearPlanimetrias(kml, id) {
        let linestring = kml.getElementsByTagName("LineString")[0]
        let coordenadas = linestring.getElementsByTagName("coordinates")[0].textContent.split("\t")
        let arrayCoordenadas = []
        for(let i = 0; i < coordenadas.length; i++) {
            arrayCoordenadas.push([coordenadas[i].split(",")[0], coordenadas[i].split(",")[1]])      
        }
        
        let map = new mapboxgl.Map({
            container: id, // container ID
            // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
            style: 'mapbox://styles/mapbox/streets-v12', // style URL
            center: [arrayCoordenadas[0][0], arrayCoordenadas[0][1]], // starting position [lng, lat]
            zoom: 9 // starting zoom
        })
        
        map.on('load', () => {
            map.addSource('route', {
            'type': 'geojson',
            'data': {
            'type': 'Feature',
            'properties': {},
            'geometry': {
            'type': 'LineString',
            'coordinates': arrayCoordenadas
            }
            }
            });
            map.addLayer({
            'id': 'route',
            'type': 'line',
            'source': 'route',
            'layout': {
            'line-join': 'round',
            'line-cap': 'round'
            },
            'paint': {
            'line-color': '#F00',
            'line-width': 8
            }
            });
            });
            
    }

    getAltimetrias(files) {
        for(let i = 0; i < files.length; i++) {
            let archivo = files[i]
            let lector = new FileReader();
            let parser = new DOMParser();
            lector.onload = function (evento) {
            let svg = parser.parseFromString(lector.result,"text/xml");            
            let content = svg.getElementsByTagName("svg")[0]
            $("body > section:eq(4)").append(content)

            }.bind(this)
            lector.readAsText(archivo);    
        }
    }

    nextSlide() {
        // check if current slide is the last and reset current slide
        if (this.curSlide === this.maxSlide) {
            this.curSlide = 0;
        } else {
            this.curSlide++;
        }
    
            //   move slide by -100%
        this.slides.forEach((slide, indx) => {
            var trans = 100 * (indx - this.curSlide);
            $(slide).css('transform', 'translateX(' + trans + '%)')
        });            
    }

    prevSlide() {
        if (this.curSlide === 0) {
            this.curSlide = this.maxSlide;
        } else {
            this.curSlide--;
        }

        this.slides.forEach((slide, indx) => {
            var trans = 100 * (indx - this.curSlide);
            $(slide).css('transform', 'translateX(' + trans + '%)')
        });
    }    
}

let viajes = new Viajes()
