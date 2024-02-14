import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export async function bar_line_chart(cuenca, index) {
  const textInit = "./csv/year_SCA/year_SCA_BNA_";
  const textEnd = "_heatmap.csv"
  let path = textInit + cuenca + textEnd;
  let data = await d3.csv(path); 
  const margin = {top: 80, right: 25, bottom: 30, left: 40},
  width = 550 - margin.left - margin.right,
  height = 350 - margin.top - margin.bottom;
  
  data = Object.assign(data, {y1: "↑ New cars sold", y2: "Avg. fuel variable (mpg) ↑"})

  let line = d3.line()
  .x(d => x(d.variable) + x.bandwidth() / 2)
  .y(d => y2(d.group))

  let x = d3.scaleBand()
    .domain(data.map(d => d.variable))
    .rangeRound([margin.left, width - margin.right])
    .padding(0.1)

  let y1 = d3.scaleLinear()
  .domain([0, d3.max(data, d => d.value)])
  .rangeRound([height - margin.bottom, margin.top])

  let y2 = d3.scaleLinear()
    .domain(d3.extent(data, d => d.group))
    .rangeRound([height - margin.bottom, margin.top])

  let xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x)
        .tickValues(d3.ticks(...d3.extent(x.domain()), width / 40).filter(v => x(v) !== undefined))
        .tickSizeOuter(0))

  let y1Axis = g => g
  .attr("transform", `translate(${margin.left},0)`)
  .style("color", "steelblue")
  .call(d3.axisLeft(y1).ticks(null, "s"))
  .call(g => g.select(".domain").remove())
  .call(g => g.append("text")
      .attr("x", -margin.left)
      .attr("y", 10)
      .attr("fill", "currentColor")
      .attr("text-anchor", "start")
      .text(data.y1))

  let y2Axis = g => g
  .attr("transform", `translate(${width - margin.right},0)`)
  .call(d3.axisRight(y2))
  .call(g => g.select(".domain").remove())
  .call(g => g.append("text")
      .attr("x", margin.right)
      .attr("y", 10)
      .attr("fill", "currentColor")
      .attr("text-anchor", "end")
      .text(data.y2))

  const svg = d3.create("svg")
  .attr("viewBox", [-15, -100, 900, 350]) //X Y WIDTH HEIGHT

  svg.append("g")
    .attr("fill", "steelblue")
    .attr("fill-opacity", 0.8)
  .selectAll("rect")
  .data(data)
  .join("rect")
    .attr("x", d => x(d.variable))
    .attr("width", x.bandwidth())
    .attr("y", d => y1(d.value))
    .attr("height", d => y1(0) - y1(d.value));

  svg.append("path")
    .attr("fill", "none")
    .attr("stroke", "currentColor")
    .attr("stroke-miterlimit", 1)
    .attr("stroke-width", 3)
    .attr("d", line(data));

  svg.append("g")
    .attr("fill", "none")
    .attr("pointer-events", "all")
  .selectAll("rect")
  .data(data)
  .join("rect")
    .attr("x", d => x(d.variable))
    .attr("width", x.bandwidth())
    .attr("y", 0)
    .attr("height", height)
  .append("title")
    .text(d => `${d.group}
  new cars sold
  mpg average fuel group`);

  svg.append("g")
    .call(xAxis);

  svg.append("g")
    .call(y1Axis);

  svg.append("g")
    .call(y2Axis);

  d3.select("#container_"+index).append(() => svg.node());
}