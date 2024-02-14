import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
// Mantener ()
export async function year_snowline(cuenca, index){
  var margin = {top: 10, right: 30, bottom: 40, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  // Text to create .csv file
  var text_ini = "./csv/year_Snowline/year_snowline_BNA_"
  var text_end =  ".csv"

  // .csv file
  var watershed_selected = text_ini.concat(cuenca).concat(text_end)

  let data = await d3.csv(watershed_selected);
// Mantener )
 
// de aqui X
  
// append the svg object to the body of the page
  var svg = d3.select("#container_"+index)
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");


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

    // Add X axis --> it is a date format
  var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(data.map(function(d) { return d.date; }))
    .padding(0.2);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end")
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);

    let menor = data[0].value;

    data.forEach(element => {
      if(element.value < menor){
        menor = element.value;
      }
    });

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([menor, d3.max(data, function(d) { return +d.value; })])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));

    // Add the line
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.date) })
        .y(function(d) { return y(d.value) })
        )

  // Add X axis label:
  svg.append("text")
    .attr("text-anchor", "end")
    .attr("font-family","Arial")
    .attr("font-size","13")
    .attr("x", (width/2) + 20)
    .attr("y", height + margin.top + 30)
    .text("Años");

  // Y axis label:
  svg.append("text")
    .attr("text-anchor", "end")
    .attr("font-family","Arial")
    .attr("font-size","13")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left + 20)
    .attr("x", -margin.top - 50)
    .text("Elevación línea de nieve (msnm)");

      // create a tooltip
  var tooltip = d3.select("#container_"+index)
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")

}