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
})({"vVhW":[function(require,module,exports) {
module.exports = "https://uw-cse442-wi20.github.io/FP-gun-deaths/lineGraphData.601118c6.csv";
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
var colors = ["#A6ACAF", "#52BE80", "#5DADE2", "#E74C3C", "#2471A3", "#E67E22"]; // define the line

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

var csvFile = require("./lineGraphData.csv");

d3.csv(csvFile, function (d) {
  // format the data
  d.Age = +d.Age;
  d.HomicideCnt = +d.HomicideCnt;
  d.SuicideCnt = +d.SuicideCnt;
  return d;
}).then(function (data) {
  // Scale the range of the data
  x.domain([0, d3.max(data, function (d) {
    return d.Age;
  })]);
  y.domain([0, 1500]).range([height, 10]); //y.domain([0, getMaxValue(data)]).range([height, 10]);
  // Add the valueline path.

  for (var i = 0; i < races.length; i++) {
    var filteredData = getFilteredData(data, races[i]);
    svg.append("path").attr("class", "line").data([filteredData]).attr("stroke", colors[i]).attr("d", valueline(1));
  } // Add the X Axis


  svg.append("g").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x)); // Add the Y Axis

  svg.append("g").call(d3.axisLeft(y));
  addLegend();
  addMouseOver();
});

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
},{"./lineGraphData.csv":"vVhW"}]},{},["U9Po"], null)
//# sourceMappingURL=https://uw-cse442-wi20.github.io/FP-gun-deaths/lineGraph.8355821f.js.map