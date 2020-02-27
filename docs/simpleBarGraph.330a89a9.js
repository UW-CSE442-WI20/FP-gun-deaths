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
})({"hQIG":[function(require,module,exports) {
module.exports = "https://uw-cse442-wi20.github.io/FP-gun-deaths/places.a8588b90.csv";
},{}],"ZSN4":[function(require,module,exports) {
var margin = {
  top: 40,
  right: 20,
  left: 40,
  bottom: 20
};
var size = 400;
var width = size - margin.left - margin.right;
var height = size - margin.top - margin.bottom;
var padding = 5;
var svg = d3.select("body").append("svg");
svg.attr("width", 400).attr("height", size).attr("border", 0);
var x = d3.scaleBand();
var y = d3.scaleLinear();
svg.append("g").attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

var csvFile = require("./places.csv");

d3.csv(csvFile).then(function (d) {
  generateGraph(d);
});

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
  console.log(nestedData);
  x.domain(nestedData.map(function (d, i) {
    return d.key;
  })).range([padding, width]);
  y.domain([0, getMaxValue(nestedData)]).range([height, margin.bottom / 2]);
  var xAxis = d3.axisBottom().scale(x);
  var yAxis = d3.axisLeft().scale(y).ticks(10); // title

  svg.append("text").attr("transform", "translate(" + margin.left + ", " + 0 + ")").attr("x", 50).attr("y", 50).attr("font-size", "24px").text("Count of deaths by Location"); // x

  svg.append("g").attr("class", "xAxis").attr("transform", "translate(" + margin.left + ", " + height + ")").call(xAxis).selectAll("text").style("text-anchor", "end").attr("dx", "-.8em").attr("dy", "-.55em").attr("transform", "translate(" + margin.left + ", " + margin.bottom / 2 + ")").attr("transform", "rotate(-30)"); //y

  svg.append("g").attr("class", "yAxis").attr("transform", "translate(" + margin.left + ", " + "0" + ")").call(yAxis); // bars

  y.range([height - 10, margin.bottom / 2]); // augment for drawing

  svg.selectAll("bar").data(nestedData).enter().append("rect").style("fill", function (d) {
    return "rgb(0, 0, " + Math.round(y(d.value)) * 10 + ")";
  }).attr("x", function (d, i) {
    return x(d.key) + margin.left;
  }).attr("y", function (d, i) {
    return y(d.value);
  }).transition().duration(1000).attr("width", x.bandwidth() - padding).attr("height", function (d, i) {
    return height - y(d.value);
  });
}

function getMaxValue(d) {
  var maxValue = d[0].value;

  for (var i = 1; i < d.length; i++) {
    maxValue = Math.max(maxValue, d[i].value);
  }

  return maxValue;
}
},{"./places.csv":"hQIG"}]},{},["ZSN4"], null)
//# sourceMappingURL=https://uw-cse442-wi20.github.io/FP-gun-deaths/simpleBarGraph.330a89a9.js.map