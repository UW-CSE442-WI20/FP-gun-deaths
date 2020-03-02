var margin = {top: 40, right: 20, left: 40, bottom: 20};
var size = 400;
var width = size - margin.left - margin.right;
var height = size - margin.top - margin.bottom;
var padding = 5;
var svg = d3.select("body").append("svg");
svg.attr("width", 400).attr("height", size).attr("border", 0);

var x = d3.scaleBand();
var y = d3.scaleLinear();

svg.append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

const csvFile = require("./places.csv");
d3.csv(csvFile).then(function(d) {
    generateGraph(d);
})


function generateGraph(d) {

    var nestedData = d3.nest()
        .key(function(d) { return d.Place;})
        .rollup(function(d) {
            return d3.sum(d, function(d) {
              return d.Deaths;  
            })
          })
        .entries(d);

    nestedData = nestedData.sort(function(d) {return d3.descending(d.value)});

    x.domain(nestedData.map(function(d, i) { return d.key;})).range([padding, width]);
    y.domain([0, getMaxValue(nestedData)]).range([height, margin.bottom / 2]);

    var xAxis = d3.axisBottom()
        .scale(x);

    var yAxis = d3.axisLeft()
        .scale(y)
        .ticks(10);
        
    // title
    svg.append("text")
          .attr("transform", "translate(" + margin.left + ", " + 0 + ")")
          .attr("x", 50)
          .attr("y", 50)
          .attr("font-size", "24px")
          .text("Count of deaths by Location");

    // x
    svg.append("g")
        .attr("class", "xAxis")
        .attr("transform", "translate(" + margin.left + ", " + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "translate(" + margin.left +  ", " + margin.bottom/2 + ")")
        .attr("transform", "rotate(-30)");

    //y
    svg.append("g")
        .attr("class", "yAxis")
        .attr("transform", "translate(" + margin.left + ", " + "0" + ")")
        .call(yAxis);


    // bars
    y.range([height - 10, margin.bottom / 2]); // augment for drawing
    svg.selectAll("bar")
        .data(nestedData)
        .enter().append("rect")
        .style("fill", function(d) {
            return "rgb(0, 0, " + Math.round(y(d.value)) * 10 + ")";
        })
        .attr("x", function(d, i) {return x(d.key) + margin.left; })
        .attr("y", function(d, i) { return y(d.value); })
        .transition()
        .duration(1000)
        .attr("width", x.bandwidth() - padding)
        .attr("height", function(d, i) { return height - y(d.value); });
}

function getMaxValue(d) {
    var maxValue = d[0].value;
    for (let i = 1; i < d.length; i++) {
        maxValue = Math.max(maxValue, d[i].value);
    }
    return maxValue;
}