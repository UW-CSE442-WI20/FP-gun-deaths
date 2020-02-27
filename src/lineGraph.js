// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// set the ranges
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the line
var valueline = d3.line()
    .x(function(d) { return x(d.age); })
    .y(function(d) { return y(d.length); });

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
const csvFile = require("./fullData.csv");
d3.csv(csvFile, function(d) {
    // format the data
    d.age = +d.age;
    return d;
  }).then(function(data){

    var dataByRaceAndAge = d3.nest()
      .key(function(d) { return d.race; })
      .key(function(d) { return d.age; })
      .rollup(function(v) { return v.length; })
      .entries(data);

    // dataByRaceAndAge = dataByRaceAndAge.sort(function(d) { return d3.ascending(d.values.key)});

    console.log(dataByRaceAndAge);

    // Scale the range of the data
    x.domain([0, d3.max(data, function(d) { return d.age; })]);
    y.domain([0, getMaxValue(dataByRaceAndAge)]).range([height, 10]);

    // // Add the valueline path.
    // svg.append("path")
    //     .data([groupedData])
    //     .attr("class", "line")
    //     .attr("d", valueline);
    //
    // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

  })

  function getMaxValue(d) {
      var maxValue = d[0].values[0].value;
      for (let i = 0; i < d.length; i++) {
        for (let j = 0; j < d[i].length; j++) {
          maxValue = Math.max(maxValue, d[i].values[j].value);
        }
      }
      return maxValue;
  }
