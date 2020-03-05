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
})({"lineGraphData.csv":[function(require,module,exports) {
module.exports = "/lineGraphData.5a6dca58.csv";
},{}],"lineGraph.js":[function(require,module,exports) {
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// set the dimensions and margins of the graph
var margin = {
  top: 20,
  right: 20,
  bottom: 30,
  left: 50
},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom; // set the ranges

var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);
var races = ["Asian/Pacific Islander", "Black", "Hispanic", "Native American", "White"];
var colors = ["#52BE80", "#5DADE2", "#E74C3C", "#2471A3", "#E67E22"]; // define the line

function valueline(intent) {
  return d3.line().x(function (d) {
    return x(d.Age);
  }).y(function (d) {
    if (intent == 1) {
      return y(d.HomicideCnt + d.SuicideCnt);
    } else if (intent == 2) {
      return y(d.HomicideCnt);
    } else {
      return y(d.SuicideCnt);
    }
  });
}

function getFilteredData(data, race) {
  return data.filter(function (d) {
    return d.Race === race;
  });
} // append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin


var svg = d3.select("body").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")"); // Get the data

var globalData;

var csvFile = require("./lineGraphData.csv");

d3.csv(csvFile, function (d) {
  // format the data
  d.Age = +d.Age;
  d.HomicideCnt = +d.HomicideCnt;
  d.SuicideCnt = +d.SuicideCnt;
  return d;
}).then(function (data) {
  globalData = data;
  var $intentSelector = document.getElementById("intent-select"); // Scale the range of the data

  x.domain([0, d3.max(data, function (d) {
    return d.Age;
  })]);
  y.domain([0, 1500]).range([height, 10]); //y.domain([0, getMaxValue(data)]).range([height, 10]);
  // Add the valueline path.

  for (var i = 0; i < races.length; i++) {
    var filteredData = getFilteredData(data, races[i]);
    svg.append("path").attr("class", "line").data([filteredData]).attr("stroke", colors[i]).attr("d", valueline($intentSelector.value));
  } // Add the X Axis


  svg.append("g").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x)); // Add the Y Axis

  svg.append("g").call(d3.axisLeft(y));
  addLegend();
  addMouseOver();
});

function updateLines(intent) {
  console.log("updateLines is called!!!!!!!!!");
  svg.selectAll(".line").transition().duration(2000).attr("d", valueline(intent));
}

function addLegend() {
  var legend = svg.selectAll(".legend").data(races).enter().append("g").attr("transform", function (d, i) {
    return "translate(" + (width - 100) + "," + (i * 15 + 20) + ")";
  }).attr("class", "legend");
  legend.append("rect").attr("width", 10).attr("height", 10).attr("fill", function (d, i) {
    return colors[i];
  });
  legend.append("text").text(function (d, i) {
    return races[i];
  }).style("font-size", 12).attr("y", 10).attr("x", 11);
}

function addMouseOver() {
  var mouseG = svg.append("g").attr("class", "mouse-over-effects");
  mouseG.append("path") // this is the black vertical line to follow mouse
  .attr("class", "mouse-line");
  var lines = document.getElementsByClassName('line');
  var mousePerLine = mouseG.selectAll('.mouse-per-line').data(races).enter().append("g").attr("class", "mouse-per-line");
  mousePerLine.append("circle").attr("r", 5).style("stroke", "black").style("fill", function (d, i) {
    return colors[i];
  }).style("stroke-width", "1px").style("opacity", "0");
  mousePerLine.append("text").attr("transform", "translate(10,3)");
  mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
  .attr('width', width) // can't catch mouse events on a g element
  .attr('height', height).attr('fill', 'none').attr('pointer-events', 'all').on('mouseout', function () {
    // on mouse out hide line, circles and text
    d3.select(".mouse-line").style("opacity", "0");
    d3.selectAll(".mouse-per-line circle").style("opacity", "0");
    d3.selectAll(".mouse-per-line text").style("opacity", "0");
  }).on('mouseover', function () {
    // on mouse in show line, circles and text
    d3.select(".mouse-line").style("opacity", "1");
    d3.selectAll(".mouse-per-line circle").style("opacity", "1");
    d3.selectAll(".mouse-per-line text").style("opacity", "1");
  }).on('mousemove', function () {
    // mouse moving over canvas
    var mouse = d3.mouse(this);
    d3.select(".mouse-line").attr("d", function () {
      var d = "M" + mouse[0] + "," + height;
      d += " " + mouse[0] + "," + 0;
      return d;
    });
    d3.selectAll(".mouse-per-line").attr("transform", function (d, i) {
      //console.log(width/mouse[0])
      var xAge = x.invert(mouse[0]),
          bisect = d3.bisector(function (d) {
        return d.Age;
      }).right; //idx = bisect(d.values, xAge);

      var beginning = 0,
          end = lines[i].getTotalLength(),
          target = null;

      while (true) {
        target = Math.floor((beginning + end) / 2);
        pos = lines[i].getPointAtLength(target);

        if ((target === end || target === beginning) && pos.x !== mouse[0]) {
          break;
        }

        if (pos.x > mouse[0]) end = target;else if (pos.x < mouse[0]) beginning = target;else break; //position found
      }

      d3.select(this).select('text').text(y.invert(pos.y).toFixed(0));
      return "translate(" + mouse[0] + "," + pos.y + ")";
    });
  });
}

