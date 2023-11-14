
let width = 600,
  height = 600,
  scales = {
    fill: d3.scaleQuantize()
            .domain([85, 591991])
            .range(d3.schemeYlOrRd[9])
  }

var numberFormat = d3.format(".2f");
function mouseover(d) {
  d3.select("#name")
    .select("text")
    .text([d.properties.county, numberFormat(d.properties.average_calfresh)])

  d3.select("#map")
    .selectAll("path")
    .attr("stroke-width", e => e.properties.county == d.properties.county ? 2 : 0)
}

function visualize(data) {
  let proj = d3.geoMercator()
    .fitSize([width, height], data)
  let path = d3.geoPath()
    .projection(proj);

  d3.select("#map")
    .selectAll("path")
    .data(data.features).enter()
    .append("path")
    .attrs({
      d: path,
      fill: d => scales.fill(d.properties.average_calfresh),
      "stroke-width": 0
    })
    .on("mouseover", (_, d) => mouseover(d));

  d3.select("#name")
    .append("text")
    .attr("transform", "translate(400, 100)")
}  

d3.json("https://raw.githubusercontent.com/Star732/UW_Madison_STAT679/main/Calfresh_Enrollment/county_wi_avgEnrollment.geojson")
  .then(visualize)
