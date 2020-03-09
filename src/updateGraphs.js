// const gunGraph = require("./gunGraph.js");
const piChart = require("./simplePieChart.js");
const placeGraph = require("./simpleBarGraph.js");
const bubbleGraph = require("./bubbleGraph.js");
const lineGraph = require("./lineGraph.js");

// const gunGraphInstance = new gunGraph();
const piChartInstance = new piChart();
const placeGraphInstance = new placeGraph();
const bubbleGraphInstance = new bubbleGraph();
const lineGraphInstance = new lineGraph();


var $intentSelector = document.getElementById("intent-select");

function updateAll() {
    piChartInstance.updatePiChart();
    placeGraphInstance.updatePlace();
    bubbleGraphInstance.updateGraph();
    lineGraphInstance.updateGraph();

}

$intentSelector.onchange = function(e) {
    updateAll();

};