var lineUpdate =
/*#__PURE__*/
function () {
  function lineUpdate() {
    _classCallCheck(this, lineUpdate);
  }

  _createClass(lineUpdate, [{
    key: "updateGraph",
    value: function updateGraph() {
      var $intentSelector = document.getElementById("intent-select");
      updateLines($intentSelector.value);
    }
  }]);

  return lineUpdate;
}();

module.exports = lineUpdate;
},{"./lineGraphData.csv":"lineGraphData.csv"}],"MvF.csv":[function(require,module,exports) {
module.exports = "/MvF.327b80e7.csv";
},{}],"simplePieChart.js":[function(require,module,exports) {
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
  svg.selectAll("text.percentage").data(pie(current)).transition().duration(2000).attr("transform", function (d, i) {
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
},{"./MvF.csv":"MvF.csv"}],"bubbleGraphData.csv":[function(require,module,exports) {
module.exports = "/bubbleGraphData.9a6e47f8.csv";
},{}],"bubbleGraph.js":[function(require,module,exports) {
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// define functions for handling homicide & side-annotation
// suicide & side-annotation
diameter = 500;
pad = 5;
var ages = ["All", "Under 15", "15 - 34", "35 - 64", "65+"];
var colors = ["#52BE80", "#E67E22", "#5DADE2", "#E74C3C", "#2471A3"];
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
  var ageGroup = 0;
  var intentData = getFilteredData(d, $intentSelector.value, ageGroup);
  globalData = d;
  enterCircles(intentData);
  var sliderAge = d3.sliderBottom().min(0) // bind based on 0-4 on the call, filter
  .max(4).width(300).ticks(4).step(1).default(0).on('onchange', function (val) {
    d3.select('p#value-age').text(ages[val]);
    ageGroup = val;
    globalAge = ageGroup;
    var ageData = getFilteredData(d, $intentSelector.value, ageGroup);
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
  scale.domain([0, maxValue]).range([20, diameter / nestedData.length - 5 * pad]);
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
  scale.domain([0, maxValue]).range([20, diameter / nestedData.length - 5 * pad]);
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
},{"./bubbleGraphData.csv":"bubbleGraphData.csv"}],"updateGraphs.js":[function(require,module,exports) {
var lineGraph = require("./lineGraph.js");

var piChart = require("./simplePieChart.js");

var bubbleGraph = require("./bubbleGraph.js");

var lineGraphInstance = new lineGraph();
var piChartInstance = new piChart();
var bubbleGraphInstance = new bubbleGraph();
var $intentSelector = document.getElementById("intent-select");

function updateAll() {
  console.log("should be here");
  lineGraphInstance.updateGraph();
  piChartInstance.updatePiChart();
  bubbleGraphInstance.updateGraph();
}

$intentSelector.onchange = function (e) {
  console.log("here!");
  updateAll();
};
},{"./lineGraph.js":"lineGraph.js","./simplePieChart.js":"simplePieChart.js","./bubbleGraph.js":"bubbleGraph.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "60470" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","updateGraphs.js"], null)
//# sourceMappingURL=/updateGraphs.9723fc8b.js.map