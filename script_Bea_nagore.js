const script = document.createElement('script');
script.src = 'https://d3js.org/d3.v6.min.js';
document.head.appendChild(script);

d3.json ("prueba.json").then (function (datosCompletos){
    
    console.log("Datos cargados de prueba.js")
   
    console.log(datosCompletos.marca_anios); // Verificar las claves presentes

    var anioseleccionado = "2023"; // O cualquier otro valor
    var datosMarca = datosCompletos.marca_anios[anioseleccionado];
    console.log("está bien eñ 2023",datosMarca); // Verificar si datosMarca contiene lo esperado

    var datosAnios = datosCompletos.anios;
    
    console.log("despues de var  datosAnios ", datosAnios)
    
    var height = 700;
    var width = 800;
    
    var margin  = {
        top: 60,
        botton: 35,
        left:35,
        right:50
            
    }
        
    // Insertamos elemento
    var elementosvg = d3.select ("body")
                        .append("svg")
                        .attr("width",width)
                        .attr("height",height);
    
    var escalaX = d3.scaleLinear()
                    .domain(d3.extent(datosAnios, function (d) {return d.anio; } ))
                    .range([margin.left, width-margin.right]);
    
    console.log("despues de escalax");

    
    var escalaY = d3.scaleLinear()
                    .domain(d3.extent(datosAnios, function (d) {return d.matriculaciones; } ))
                    .range([height - margin.botton, margin.top]);
    
    console.log("despues de escalay");
    
    var escalaTamanio = d3.scaleLinear()
                          .domain(d3.extent(datosAnios, function (d) {return d.matriculaciones; } ))
                          .range([5, 20]);
    
    console.log("despues de escalatamanio");

    var escalaColor = d3.scaleLinear()
                    .domain(d3.extent(datosAnios, function (d) {return d.anio; } ))
                    .range(["red", "blue"])
    
    console.log("despues de escalacolor")
    

    // Ejes
    var ejeX = d3.axisBottom (escalaX)
                 .ticks (5)
                 .tickFormat (d3.format(".3s"))
    
    elementosvg.append("g")
               .attr("transform","translate (0," + (height - margin.botton+5) + ")")
               .call(ejeX)
              
    console.log("axisinteredio")
    
              
    var ejeY = d3.axisLeft (escalaY)
    
    elementosvg.append("g")
               .attr("transform","translate (" + margin.left + ",0)")
               .call(ejeY)

    var ejeY = d3.axisLeft (escalaY)
    console.log("antes pintar")
    
    
    // Pintamos
    /*elementosvg.selectAll("circle") 
               .data(datosAnios) 
               .join ("circle")
               .attr("r",d => escalaTamanio(d.matriculaciones)) 
               .attr("cx", d => escalaX(d.anio))
               .attr("cy",d => escalaY(d.matriculaciones))
               .attr ("fill", d => escalaColor(d.anio))
               //.on("click", d => pintarDetalle(d.anio))
               .on("mouseover", d => pintarTooltip(d))
               .on("mouseout", d => borrarTooltip)*/
    
    elementosvg.selectAll("circle") 
        .data(datosAnios) 
        .join("circle")
        .attr("r", function(d) { return escalaTamanio(d.matriculaciones); }) 
        .attr("cx", function(d) { return escalaX(d.anio); })
        .attr("cy", function(d) { return escalaY(d.matriculaciones); })
        .attr("fill", function(d) { return escalaColor(d.anio); })
        .on("mouseover", function(d) { return pintarTooltip(d); })
        .on("mouseout", function(d) { return borrarTooltip; })
        .on("click", function(d) { return pintarDetalle(d.anio); });


    var tooltip = d3.select ("body")
                    .append("div")
                    .attr("class", "tooltip")
   
    /*var svgDetalle=d3.select ("body")
                        .append("svg")     
                        .attr("width",width)
                        .attr("height",height)
    
    svgDetalle.append("g")
                 .attr("transform","translate (0," + (height - margin.botton+5) + ")")
                 .call(ejeX);
    
    var gEjeYDetalle =  svgDetalle.append("g")
                                        .attr("transform","translate (" + margin.left + ",0)")

      */      
    function borrarTooltip(){
        tooltip.style("opacity", 0)
    }
    
    function pintarTooltip(d){
        tooltip.text(d.anio + " -*- " + d.matriculaciones)
               .style("top", d3.event.pageY + "px")
               .style("left", d3.event.pageX + "px")
               .style("opacity", 1)
    }

    function pintarDetalle(anioseleccionado){
      var margin = {top: 20, right: 100, bottom: 100, left: 40},
            width = 800 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        console.log("entradmos en pintardetalle"); 
        console.log("Dimensiones y márgenes definidos");

        // Crear elemento SVG
        var svg = d3.select("body")
          .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        console.log("SVG creado");
        
         var datosMarca2 = datosCompletos.marca_anios[anioseleccionado];
        console.log("está bien eñ 2023",datosMarca2);
        // Escala para el eje x (orden)
        var xScale = d3.scaleLinear()
          .domain([0, d3.max(datosMarca2, function(d) { return d.orden; })])
          .range([0, width]);

        console.log("Escala x creada");

        // Escala para el eje y (matriculaciones)
        var yScale = d3.scaleLinear()
          .domain([0, d3.max(datosMarca2, function(d) { return d.matriculaciones; })])
          .range([height, 0]);

        console.log("Escala y creada");

        // Eje X
        svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(xScale))
          .style("font-size", "10px");

        // Título del eje X
        svg.append("text")
          .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 40) + ")")
          .style("text-anchor", "middle")
          .text("Marcas");

        // Eje Y
        svg.append("g")
          .call(d3.axisLeft(yScale))
          .style("font-size", "10px");

        // Título del eje Y
        svg.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.left)
          .attr("x", 0 - (height / 2))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text("Matriculaciones");

        // Campos de texto para el año
        svg.append("text")
          .attr("x", width / 2)
          .attr("y", height + margin.bottom / 1.3)
          .attr("text-anchor", "middle")
          .style("font-size", "14px")
          .text("Año:"+anioseleccionado);

        // Crear puntos
        svg.selectAll("circle")
          .data(datosCompletos.marca_anios[anioseleccionado])
          .enter().append("circle")
          .attr("cx", function(d) { return xScale(d.orden); })
          .attr("cy", function(d) { return yScale(d.matriculaciones); })
          .attr("r", 5) // Radio de los puntos
          .style("fill", "steelblue"); // Color de los puntos

        console.log("Puntos creados");

        // Etiquetas de marcas
        svg.selectAll("text.labels")
          .data(datosCompletos.marca_anios[anioseleccionado])
          .enter().append("text")
          .attr("class", "labels")
          .attr("x", function(d) { return xScale(d.orden) + 10; })
          .attr("y", function(d) { return yScale(d.matriculaciones) + 5; }) // Ajuste vertical
          .text(function(d) { return d.marca; })
          .attr("text-anchor", "middle") // Alineación central
          .style("font-size", "10px"); // Tamaño de fuente

        console.log("Etiquetas de marcas creadas");

    }
              
})