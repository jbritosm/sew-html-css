<?php
    class Record {
        public function __construct() {
            $this->server = "localhost";
            $this->user = "DBUSER2023";
            $this->pass = "DBPSWD2023";
            $this->dbname = "records";
        }

        function insertData($nombre, $apellidos, $nivel, $tiempo) {
            $db = new mysqli($this->server, $this->user, $this->pass, $this->dbname);

            $stmt = $db->prepare("INSERT INTO registro
                                  VALUES (?, ?, ?, ?);");

            $stmt->bind_param('sssi', $nombre, $apellidos, $nivel, $tiempo);
            $stmt->execute();
    
            $stmt->close();

            return $this->getData($db);
        }

        function getData($db) {

            $result = $db->query("SELECT *
                                  FROM registro
                                  ORDER BY tiempo ASC
                                  LIMIT 10;");
            
            $rows = array();
            if ($result->num_rows > 0) {               

                while($row = $result->fetch_assoc()) {
                    array_push($rows, $row);
                }
                $db->close();
                return $rows;
            } else {
                echo "No se ha seleccionado ninguna fila.";
            }                       

            $db->close();            
        }
    }   
?>
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
        <h2>Menú</h2>
        <a href="memoria.html" accesskey="E" tabindex="8">Juego de memoria</a>
        <a href="sudoku.html" accesskey="K" tabindex="9">Sudoku</a>
        <a href="crucigrama.php" accesskey="C" tabindex="10">Crucigrama matematico</a>
        <a href="api.html" accesskey="P" tabindex="11">Aplicacion</a>
        <a href="php/biblioteca.php" accesskey="B" tabindex="12">Biblioteca</a>
    </section>
    <main></main>    
    <section>
        <?php
            if(count($_POST) > 0) {
                $nombre = $_POST["nombre"];
                $apellidos = $_POST["apellidos"];
                $nivel = $_POST["dificultad"];
                $tiempo = $_POST["tiempo"];
                
                $record = new Record();
                $content = "\t<h2>Ranking del crucigrama: </h2>";
                $content .= "\t<ol>\n";
                foreach ($record->insertData($nombre, $apellidos, $nivel, $tiempo) as $key => $value) {
                    $content .= "\t\t<li>Nombre: {$value['nombre']} Apellidos: {$value['apellidos']} Nivel: {$value['nivel']} Tiempo: {$value['tiempo']}</li>\n";
                }         
                $content .= "\t</ol>\n";  
                echo $content;    
            }
        ?>
    </section>
    <section data-type="botonera">
        <h2>Botonera</h2>
        <button onclick="crucigrama.introduceElement(1)">1</button>
        <button onclick="crucigrama.introduceElement(2)">2</button>
        <button onclick="crucigrama.introduceElement(3)">3</button>
        <button onclick="crucigrama.introduceElement(4)">4</button>
        <button onclick="crucigrama.introduceElement(5)">5</button>
        <button onclick="crucigrama.introduceElement(6)">6</button>
        <button onclick="crucigrama.introduceElement(7)">7</button>
        <button onclick="crucigrama.introduceElement(8)">8</button>
        <button onclick="crucigrama.introduceElement(9)">9</button>
        <button onclick="crucigrama.introduceElement('*')">*</button>
        <button onclick="crucigrama.introduceElement('+')">+</button>
        <button onclick="crucigrama.introduceElement('-')">-</button>
        <button onclick="crucigrama.introduceElement('/')">/</button>
    </section>
    <script>
        crucigrama.paintMathword()

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