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

var _d3Array = require('d3-array');

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

function calcMargin(axes, margin) {
  if (margin) return margin;
  return axes ? { top: 20, right: 20, bottom: 50, left: 50 } : { top: 0, right: 0, bottom: 0, left: 0 };
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