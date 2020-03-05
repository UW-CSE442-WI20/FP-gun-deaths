// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"BE9J":[function(require,module,exports) {
module.exports = "https://uw-cse442-wi20.github.io/FP-gun-deaths/MvF.48a8c96a.csv";
},{}],"lD15":[function(require,module,exports) {
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var genders = ["Male", "Female"];
var intents = ["Homicide", "Suicide"];
var padding = 50;
var deaths = [54486, 8689, 29803, 5373]; // MS, FS, MH, FH

var current = [];
var percentage = [];
var width = 300;
var height = 200;
var radius = Math.min(width, height) / 2;
var svg = d3.select("body").append("svg").attr("width", width + padding).attr("height", height + padding);
g = svg.append("g").attr("transform", "translate(" + (width + padding) / 2 + "," + (height + padding) / 2 + ")"); // Generate the arcs

var arc = d3.arc().innerRadius(0).outerRadius(radius);
var color = d3.scaleOrdinal(['#1F75FE', '#FFC0CB']); // Generate the pie

var pie = d3.pie();

function pieChartUpdate() {
  console.log("function pieChartUpdate is called!");
  svg.selectAll("path").data(pie(current)).transition().duration(2000).attr("d", arc); // svg.selectAll("arc").selectAll("percentage").remove();

  console.log(svg.selectAll("text.percentage"));
  svg.selectAll("text.percentage").data(pie(current)).transition().attr("transform", function (d, i) {
    var _d = arc.centroid(d);

    console.log(_d);
    _d[0] *= 2.2; //multiply by a constant factor

    _d[1] *= 2.2; //multiply by a constant factor

    return "translate(" + _d + ")";
  }).attr("dy", ".50em").style("text-anchor", "middle").text(function (d, i) {
    return percentage[i].toFixed(2) + '%';
  });
}

function pieChartCreate() {
  //Generate groups
  var arcs = g.selectAll("arc").data(pie(current)).enter().append("g").attr("class", "arc"); //Draw arc paths

  arcs.append("path").attr("fill", function (d, i) {
    return color(i);
  }).attr("d", arc); // creates the lengend for the pie chart

  var legendP = svg.selectAll(".legend").data(pie(current)).enter().append("g").attr("transform", function (d, i) {
    return "translate(" + (width - 50) + "," + (i * 15 + 20) + ")";
  }).attr("class", "legend");
  legendP.append("rect").attr("width", 10).attr("height", 10).attr("fill", function (d, i) {
    return color(i);
  });
  legendP.append("text").text(function (d, i) {
    return genders[i];
  }).style("font-size", 12).attr("y", 10).attr("x", 11); // percentages for pie chart

  g.selectAll("percentage").data(pie(current)).enter().append("text").attr("class", "percentage").attr("transform", function (d, i) {
    var _d = arc.centroid(d);

    console.log(_d);
    _d[0] *= 2.2; //multiply by a constant factor

    _d[1] *= 2.2; //multiply by a constant factor

    return "translate(" + _d + ")";
  }).attr("dy", ".50em").style("text-anchor", "middle").text(function (d, i) {
    return percentage[i].toFixed(2) + '%';
  });
} // grabs the data about Male v Female, filtered on intent


function getFilteredData(data, intent) {
  if (intent == 1) {
    // double equals allows interpolation
    // both homicide and suicide
    current = [deaths[0] + deaths[2], deaths[1] + deaths[3]];
    var total_deaths = deaths[0] + deaths[2] + deaths[1] + deaths[3];
    percentage = [current[0] / total_deaths, current[1] / total_deaths];
    return data;
  } else if (intent == 2) {
    // homicide
    current = [deaths[2], deaths[3]];
    var total_deaths = deaths[2] + deaths[3];
    percentage = [current[0] / total_deaths, current[1] / total_deaths];
    return data.filter(function (d) {
      return d.Intent === "Homicide";
    });
  } else {
    // intent == 3
    // suicide
    current = [deaths[0], deaths[1]];
    var total_deaths = deaths[0] + deaths[1];
    percentage = [current[0] / total_deaths, current[1] / total_deaths];
    return data.filter(function (d) {
      return d.Intent === "Suicide";
    });
  }
} // unnecessary but ill refactor later if i have time


var globalData; // read in CSV data

var csvMvF = require("./MvF.csv");

d3.csv(csvMvF, function (d) {
  d.Deaths = +d.Deaths;
  return d;
}).then(function (d) {
  var $intentSelector = document.getElementById("intent-select");
  var intent = $intentSelector.value;
  globalData = d;
  getFilteredData(d, $intentSelector.value);
  pieChartCreate(); // $intentSelector.onchange = function(e) {
  //     intent = e.target.value;
  //     getFilteredData(d, intent);
  //     console.log(current);
  //     pieChartUpdate();
  // };
}); // html for intent selecter for piechart
//
//<div id="intent-pie">
//    <h3>Intent (Pie Chart):</h3>
//      <select id="intent-pie-select">
//        <option value=1 selected>All Deaths</option>
//        <option value=2>Homicide</option>
//        <option value=3>Suicide</option>
//      </select>
//</div>

var piUpdate =
/*#__PURE__*/
function () {
  function piUpdate() {
    _classCallCheck(this, piUpdate);
  }

  _createClass(piUpdate, [{
    key: "updatePiChart",
    value: function updatePiChart() {
      console.log("class pichart function is called");
      var $intentSelector = document.getElementById("intent-select");
      getFilteredData(globalData, $intentSelector.value);
      pieChartUpdate();
    }
  }]);

  return piUpdate;
}();

module.exports = piUpdate;
},{"./MvF.csv":"BE9J"}],"f9Pb":[function(require,module,exports) {
module.exports = "https://uw-cse442-wi20.github.io/FP-gun-deaths/bubbleGraphData.8cbbc904.csv";
},{}],"Gtdq":[function(require,module,exports) {
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// define functions for handling homicide & side-annotation
// suicide & side-annotation
diameter = 500;
pad = 5;
var ages = ["All", "Under 15", "15 - 34", "35 - 64", "65+"];
var colors = ["#A6ACAF", "#52BE80", "#E67E22", "#5DADE2", "#E74C3C", "#2471A3"];
var scale = d3.scaleSqrt();
var svg = d3.select("body").append("svg");
svg.attr("width", diameter).attr("height", diameter).attr("border", 0);
var pack = d3.pack().size([diameter - 50, diameter]).padding(pad);

function getFilteredData(data, intent, ageGroup) {
  console.log(data);
  console.log(intent);
  console.log(ageGroup);

  if (intent == 1 && ageGroup == 0) {
    // double equals allows interpolation
    // both homicide and suicide
    return data;
  } else if (intent == 1) {
    return data.filter(function (d) {
      return d.Age === ages[ageGroup];
    });
  } else if (intent == 2 && ageGroup == 0) {
    // homicide
    return data.filter(function (d) {
      return d.Intent === "Homicide";
    });
  } else if (intent == 2) {
    return data.filter(function (d) {
      return d.Intent === "Homicide" && d.Age === ages[ageGroup];
    });
  } else if (intent == 3 && ageGroup == 0) {
    // suicide
    return data.filter(function (d) {
      return d.Intent === "Suicide";
    });
  } else {
    return data.filter(function (d) {
      return d.Intent === "Suicide" && d.Age === ages[ageGroup];
    });
  }
} // read in CSV data


var globalData;
var globalAge = 0;

var csvFile = require("./bubbleGraphData.csv");

d3.csv(csvFile, function (d) {
  d.Deaths = +d.Deaths;
  d.Population = +d.Population;
  d.Rate = parseFloat(d.Rate);
  return d;
}).then(function (d) {
  var $intentSelector = document.getElementById("intent-select");
  var intent = $intentSelector.value;
  var ageGroup = 0;
  var intentData = getFilteredData(d, $intentSelector.value, ageGroup);
  globalData = d;
  enterCircles(intentData);
  var sliderAge = d3.sliderBottom().min(0) // bind based on 0-4 on the call, filter
  .max(4).width(300).ticks(4).step(1).default(0).on('onchange', function (val) {
    d3.select('p#value-age').text(ages[val]);
    ageGroup = val;
    globalAge = ageGroup;
    var ageData = getFilteredData(d, intent, ageGroup);
    console.log(ageData);
    updateCircles(ageData);
  });
  var gAge = d3.select('div#slider-age').append('svg').attr('width', 500).attr('height', 100).append('g').attr('transform', 'translate(30,30)');
  gAge.call(sliderAge);
  d3.select('p#value-age').text(ages[sliderAge.value()]); // $intentSelector.onchange = function(e) {
  //   intent = e.target.value;
  //   var intentData = getFilteredData(d, intent, ageGroup);
  //   updateCircles(intentData);
  // };
}); // hard cap @ 6 circles, so hard math was performed on rendering
// hard padding @ 50 on each side, so actual svg is 500x500

function enterCircles(data) {
  var nestedData = d3.nest().key(function (d) {
    return d.Race;
  }).rollup(function (d) {
    return d3.sum(d, function (d) {
      return d.Rate; // deaths per 100k
    });
  }).entries(data);
  var root = d3.hierarchy({
    children: nestedData
  }).sum(function (d) {
    return d.value;
  });
  var maxValue = getMaxValue(nestedData);
  scale.domain([0, maxValue]).range([20, diameter / nestedData.length]);
  var node = svg.selectAll(".node").data(pack(root).leaves()).enter().append("g").attr("class", "node").attr("transform", function (d, i) {
    return "translate(" + d.x + ", " + d.y + ")";
  });
  node.append("title").text(function (d, i) {
    return d.data.key + ": " + d.value;
  });
  node.append("circle").transition().duration(1000).attr("r", function (d, i) {
    return scale(d.value);
  }).attr("stroke", "black").style("fill", function (d, i) {
    return colors[i];
  });
  node.append("text").attr("dy", ".2em").style("text-anchor", "middle").text(function (d) {
    return d.data.key;
  }).attr("font-family", "sans-serif").attr("font-size", function (d) {
    return scale(d.value) / 5;
  }).attr("fill", "white");
  node.append("text").attr("dy", "1.3em").attr("class", "subtitle").style("text-anchor", "middle").text(function (d) {
    return d.value.toFixed(2);
  }).attr("font-family", "Gill Sans", "Gill Sans MT").attr("font-size", function (d) {
    return scale(d.value) / 5;
  }).attr("fill", "white");
  d3.select(self.frameElement).style("height", diameter + "px");
}

function updateCircles(data) {
  var nestedData = d3.nest().key(function (d) {
    return d.Race;
  }).rollup(function (d) {
    return d3.sum(d, function (d) {
      return d.Rate; // deaths per 100k to 2 decimals
    });
  }).entries(data);
  var root = d3.hierarchy({
    children: nestedData
  }).sum(function (d) {
    return d.value;
  });
  var maxValue = getMaxValue(nestedData);
  scale.domain([0, maxValue]).range([20, diameter / nestedData.length]);
  var node = svg.selectAll(".node").data(pack(root).leaves()).transition().duration(2000).attr("transform", function (d, i) {
    return "translate(" + d.x + ", " + d.y + ")";
  }).call(function (node) {
    node.select("circle").attr("r", function (d, i) {
      return scale(d.value);
    });
    node.select("title").text(function (d, i) {
      return d.data.key + ": " + d.value;
    });
    node.select("text").attr("dy", ".2em").style("text-anchor", "middle").text(function (d) {
      return d.data.key;
    }).attr("font-family", "sans-serif").attr("font-size", function (d) {
      return scale(d.value) / 5;
    }).attr("fill", "white");
    node.select(".subtitle").attr("dy", "1.3em").style("text-anchor", "middle").text(function (d) {
      return d.value.toFixed(2);
    }).attr("font-family", "Gill Sans", "Gill Sans MT").attr("font-size", function (d) {
      return scale(d.value) / 5;
    }).attr("fill", "white");
    d3.select(self.frameElement).style("height", diameter + "px");
  });
}

function getMaxValue(d) {
  var currMax = d[0].value;

  for (var i = 1; i < d.length; i++) {
    currMax = Math.max(currMax, d[i].value);
  }

  return currMax;
}

var bubbleUpdate =
/*#__PURE__*/
function () {
  function bubbleUpdate() {
    _classCallCheck(this, bubbleUpdate);
  }

  _createClass(bubbleUpdate, [{
    key: "updateGraph",
    value: function updateGraph() {
      console.log(globalData);
      var $intentSelector = document.getElementById("intent-select");
      var intentData = getFilteredData(globalData, $intentSelector.value, globalAge);
      console.log(intentData);
      updateCircles(intentData);
    }
  }]);

  return bubbleUpdate;
}();

module.exports = bubbleUpdate;
},{"./bubbleGraphData.csv":"f9Pb"}],"dbB8":[function(require,module,exports) {
var piChart = require("./simplePieChart.js");

var bubbleGraph = require("./bubbleGraph.js");

var piChartInstance = new piChart();
var bubbleGraphInstance = new bubbleGraph();
var $intentSelector = document.getElementById("intent-select");

function updateAll() {
  console.log("should be here");
  piChartInstance.updatePiChart();
  bubbleGraphInstance.updateGraph();
}

$intentSelector.onchange = function (e) {
  console.log("here!");
  updateAll();
};
},{"./simplePieChart.js":"lD15","./bubbleGraph.js":"Gtdq"}]},{},["dbB8"], null)
//# sourceMappingURL=https://uw-cse442-wi20.github.io/FP-gun-deaths/updateGraphs.37c794ab.js.map