<?php
    class Carrusel {
        public function __construct($nombreCapital, $nombrePais) {
            $this->nombreCapital = $nombreCapital;
            $this->nombrePais = $nombrePais;
            $this->photos = array();
        }

        public function getData() {
            $params = array(
            'api_key' => 'dc7f40bc454df978bd1ac3fafb0095d8',
            'method' => 'flickr.photos.search',
            'nojsoncallback' => '1',
            'lat' => 44.817778,
            'lon' => 20.456944,
            'format' => 'json',
            'tags' => $this->nombreCapital . ',' . $this->nombrePais,
            'per_page' => '10'
            );

            $encoded_params = array();

            foreach ($params as $k => $v){
                $encoded_params[] = urlencode($k).'='.urlencode($v);
            }

            $url = "https://api.flickr.com/services/rest/?".implode('&', $encoded_params);
            $rsp = file_get_contents($url);

            $rsp_obj = json_decode($rsp);
            
            foreach ($rsp_obj->photos->photo as $photo ) {
                if ($rsp_obj->stat == 'ok'){
                    
                    $title = $photo->title;
                    $farm_id = $photo->farm;
                    $server_id = $photo->server;
                    $photo_id = $photo->id;
                    $secret_id = $photo->secret;
                    $size = 'm';
                
                    $photo_url = 'https://farm'.$farm_id.'.staticflickr.com/'.$server_id.'/'.$photo_id.'_'.$secret_id.'_'.$size.'.'.'jpg';
                
                    array_push($this->photos, array($photo_url, $title));
                
                } else {
                    echo "¡Error al llamar al servicio Web!";
                }
            }                        
        }

        public function printPhotos() {
            echo "\t<article>\n";
            echo "\t\t<h2>Carrusel de imagenes</h2>\n";
            foreach($this->photos as $photo) {
                $img = '<img src="' . $photo[0] . '" alt="' . $photo[1] . '" />';
                echo $img; 
            }

            echo "\t<button onclick='viajes.nextSlide()' data-action='next'> > </button>\n";
            echo "\t<button onclick='viajes.prevSlide()' data-action='prev'> < </button>\n";

            echo "\t</article>\n";
        }
    }

    class Moneda {
        public function __construct($siglasFrom, $siglasTo) {
            $this->siglasFrom = $siglasFrom;
            $this->siglasTo = $siglasTo;
            $this->api_key = "fca_live_eTFTdK2d0eM25iydsZBzsi6U0610HmTm6HoICtM5";
        }

        public function convertirMoneda($cantidad) {
            $apiKey = '2caf67adc8b7caaec5d0a74a';            
            $apiUrl = "https://open.er-api.com/v6/latest";
            $url = "$apiUrl?apikey=$apiKey";
            $response = file_get_contents($url);

            $data = json_decode($response, true);

            if ($data['result'] == 'success') {
                $rateOrigen = $data['rates'][$this->siglasFrom];
                $rateObjetivo = $data['rates'][$this->siglasTo];

                $cantidadConvertida = $cantidad * ($rateObjetivo / $rateOrigen);

                return $cantidadConvertida;
            } else {
                return "Error en la solicitud de la tasa de cambio: " . $data['error'];
            }
        }
    }
?>
<!DOCTYPE HTML>
<html lang="es">
<head>
    <!-- Datos que describen el documento -->
    <meta charset="UTF-8" />
    <title>EscritorioVirtual - Viajes</title>
    <meta name ="author" content ="Joaquín Salustiano Britos Morales" />
    <meta name ="description" content ="Página de viajes nuestro escritorio virtual." />
    <meta name ="keywords" content ="desarrollo" />
    <meta name ="viewport" content ="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet " type="text/css" href="estilo/layout.css" />
    <link rel="stylesheet" type="text/css" href="estilo/viajes.css" />
    <link href="https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.css" rel="stylesheet">
    <link rel="icon" href="multimedia/imagenes/favicon.png"/>
    <script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script> 
    <script src="https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.js"></script>
    <script src="js/viajes.js" defer></script>
</head>

<body>
    <header>
        <!-- Datos con el contenidos que aparece en el navegador -->
        <h1>Escritorio Virtual</h1>
        <nav>
            <a href="index.html" accesskey="I" tabindex="1">Inicio</a>
            <a href="sobremi.html" accesskey="S" tabindex="2">Sobre mi</a>
            <a href="noticias.html" accesskey="N" tabindex="3">Noticias</a>
            <a href="agenda.html" accesskey="A" tabindex="4">Agenda</a>
            <a href="metereologia.html" accesskey="M" tabindex="5">Metereologia</a>
            <a href="viajes.php" accesskey="V" tabindex="6">Viajes</a>
            <a href="juegos.html" accesskey="J" tabindex="7">Juegos</a>
            <a href="api.html" accesskey="P" tabindex="8">Aplicacion</a>
        </nav>
    </header>
    <section>
        <h2>Mapa estatico</h2>
        <button onclick="viajes.getMapaEstaticoMapbox()">Mostrar mapa estatico</button>
    </section>
    <section>
        <h2>Mapa dinamico</h2>
        <button onclick="viajes.getMapaDinamicoMapbox('map')">Mostrar mapa dinamico</button>
        <section id="map"></section>
    </section>
    <section>
        <h2>Rutas</h2>
        <label for="rutas">Fichero de rutas:</label>
        <input type="file" id="rutas" name="rutas" onchange="viajes.cargarRutaXML(this.files);"/>
    </section>
    <section>
        <h2>Planimetrias</h2>
        <label for="planimetrias">Fichero de planimetrias:</label>
        <input multiple type="file" id="planimetrias" name="planimetrias" onchange="viajes.getPlanimetriaMapbox(this.files);"/>
    </section>
    <section>
        <h2>Altimetrias</h2>
        <label for="altimetrias">Fichero de altimetrias:</label>
        <input multiple type="file" id="altimetrias" name="altimetrias" onchange="viajes.getAltimetrias(this.files);"/>
    </section>
    <section>
        <h2>Cambio de moneda</h2>
        <?php
            $moneda = new Moneda("RSD", "EUR");
            echo "<p>1 EUR son: " . $moneda->convertirMoneda(1) . " RSD.</p>";
        ?>
    </section>
    <?php
        $carrusel = new Carrusel("Belgrado", "Serbia");
        $carrusel->getData();
        $carrusel->printPhotos();        
    ?>
    
    
</body>
</html>