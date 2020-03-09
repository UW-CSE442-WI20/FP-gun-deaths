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
var svg = d3.select(".pie-chart").append("svg").attr("width", width + padding).attr("height", height + padding);
g = svg.append("g").attr("transform", "translate(" + (width + padding) / 2 + "," + (height + padding) / 2 + ")"); // Generate the arcs

var arc = d3.arc().innerRadius(0).outerRadius(radius);
var color = d3.scaleOrdinal(['#1F75FE', '#FFC0CB']); // Generate the pie

var pie = d3.pie();

function pieChartUpdate() {
  svg.selectAll("path").data(pie(current)).transition().duration(2000).attr("d", arc); // svg.selectAll("arc").selectAll("percentage").remove();

  svg.selectAll("text.percentage").data(pie(current)).transition().duration(2000).attr("transform", function (d, i) {
    var _d = arc.centroid(d);

    _d[0] *= 2.2; //multiply by a constant factor

    _d[1] *= 2.2; //multiply by a constant factor

    return "translate(" + _d + ")";
  }).attr("dy", ".50em").style("text-anchor", "middle").text(function (d, i) {
    return (percentage[i] * 100).toFixed(2) + '%';
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

    _d[0] *= 2.2; //multiply by a constant factor

    _d[1] *= 2.2; //multiply by a constant factor

    return "translate(" + _d + ")";
  }).attr("dy", ".50em").style("text-anchor", "middle").text(function (d, i) {
    return (percentage[i] * 100).toFixed(2) + '%';
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
      var $intentSelector = document.getElementById("intent-select");
      getFilteredData(globalData, $intentSelector.value);
      pieChartUpdate();
    }
  }]);

  return piUpdate;
}();

