let ix = d3.range(100)
let generator = d3.randomUniform(0, 500)
let r_generator = d3.randomUniform(0, 10)
let col_generator = d3.randomUniform(0, 255)
let u = ix.map(_ => {return {x: generator(), y: generator(), r: r_generator(), red: col_generator(), green: col_generator(), blue: col_generator()}})

d3.select("#scatter")
  .selectAll("circle")
  .data(u).enter()
  .append("circle")
  .attrs({
    cx: d => d.x,
    cy: d => d.y,
    r: d => d.r,
    fill: d => 'rgb(' + d.red + ',' + d.green + ',' + d.blue + ')'
  })

let transition_length = 100;
let col_generator2 = d3.randomUniform(0, 255)
let x_generator = d3.randomUniform(0, 500)

function animate(t) {
    // u = u.map(d => { return {x: d.x, y: d.y, r: d.r, rnew: (1 + Math.sin(t/10)) * d.r, red: col_generator(), green: col_generator(), blue: col_generator() }})
    u = u.map(d => { return {r: d.r, rnew: (1 + Math.sin(t/10)) * d.r, red: col_generator2(), green: col_generator2(), blue: col_generator2()}})
    d3.selectAll("circle")
        .data(u)
        .transition()
        .duration(transition_length)
        .attrs({
            r: d => d.rnew,
            fill: d => 'rgb(' + d.red + ',' + d.green + ',' + d.blue + ')'
        })

    d3.timeout(() => { animate(t + 1) }, 100)
}

animate(0);