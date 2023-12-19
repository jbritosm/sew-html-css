<?php
class Descarga {
    public function __construct() {
        $this->server = "localhost";
        $this->user = "DBUSER2023";
        $this->pass = "DBPSWD2023";
        $this->dbname = "biblioteca";
        $this->exportar();
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
                header('Location: biblioteca.php');
                exit;
            }
        } else {
            header('Location: biblioteca.php');
            exit;
        }
    
        $conn->close();
    }
    public function exportar() {
        $this->existeBD();
        $conn = new mysqli($this->server, $this->user, $this->pass, $this->dbname);
        $fileName = "biblioteca.csv";
        $file = fopen($fileName, "w");
        
        $result = $conn->query("SHOW TABLES");
        
        while($row = $result->fetch_row()) {
            $table = $row[0];                
        
            $colResult = $conn->query("SHOW COLUMNS FROM $table;");
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
        
        header('Content-Type: text/csv');
        header('Content-Disposition: attachment; filename="' . $fileName . '"');
        
        readfile($fileName);
        exit;
    }
}

new Descarga();
?>