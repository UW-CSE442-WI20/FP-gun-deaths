var margin = {top: 50, right: 25, left: 75, bottom: 25};
var size = 500;
var width = size - margin.left - margin.right;
var height = size - margin.top - margin.bottom;
var padding = 5;
var greenScale = d3.scaleLinear().domain([0, 255]).range([30, 160]);
var svg = d3.select("body").append("svg");
svg.attr("width", size).attr("height", size).attr("border", 0);

var x = d3.scaleBand();
var y = d3.scaleLinear();

svg.append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

var globalData;
const csvFile = require("./places.csv");
d3.csv(csvFile).then(function(d) {
    generateGraph(d);
    globalData = d;
})

function getFilteredData(data, intent) {
    if (intent == 1) { // double equals allows interpolation
        // both homicide and suicide
        return data;
    } else if (intent == 2) {
        // homicide
        return data.filter(function(d) { return d.Intent === "Homicide"});
    } else {  // intent == 3
        // suicide
        return data.filter(function(d) { return d.Intent === "Suicide"});
    }

}


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
        .ticks(5);

    // // title
    // svg.append("text")
    //       .attr("transform", "translate(" + margin.left + ", " + 0 + ")")
    //       .attr("x", 50)
    //       .attr("y", 50)
    //       .attr("font-size", "24px")
    //       .text("Count of deaths by Location");

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

    // Y Axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Deaths");


    // bars
    y.range([height - 10, margin.bottom / 2]); // augment for drawing
    svg.selectAll("bar")
        .data(nestedData)
        .enter().append("rect")
        .attr("class", "placeBar")
        .style("fill", function(d) {
            var colorAugment = Math.round(y(d.value)) / 2;
            var red = 240 - colorAugment;
            return "rgb(" + red + ", " + greenScale(colorAugment) + ", 0)";
        })
        .attr("x", function(d, i) {return x(d.key) + margin.left; })
        .attr("y", function(d, i) { return y(d.value); })
        .on('mouseover', mouseHoverIn)
        .on("mouseout", mouseHoverOut)
        .transition()
        .duration(1000)
        .attr("width", x.bandwidth() - padding)
        .attr("height", function(d, i) { return height - y(d.value); });

}

function updateGraph(d) {
    var nestedData = d3.nest()
        .key(function(d) { return d.Place;})
        .rollup(function(d) {
            return d3.sum(d, function(d) {
              return d.Deaths;
            })
          })
        .entries(d);

    nestedData = nestedData.sort(function(d) {return d3.descending(d.value)});

    y.range([height - 10, margin.bottom / 2]); // augment for drawing
    svg.selectAll("rect.placeBar")
        .data(nestedData)
        .transition()
        .duration(1000)
        .style("fill", function(d) {
            var colorAugment = Math.round(y(d.value)) / 2;
            var red = 240 - colorAugment;
            return "rgb(" + red + ", " + greenScale(colorAugment) + ", 0)";
        })
        .attr("x", function(d, i) {return x(d.key) + margin.left; })
        .attr("y", function(d, i) { return y(d.value); })
        .attr("width", x.bandwidth() - padding)
        .attr("height", function(d, i) { return height - y(d.value); });
}

function mouseHoverIn(d, i) {
    svg.append("text")
        .attr("id", "t" + d.value + "-")
        .attr("x", function() {
            return x(d.key) + 75;
        })
        .attr("y", function() {
            return y(d.value) - 1.5;
        })
    .text(function() { return d.value; })
        .attr("fill", "black");
}

function mouseHoverOut(d, i) {
    d3.select("#t" + d.value + "-").remove();
}

function getMaxValue(d) {
    var maxValue = d[0].value;
    for (let i = 1; i < d.length; i++) {
        maxValue = Math.max(maxValue, d[i].value);
    }
    return maxValue;
}

class placeUpdate {
    constructor() {}

    updatePlace() {
      var $intentSelector = document.getElementById("intent-select");
      var intentData = getFilteredData(globalData, $intentSelector.value);
      updateGraph(intentData);
    }
  }

  module.exports = placeUpdate;