module.exports = piUpdate;
},{"./MvF.csv":"BE9J"}],"hQIG":[function(require,module,exports) {
module.exports = "https://uw-cse442-wi20.github.io/FP-gun-deaths/places.ede5feec.csv";
},{}],"ZSN4":[function(require,module,exports) {
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var margin = {
  top: 50,
  right: 25,
  left: 75,
  bottom: 25
};
var size = 500;
var width = size - margin.left - margin.right;
var height = size - margin.top - margin.bottom;
var padding = 5;
var greenScale = d3.scaleLinear().domain([0, 255]).range([30, 160]);
var svg = d3.select(".bar-graph").append("svg");
svg.attr("width", size).attr("height", size).attr("border", 0);
var x = d3.scaleBand();
var y = d3.scaleLinear();
svg.append("g").attr("transform", "translate(" + margin.left + ", " + margin.top + ")");
var globalData;

var csvFile = require("./places.csv");

d3.csv(csvFile).then(function (d) {
  generateGraph(d);
  globalData = d;
});

function getFilteredData(data, intent) {
  if (intent == 1) {
    // double equals allows interpolation
    // both homicide and suicide
    return data;
  } else if (intent == 2) {
    // homicide
    return data.filter(function (d) {
      return d.Intent === "Homicide";
    });
  } else {
    // intent == 3
    // suicide
    return data.filter(function (d) {
      return d.Intent === "Suicide";
    });
  }
}

function generateGraph(d) {
  var nestedData = d3.nest().key(function (d) {
    return d.Place;
  }).rollup(function (d) {
    return d3.sum(d, function (d) {
      return d.Deaths;
    });
  }).entries(d);
  nestedData = nestedData.sort(function (d) {
    return d3.descending(d.value);
  });
  x.domain(nestedData.map(function (d, i) {
    return d.key;
  })).range([padding, width]);
  y.domain([0, getMaxValue(nestedData)]).range([height, margin.bottom / 2]);
  var xAxis = d3.axisBottom().scale(x);
  var yAxis = d3.axisLeft().scale(y).ticks(5); // // title
  // svg.append("text")
  //       .attr("transform", "translate(" + margin.left + ", " + 0 + ")")
  //       .attr("x", 50)
  //       .attr("y", 50)
  //       .attr("font-size", "24px")
  //       .text("Count of deaths by Location");
  // x

  svg.append("g").attr("class", "xAxis").attr("transform", "translate(" + margin.left + ", " + height + ")").call(xAxis).selectAll("text").style("text-anchor", "end").attr("dx", "-.8em").attr("dy", "-.55em").attr("transform", "translate(" + margin.left + ", " + margin.bottom / 2 + ")").attr("transform", "rotate(-30)"); //y

  svg.append("g").attr("class", "yAxis").attr("transform", "translate(" + margin.left + ", " + "0" + ")").call(yAxis); // Y Axis label

  svg.append("text").attr("transform", "rotate(-90)").attr("y", 0).attr("x", 0 - height / 2).attr("dy", "1em").style("text-anchor", "middle").text("Deaths"); // bars

  y.range([height - 10, margin.bottom / 2]); // augment for drawing

  svg.selectAll("bar").data(nestedData).enter().append("rect").attr("class", "placeBar").style("fill", function (d) {
    var colorAugment = Math.round(y(d.value)) / 2;
    var red = 240 - colorAugment;
    return "rgb(" + red + ", " + greenScale(colorAugment) + ", 0)";
  }).attr("x", function (d, i) {
    return x(d.key) + margin.left;
  }).attr("y", function (d, i) {
    return y(d.value);
  }).on('mouseover', mouseHoverIn).on("mouseout", mouseHoverOut).transition().duration(1000).attr("width", x.bandwidth() - padding).attr("height", function (d, i) {
    return height - y(d.value);
  });
}

function updateGraph(d) {
  var nestedData = d3.nest().key(function (d) {
    return d.Place;
  }).rollup(function (d) {
    return d3.sum(d, function (d) {
      return d.Deaths;
    });
  }).entries(d);
  nestedData = nestedData.sort(function (d) {
    return d3.descending(d.value);
  });
  y.range([height - 10, margin.bottom / 2]); // augment for drawing

  svg.selectAll("rect.placeBar").data(nestedData).transition().duration(1000).style("fill", function (d) {
    var colorAugment = Math.round(y(d.value)) / 2;
    var red = 240 - colorAugment;
    return "rgb(" + red + ", " + greenScale(colorAugment) + ", 0)";
  }).attr("x", function (d, i) {
    return x(d.key) + margin.left;
  }).attr("y", function (d, i) {
    return y(d.value);
  }).attr("width", x.bandwidth() - padding).attr("height", function (d, i) {
    return height - y(d.value);
  });
}

function mouseHoverIn(d, i) {
  svg.append("text").attr("id", "t" + d.value + "-").attr("x", function () {
    return x(d.key) + 75;
  }).attr("y", function () {
    return y(d.value) - 1.5;
  }).text(function () {
    return d.value;
  }).attr("fill", "black");
}

function mouseHoverOut(d, i) {
  d3.select("#t" + d.value + "-").remove();
}

function getMaxValue(d) {
  var maxValue = d[0].value;

  for (var i = 1; i < d.length; i++) {
    maxValue = Math.max(maxValue, d[i].value);
  }

  return maxValue;
}

var placeUpdate =
/*#__PURE__*/
function () {
  function placeUpdate() {
    _classCallCheck(this, placeUpdate);
  }

  _createClass(placeUpdate, [{
    key: "updatePlace",
    value: function updatePlace() {
      var $intentSelector = document.getElementById("intent-select");
      var intentData = getFilteredData(globalData, $intentSelector.value);
      updateGraph(intentData);
    }
  }]);

  return placeUpdate;
}();

module.exports = placeUpdate;
},{"./places.csv":"hQIG"}],"f9Pb":[function(require,module,exports) {
module.exports = "https://uw-cse442-wi20.github.io/FP-gun-deaths/bubbleGraphData.15def757.csv";
},{}],"Gtdq":[function(require,module,exports) {
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// define functions for handling homicide & side-annotation
// suicide & side-annotation
diameter = 550;
pad = 5;
var ages = ["All", "Under 15", "15 - 34", "35 - 64", "65+"];
var colors = ["#52BE80", "#E67E22", "#5DADE2", "#E74C3C", "#2471A3"];
var scale = d3.scaleSqrt();
var svg = d3.select(".bubble-graph").append("svg");
svg.attr("width", diameter).attr("height", diameter).attr("border", 0);
var f = d3.format(".2f");
var pack = d3.pack().size([diameter - 50, diameter]).padding(pad);

function getFilteredData(data, intent, ageGroup) {
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
var globalAge = 1;
var globalIntent = 1;

var csvFile = require("./bubbleGraphData.csv");

d3.csv(csvFile, function (d) {
  d.Deaths = +d.Deaths;
  d.Population = +d.Population;
  d.Rate = parseFloat(d.Rate);
  return d;
}).then(function (d) {
  var $intentSelector = document.getElementById("intent-select");
  var $ageSelector = document.getElementById("age-select");
  var data = getFilteredData(d, $intentSelector.value, $ageSelector.value);
  globalData = d;
  enterCircles(data);
  svg.append("text").attr("transform", "translate(" + diameter / 2 + " ," + (0 + 20) + ")").style("text-anchor", "middle").text("Deaths per 100,000");

  $ageSelector.onchange = function (e) {
    globalAge = e.target.value;
    var ageData = getFilteredData(d, globalIntent, globalAge);
    updateCircles(ageData);
  };
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
  scale.domain([0, maxValue]).range([20, diameter / nestedData.length - 4 * pad]);
  var node = svg.selectAll(".node").data(pack(root).leaves()).enter().append("g").attr("class", "node").attr("transform", function (d, i) {
    return "translate(" + d.x + ", " + d.y + ")";
  });
  node.append("title").text(function (d, i) {
    return d.data.key + ": " + f(d.value);
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
  scale.domain([0, maxValue]).range([20, diameter / nestedData.length - 4 * pad]);
  var node = svg.selectAll(".node").data(pack(root).leaves()).transition().duration(2000).attr("transform", function (d, i) {
    return "translate(" + d.x + ", " + d.y + ")";
  }).call(function (node) {
    node.select("circle").attr("r", function (d, i) {
      return scale(d.value);
    });
    node.select("title").text(function (d, i) {
      return d.data.key + ": " + f(d.value);
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
      var $intentSelector = document.getElementById("intent-select");
      globalIntent = $intentSelector.value;
      var intentData = getFilteredData(globalData, globalIntent, globalAge);
      updateCircles(intentData);
    }
  }]);

  return bubbleUpdate;
}();

module.exports = bubbleUpdate;
},{"./bubbleGraphData.csv":"f9Pb"}],"vVhW":[function(require,module,exports) {
module.exports = "https://uw-cse442-wi20.github.io/FP-gun-deaths/lineGraphData.601118c6.csv";
},{}],"U9Po":[function(require,module,exports) {
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// set the dimensions and margins of the graph
var margin = {
  top: 20,
  right: 20,
  bottom: 70,
  left: 50
},
    width = 650 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom; // set the ranges

var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);
var races = ["Asian/Pacific Islander", "Black", "Hispanic", "Native American", "White"];
var colors = ["#52BE80", "#E67E22", "#5DADE2", "#E74C3C", "#2471A3"]; // define the line

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


var svg = d3.select(".line-graph").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")"); // Get the data

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


  svg.append("g").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x)); // X Axis label

  svg.append("text").attr("transform", "translate(" + width / 2 + " ," + (height + margin.top + 20) + ")").style("text-anchor", "middle").text("Age"); // Add the Y Axis

  svg.append("g").call(d3.axisLeft(y)); // Y Axis label

  svg.append("text").attr("transform", "rotate(-90)").attr("y", 0 - margin.left - 5).attr("x", 0 - height / 2).attr("dy", "1em").style("text-anchor", "middle").text("Deaths");
  addLegend();
  addMouseOver();
});

