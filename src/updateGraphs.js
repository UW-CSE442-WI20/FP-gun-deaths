// const gunGraph = require("./gunGraph.js");
const bubbleGraph = require("./bubbleGraph.js");
const placeGraph = require("./simpleBarGraph.js");
const lineGraph = require("./lineGraph.js");
const piChart = require("./simplePieChart.js");

// const gunGraphInstance = new gunGraph();
const bubbleGraphInstance = new bubbleGraph();
const placeGraphInstance = new placeGraph();
const lineGraphInstance = new lineGraph();
const piChartInstance = new piChart();


var $intentSelector = document.getElementById("intent-select");

function updateAll() {
    placeGraphInstance.updatePlace();
    lineGraphInstance.updateGraph();
    piChartInstance.updatePiChart();
    bubbleGraphInstance.updateGraph();

}

$intentSelector.onchange = function(e) {
    updateAll();

};
