import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
//import * as d4 from "./d3.v4.js"

// Mantener ()
export async function tc_SP_SCA(cuenca, index){


var margin = {top: 50, right: 0, bottom: 10, left: 65},
width = 200 - margin.left - margin.right,
height = 600 - margin.top - margin.bottom;


var plot01svg = d3.select("#container_"+index)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("id", "d3-plot")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    
d3.csv("csv/total/tc_SP_SCA.csv", function(error, data) {

        var y = d3.scaleOrdinal()
    .rangeRoundBands([0, height], .3);

var x = d3.scale.linear()
        .rangeRound([0, width]);

var color = d3.scale.ordinal()
    .range(["blue", "orange", "yellow", "orange", "blue"]);

    color.domain(["Strongly disagree", "Disagree", "Neither agree nor disagree", "Agree", "Strongly agree"]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("top")
    .ticks(5);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")


    data.forEach(function(d) {
    // calc percentages
        d["Strongly disagree"] = +d[1];
        d["Disagree"] = +d[2];
        d["Neither agree nor disagree"] = +d[3];
        d["Agree"] = +d[4];
        d["Strongly agree"] = +d[5];
        var x0 = -1*(d["Neither agree nor disagree"]+d["Disagree"]+d["Strongly disagree"]);
        var idx = 0;
            d.boxes = color.domain().map(function(name) { return {name: name, x0: x0, x1: x0 += +d[name], N: +d.N, n: +d[idx += 1]}; });
  });

  var min_val = d3.min(data, function(d) {
          return d.boxes["0"].x0;
          });

  var max_val = d3.max(data, function(d) {
          return d.boxes["4"].x1;
          });

  x.domain([min_val*1.1, 0]);
  
  y.domain(data.map(function(d) { return d.Question; }));

  plot01svg.append("g")
      .attr("class", "x axis")
      .call(xAxis);

  plot01svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)

  var vakken = plot01svg.selectAll(".question")
      .data(data)
    .enter().append("g")
      .attr("class", "bar")
      .attr("transform", function(d) { return "translate(0," + y(d.Question) + ")"; });

  var bars = vakken.selectAll("rect")
      .data(function(d) { return d.boxes; })
    .enter().append("g").attr("class", "subbar");

  bars.append("rect")
      .attr("height", y.rangeBand())
      .attr("x", function(d) { return x(d.x0); })
      .attr("width", function(d) { return x(d.x1) - x(d.x0); })
      .style("fill", function(d) { return color(d.name); });

  vakken.insert("rect",":first-child")
      .attr("height", y.rangeBand())
      .attr("x", "1")
      .attr("width", width)
      .attr("fill-opacity", "0.5")
      .style("fill", "#F5F5F5")
      .attr("class", function(d,index) { return index%2==0 ? "even" : "uneven"; });

  plot01svg.append("g")
      .attr("class", "y axis")
  .append("line")
      .attr("x1", x(0))
      .attr("x2", x(0))
      .attr("y2", height);
      

 // y-axis label     

 plot01svg.append("text")
        .attr("text-anchor", "end")
        .attr("font-family","Arial")
        .attr("font-size","12")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 20)
        .attr("x", -margin.top - 150)
        .text("Cuencas (cod BNA)")



////// Legend ////////

// Location

 var xLegend = 9;
 var yLegend = 19;       
 var heightLegend = 8;
 var widthLegend = 8;

// Legend
plot01svg.append("rect")
    .attr("x",xLegend)
    .attr("y",yLegend)
    .attr('height', heightLegend)
    .attr('width', widthLegend)
    .style("fill", "blue")

plot01svg.append("rect")
    .attr("x",xLegend)
    .attr("y",yLegend + 22)
    .attr('height', heightLegend)
    .attr('width', widthLegend)
    .style("fill", "orange")

plot01svg.append("rect")
    .attr("x",xLegend)
    .attr("y",yLegend + 44)
    .attr('height', heightLegend)
    .attr('width', widthLegend)
    .style("fill", "yellow")

plot01svg.append("text")
    .attr("x", xLegend + 12)
    .attr("y", yLegend + 5)
    .text("Permanente")
    .style("font-size", "11px")
    .attr("font-family","Arial")
    .attr("alignment-baseline","middle")

plot01svg.append("text")
    .attr("x", xLegend + 12)
    .attr("y", yLegend + 27)
    .text("Estacional")
    .style("font-size", "11px")
    .attr("font-family","Arial")
    .attr("alignment-baseline","middle")

plot01svg.append("text")
    .attr("x", xLegend + 12)
    .attr("y", yLegend + 49)
    .text("Intermitente")
    .style("font-size", "11px")
    .attr("font-family","Arial")
    .attr("alignment-baseline","middle")



});



















}