function updateLines(intent) {
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
},{"./lineGraphData.csv":"vVhW"}],"dbB8":[function(require,module,exports) {
// const gunGraph = require("./gunGraph.js");
var piChart = require("./simplePieChart.js");

var placeGraph = require("./simpleBarGraph.js");

var bubbleGraph = require("./bubbleGraph.js");

var lineGraph = require("./lineGraph.js"); // const gunGraphInstance = new gunGraph();


var piChartInstance = new piChart();
var placeGraphInstance = new placeGraph();
var bubbleGraphInstance = new bubbleGraph();
var lineGraphInstance = new lineGraph();
var $intentSelector = document.getElementById("intent-select");

function updateAll() {
  piChartInstance.updatePiChart();
  placeGraphInstance.updatePlace();
  bubbleGraphInstance.updateGraph();
  lineGraphInstance.updateGraph();
}

$intentSelector.onchange = function (e) {
  updateAll();
};
},{"./simplePieChart.js":"lD15","./simpleBarGraph.js":"ZSN4","./bubbleGraph.js":"Gtdq","./lineGraph.js":"U9Po"}]},{},["dbB8"], null)
//# sourceMappingURL=https://uw-cse442-wi20.github.io/FP-gun-deaths/updateGraphs.e6b031dd.js.map