console.log("Cargando fichero Sesion6.js")

d3.json ("https://gist.githubusercontent.com/double-thinker/817b155fd4fa5fc865f7b32007bd8744/raw/13068b32f82cc690fb352f405c69c156529ca464/partidos2.json").then (function (datosCompletos){
    
    console.log("Datos cargados Sesion6.js")
    
    /* 
     * Gráfica de dispersión 
     */
    
    // Variable correspondiente a los partidos politicos
    var datosPartidos = datosCompletos.partidos;
    
    var height = 600;
    var width = 400;
    
    var margin  = {
        top: 20,
        botton: 50,
        left:40,
        right:50
            
    }
    
    // Insertamos elemento
    var elementosvg = d3.select ("body")
                        .append("svg")
                        .attr("width",width)
                        .attr("height",height);
    
    // Escalas
    var escalatamanio = d3.scaleLinear()
                            .domain(d3.extent(datosPartidos, d => d.votantes))
                            .range([8,20])    

    var escalaX = d3.scaleLinear()
                    .domain ([1,10])
                    .range ([0 + margin.left, width - margin.right]);
    
    var escalaY= d3.scaleLinear()
                   .domain (d3.extent(datosPartidos, d => d.votantes))
                   .range ([height - margin.botton, 0 + margin.top]);
    
    // Cambio en el escala de tres colores
    var escalaColor = d3.scaleLinear ()
                        .domain ([1, 5, 10])
                        .range (["red", "grey", "blue"])
    
    // Ejes
    var ejeX = d3.axisBottom (escalaX)
                 .ticks (5)
                 .tickFormat (d3.format(".3s"))
    
    elementosvg.append("g")
               .attr("transform","translate (0," + (height - margin.botton+5) + ")")
               .call(ejeX)
              
              
    var ejeY = d3.axisLeft (escalaY)
    
    elementosvg.append("g")
               .attr("transform","translate (" + margin.left + ",0)")
               .call(ejeY)
    
    // Pintamos
    elementosvg.selectAll("circle") 
               .data(datosPartidos) 
               .join ("circle")
               .attr("r",d => escalatamanio(d.votantes)) 
               .attr("cx", d => escalaX(d.mediaAutoubicacion))
               .attr("cy",d => escalaY(d.votantes))
               .attr ("fill", d => escalaColor(d.mediaAutoubicacion))
               .on("click", d => pintarHistograma(d.partido))
               .on("mouseover", d => pintarTooltip(d))
               .on("mouseout", d => borrarTooltip)

    var tooltip = d3.select ("body")
                    .append("div")
                    .attr("class", "tooltip")
    
    /*  
     * Histograma 
     */    
    
    var svgHistograma=d3.select ("body")
                        .append("svg")     
                        .attr("width",width)
                        .attr("height",height)
    
    svgHistograma.append("g")
                 .attr("transform","translate (0," + (height - margin.botton+5) + ")")
                 .call(ejeX)
    
    var gEjeYHistograma =  svgHistograma.append("g")
                                        .attr("transform","translate (" + margin.left + ",0)")

    
    function pintarHistograma (partidoseleccionado){
        
        // Seleccionamos los datos para el partido
        var datosHistograma = datosCompletos.histogramas[partidoseleccionado];
        
        // Escala
        var escalaYHistograma = d3.scaleLinear()
                                  .domain (d3.extent(datosHistograma, d => d.y))
                                  .range ([height - margin.botton, 0 + margin.top]);
     
        var ejeYHistograma = d3.axisLeft (escalaYHistograma)
                               .ticks(5)
                               .tickFormat(d3.format(".3s"));
        
        gEjeYHistograma.transition()
                       .duration(2000)
                       .ease(d3.easeBounce)
                       .call(ejeYHistograma)
        

        svgHistograma.selectAll("circle") 
               .data(datosHistograma) 
               .join ("circle")
               .transition()
               .duration(5000)
               .ease(d3.easeElastic.period(0.4))
               .delay(500)
               .attr("r",d => escalatamanio(d.y)) 
               .attr("cx", d => escalaX(d.x))
               .attr("cy",d => escalaYHistograma(d.y))
               .attr ("fill", d => escalaColor(d.x))
        
        svgHistograma.select(".title-label").remove();
        svgHistograma.append("text")
                     .attr("class", "title-label")
                     .attr("x", (width / 2))             
                     .attr("y", height)
                     .attr("text-anchor", "middle")  
                     .style("font-size", "16px") 
                     .style("text-decoration", "underline")  
                     .text(function (d) {return partidoseleccionado; });
        
    }
    
    function borrarTooltip(){
        tooltip.style("opacity", 0)
    }
    
    function pintarTooltip(d){
        tooltip.text(d.partido + " -*- " + d.mediaAutoubicacion)
               .style("top", d3.event.pageY + "px")
               .style("left", d3.event.pageX + "px")
               .style("opacity", 1)
    }
})