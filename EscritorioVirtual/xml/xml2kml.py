import xml.etree.ElementTree as ET

def prologue(file):
    start = """    
        <kml>
            <Document>
            
"""
    file.write(start)

def route_coordinates(ruta, file):
    # Coordenadas de inicio.
    coord_inicio = ruta.find('{http://www.uniovi.es}coordenadas-inicio')
    hitos = ruta.find("{http://www.uniovi.es}hitos")

    # Coordenadas de inicio placemark
    longitud = coord_inicio.get("longitud")
    latitud = coord_inicio.get("latitud")
    altitud = coord_inicio.get("altitud")
    placemark = f"""<Placemark>
    <Style>
      <LineStyle>
        <color>ff0000ff</color>
        <width>2</width>         
      </LineStyle>
    </Style>
        <LineString>
            <coordinates>
                {longitud},{latitud},{altitud}\n
"""
    file.write(placemark)

    # Hitos placemarks
    for hito in hitos:
        coord_hito = hito.find("{http://www.uniovi.es}coordenadas-hito")
        longitud = coord_hito.get("longitud")
        latitud = coord_hito.get("latitud")
        altitud = coord_hito.get("altitud")
        placemark = f"""{longitud},{latitud},{altitud}\n
"""
        file.write(placemark)

def epilogue(file):
    end = """
            </coordinates>
            </LineString>
            </Placemark>
        </Document>
    </kml>
"""
    file.write(end)

def main():
    # Get the XML tree
    tree = ET.parse("rutasEsquema.xml")
    # Get the root element
    root = tree.getroot()

    # Traverse the root children
    for i, ruta in enumerate(root):
        # Generate the file 
        file_name = f"ruta{i + 1}.kml"
        with open(file_name, "w") as file:
            # Prologue with the starting tags
            prologue(file)
            # Route coordinates
            route_coordinates(ruta, file)
            # Epilogue with end tags
            epilogue(file)
        

if __name__ == '__main__':
    main()