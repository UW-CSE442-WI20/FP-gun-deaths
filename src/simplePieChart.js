var genders = ["M", "F"]
var intents = ["Homicide", "Suicide"]

var deaths = [54486, 8689, 29803, 5373];  // MS, FS, MH, FH
var current = []

var svg = d3.select("body").append("svg"),
			width = svg.attr("width", 300),
			height = svg.attr("height", 200),
			radius = Math.min(width, height) / 2,
			g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var color = d3.scaleOrdinal(['#4daf4a','#377eb8']);

// Generate the pie
var pie = d3.pie();

function pieChartCreateAndUpdate() {
    // Generate the arcs
    var arc = d3.arc()
                .innerRadius(0)
                .outerRadius(radius);

    //Generate groups
    var arcs = g.selectAll("arc")
                .data(pie(current))
                .enter()
                .append("g")
                .attr("class", "arc")

    //Draw arc paths
    arcs.append("path")
        .attr("fill", function(d, i) {
            return color(i);
        })
        .attr("d", arc);

    // creates the lengend for the pie chart
    var legendP = svg.selectAll(".legend")
        .data(pie(current))
        .enter().append("g")
        .attr("transform", function(d, i){
            return "translate(" + (width-110) + "," + (i*15 +20) + ")";
        })
        .attr("class", "legend");

    legendP.append("rect")
        .attr("width", 10)
        .attr("hegiht", 10)
        .attr("fill", function(d, i){
            return color(i);
        });

    legendP.append("text")
        .text(function(d){
            return d;
        })
        .style("font-size", 12)
        .attr("y", 10)
        .attr("x", 11);
}

// grabs the data about Male v Female, filtered on intent
function getFilteredDataForPieChart(data, intent) {
    if (intent == 1) { // double equals allows interpolation
        // both homicide and suicide
        current = [deaths[0]+deaths[2], deaths[1]+deaths[3]];
        return data;
    } else if (intent == 2) {
        // homicide
        current = [deaths[2], deaths[3]];
        return data.filter(function(d) { return d.Intent === "Homicide"});
    } else {  // intent == 3
        // suicide
        current = [deaths[0], deaths[1]];
        return data.filter(function(d) { return d.Intent === "Suicide"});
    }
}

// read in CSV data
const csvMvF = require("./MvF.csv");
d3.csv(csvMvF, function(d) {
        d.Deaths = +d.Deaths;
        return d;
}).then(function(d) {
    var $intentSelector = document.getElementById("intent-select");
    var intent = $intentSelector.value;
    var intentData = getFilteredData(d, $intentSelector.value);

    pieChartCreateAndUpdate();

    $intentSelector.onchange = function(e) {
        intent = e.target.value;
        var intentData = getFilteredData(d, intent);
  
        pieChartCreateAndUpdate();
  
    };
})

// html for intent selecter for piechart
//
//<div id="intent-pie">
//    <h3>Intent (Pie Chart):</h3>
//      <select id="intent-pie-select">
//        <option value=1 selected>All Deaths</option>
//        <option value=2>Homicide</option>
//        <option value=3>Suicide</option>
//      </select>
//</div>