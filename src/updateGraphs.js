
const piChart = require("./simplePieChart.js");
const bubbleGraph = require("./bubbleGraph.js");
const piChartInstance = new piChart();
const bubbleGraphInstance = new bubbleGraph();

var $intentSelector = document.getElementById("intent-select");

function updateAll() {
    console.log("should be here");
    piChartInstance.updatePiChart();
    bubbleGraphInstance.updateGraph();
}

$intentSelector.onchange = function(e) {
    console.log("here!");
    updateAll();

};