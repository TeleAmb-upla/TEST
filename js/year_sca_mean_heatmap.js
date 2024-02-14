import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
// Manter (
export async function year_sca_mean_heatmap(cuenca, index){
  const textInit = "./csv/year_SCA/year_SCA_BNA_";
  const textEnd = "_mean_heatmap.csv"

  let path = textInit + cuenca + textEnd;
  let data = await d3.csv(path);

  const margin = {top: 80, right: 25, bottom: 30, left: 40},
  width = 550 - margin.left - margin.right,
  height = 350 - margin.top - margin.bottom;
// Manter )
  // append the svg object to the body of the page
  var svg = d3.select("#container_"+index)
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

  // Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
  const myGroups = Array.from(new Set(data.map(d => d.group)))
  const myVars = Array.from(new Set(data.map(d => d.variable)))

  // Build X scales and axis:
  var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(myGroups)
    .padding(0.05);
  svg.append("g")
    .style("font-size", 8)
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSize(0))
    .select(".domain").remove()

  // Build Y scales and axis:
  var y = d3.scaleBand()
    .range([ height, 0 ])
    .domain(myVars)
    .padding(0.05);
  svg.append("g")
    .style("font-size", 8)
    .call(d3.axisLeft(y).tickSize(0))
    .select(".domain").remove()

  // Build color scale

  var myColor = d3.scaleLinear().domain([1,50])
  .range(["#ffffd9", "#081d58"])


//  var myColor = d3.scaleSequential()
//    .interpolator(d3.interpolateInferno)
//    .domain([1,100])

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
    .data(data, function(d) {return d.group+':'+d.variable;})
    .enter()
    .append("rect")
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

// Add title to graph
svg.append("text")
        .attr("x", 0)
        .attr("y", -50)
        .attr("text-anchor", "left")
        .style("font-size", "9px")
        .text("A d3.js heatmap");

// Add subtitle to graph
svg.append("text")
        .attr("x", 0)
        .attr("y", -20)
        .attr("text-anchor", "left")
        .style("font-size", "8px")
        .style("fill", "grey")
        .style("max-width", 400)
        .text("A short description of the take-away message of this chart.");

}