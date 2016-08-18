'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDefaultAxisStyles = exports.defaultColors = exports.defaultStyles = exports.createUniqueID = exports.reduce = exports.createFormat = exports.createParser = exports.formatDatumY = exports.formatDatumX = exports.formatDatumTimeY = exports.formatDatumTimeX = exports.mapDatumY = exports.mapDatumX = exports.mapDatumTimeY = exports.mapDatumTimeX = undefined;

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

exports.formatType = formatType;
exports.createMapDatumX = createMapDatumX;
exports.createMapDatumY = createMapDatumY;
exports.createParserDatumX = createParserDatumX;
exports.createParserDatumY = createParserDatumY;
exports.createParserY = createParserY;
exports.createParserX = createParserX;
exports.createFormatX = createFormatX;
exports.createFormatY = createFormatY;
exports.calculateDomain = calculateDomain;
exports.calculateExtent = calculateExtent;
exports.createDomainX = createDomainX;
exports.createDomainY = createDomainY;
exports.createScaleTimeX = createScaleTimeX;
exports.createScaleTimeY = createScaleTimeY;
exports.createScaleTextX = createScaleTextX;
exports.createScaleTextY = createScaleTextY;
exports.createScaleLinearX = createScaleLinearX;
exports.createScaleLinearY = createScaleLinearY;
exports.createScaleY = createScaleY;
exports.createScaleX = createScaleX;

var _d = require('d3');

var _d3Array = require('d3-array');

var _d3Scale = require('d3-scale');

var _d3TimeFormat = require('d3-time-format');

var _defaultStyles = require('./common/defaultStyles');

var _defaultStyles2 = _interopRequireDefault(_defaultStyles);

var _defaultAxisStyles = require('./common/defaultAxisStyles');

var _defaultColors = require('./common/defaultColors');

