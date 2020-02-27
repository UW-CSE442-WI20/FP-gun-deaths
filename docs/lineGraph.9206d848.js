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
})({"N8Gz":[function(require,module,exports) {
module.exports = "https://uw-cse442-wi20.github.io/FP-gun-deaths/fullData.a5aea34f.csv";
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
var y = d3.scaleLinear().range([height, 0]); // define the line

var valueline = d3.line().x(function (d) {
  return x(d.age);
}).y(function (d) {
  return y(d.length);
}); // append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin

var svg = d3.select("body").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")"); // Get the data

var csvFile = require("./fullData.csv");

d3.csv(csvFile, function (d) {
  // format the data
  d.age = +d.age;
  return d;
}).then(function (data) {
  var dataByRaceAndAge = d3.nest().key(function (d) {
    return d.race;
  }).key(function (d) {
    return d.age;
  }).rollup(function (v) {
    return v.length;
  }).entries(data); // dataByRaceAndAge = dataByRaceAndAge.sort(function(d) { return d3.ascending(d.values.key)});

  console.log(dataByRaceAndAge); // Scale the range of the data

  x.domain([0, d3.max(data, function (d) {
    return d.age;
  })]);
  y.domain([0, getMaxValue(dataByRaceAndAge)]).range([height, 10]); // // Add the valueline path.
  // svg.append("path")
  //     .data([groupedData])
  //     .attr("class", "line")
  //     .attr("d", valueline);
  //
  // Add the X Axis

  svg.append("g").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x)); // Add the Y Axis

  svg.append("g").call(d3.axisLeft(y));
});

function getMaxValue(d) {
  var maxValue = d[0].values[0].value;

  for (var i = 0; i < d.length; i++) {
    for (var j = 0; j < d[i].length; j++) {
      maxValue = Math.max(maxValue, d[i].values[j].value);
    }
  }

  return maxValue;
}
},{"./fullData.csv":"N8Gz"}]},{},["U9Po"], null)
//# sourceMappingURL=https://uw-cse442-wi20.github.io/FP-gun-deaths/lineGraph.9206d848.js.map