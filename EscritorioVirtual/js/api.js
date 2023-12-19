class API {
    constructor() {
        this.apiKey = "pk.eyJ1IjoiamJyaXRvc20iLCJhIjoiY2xwamowcWh1MDBrcjJqbGJocTQ0NDBycSJ9.fIpnrp47Ldja1ZKWBFax-Q";        
        mapboxgl.accessToken = this.apiKey
        this.addFullscreenListener()
    }

    crearPlanimetrias(kml, id) {
        let linestring = kml.getElementsByTagName("LineString")[0]
        let coordenadas = linestring.getElementsByTagName("coordinates")[0].textContent.split("\t")
        let arrayCoordenadas = []
        for(let i = 0; i < coordenadas.length; i++) {
            arrayCoordenadas.push([coordenadas[i].split(",")[0], coordenadas[i].split(",")[1]])      
        }
        console.log(arrayCoordenadas)
        
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

    dodrop(event, id) {
        let dt = event.dataTransfer;
        let archivo = dt.files[0]

        let lector = new FileReader();
            let parser = new DOMParser();
            lector.onload = function (evento) {
            let kml = parser.parseFromString(lector.result,"text/xml");
            $("body > section:nth-child(3)").append(`<section id=${id}></section>`)
            
            this.crearPlanimetrias(kml, id)
        }.bind(this)
        lector.readAsText(archivo);
    }

    addFullscreenListener() {
        document.addEventListener(
            "keydown",
            (e) => {if(e.key === "Enter") this.toggleFullscreen()},
            false,
          );
    }

    toggleFullscreen() {
        let elem = document.querySelector("body > section:nth-last-of-type(1) > section");
        if(elem === null) {
            alert("Por favor arrastra y suelta un archivo KML en la zona designada.")
            return
        }

        if (!document.fullscreenElement) {
          elem.requestFullscreen().catch((err) => {
            alert(
              `Error al entrar en modo pantalla completa: ${err.message} (${err.name})`,
            );
          });
        } else {
          document.exitFullscreen();
        }
    }
}

let api = new API()