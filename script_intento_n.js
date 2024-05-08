d3.json("año_marca_modelo.json").then(function (datos) {
    let height = 800;
    let width = 1000; 
    
    let margin ={
        top: 60,
        bottom: 35,
        left: 100,
        right: 100        
    }
    
    /* Diccionario que almacena año y cantidad */
    const counts = {};
    datos.forEach(function(d) {
        const brand = d.ModelYear;
        counts[brand] = (counts[brand] || 0) + parseInt(d.Count);
    });
      
    const brandCounts = Object.keys(counts).map(brand => ({ brand: brand, count: counts[brand] }));
    let datosFiltrados = brandCounts;
    

    /* Escalas */
    let maxValue = d3.max(Object.values(counts));

    let escalaY = d3.scaleLinear()
                    .domain([0, maxValue])
                    .range([height - margin.bottom, margin.top]);
    
    
    let escalaX = d3.scaleBand()
                    .domain(datosFiltrados.map(d => d.brand))
                    .range([margin.right, width - margin.left])
                    .padding(0.1);
    
    
          /* Funciones ToolTips */
    function borrarTooltip(){
        tooltip.style("opacity", 0)
    }
    
    function pintarTooltip(event, d){
        tooltip.text(d.brand + " -*- " + d.count)
               .style("top", event.pageY + "px")
               .style("left", event.pageX + "px")
               .style("opacity", 1)
    }
    
    /* Bea orden de marcas*/
    
    var dataMatrix = [
  ["ALFA ROMEO"],  ["AUDI"],["AZURE DYNAMICS"],  ["BENTLEY"],  ["BMW"],  ["CADILLAC"],  ["CHEVROLET"],  ["CHRYSLER"],  ["FIAT"],  ["FISKER"],  ["FORD"],  ["GENESIS"],  ["HONDA"], ["HYUNDAI"],  ["JAGUAR"],  ["JEEP"],  ["KIA"],
  ["LAND ROVER"],  ["LEXUS"],  ["LINCOLN"],  ["LUCID"],  ["MAZDA"],  ["MERCEDES-BENZ"],  ["MINI"],  ["MITSUBISHI"],
  ["NISSAN"],  ["POLESTAR"],  ["PORSCHE"],  ["RIVIAN"],  ["SMART"],  ["SUBARU"],  ["TESLA"],  ["TH!NK"],["TOYOTA"],  ["VOLKSWAGEN"],  ["VOLVO"],  ["WHEEGO ELECTRIC CARS"]
];

// Función para obtener la posición de un elemento en la matriz
function obtenerPosicion(elemento) {
  for (var i = 0; i < dataMatrix.length; i++) {
    if (dataMatrix[i][0] === elemento) {
      return [i, 0];
    }
  }
  return null; // Elemento no encontrado
}

    // Función para obtener la longitud de la matriz
    function longitudMatriz() {
      return dataMatrix.length;
    }
        // Ancho disponible en el lienzo
        const availableWidth = width - margin.left - margin.right;

        // Crea la escala de bandas para el eje X
    const escalaXDetalle = d3.scaleBand()
        .domain(dataMatrix.map(function(row) { return row[0]; })) // Usa los nombres de las marcas como dominio
        .range([margin.left, width - margin.right]) // Rango desde el margen izquierdo hasta el ancho disponible en el lienzo
        .padding(0.1); // Espacio entre las bandas (ajustable según tu preferencia)

        // Prueba de la función para obtener la posición de un elemento
        var elemento = "FORD";
        var posicion = obtenerPosicion(elemento);
        var longitud = longitudMatriz();

        console.log("La posición de " + elemento + " es: " + posicion);
        console.log("La longitud de la matriz es: " + longitud);

     /* Bea fin orden de marcas*/
    
    /* Diccionario que almacena año, cantidad y marca SIN HACER*/

    let elementoSVG = d3.select("body")
                        .append("svg")
                        .attr("width", width)
                        .attr("height", height);
    
    var tooltip = d3.select ("body")
                    .append("div")
                    .attr("class", "tooltip")
    
    /* Pintar grafica */
    elementoSVG.selectAll("rect") 
        .data(datosFiltrados)
        .join("rect")
        .sort((a, b) => b.count - a.count)
        .attr("x", d=> escalaX(d.brand)) // Posición X de las barras
        .attr("y", d => escalaY(d.count)) // Posición Y de las barras
        .attr("width", escalaX.bandwidth())// - margin.left) // Ancho de las barras
        .attr("height", d => height - margin.bottom - escalaY(d.count)) // Altura de las barras
        .attr("fill", "steelblue")
        .on("mouseover", function(event, d) { return pintarTooltip(event, d); })
        .on("mouseout", function(d) { return borrarTooltip(); });


    /* Eje Y */
    let ejeY = d3.axisLeft(escalaY);
    elementoSVG.append("g")
                .attr("transform", "translate(" + margin.left + ",0)")
                .call(ejeY);
    
    elementoSVG.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 20)
          .attr("x", 0 - (height / 2))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text("Matriculaciones");

    /* Eje X */
    let ejeX = d3.axisBottom(escalaX);
                
    elementoSVG.append("g")
               .attr("transform", "translate(0," + (height - margin.bottom) + ")")
               .call(ejeX)
               .style("font-size", "10px");
    
    elementoSVG.append("text")
          //.attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top) + ")")
            .attr("transform", "translate(" + (width / 2) + " ," + height + ")")
          .style("text-anchor", "middle")
          .text("Año");
    
     /*pintamos el ejex detalle fijo, grafica detalle*/
    
    console.log("antes svgdetalleDetalle")
    
    var svgDetalle=d3.select ("body")   
                        .append("svg")     
                        .attr("width",width)
                        .attr("height",height)
    
    /*pintamos el ejex detalle fijo, grafica detalle, primero el contenedor*/
    
    console.log("antes ejeXDetalle")
    
    svgDetalle.append("g")
                 .attr("transform","translate (0," + (height - margin.bottonm+5) + ")")
                 .call(escalaXDetalle);
    
    console.log("antes gEjeYDetalle")

    var gEjeYDetalle =  svgDetalle.append("g")
                                        .attr("transform","translate (" + margin.left + ",0)")
    
 
});

