import xml.etree.ElementTree as ET

def polyline(ruta, file):
    # Coordenadas de inicio.
    coord_inicio = ruta.find('{http://www.uniovi.es}coordenadas-inicio')
    hitos = ruta.find("{http://www.uniovi.es}hitos")

    altitudes = []

    # Coordenadas de inicio placemark
    altitudes.append(coord_inicio.get("altitud"))

    # Altitud hitos
    for hito in hitos:        
        coord_hito = hito.find("{http://www.uniovi.es}coordenadas-hito")
        altitudes.append(coord_hito.get("altitud"))
    
    altitudes = [int(x) for x in altitudes]
    max_altitude = max(altitudes)

    start = f"""<?xml version="1.0" encoding="utf-8"?>
    <svg width="150" height="{max_altitude}" style="overflow:visible " version="1.1" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="150" height="{max_altitude}" stroke="blue" stroke-width="4" fill="none" />
"""

    file.write(start)
    file.write("""<polyline points=\"""")

    x = 0
    for altitud in altitudes:
        file.write(f"{x},{max_altitude - altitud} ")
        x += 50

    file.write("""\" style=\"fill:white;stroke:red;stroke-width:4\" />""")
    file.write("</svg>")

def main():
    # Get the XML tree
    tree = ET.parse("rutasEsquema.xml")
    # Get the root element
    root = tree.getroot()

    # Traverse the root children
    for i, ruta in enumerate(root):
        # Generate the file 
        file_name = f"perfil{i + 1}.svg"
        with open(file_name, "w") as file:
            # Altimetry
            polyline(ruta, file)        

if __name__ == '__main__':
    main()