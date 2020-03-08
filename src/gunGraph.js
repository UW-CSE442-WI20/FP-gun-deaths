var margin = {top: 50, right: 25, left: 50, bottom: 25};
var size = 500;
var width = size - margin.left - margin.right;
var height = size - margin.top - margin.bottom;
var padding = 5;
var colors = ["#52BE80", "#E67E22", "#5DADE2", "#E74C3C"];
var svg = d3.select("body").append("svg");
svg.attr("width", size).attr("height", size).attr("border", 0);

var x = d3.scaleBand();
var y = d3.scaleLinear();


function getFilteredData(data, year) {
    if (year == 1) {
        return data;
    } else if (year == 2) {
        return data.filter(function(d) { return d.year === 2012;});
    } else if (year == 3) {
        return data.filter(function(d) { return d.year === 2013;});
    } else if (year == 4) {
        return data.filter(function(d) { return d.year === 2014;});
    } else if (year == 5) {
        return data.filter(function(d) { return d.year === 2015;});
    } else { // year == 6
        return data.filter(function(d) { return d.year === 2016;});
    }
}

var globalData;
const csvFile = require("./fbi_clean.csv");
d3.csv(csvFile, function(d) {
    d.year = +d.year;
    d.deaths = +d.deaths;
    return d;
}).then(function(d) {
    var $yearSelector = document.getElementById("year-select");
    var yearData = getFilteredData(d, $yearSelector.value);
    generateGraph(yearData);
    globalData = d;
    console.log(d);

    $yearSelector.onchange = function(e) {
        year = e.target.value;
        var yearData = getFilteredData(d, year);
        console.log(yearData);

        updateGraph(yearData);
    }
})

function generateGraph(d) {
    var nestedData = d3.nest()
        .key(function(d) { return d.gunType;})
        .rollup(function(d) {
            return d3.sum(d, function(d) {
              return d.deaths;  
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

    // // title
    // svg.append("text")
    //       .attr("transform", "translate(" + margin.left + ", " + -30 + ")")
    //       .attr("x", 50)
    //       .attr("y", 50)
    //       .attr("font-size", "24px")
    //       .text("Count of deaths per year by firearm type");

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
        .attr("class", "gunBar")
        .style("fill", function(d, i) {
            return colors[i];
        })
        .attr("x", function(d, i) {return x(d.key) + margin.left + 5*padding; })
        .attr("y", function(d, i) { return y(d.value); })
        .transition()
        .duration(1000)
        .attr("width", x.bandwidth() - 10*padding)
        .attr("height", function(d, i) { return height - y(d.value); });
}

function updateGraph(d) {
    var nestedData = d3.nest()
        .key(function(d) { return d.gunType;})
        .rollup(function(d) {
            return d3.sum(d, function(d) {
              return d.deaths;  
            })
          })
        .entries(d);

    nestedData = nestedData.sort(function(d) {return d3.descending(d.value)});
    console.log(nestedData);

    y.range([height - 10, margin.bottom / 2]); // augment for drawing
    svg.selectAll("rect.gunBar")
        .data(nestedData)
        .transition()
        .duration(1000)
        .style("fill", function(d, i) {
            return colors[i];
        })
        .attr("x", function(d, i) { console.log(d); return x(d.key) + margin.left + 5*padding; })
        .attr("y", function(d, i) { return y(d.value); })
        .attr("width", x.bandwidth() - 10*padding)
        .attr("height", function(d, i) { return height - y(d.value); });
}

function getMaxValue(d) {
    var maxValue = d[0].value;
    for (let i = 1; i < d.length; i++) {
        maxValue = Math.max(maxValue, d[i].value);
    }
    return maxValue;
}

class gunUpdate {
    constructor() {}

    updateGun() {
        var $yearSelector = document.getElementById("year-select");
        var yearData = getFilteredData(globalData, $yearSelector.value);
        updateGraph(yearData);
    }
}

module.exports = gunUpdate;
