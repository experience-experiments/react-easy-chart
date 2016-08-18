'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultStyles = exports.defaultColors = undefined;

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

exports.reduce = reduce;
exports.createValueGenerator = createValueGenerator;
exports.createCircularTicks = createCircularTicks;
exports.getAxisStyles = getAxisStyles;
exports.createUniqueID = createUniqueID;
exports.calculateMargin = calculateMargin;
exports.textDomainRange = textDomainRange;
exports.calculateExtent = calculateExtent;
exports.calculateDomainRange = calculateDomainRange;
exports.createDomainRangeGenerator = createDomainRangeGenerator;

var _d3Array = require('d3-array');

var _d3Scale = require('d3-scale');

var _d = require('d3');

var _objectHash = require('object-hash');

var _objectHash2 = _interopRequireDefault(_objectHash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultColors = exports.defaultColors = ['#3F4C55', '#E3A51A', '#F4E956', '#AAAC84'];

var defaultStyles = exports.defaultStyles = {
  '.pie-chart-slice': {
    stroke: '#fff',
    strokeWidth: 1,
    opacity: '1'
  },
  '.pie-chart-slice:hover': {
    opacity: '0.8'
  },
  '.pie-chart-label': {
    fontFamily: 'sans-serif',
    fontSize: '12px',
    textAnchor: 'middle',
    fill: '#000'
  },
  '.bar': {
    fill: 'blue',
    transition: 'x 0.35s ease-in, y 0.35s ease-in, height 0.5s ease-in, width 0.5s ease-in',
    opacity: 1
  },
  '.bar:hover': {
    opacity: 0.8
  },
  '.line': {
    fill: 'none',
    strokeWidth: 1.5,
    opacity: 0.7
  },
  '.line:hover': {
    opacity: 1
  },
  '.area': {
    opacity: 0.7
  },
  '.area:hover': {
    opacity: 1
  },
  '.dot': {
    strokeWidth: 0,
    opacity: 0.85,
    transition: 'cx 0.35s ease-in, cy 0.35s ease-in, r 0.5s ease-in'
  },
  '.dot:hover': {
    opacity: 1
  },
  'circle.data-point': {
    r: 4,
    opacity: 0.7,
    transition: 'cx 0.35s ease-in, cy 0.35s ease-in'
  },
  'circle.data-point:hover': {
    r: 6,
    opacity: 1
  },
  'circle.tick-circle': {
    r: 2,
    fill: 'lightgrey'
  },
  '.x circle.tick-circle': {
    cy: '8px'
  },
  '.axis': {
    'font-family': 'dobra-light,Arial,sans-serif',
    'font-size': '9px'
  },
  '.axis .label': {
    font: '14px arial'
  },
  '.axis path, .axis line': {
    fill: 'none',
    strokeWidth: 1,
    'shape-rendering': 'crispEdges'
  },
  'x.axis path': {
    display: 'none',
    stroke: 'lightgrey'
  },
  '.tick line': {
    stroke: 'lightgrey',
    strokeWidth: 1,
    opacity: '0.7'
  }
};

function reduce() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var rVal = args[0];
  for (var i = 1; i < args.length; i++) {
    rVal -= args[i];
  }
  return rVal;
}

function createValueGenerator(scale, type, parseDate) {
  var dataIndex = scale === 'x' ? 'x' : 'y';
  return type === 'time' ? function (d) {
    return parseDate(d[dataIndex]);
  } : function (d) {
    return d[dataIndex];
  };
}

function createCircularTicks(containerElement) {
  (0, _d.select)(containerElement).select('svg').selectAll('.tick-circle').remove();

  var ticks = (0, _d.select)(containerElement).select('svg').selectAll('.tick');

  function circleAppender() {
    (0, _d.select)(this).append('circle').attr('class', 'tick-circle');
  }
  ticks.each(circleAppender);
}

function getAxisStyles(grid, verticalGrid, yAxisOrientRight) {
  return {
    '.x circle.tick-circle ': {
      fill: verticalGrid ? 'none' : 'lightgrey'
    },
    '.y circle.tick-circle': {
      cx: yAxisOrientRight ? '+5px' : '-8px',
      fill: grid ? 'none' : 'lightgrey'
    },
    '.y.axis line': {
      display: grid ? 'inline' : 'none',
      stroke: 'lightgrey'
    }
  };
}

function createUniqueID(o) {
  return (0, _objectHash2.default)(o);
}

function calculateMargin(axes, margin, yAxisOrientRight, y2) {
  if (margin) return margin;
  if (yAxisOrientRight) {
    return axes ? { top: 20, right: 50, bottom: 50, left: y2 ? 50 : 20 } : { top: 0, right: 0, bottom: 0, left: 0 };
  }
  return axes ? { top: 20, right: y2 ? 50 : 20, bottom: 50, left: 50 } : { top: 0, right: 0, bottom: 0, left: 0 };
}

/* eslint no-shadow: 0 */
function textDomainRange(d, s) {
  var a = [];

  d.forEach(function (d) {
    d.forEach(function (d, i) {
      var v = d[s];
      if (!a.includes(v)) a.splice(i, 0, v);
    });
  });

  return a;
}

function calculateExtent(data, accessor) {
  var lo = void 0; // Low
  var hi = void 0; // High
  data.forEach(function (item) {
    var _extent = (0, _d3Array.extent)(item, accessor);

    var _extent2 = (0, _slicedToArray3.default)(_extent, 2);

    var LO = _extent2[0];
    var HI = _extent2[1];

    lo = lo < LO ? lo : LO;
    hi = hi > HI ? hi : HI;
  });
  return [lo, hi];
}

function timeDomainRange(domainRange, parseDate) {
  var _domainRange = (0, _slicedToArray3.default)(domainRange, 2);

  var LO = _domainRange[0];
  var HI = _domainRange[1];

  var lo = parseDate(LO);
  var hi = parseDate(HI);
  return [lo, hi];
}

function calculateDomainRange(domainRange, type, parseDate) {
  if (!Array.isArray(domainRange)) return null;
  return type === 'time' ? timeDomainRange(domainRange, parseDate) : domainRange;
}

function createDomainRangeGenerator(scale, domainRange, data, type, length, parseDate) {
  /*
  const dataIndex =
    (scale === 'x')
      ? 'x'
      : 'y';
  */
  var axis = void 0;

  switch (type) {
    case 'text':
      axis = (0, _d3Scale.scalePoint)();
      axis.domain(Array.isArray(domainRange) ? domainRange // calculateDomainRange(domainRange, type, parseDate)
      : textDomainRange(data, scale)).range([0, length]).padding(0);
      break;
    case 'linear':
      axis = (0, _d3Scale.scaleLinear)();
      axis.domain(Array.isArray(domainRange) ? domainRange // calculateDomainRange(domainRange, type, parseDate)
      : calculateExtent(data, createValueGenerator(scale, type, parseDate))).range(scale === 'x' ? [0, length] : [length, 0]);
      break;
    case 'time':
      axis = _d.time.scale();
      axis.domain(Array.isArray(domainRange) ? timeDomainRange(domainRange, parseDate) : calculateExtent(data, createValueGenerator(scale, type, parseDate))).range(scale === 'x' ? [0, length] : [length, 0]);
      break;
    default:
      break;
  }
  return axis;
}
//# sourceMappingURL=shared.js.map