<!DOCTYPE HTML>
<html lang="es">

<head>
    <!-- Datos que describen el documento -->
    <meta charset="UTF-8" />
    <title>Escritorio Virtual - Crucigrama</title>
    <meta name="author" content="Joaquín Salustiano Britos Morales" />
    <meta name="description" content="Juego de crucigrama matematico" />
    <meta name="keywords" content="crucigrama, matematico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
    <link rel="stylesheet" type="text/css" href="estilo/crucigrama.css" />
    <link rel="icon" href="multimedia/imagenes/favicon.png" />
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"
        integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
    <script src="js/crucigrama.js"></script>
</head>

<body>
<?php
    class Record {
        public function __construct() {
            $this->server = "localhost";
            $this->user = "DBUSER2023";
            $this->pass = "DBPSWD2023";
            $this->dbname = "records";
        }
    }

    if(count($_POST) > 0) {
        $conn = new mysqli($servername, $username, $password, $database);
        if($conn->connect_error) {
            die("Error de conexion.". $conn->connect_error);
        }

        $nombre = $_POST["nombre"];
        $apellidos = $_POST["apellidos"];
        $dificultad = $_POST["dificultad"];
        $tiempo = $_POST["tiempo"];
        
        list($hours, $minutes, $seconds) = explode(':', $tiempo);
        $tiempo = $hours * 3600 + $minutes * 60 + $seconds;
        
        $sql = "INSERT INTO Records VALUES($nombre, $apellidos, $dificultad, $tiempo)";
        $conn->query($sql);
        
    }
?>
    <header>
        <!-- Datos con el contenidos que aparece en el navegador -->
        <h1>Escritorio Virtual</h1>
        <nav>
            <a href="index.html" accesskey="I" tabindex="1">Inicio</a>
            <a href="sobremi.html" accesskey="S" tabindex="2">Sobre mi</a>
            <a href="noticias.html" accesskey="N" tabindex="3">Noticias</a>
            <a href="agenda.html" accesskey="A" tabindex="4">Agenda</a>
            <a href="metereologia.html" accesskey="M" tabindex="5">Metereologia</a>
            <a href="viajes.html" accesskey="V" tabindex="6">Viajes</a>
            <a href="juegos.html" accesskey="J" tabindex="7">Juegos</a>
        </nav>
    </header>
    <section>
        <h2>Menú</h2>
        <a href="memoria.html" accesskey="E" tabindex="8">Juego de memoria</a>
        <a href="sudoku.html" accesskey="K" tabindex="9">Sudoku</a>
        <a href="crucigrama.php" accesskey="C" tabindex="10">Crucigrama matematico</a>
    </section>
    <main></main>
    <script>
        crucigrama.paintMathword()
        crucigrama.createRecordForm()

        addEventListener("keydown", (event) => {
            // Comprobar que haya una celda pulsada.
            if (/^[0-9]+|[\+\-\*\/\=]$/.test(event.key)) {
                if( $("main > p[data-state='clicked']").length > 0) {
                    crucigrama.introduceElement(event.key)
                } else {
                    alert("Tienes que seleccionar una casilla")
                }
            } else {
                alert("Solo son válidos valores del 1 al 9 y los operadores matematios +,-,*,/.")
            }
        })
    </script>
</body>

</html>