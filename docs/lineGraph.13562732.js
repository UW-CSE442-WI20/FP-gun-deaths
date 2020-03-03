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
})({"j08v":[function(require,module,exports) {
module.exports = "https://uw-cse442-wi20.github.io/FP-gun-deaths/lineData.4e0fde1b.csv";
},{}],"U9Po":[function(require,module,exports) {
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
var colors = ["#A6ACAF", "#52BE80", "#E67E22", "#5DADE2", "#E74C3C", "#2471A3"]; // define the line

function valueline(Race) {
  return d3.line().x(function (d) {
    return x(d.Age);
  }).y(function (d) {
    if (Race == "Asian/Pacific Islander") {
      return y(d.AsianPacificIslander);
    } else if (Race == "Black") {
      return y(d.Black);
    } else if (Race == "Hispanic") {
      return y(d.Hispanic);
    } else if (Race == "Native American") {
      return y(d.NativeAmerican);
    } else {
      return y(d.White);
    }
  });
} // append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin


var svg = d3.select("body").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")"); // Get the data

var csvFile = require("./lineData.csv");

d3.csv(csvFile, function (d) {
  // format the data
  d.Age = +d.Age;
  d.AsianPacificIslander = +d.AsianPacificIslander;
  d.Black = +d.Black;
  d.Hispanic = +d.Hispanic;
  d.NativeAmerican = +d.NativeAmerican;
  d.White = +d.White;
  return d;
}).then(function (data) {
  // Scale the range of the data
  x.domain([0, d3.max(data, function (d) {
    return d.Age;
  })]);
  y.domain([0, 1500]).range([height, 10]); //y.domain([0, getMaxValue(data)]).range([height, 10]);
  // Add the valueline path.

  for (var i = 0; i < races.length; i++) {
    svg.append("path").data([data]).attr("fill", "none").attr("stroke", colors[i]).attr("stroke-width", "2px").attr("d", valueline(races[i]));
  } // Add the X Axis


  svg.append("g").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x)); // Add the Y Axis

  svg.append("g").call(d3.axisLeft(y));
});

function getMaxValue(d) {
  var maxValue = d[1].value;

  for (var i = 1; i < d.length; i++) {
    maxValue = Math.max(maxValue, d[i].value);
  }

  return maxValue;
}
},{"./lineData.csv":"j08v"}]},{},["U9Po"], null)
//# sourceMappingURL=https://uw-cse442-wi20.github.io/FP-gun-deaths/lineGraph.13562732.js.map