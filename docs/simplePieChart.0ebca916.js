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
} // read in CSV data


var csvMvF = require("./MvF.csv");

d3.csv(csvMvF, function (d) {
  d.Deaths = +d.Deaths;
  return d;
}).then(function (d) {
  var $intentSelector = document.getElementById("intent-select");
  var intent = $intentSelector.value;
  getFilteredData(d, $intentSelector.value);
  pieChartCreate();

  $intentSelector.onchange = function (e) {
    intent = e.target.value;
    getFilteredData(d, intent);
    console.log(current);
    pieChartUpdate();
  };
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
},{"./MvF.csv":"BE9J"}]},{},["lD15"], null)
//# sourceMappingURL=https://uw-cse442-wi20.github.io/FP-gun-deaths/simplePieChart.0ebca916.js.map