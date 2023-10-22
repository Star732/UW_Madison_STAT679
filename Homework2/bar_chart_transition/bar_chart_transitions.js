let bar_ages = [],
    generator = d3.randomUniform(0, 500),
    r_generator = d3.randomUniform(0, 255), g_generator = d3.randomUniform(0, 255), b_generator = d3.randomUniform(0, 255),
    r_generator1 = d3.randomUniform(0, 255), g_generator1 = d3.randomUniform(0, 255), b_generator1 = d3.randomUniform(0, 255),
    id = 0;

function update() {
    bar_ages = bar_ages.map(d => { return {id: d.id, age: d.age + 1, height: d.height, r: d.r, g: d.g, b: d.b, rl: d.rl, gl: d.gl, bl: d.bl }})
    bar_ages.push({age: 0, height: generator(), id: id, r: r_generator(), g: g_generator(), b: b_generator(), rl: r_generator1(), gl: g_generator1(), bl: b_generator1()});
    bar_ages = bar_ages.filter(d => d.age < 5)
    id += 1;

    let selection = d3.select("svg")
        .selectAll("rect")
        .data(bar_ages, d => d.id)

    selection.enter()
        .append("rect")
        .attrs({
            x: -80, 
            y: d => 500 - d.height, 
            width: 80,
            height: d => d.height,
            fill: d => 'rgb(' + d.r + ',' + d.g + ',' + d.b + ')' 
        })

    d3.select("svg")
        .selectAll("rect")
        .transition()
        .duration(1000)
        .attrs({
            x: d => 150 * d.age,
            y: d => 500 - d.height, 
            width: 80,
            height: d => d.height,
            fill: d => 'rgb(' + d.rl + ',' + d.gl + ',' + d.bl + ')' 
        })

    selection.exit()
        .transition()
        .duration(1000)
        .attr("y", 500)
        .remove()

}
