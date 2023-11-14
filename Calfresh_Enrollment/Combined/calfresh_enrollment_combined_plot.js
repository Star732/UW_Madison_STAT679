
let width = 400,
  height = 400,
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

function visualize1(data) {
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
  .then(visualize1)


  
function preAnalyse(data) {
  data = data.filter(function(d) {
    return d.calfresh != 'NA';
  });

  let selectedColumns = data.map(d => ({
    date: d.date,
    county: d.county,
    calfresh: d.calfresh,
  }));

  let uniqueDates = Array.from(new Set(data.map(d => d.date)));
  let yearToNumber = {};
  uniqueDates.forEach(function(date, index) {
    yearToNumber[date] = index + 1;
  });

  selectedColumns.forEach(function(d) {
    let dates = d.date;
    d.date = yearToNumber[dates];
  });
  return selectedColumns
}

function nest(data) {
  let result = {}
  let counties = data.map(d => d.county)
  for (let i = 0; i < counties.length; i++){
    result[counties[i]] = [];
  }

  for (let i = 0; i < data.length; i++){
    result[data[i].county].push(data[i])
  }

  return Object.values(result)
}

function draw_lines(nested, scales) {
  let line_generator = d3.line()
    .x(d => scales.x(d.date))
    .y(d => scales.y(d.calfresh))

  d3.select("#lines")
    .selectAll("path")
    .data(nested).enter()
    .append("path")
    .attrs({
        d: line_generator,
        fill: "none",
    });
}

function make_scales(data, margin) {
  return {
    x: d3.scaleLinear()
      .domain(d3.extent(data.map(d => d.date)))//.domain([0, 85])
      .range([margin.left, 500 - margin.right]),
    y: d3.scaleLinear()
      .domain(d3.extent(data.map(d => d.calfresh)))
      .range([300 - margin.bottom, margin.top])
  }
}

function draw_axes(scales, margin) {
  let x_axis = d3.axisBottom(scales.x)
  d3.select("#x_axis")
    .attr("transform", `translate(0, ${300 - margin.bottom})`)
    .call(x_axis)
  
  let y_axis = d3.axisLeft(scales.y)
  d3.select("#y_axis")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(y_axis)
}

function visualize(data) {
  let margin = {top: 10, right: 10, bottom: 20, left: 60}
  let selected = preAnalyse(data)
  let nested = nest(selected)
  let scales = make_scales(selected, margin)
  draw_lines(nested, scales)
  draw_axes(scales, margin)
}

d3.csv("https://raw.githubusercontent.com/krisrs1128/stat992_f23/main/exercises/ps3/calfresh-small.csv", d3.autoType)
  .then(visualize)
