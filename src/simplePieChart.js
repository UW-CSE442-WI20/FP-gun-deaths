var genders = ["Male", "Female"]
var intents = ["Homicide", "Suicide"]

var deaths = [54486, 8689, 29803, 5373];  // MS, FS, MH, FH
var current = [];
var radius = Math.min(300, 200) / 2;
var width = 300;
var height = 200;

var svg = d3.select("body").append("svg")
			.attr("width", width)
            .attr("height", height);
            
g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// Generate the arcs
var arc = d3.arc()
                .innerRadius(0)
                .outerRadius(radius);

var color = d3.scaleOrdinal(['#1F75FE','#FFC0CB']);

// Generate the pie
var pie = d3.pie();

function pieChartUpdate() {
    g.selectAll("arc")
        .data(pie(current))
        .selectAll("path")
        .attr("d", arc);
}

function pieChartCreate() {

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
            return "translate(" + (width-50) + "," + (i*15 +20) + ")";
        })
        .attr("class", "legend");

    legendP.append("rect")
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", function(d, i){
            return color(i);
        });

    legendP.append("text")
        .text(function(d, i){
            return genders[i];
        })
        .style("font-size", 12)
        .attr("y", 10)
        .attr("x", 11);
}

// grabs the data about Male v Female, filtered on intent
function getFilteredData(data, intent) {
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
    getFilteredData(d, $intentSelector.value);

    pieChartCreate();

    $intentSelector.onchange = function(e) {
        intent = e.target.value;
        getFilteredData(d, intent);
        console.log(current);
  
        pieChartUpdate();
  
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