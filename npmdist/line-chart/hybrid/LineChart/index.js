'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _d = require('d3');

var _common = require('./common');

function initialise(chart, props) {
  var data = props.data;
  var type = props.type;
  var xType = props.xType;
  var yType = props.yType;
  var grid = props.grid;
  var hGrid = props.hGrid;
  var vGrid = props.vGrid;
  var width = props.width;
  var height = props.height;
  var margin = props.margin;
  var orient = props.orient;
  var xLabel = props.xLabel;
  var yLabel = props.yLabel;
  var colors = props.colors;
  var interpolate = props.interpolate;
  var pattern = props.pattern;
  var xDomain = props.xDomain;
  var yDomain = props.yDomain;
  var t = margin.top;
  var r = margin.right;
  var b = margin.bottom;
  var l = margin.left;


  var m = {
    t: t,
    r: r,
    b: b,
    l: l
  };

  var w = [width, l, // margin.left
  r // margin.right
  ].reduce(_common.reduce);

  var h = [height, t, // margin.top
  b // margin.bottom
  ].reduce(_common.reduce);

  var strokes = colors.concat(_common.defaultColors);

  var types = {
    x: xType || type,
    y: yType || type
  };

  var domains = {
    x: Array.isArray(xDomain) ? xDomain : (0, _common.createDomainX)(types.x, data, pattern),
    y: Array.isArray(yDomain) ? yDomain : (0, _common.createDomainY)(types.y, data, pattern)
  };

  var scales = {
    x: (0, _common.createScaleX)(types.x, domains.x, w),
    y: (0, _common.createScaleY)(types.y, domains.y, h)
  };

  var parsers = {
    x: (0, _common.createParserX)(types.x, pattern),
    y: (0, _common.createParserY)(types.y, pattern)
  };

  /*
  const patterns = {
    x: xPattern || pattern,
    y: yPattern || pattern
  };
   const formats = {
    x: createFormatX(types.x, patterns.x),
    y: createFormatY(types.y, patterns.y)
  };
  */

  var linePath = _d.svg.line().interpolate(interpolate).x(function (d) {
    return scales.x(parsers.x(d));
  }).y(function (d) {
    return scales.y(parsers.y(d));
  });

  var root = (0, _d.select)(chart).append('g').attr('class', 'chartGroup').attr('transform', 'translate(' + l + ', ' + t + ')');

  var xAxis = _d.svg.axis().scale(scales.x).orient('bottom');

  if (vGrid || grid) {
    xAxis.tickSize(-h, 6).tickPadding(10);
  } else {
    xAxis.tickSize(0, 6).tickPadding(16);
  }

  var xGroup = root.append('g').attr('class', 'x axis').attr('transform', 'translate(0, ' + h + ')');

  xGroup.call(xAxis);

  if (xLabel) {
    xGroup.append('text').attr('class', 'label').attr('x', orient === 'right' ? 0 : w).attr('y', m.b - m.t).attr('dx', orient === 'right' ? '0em' : '-.175em').attr('dy', '-.175em').style('dominant-baseline', 'ideographic').style('text-anchor', orient === 'right' ? 'start' : 'end').text(xLabel);
  }

  var yAxis = _d.svg.axis().scale(scales.y).orient(orient === 'right' ? 'right' : 'left');

  if (hGrid || grid) {
    yAxis.tickSize(-w, 6).tickPadding(10);
  } else {
    yAxis.tickSize(0, 6).tickPadding(16);
  }

  var yGroup = root.append('g').attr('class', 'y axis').attr('transform', orient === 'right' ? 'translate(' + w + ', 0)' : 'translate(0, 0)');

  yGroup.call(yAxis);

  if (yLabel) {
    yGroup.append('text').attr('class', 'label').attr('transform', 'rotate(-90)').attr('x', 0).attr('y', orient === 'right' ? +m.r - m.l : -m.l + m.r).attr('dx', 0).attr('dy', orient === 'right' ? '-.175em' : '1em').style('dominant-baseline', 'ideographic').style('text-anchor', 'end').text(yLabel);
  }

  var getStroke = function getStroke(d, i) {
    return strokes[i];
  };

  var chartPathsGroup = root.append('g').attr('class', 'chartPathsGroup');

  chartPathsGroup.selectAll('path').data(data).enter().append('path').attr('class', 'line').style('stroke', getStroke).attr('d', linePath);
}

