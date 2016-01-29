'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reduce = reduce;
exports.getValueFunction = getValueFunction;
exports.getRandomId = getRandomId;
exports.calcMargin = calcMargin;
exports.findLargestExtent = findLargestExtent;
exports.calcDefaultDomain = calcDefaultDomain;
exports.setLineDomainAndRange = setLineDomainAndRange;

var _d3Array = require('d3-array');

var _d3Scale = require('d3-scale');

var _d = require('d3');

function reduce(x) {
  var rVal = x;
  for (var i = 1; i < arguments.length; i++) {
    rVal -= arguments[i];
  }
  return rVal;
}

function getValueFunction(scale, type, dateParser) {
  var dataIndex = scale === 'x' ? 'x' : 'y';
  switch (type) {
    case 'time':
      return function (d) {
        return dateParser(d[dataIndex]);
      };
    default:
      return function (d) {
        return d[dataIndex];
      };
  }
}

function getRandomId() {
  return Math.floor(Math.random() * new Date().getTime());
}

function calcMargin(axes, margin, yAxisOrientRight) {
  if (margin) return margin;
  var defaultMargins = axes ? { top: 20, right: 20, bottom: 50, left: 50 } : { top: 0, right: 0, bottom: 0, left: 0 };
  if (yAxisOrientRight) {
    defaultMargins = axes ? { top: 20, right: 50, bottom: 50, left: 20 } : { top: 0, right: 0, bottom: 0, left: 0 };
  }
  return defaultMargins;
}

function findLargestExtent(data, valueFunction) {
  var low = undefined;
  var high = undefined;
  data.map(function (dataElement) {
    var calcDomainRange = (0, _d3Array.extent)(dataElement, valueFunction);
    low = low < calcDomainRange[0] ? low : calcDomainRange[0];
    high = high > calcDomainRange[1] ? high : calcDomainRange[1];
  });
  return [low, high];
}

function calcDefaultDomain(domainRange, type, dateParser) {
  if (!domainRange) return null;
  switch (type) {
    case 'time':
      return [dateParser(domainRange[0]), dateParser(domainRange[1])];
    default:
      return domainRange;
  }
}

function setLineDomainAndRange(scale, domainRange, data, type, length, parseDate) {
  var dataIndex = scale === 'x' ? 'x' : 'y';
  var d3Axis = undefined;
  switch (type) {
    case 'text':
      d3Axis = (0, _d3Scale.ordinal)();
      d3Axis.domain(domainRange ? calcDefaultDomain(domainRange, type, parseDate) : data[0].map(function (d) {
        return d[dataIndex];
      }));

      d3Axis.rangePoints([0, length], 0);
      break;
    case 'linear':
      d3Axis = (0, _d3Scale.linear)();
      d3Axis.domain(domainRange ? calcDefaultDomain(domainRange, type, parseDate) : findLargestExtent(data, getValueFunction(scale, type, parseDate)));
      d3Axis.range(scale === 'x' ? [0, length] : [length, 0]);
      break;
    case 'time':
      d3Axis = _d.time.scale();
      d3Axis.domain(domainRange ? calcDefaultDomain(domainRange, type, parseDate) : findLargestExtent(data, getValueFunction(scale, type, parseDate)));
      d3Axis.range(scale === 'x' ? [0, length] : [length, 0]);
      break;
    default:
      break;
  }
  return d3Axis;
}
//# sourceMappingURL=shared.js.map