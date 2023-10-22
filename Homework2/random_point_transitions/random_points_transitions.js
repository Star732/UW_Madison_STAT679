let generator = d3.randomUniform();
let x = d3.range(10).map(_ => {return {c_x: generator() }});

  
d3.select("#scatter")
 .selectAll("circle")
 .data(x).enter()
 .append("circle")
 .attrs({
    cx: d => 10 + 800 * d.c_x,
    cy: 250,
    r: 10
 })

let col_gen = d3.randomUniform(255)

function animate(t) {
    let u = d3.range(10).map(_ => {return {c_x: generator(), c_y: generator(), r: 15*generator(), rr: col_gen(), gg: col_gen(), bb: col_gen() }})
    
    u = u.map(d => {return {c_x: d.c_x, c_y: d.c_y, r: d.r, rnew: (1+Math.sin(t/10)) * d.r, rr: d.rr, gg: d.gg, bb: d.bb}})
    
    d3.selectAll("circle")
        .data(u)
        .attrs({
            cx: d => 10 + 800 * d.c_x,
            cy: d => 10 + 450 * d.c_y,
            r: d => d.rnew,
            fill: d => 'rgb(' + d.rr + ',' + d.gg + ',' + d.bb + ')'
        })
    
    d3.timeout(() => {animate(t+1) }, 100)
}

animate(0);
