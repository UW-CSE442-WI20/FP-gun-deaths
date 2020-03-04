// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// set the ranges
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

var races = ["Asian/Pacific Islander", "Black", "Hispanic", "Native American", "White"];
var colors = ["#A6ACAF", "#52BE80", "#5DADE2", "#E74C3C", "#2471A3", "#E67E22"];

// define the line
function valueline(intent) {
  return d3.line()
        .x(function(d) { return x(d.Age); })
        .y(function(d) { if (intent == 1) {
                          return y(d.HomicideCnt + d.SuicideCnt);
                        } else if (intent == 2) {
                          return y(d.HomicideCnt);
                        } else {
                          return y(d.SuicideCnt);
                        } });
}

function getFilteredData(data, race) {
  return data.filter(function(d) { return d.Race === race });
}


// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Get the data
const csvFile = require("./lineGraphData.csv");
d3.csv(csvFile, function(d) {
    // format the data
    d.Age = +d.Age;
    d.HomicideCnt = +d.HomicideCnt;
    d.SuicideCnt = +d.SuicideCnt;
    return d;
  }).then(function(data){
    // Scale the range of the data
    x.domain([0, d3.max(data, function(d) { return d.Age; })]);
    y.domain([0, 1500]).range([height, 10]);
    //y.domain([0, getMaxValue(data)]).range([height, 10]);

    // Add the valueline path.
    for (let i = 0; i < races.length; i++) {
      var filteredData = getFilteredData(data, races[i]);
      svg.append("path")
          .data([filteredData])
          .attr("fill", "none")
          .attr("stroke", colors[i])
          .attr("stroke-width", "2px")
          .attr("d", valueline(1));
    }

    // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

  })

  function getMaxValue(d) {
    var maxValue = d[1].value;
    for (let i = 1; i < d.length; i++) {
        maxValue = Math.max(maxValue, d[i].value);
    }
    return maxValue;
  }