function transition(chart, props) {
  var data = props.data;
  var type = props.type;
  var xType = props.xType;
  var yType = props.yType;
  var grid = props.grid;
  var hGrid = props.hGrid;
  var vGrid = props.vGrid;
  var width = props.width;
  var height = props.height;
  var margin = props.margin;
  var orient = props.orient;
  var xLabel = props.xLabel;
  var yLabel = props.yLabel;
  var colors = props.colors;
  var interpolate = props.interpolate;
  var pattern = props.pattern;
  var xDomain = props.xDomain;
  var yDomain = props.yDomain;
  var t = margin.top;
  var r = margin.right;
  var b = margin.bottom;
  var l = margin.left;


  var m = {
    t: t,
    r: r,
    b: b,
    l: l
  };

  var w = [width, l, // margin.left
  r // margin.right
  ].reduce(_common.reduce);

  var h = [height, t, // margin.top
  b // margin.bottom
  ].reduce(_common.reduce);

  var strokes = colors.concat(_common.defaultColors);

  var types = {
    x: xType || type,
    y: yType || type
  };

  var domains = {
    x: Array.isArray(xDomain) ? xDomain : (0, _common.createDomainX)(types.x, data, pattern),
    y: Array.isArray(yDomain) ? yDomain : (0, _common.createDomainY)(types.y, data, pattern)
  };

  var scales = {
    x: (0, _common.createScaleX)(types.x, domains.x, w),
    y: (0, _common.createScaleY)(types.y, domains.y, h)
  };

  var parsers = {
    x: (0, _common.createParserX)(types.x, pattern),
    y: (0, _common.createParserY)(types.y, pattern)
  };

  /*
  const patterns = {
    x: xPattern || pattern,
    y: yPattern || pattern
  };
   const formats = {
    x: createFormatX(types.x, patterns.x),
    y: createFormatY(types.y, patterns.y)
  };
  */

  var linePath = _d.svg.line().interpolate(interpolate).x(function (d) {
    return scales.x(parsers.x(d));
  }).y(function (d) {
    return scales.y(parsers.y(d));
  });

  var n = data.length;

  var root = (0, _d.select)(chart).selectAll('g.chartGroup');

  root.transition().duration(750).attr('transform', 'translate(' + l + ', ' + t + ')');

  var xAxis = _d.svg.axis().scale(scales.x).orient('bottom');

  if (vGrid || grid) {
    xAxis.tickSize(-h, 6).tickPadding(10);
  } else {
    xAxis.tickSize(0, 6).tickPadding(16);
  }

  var xGroup = root.selectAll('g.x.axis');

  xGroup.call(xAxis);

  xGroup.transition().duration(750).attr('transform', 'translate(0, ' + h + ')');

  xGroup.selectAll('text.label').remove();

  if (xLabel) {
    xGroup.append('text').attr('class', 'label').attr('x', orient === 'right' ? 0 : w).attr('y', m.b - m.t).attr('dx', orient === 'right' ? '0em' : '-.175em').attr('dy', '-.175em').style('dominant-baseline', 'ideographic').style('text-anchor', orient === 'right' ? 'start' : 'end').text(xLabel);
  }

  var yAxis = _d.svg.axis().scale(scales.y).orient(orient === 'right' ? 'right' : 'left');

  if (hGrid || grid) {
    yAxis.tickSize(-w, 6).tickPadding(10);
  } else {
    yAxis.tickSize(0, 6).tickPadding(16);
  }

  var yGroup = root.selectAll('g.y.axis');

  yGroup.call(yAxis);

  yGroup.transition().duration(750).attr('transform', orient === 'right' ? 'translate(' + w + ', 0)' : 'translate(0, 0)');

  yGroup.selectAll('text.label').remove();

  if (yLabel) {
    yGroup.append('text').attr('class', 'label').attr('transform', 'rotate(-90)').attr('x', 0).attr('y', orient === 'right' ? +m.r - m.l : -m.l + m.r).attr('dx', 0).attr('dy', orient === 'right' ? '-.175em' : '1em').style('dominant-baseline', 'ideographic').style('text-anchor', 'end').text(yLabel);
  }

  var getStroke = function getStroke(d, i) {
    return strokes[i];
  };

  var chartPathsGroup = root.selectAll('g.chartPathsGroup path').data(data);

  if (n) {
    chartPathsGroup.transition().duration(750).attr('class', 'line').style('stroke', getStroke).attr('d', function (d) {
      return linePath(d);
    });

    chartPathsGroup.enter().append('path').attr('class', 'line').style('stroke', getStroke).attr('d', function (d) {
      return linePath(d);
    });
  }

  chartPathsGroup.exit().remove();
}

exports.default = {
  initialise: initialise,
  transition: transition
};
module.exports = exports['default'];
//# sourceMappingURL=index.js.map