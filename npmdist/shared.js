'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultStyle = exports.rmaColorPalet = undefined;
exports.reduce = reduce;
exports.getValueFunction = getValueFunction;
exports.createCircularTicks = createCircularTicks;
exports.getAxisStyles = getAxisStyles;
exports.getRandomId = getRandomId;
exports.calcMargin = calcMargin;
exports.findLargestExtent = findLargestExtent;
exports.calcDefaultDomain = calcDefaultDomain;
exports.setLineDomainAndRange = setLineDomainAndRange;

var _d3Array = require('d3-array');

var _d3Scale = require('d3-scale');

var _d = require('d3');

var rmaColorPalet = exports.rmaColorPalet = ['#3F4C55', '#E3A51A', '#F4E956', '#AAAC84'];

var defaultStyle = exports.defaultStyle = {
  '.pie_chart_lines': {
    stroke: '#fff',
    strokeWidth: 1,
    opacity: '1'
  },
  '.pie_chart_lines:hover': {
    opacity: '0.8'
  },
  '.pie_chart_text': {
    fontFamily: 'sans-serif',
    fontSize: '12px',
    textAnchor: 'middle',
    fill: '#000'
  },
  '.bar': {
    fill: 'blue',
    transition: 'height 0.5s ease-in, y 0.5s ease-in',
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
    opacity: 0.85
  },
  '.dot:hover': {
    opacity: 1
  },
  'circle.data-point': {
    r: 4,
    opacity: 0.7
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
  '.axis path,.axis line': {
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

function getRandomId() {
  return Math.floor(Math.random() * new Date().getTime());
}

function calcMargin(axes, margin, yAxisOrientRight, y2) {
  if (margin) return margin;
  var defaultMargins = axes ? { top: 20, right: y2 ? 50 : 20, bottom: 50, left: 50 } : { top: 0, right: 0, bottom: 0, left: 0 };
  if (yAxisOrientRight) {
    defaultMargins = axes ? { top: 20, right: 50, bottom: 50, left: y2 ? 50 : 20 } : { top: 0, right: 0, bottom: 0, left: 0 };
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