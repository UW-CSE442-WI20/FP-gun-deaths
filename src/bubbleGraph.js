// define functions for handling homicide & side-annotation

// suicide & side-annotation

diameter = 550;
pad = 5;
var ages = ["All", "Under 15", "15 - 34", "35 - 64", "65+"];
var colors = ["#52BE80", "#E67E22", "#5DADE2", "#E74C3C", "#2471A3"];
var scale = d3.scaleSqrt();
var svg = d3.select(".bubble-graph").append("svg");
svg.attr("width", diameter).attr("height", diameter).attr("border", 0);
var f = d3.format(".2f");

var pack = d3.pack()
    .size([diameter-50, diameter])
    .padding(pad);

function getFilteredData(data, intent, ageGroup) {
  if (intent == 1 && ageGroup == 0) { // double equals allows interpolation
    // both homicide and suicide
    return data;
  } else if (intent == 1) {
    return data.filter(function(d) { return d.Age === ages[ageGroup] });
  } else if (intent == 2 && ageGroup == 0) {
    // homicide
    return data.filter(function(d) { return d.Intent === "Homicide"});
  } else if (intent == 2) {
    return data.filter(function(d) { return (d.Intent === "Homicide") && (d.Age === ages[ageGroup])});
  } else if (intent == 3 && ageGroup == 0){
    // suicide
    return data.filter(function(d) { return d.Intent === "Suicide"});
  } else {
    return data.filter(function(d) { return (d.Intent === "Suicide") && (d.Age === ages[ageGroup])});
  }
}

// read in CSV data
var globalData;
var globalAge = 1;
var globalIntent = 1;
const csvFile = require("./bubbleGraphData.csv");
d3.csv(csvFile, function(d) {
        d.Deaths = +d.Deaths;
        d.Population = +d.Population;
        d.Rate = parseFloat(d.Rate);
        return d;
}).then(function(d) {
    var $intentSelector = document.getElementById("intent-select");
    var $ageSelector = document.getElementById("age-select");
    var data = getFilteredData(d, $intentSelector.value, $ageSelector.value);
    globalData = d;

    enterCircles(data);

    svg.append("text")
        .attr("transform",
              "translate(" + (diameter/2) + " ," +
                             (0 + 20) + ")")
        .style("text-anchor", "middle")
        .text("Deaths per 100,000");

    $ageSelector.onchange = function(e) {
      globalAge = e.target.value;
      var ageData = getFilteredData(d, globalIntent, globalAge);

      updateCircles(ageData);
    };
})

// hard cap @ 6 circles, so hard math was performed on rendering
// hard padding @ 50 on each side, so actual svg is 500x500
function enterCircles(data) {

  var nestedData = d3.nest()
    .key(function(d) { return d.Race;})
    .rollup(function(d) {
      return d3.sum(d, function(d) {
        return d.Rate;  // deaths per 100k
      })
    })
    .entries(data);

  var root = d3.hierarchy({children: nestedData})
    .sum(function(d) { return d.value; });

  var maxValue = getMaxValue(nestedData);

  scale.domain([0, maxValue])
    .range([20, (diameter / nestedData.length) - 4*pad]);

  var node = svg.selectAll(".node")
  .data(pack(root).leaves())
  .enter()
  .append("g")
  .attr("class", "node")
  .attr("transform", function(d, i) {
    return "translate(" + d.x + ", " + d.y + ")";
  });

  node.append("title")
    .text(function(d, i) {
      return d.data.key + ": " + f(d.value);
    });

  node.append("circle")
    .transition()
    .duration(1000)
    .attr("r", function(d, i) {
        return scale(d.value);
    })
    .attr("stroke", "black")
    .style("fill", function(d,i) {
        return colors[i];
    });

  node.append("text")
    .attr("dy", ".2em")
    .style("text-anchor", "middle")
    .text(function(d) {
        return d.data.key;
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", function(d){
        return scale(d.value)/5;
    })
    .attr("fill", "white");

  node.append("text")
    .attr("dy", "1.3em")
    .attr("class", "subtitle")
    .style("text-anchor", "middle")
    .text(function(d) {
        return d.value.toFixed(2);
    })
    .attr("font-family",  "Gill Sans", "Gill Sans MT")
    .attr("font-size", function(d){
        return scale(d.value)/5;
    })
    .attr("fill", "white");

  d3.select(self.frameElement)
    .style("height", diameter + "px");

  }

function updateCircles(data) {

  var nestedData = d3.nest()
  .key(function(d) { return d.Race;})
  .rollup(function(d) {
    return d3.sum(d, function(d) {
      return d.Rate;  // deaths per 100k to 2 decimals
    })
  })
  .entries(data);

var root = d3.hierarchy({children: nestedData})
  .sum(function(d) { return d.value; })
var maxValue = getMaxValue(nestedData);

scale.domain([0, maxValue])
  .range([20, (diameter / nestedData.length) - 4*pad]);

  var node = svg.selectAll(".node")
  .data(pack(root).leaves())
  .transition()
  .duration(2000)
  .attr("transform", function(d, i) {
    return "translate(" + d.x + ", " + d.y+ ")";
  })
  .call(function(node) {
    node.select("circle")
    .attr("r", function(d, i) {
        return scale(d.value);
    });

    node.select("title")
    .text(function(d, i) {
      return d.data.key + ": " + f(d.value);
    })

    node.select("text")
    .attr("dy", ".2em")
    .style("text-anchor", "middle")
    .text(function(d) {
        return d.data.key;
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", function(d){
        return scale(d.value)/5;
    })
    .attr("fill", "white");

    node.select(".subtitle")
    .attr("dy", "1.3em")
    .style("text-anchor", "middle")
    .text(function(d) {
        return d.value.toFixed(2);
    })
    .attr("font-family",  "Gill Sans", "Gill Sans MT")
    .attr("font-size", function(d){
        return scale(d.value)/5;
    })
    .attr("fill", "white");

    d3.select(self.frameElement)
    .style("height", diameter + "px");
  });




}

function getMaxValue(d) {
  var currMax = d[0].value;
  for (var i = 1; i < d.length; i++) {
    currMax = Math.max(currMax, d[i].value);
  }
  return currMax;
}

class bubbleUpdate {
  constructor() {}

  updateGraph() {
    var $intentSelector = document.getElementById("intent-select");
    globalIntent = $intentSelector.value
    var intentData = getFilteredData(globalData, globalIntent, globalAge);
    updateCircles(intentData);
  }
}

module.exports = bubbleUpdate;
