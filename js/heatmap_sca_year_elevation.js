import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
// Mantener (
export async function heatmap_sca_year_elevation(cuenca, index){
  const textInit = "./csv/year_month_SCA/year_month_SCA_BNA_";
  const textEnd = "_heatmap.csv"

  let yearScaPath = textInit + cuenca + textEnd;
  let yearSca = await d3.csv(yearScaPath);

  const margin = {top: 80, right: 25, bottom: 30, left: 40},
  width = 550 - margin.left - margin.right,
  height = 350 - margin.top - margin.bottom;

  // Mantener )
  // append the svg object to the body of the page
  const svg = d3
      .create("svg")
      .attr("viewBox", [-15, -100, 900, 350]) //X Y WIDTH HEIGHT
  
  svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
  const myGroups = Array.from(new Set(yearSca.map(d => d.group)))
  const myVars = Array.from(new Set(yearSca.map(d => d.variable)))

  // Build X scales and axis:
  const x = d3.scaleBand()  
      .range([ 0, width ])
      .domain(myGroups)
      .padding(0.05);
  svg.append("g") 
      .style("font-size", 8) // TAMANIO DE LOS GRUPOS (ANIOS)
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x).tickSize(0))
      .select(".domain").remove()

  // Build Y scales and axis:
  const y = d3.scaleBand()
      .range([ height, 0 ])
      .domain(myVars)
      .padding(0.05);
  svg.append("g")
      .style("font-size", 10)
      .call(d3.axisLeft(y).tickSize(0))
      .select(".domain").remove()

  // Build color scale es la paleta de colores entonces, pero el rango que considera es una duda que tengo 
  // https://d3js.org/d3-interpolate
  /**
   * d3.interpolateViridis
       d3.interpolateInferno
      d3.interpolateMagma
      d3.interpolatePlasma
      d3.interpolateWarm
      d3.interpolateCool
      d3.interpolateRainbow
      d3.interpolateCubehelixDefault
  */
  const myColor = d3.scaleSequential()
      .interpolator(d3.interpolateRainbow)
      .domain([1,100])

  // Add title to graph
  svg.append("text")
          .attr("x", 0)
          .attr("y", -50)
          .attr("text-anchor", "left")
          .style("font-size", "22px")
          .text("Snow Cover Area "); // TITLE

  // Add subtitle to graph
  svg.append("text")
          .attr("x", 0)
          .attr("y", -20)
          .attr("text-anchor", "left")
          .style("font-size", "14px")
          .style("fill", "grey")
          .style("max-width", 400)
          .text("Snow Cover Area por año de la cuenca " + cuenca); //SUB TITLE

      // create a tooltip

      const tooltip = d3.select("#container_"+index)
          .append("div")
          .style("opacity", 0)
          .attr("class", "tooltip")
          .style("background-color", "white")
          .style("border", "solid")
          .style("border-width", "2px")
          .style("border-radius", "5px")
          .style("padding", "5px")
          .style("margin", "20px 0px -40px 23px") //TOP, RIGHT BOTTOM LEFT

  // Three function that change the tooltip when user hover / move / leave a cell
  const mouseover = function(event,d) {
      tooltip
      .style("opacity", 1)
      d3.select(this)
      .style("stroke", "black")
      .style("opacity", 1)
  }
  const mousemove = function(event,d) {
  tooltip
      .html("The exact value of this cell is: "+d.value)
      .style("width", "auto")
  }
  const mouseleave = function(event,d) {
      tooltip
      .style("opacity", 0)
      d3.select(this)
      .style("stroke", "none")
      .style("opacity", 0.8)
  }

  // add the squares
  svg.selectAll()
      .data(yearSca, function(d) {return d.group+':'+d.variable;})
      .join("rect")
      .attr("x", function(d) { return x(d.group) })
      .attr("y", function(d) { return y(d.variable) })
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("width", x.bandwidth() )
      .attr("height", y.bandwidth() )
      .style("fill", function(d) { return myColor(d.value)} )
      .style("stroke-width", 4)
      .style("stroke", "none")
      .style("opacity", 0.8)
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)

      d3.select("#container_"+index).append(() => svg.node());
}