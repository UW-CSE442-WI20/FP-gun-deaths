const lineGraph = require("./lineGraph.js");
const piChart = require("./simplePieChart.js");
const bubbleGraph = require("./bubbleGraph.js");

const lineGraphInstance = new lineGraph();
const piChartInstance = new piChart();
const bubbleGraphInstance = new bubbleGraph();


var $intentSelector = document.getElementById("intent-select");

function updateAll() {
    console.log("should be here");
    lineGraphInstance.updateGraph();
    piChartInstance.updatePiChart();
    bubbleGraphInstance.updateGraph();

}

$intentSelector.onchange = function(e) {
    console.log("here!");
    updateAll();

};