var _defaultColors2 = _interopRequireDefault(_defaultColors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TIMEPARSER = {};
var TIMEFORMAT = {};

var mapDatumTimeX = function mapDatumTimeX(p) {
  return function (d) {
    return p(d.x);
  };
};
var mapDatumTimeY = function mapDatumTimeY(p) {
  return function (d) {
    return p(d.y);
  };
};
var mapDatumX = function mapDatumX(d) {
  return d.x;
};
var mapDatumY = function mapDatumY(d) {
  return d.y;
};

exports.mapDatumTimeX = mapDatumTimeX;
exports.mapDatumTimeY = mapDatumTimeY;
exports.mapDatumX = mapDatumX;
exports.mapDatumY = mapDatumY;


var formatDatumTimeX = function formatDatumTimeX(p) {
  return function (d) {
    return p(d.x);
  };
};
var formatDatumTimeY = function formatDatumTimeY(p) {
  return function (d) {
    return p(d.y);
  };
};
var formatDatumX = function formatDatumX(d) {
  return d.x;
};
var formatDatumY = function formatDatumY(d) {
  return d.y;
};

exports.formatDatumTimeX = formatDatumTimeX;
exports.formatDatumTimeY = formatDatumTimeY;
exports.formatDatumX = formatDatumX;
exports.formatDatumY = formatDatumY;


var formatString = function formatString(v) {
  return v;
};
var formatNumber = function formatNumber(n) {
  return n % 1 ? n.toFixed(1) : n;
};

function formatType(type) {
  return type === 'text' ? formatString : formatNumber;
}

function createParser() {
  var pattern = arguments.length <= 0 || arguments[0] === undefined ? '%d-%b-%y' : arguments[0];

  return TIMEPARSER[pattern] || (TIMEPARSER[pattern] = (0, _d3TimeFormat.timeParse)(pattern));
}

function createMapDatumX(type, pattern) {
  return type === 'time' ? formatDatumTimeX(createParser(pattern)) : formatDatumX;
}

function createMapDatumY(type, pattern) {
  return type === 'time' ? formatDatumTimeY(createParser(pattern)) : formatDatumY;
}

function createParserDatumX(type, pattern) {
  return type === 'time' ? formatDatumTimeX(createParser(pattern)) : formatDatumX;
}

function createParserDatumY(type, pattern) {
  return type === 'time' ? formatDatumTimeY(createParser(pattern)) : formatDatumY;
}

function createParserY(type, pattern) {
  return type === 'time' ? formatDatumTimeY(createParser(pattern)) : formatDatumY;
}

function createParserX(type, pattern) {
  return type === 'time' ? formatDatumTimeX(createParser(pattern)) : formatDatumX;
}

exports.createParser = createParser;


function createFormat() {
  var pattern = arguments.length <= 0 || arguments[0] === undefined ? '%b %d' : arguments[0];

  return TIMEFORMAT[pattern] || (TIMEFORMAT[pattern] = _d.time.format(pattern));
}

function createFormatX(type, pattern) {
  return type === 'time' ? createFormat(pattern) : function (v) {
    return v;
  };
}

function createFormatY(type, pattern) {
  return type === 'time' ? createFormat(pattern) : function (v) {
    return v;
  };
}

exports.createFormat = createFormat;
function calculateDomain(data, map) {
  var domain = [];

  data.forEach(function (item) {
    item.forEach(function (d, i) {
      var v = map(d);
      if (!domain.includes(v)) {
        domain.splice(i, 0, v);
      }
    });
  });

  return domain;
}

function calculateExtent(data, map) {
  var min = void 0; // Low
  var max = void 0; // High
  data.forEach(function (row) {
    var _extent = (0, _d3Array.extent)(row, map);

    var _extent2 = (0, _slicedToArray3.default)(_extent, 2);

    var MIN = _extent2[0];
    var MAX = _extent2[1];
    /*
     * Equivalent to
     *
     * Math.min()
     * Math.max()
     *
     * For non-numeric values
     */

    min = min < MIN ? min : MIN;
    max = max > MAX ? max : MAX;
  });
  return [min, max];
}

function createDomainX(type, data, pattern) {
  switch (type) {
    case 'time':
      return calculateExtent(data, mapDatumTimeX(createParser(pattern)));
    case 'text':
      return calculateDomain(data, mapDatumX);
    default:
      return calculateExtent(data, mapDatumX);
  }
}

function createDomainY(type, data, pattern) {
  switch (type) {
    case 'time':
      return calculateExtent(data, mapDatumTimeY(createParser(pattern)));
    case 'text':
      return calculateDomain(data, mapDatumY);
    default:
      return calculateExtent(data, mapDatumY);
  }
}

/* eslint no-param-reassign: 0 */
var reduce = exports.reduce = function reduce(p, c) {
  return p -= c;
};

var createUniqueID = exports.createUniqueID = function createUniqueID() {
  return Math.floor(Math.random() * new Date().getTime());
};

function createScaleTimeX() {
  var domain = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
  var x = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

  return _d.time.scale().domain(domain).range([0, x]);
}

function createScaleTimeY() {
  var domain = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
  var y = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

  return _d.time.scale().domain(domain).range([y, 0]);
}

function createScaleTextX() {
  var domain = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
  var s = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

  return (0, _d3Scale.scalePoint)().domain(domain).range([0, s]).padding(0);
}

function createScaleTextY() {
  var domain = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
  var s = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

  return (0, _d3Scale.scalePoint)().domain(domain).range([0, s]).padding(0);
}

function createScaleLinearX() {
  var domain = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
  var x = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

  return (0, _d3Scale.scaleLinear)().domain(domain).range([0, x]);
}

function createScaleLinearY() {
  var domain = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
  var y = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

  return (0, _d3Scale.scaleLinear)().domain(domain).range([y, 0]);
}

function createScaleY(type) {
  var domain = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
  var y = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

  switch (type) {
    case 'time':
      return createScaleTimeY(domain, y);
    case 'text':
      return createScaleTextY(domain, y);
    default:
      return createScaleLinearY(domain, y);
  }
}

function createScaleX(type) {
  var domain = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
  var x = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

  switch (type) {
    case 'time':
      return createScaleTimeX(domain, x);
    case 'text':
      return createScaleTextX(domain, x);
    default:
      return createScaleLinearX(domain, x);
  }
}

exports.defaultStyles = _defaultStyles2.default;
exports.defaultColors = _defaultColors2.default;
exports.getDefaultAxisStyles = _defaultAxisStyles.defaultAxisStyles;
//# sourceMappingURL=common.js.map