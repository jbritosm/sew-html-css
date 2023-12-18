<?php
    class Biblioteca {
        public function __construct() {
            $this->server = "localhost";
            $this->user = "DBUSER2023";
            $this->pass = "DBPSWD2023";
            $this->dbname = "biblioteca";

            $this->tablas = "biblioteca.sql";
            $this->datos = "biblioteca.csv";
        }

        public function existeBD() {
            $conn = new mysqli($this->server, $this->user, $this->pass);
        
            if ($conn->connect_error) {
                echo "<p>Conexión fallida: " . $conn->connect_error . "</p>";
                exit;
            }
        
            $consulta = "SHOW DATABASES LIKE '$this->dbname'";
            $resultado = $conn->query($consulta);
        
            if ($resultado) {
                if ($resultado->num_rows == 0) {
                    echo "<p>La base de datos no existe.</p>";
                    exit;
                }
            } else {
                    echo "<p>Error al ejecutar la consulta: " . $conn->error . "</p>";
                    exit;
            }
        
            $conn->close();
        }

        public function createTables() {
            $conn = new mysqli($this->server, $this->user, $this->pass);

            // Verificar la conexión
            if ($conn->connect_error) {
                die("Conexión fallida: " . $conn->connect_error);
            }

            $sql = file_get_contents($this->tablas);
            
            if ($conn->multi_query($sql)) {
                echo "<p>Base de datos creada</p>";
            } else {
                echo "<p>Error al ejecutar el script SQL: " . $conn->error . "</p>";
            }

            $conn->close();
        }

        public function insertFromCSV() {
            $this->existeBD();
            $fileHandle = fopen($this->datos, 'r');

            $tableNames = array("autor_id", "editorial_id", "genero_id", "libro_idtitulo_libro", "libro_idautor_id");
            
            $rowType = "";

            if ($fileHandle !== false) {
                while (($row = fgetcsv($fileHandle)) !== false) {
                    $first = $row[0];
                    switch($first) {
                        case "autor_id":      
                            $rowType = "autor";                                                          
                            continue 2;
                        case "editorial_id":
                            $rowType = "editorial";
                            continue 2;
                        case "genero_id":
                            $rowType = "genero";
                            continue 2;
                        case "libro_id":
                            if($row[1] === "autor_id") {
                                $rowType = "libroautor";
                            } else {
                                $rowType = "libro";
                            }                                
                            continue 2;
                        default:
                            switch($rowType) {
                                case "autor":
                                    $this->insertAutor($row);
                                    break;
                                case "editorial":
                                    $this->insertEditorial($row);
                                    break;
                                case "genero":
                                    $this->insertGenero($row);
                                    break 2;
                                case "libro":
                                    $this->insertLibro($row);
                                    break 2;
                                case "libroautor":
                                    $this->insertLibroAutor($row);
                                    break 2;
                            }
                    }
                }
                
                echo "<p>Datos cargados correctamente</p>";
            }   
           
        }

        function borrarBD() {
            $this->existeBD();
            $conn = new mysqli($this->server, $this->user, $this->pass, $this->dbname);
            $conn->query("DROP DATABASE biblioteca;");
            $conn->close();

            echo "<p>Base de datos borrada con exito.</p>";
        }

        function exportarCSV() {
            $this->existeBD();
            $conn = new mysqli($this->server, $this->user, $this->pass, $this->dbname);
            $fileName = "biblioteca.csv";
            $file = fopen($fileName, "w");

            $result = $conn->query("SHOW TABLES");

            while($row = $result->fetch_row()) {
                $table = $row[0];                

                $colResult = $conn->query("SHOW COLUMNS FROM $table");
                $names = array();

                while($colRow = $colResult->fetch_assoc()) {
                    $names[] = $colRow["Field"];
                }

                fputcsv($file, $names);
                
                $dataResult = $conn->query("SELECT * FROM $table");

                while($dataRow = $dataResult->fetch_assoc()) {
                    fputcsv($file, $dataRow);
                }
            }
            
            fclose($file);
            $conn->close(); 
        }
        

        public function execute($stmt) {
            try {
                $stmt->execute();            
            } catch (mysqli_sql_exception $e) {
                die("<p>Error: " . $e->getMessage() . "</p>");                
            } catch(Exception $e) {
                die("<p>Error desconocido: " . $e->getMessage() . "</p>");
                exit;
            } 
        }

        public function insertAutor($data) {
            $conn = new mysqli($this->server, $this->user, $this->pass, $this->dbname);
            $stmt = $conn->prepare("INSERT INTO Autor
                                  VALUES (?, ?);");

            $stmt->bind_param('is', $data[0], $data[1]);
            
            $this->execute($stmt);          

            $conn->close();
        }

        public function insertEditorial($data) {
            $conn = new mysqli($this->server, $this->user, $this->pass, $this->dbname);
            $stmt = $conn->prepare("INSERT INTO Editorial
                                  VALUES (?, ?);");

            $stmt->bind_param('is', $data[0], $data[1]);

            $this->execute($stmt);          

            $conn->close();
        }

        public function insertGenero($data) {
            $conn = new mysqli($this->server, $this->user, $this->pass, $this->dbname);
            $stmt = $conn->prepare("INSERT INTO Genero
                                  VALUES (?, ?);");

            $stmt->bind_param('is', $data[0], $data[1]);
            $this->execute($stmt);          

            $conn->close();
        }

        public function insertLibro($data) {
            $conn = new mysqli($this->server, $this->user, $this->pass, $this->dbname);
            $stmt = $conn->prepare("INSERT INTO Libro
                                  VALUES (?, ?, ?, ?, ?);");

            $stmt->bind_param('isiii', $data[0], $data[1], $data[2], $data[3], $data[4]);
            $this->execute($stmt);          

            $conn->close();
        }

        public function insertLibroAutor($data) {
            $conn = new mysqli($this->server, $this->user, $this->pass, $this->dbname);
            $stmt = $conn->prepare("INSERT INTO Libro_autor
                                  VALUES (?, ?);");

            $stmt->bind_param('ii', $data[0], $data[1]);
            $this->execute($stmt);          

            $conn->close();
        }

        public function listLibros() {
            $this->existeBD();
            $conn = new mysqli($this->server, $this->user, $this->pass, $this->dbname);
            
            $sql = "SELECT l.titulo_libro, a.nombre_autor, g.nombre_genero, e.nombre_editorial, l.prestado
                    FROM autor a, editorial e, genero g, libro l, libro_autor la
                    WHERE l.libro_id = la.libro_id
                    AND la.autor_id = a.autor_id
                    AND l.editorial_id = e.editorial_id
                    AND l.genero_id = g.genero_id";
                    
            $result = $conn->query($sql);

            if ($result->num_rows > 0) {      
                echo "<h3>Libros:</h3>";
                echo "<ul>";
                while($row = $result->fetch_assoc()) {
                    $prestado = $row["prestado"] == 0 ? "No" : "Si";
                    echo "<li>Título: " . $row["titulo_libro"] . " - Autor: " . $row["nombre_autor"] . " - Género: " . $row["nombre_genero"] . " - Editorial: " . $row["nombre_editorial"] . " - Prestado: " . $prestado . "</li>";
                }
                echo "</ul>";
            } else {
                echo "<p>No hay libros en la base de datos.</p>";
            }             

            $conn->close();
        }

        public function prestamo($libro) {
            $this->existeBD();

            $conn = new mysqli($this->server, $this->user, $this->pass, $this->dbname);

            $stmt = $conn->prepare("SELECT * FROM libro WHERE titulo_libro = ?;");
            $stmt->bind_param('s', $libro);

            $stmt->execute();

            $result = $stmt->get_result();
            if ($result->num_rows > 0) {
                $row = $result->fetch_assoc();
                if($row["prestado"] == 1) {
                    echo "<p>Este libro ya ha sido prestado.</p>";
                } else {
                    $stmt = $conn->prepare("UPDATE libro SET prestado = ? WHERE libro_id = ?;");
                    $prestado = 1;
                    $stmt->bind_param('ii', $prestado, $row["libro_id"]);
                    $this->execute($stmt);     
                }
            } else {
                echo "<p>No existe un libro con ese nombre.</p>";
            }

            $conn->close();
        }

        public function devolver($libro) {
            $this->existeBD();

            $conn = new mysqli($this->server, $this->user, $this->pass, $this->dbname);

            $stmt = $conn->prepare("SELECT * FROM libro WHERE titulo_libro = ?;");
            $stmt->bind_param('s', $libro);

            $stmt->execute();

            $result = $stmt->get_result();
            if ($result->num_rows > 0) {
                $row = $result->fetch_assoc();
                if($row["prestado"] == 0) {
                    echo "<p>Este libro no ha sido prestado.</p>";
                } else {
                    $stmt = $conn->prepare("UPDATE libro SET prestado = ? WHERE libro_id = ?;");
                    $prestado = 0;
                    $stmt->bind_param('ii', $prestado, $row["libro_id"]);
                    $this->execute($stmt);     
                }
            } else {
                echo "<p>No existe un libro con ese nombre.</p>";
            }

            $conn->close();
        }
    }

    $biblioteca = new Biblioteca();
?>
<!DOCTYPE HTML>
<html lang="es">
<head>
    <!-- Datos que describen el documento -->
    <meta charset="UTF-8" />
    <title>EscritorioVirtual - Biblioteca</title>
    <meta name ="author" content ="Joaquín Salustiano Britos Morales" />
    <meta name ="description" content ="Página de viajes nuestro escritorio virtual." />
    <meta name ="keywords" content ="desarrollo" />
    <meta name ="viewport" content ="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" type="text/css" href="../estilo/estilo.css" />
    <link rel="stylesheet " type="text/css" href="../estilo/layout.css" />
    <link rel="stylesheet" type="text/css" href="../estilo/biblioteca.css" />
    <link rel="icon" href="../multimedia/imagenes/favicon.png"/>
</head>

<body>
    <header>
        <!-- Datos con el contenidos que aparece en el navegador -->
        <h1>Escritorio Virtual</h1>
        <nav>
            <a href="../index.html" accesskey="I" tabindex="1">Inicio</a>
            <a href="../sobremi.html" accesskey="S" tabindex="2">Sobre mi</a>
            <a href="../noticias.html" accesskey="N" tabindex="3">Noticias</a>
            <a href="../agenda.html" accesskey="A" tabindex="4">Agenda</a>
            <a href="../metereologia.html" accesskey="M" tabindex="5">Metereologia</a>
            <a href="viajes.php" accesskey="V" tabindex="6">Viajes</a>
            <a href="../juegos.html" accesskey="J" tabindex="7">Juegos</a>
        </nav>
    </header> 
    <section>
        <h2>Menú</h2>
        <nav>
            <a href="../memoria.html" accesskey="E" tabindex="8">Juego de memoria</a>
            <a href="../sudoku.html" accesskey="K" tabindex="9">Sudoku</a>
            <a href="crucigrama.php" accesskey="C" tabindex="10">Crucigrama matematico</a>
            <a href="../api.html" accesskey="P" tabindex="11">Aplicacion</a>
            <a href="biblioteca.php" accesskey="B" tabindex="12">Biblioteca</a>
        </nav>
    </section>       
    <main>                
        <h2>Biblioteca</h2>
        <section>
            <h3>Control de datos</h3>
            <form action='#' method='POST'>
                <input type="submit" value="Crear base de datos" name="crear" />
                <input type="submit" value="Cargar archivos" name="cargar" />
                <input type="submit" value="Exportar" name="exportar" />
                <input type="submit" value="Borrar base de datos" name="borrar" />
            </form>
            <?php
                if(count($_POST) > 0) {
                    if(isset($_POST["crear"])) $biblioteca->createTables();
                    if(isset($_POST["cargar"])) $biblioteca->insertFromCSV();
                    if(isset($_POST["exportar"])) $biblioteca->exportarCSV();
                    if(isset($_POST["borrar"])) $biblioteca->borrarBD();
                }
            ?>
        </section>   
             
        <section>
            <h3>Prestamo de libros</h3>
            <form action='#' method='POST'>
                <label for="libro">Libro:</label>
                <input type="text" id="libro" name="libro" value="" required />
                <input type="submit" value="Pedir prestado" name="prestamo" />
                <input type="submit" value="Devolver" name="devolver" />
            </form>   
            <?php
                if(count($_POST) > 0) {
                    if(isset($_POST["prestamo"])) $biblioteca->prestamo($_POST["libro"]);
                    if(isset($_POST["devolver"])) $biblioteca->devolver($_POST["libro"]);
                }
            ?>        
        </section>
        <?php
            $biblioteca->listLibros();
        ?>
    </main>
    
</body>
</html>