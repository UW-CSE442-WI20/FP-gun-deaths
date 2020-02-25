var margin = {top: 40, right: 20, left: 40, bottom: 20};
var size = 400;
var width = size - margin.left - margin.right;
var height = size - margin.top - margin.bottom;
var padding = 5;
var svg = d3.select("body").append("svg");
svg.attr("width", 400).attr("height", size).attr("border", 0);

var x = d3.scalePoint();
var y = d3.scaleLinear();

svg.append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

const csvFile = require("./fullData.csv");
d3.csv(csvFile).then(function(d) {
    generateGraph(d);
})


function generateGraph(d) {

    var nestedData = d3.nest()
        .key(function(d) { return d.place;})
        .entries(d);

    nestedData = nestedData.sort(function(d) { console.log(d.values.length); return d3.descending(d.values.length)});
    console.log(nestedData);

    x.domain(nestedData.map(function(d, i) { return d.key;})).range([padding, width + margin.left + padding]);
    y.domain([0, getMaxValue(nestedData)]).range([height, 10]);

    var xAxis = d3.axisBottom()
        .scale(x);

    var yAxis = d3.axisLeft()
        .scale(y)
        .ticks(10);
    
    // x
    svg.append("g")
        .attr("class", "xAxis")
        .attr("transform", "translate(" + margin.left + ", " + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-90)" );

    //y
    svg.append("g")
        .attr("class", "yAxis")
        .attr("transform", "translate(" + margin.left + ", " + "0" + ")")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end");

    svg.selectAll("bar")
        .data(nestedData)
        .enter().append("rect")
        .style("fill", function(d) {
            return "rgb(0, 0, " + Math.round(y(d.values.length)) * 10 + ")";
        })
        .attr("x", function(d, i) { return (width / nestedData.length) * i + margin.left + padding; })
        .attr("y", function(d, i) { return y(d.values.length); })
        .transition()
        .attr("width", width / nestedData.length - padding)
        .attr("height", function(d, i) { return height - y(d.values.length); });
}

function getMaxValue(d) {
    var maxValue = d[0].values.length;
    for (let i = 1; i < d.length; i++) {
        maxValue = Math.max(maxValue, d[i].values.length);
    }
    return maxValue;
}