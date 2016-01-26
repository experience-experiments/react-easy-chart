'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactFauxDom = require('react-faux-dom');

var _d3Scale = require('d3-scale');

var _shared = require('../shared');

var _d = require('d3');

var _radium = require('radium');

var _lodash = require('lodash.merge');

var _lodash2 = _interopRequireDefault(_lodash);

var _d3TimeFormat = require('d3-time-format');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var defaultStyle = {
  '.area': {
    stroke: 'black',
    strokeWidth: 0
  },
  '.dot': {
    strokeWidth: 0
  },
  'circle': {
    r: 4
  },
  'circle:hover': {
    r: 8,
    opacity: 0.6
  },
  '.axis': {
    font: '10px arial'
  },
  '.axis .label': {
    font: '14px arial'
  },
  '.axis path,.axis line': {
    fill: 'none',
    stroke: '#000',
    'shape-rendering': 'crispEdges'
  },
  'x.axis path': {
    display: 'none'
  },
  '.tick line': {
    stroke: 'lightgrey',
    opacity: '0.7'
  }
};

var AreaChart = (function (_React$Component) {
  _inherits(AreaChart, _React$Component);

  _createClass(AreaChart, null, [{
    key: 'propTypes',
    get: function get() {
      return {
        data: _react2.default.PropTypes.array.isRequired,
        width: _react2.default.PropTypes.number,
        height: _react2.default.PropTypes.number,
        xType: _react2.default.PropTypes.string,
        yType: _react2.default.PropTypes.string,
        datePattern: _react2.default.PropTypes.string,
        interpolate: _react2.default.PropTypes.string,
        style: _react2.default.PropTypes.object,
        margin: _react2.default.PropTypes.object,
        axes: _react2.default.PropTypes.bool,
        grid: _react2.default.PropTypes.bool,
        xDomainRange: _react2.default.PropTypes.array,
        yDomainRange: _react2.default.PropTypes.array,
        areaColors: _react2.default.PropTypes.array,
        axisLabels: _react2.default.PropTypes.object,
        tickTimeDisplayFormat: _react2.default.PropTypes.string,
        yTicks: _react2.default.PropTypes.number,
        xTicks: _react2.default.PropTypes.number,
        dataPoints: _react2.default.PropTypes.bool,
        mouseOverHandler: _react2.default.PropTypes.func,
        mouseOutHandler: _react2.default.PropTypes.func,
        mouseMoveHandler: _react2.default.PropTypes.func,
        clickHandler: _react2.default.PropTypes.func
      };
    }
  }, {
    key: 'defaultProps',
    get: function get() {
      return {
        width: 200,
        height: 150,
        datePattern: '%d-%b-%y',
        interpolate: 'linear',
        axes: false,
        areaColors: [],
        xType: 'linear',
        yType: 'linear',
        axisLabels: { x: '', y: '' },
        mouseOverHandler: function mouseOverHandler() {},
        mouseOutHandler: function mouseOutHandler() {},
        mouseMoveHandler: function mouseMoveHandler() {},
        clickHandler: function clickHandler() {}
      };
    }
  }]);

  function AreaChart(props) {
    _classCallCheck(this, AreaChart);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(AreaChart).call(this, props));

    _this.parseDate = (0, _d3TimeFormat.format)(props.datePattern).parse;
    _this.uid = (0, _shared.getRandomId)();
    return _this;
  }

  _createClass(AreaChart, [{
    key: 'setDomainAndRange',
    value: function setDomainAndRange(scale, domainRange, data, type, length) {
      var dataIndex = scale === 'x' ? 'x' : 'y';
      var d3Axis = undefined;
      switch (type) {
        case 'text':
          d3Axis = (0, _d3Scale.ordinal)();
          d3Axis.domain(domainRange ? (0, _shared.calcDefaultDomain)(domainRange, type, this.parseDate) : data[0].map(function (d) {
            return d[dataIndex];
          }));

          d3Axis.rangePoints([0, length], 0);
          break;
        case 'linear':
          d3Axis = (0, _d3Scale.linear)();
          d3Axis.domain(domainRange ? (0, _shared.calcDefaultDomain)(domainRange, type, this.parseDate) : (0, _shared.findLargestExtent)(data, (0, _shared.getValueFunction)(scale, type, this.parseDate)));
          d3Axis.range(scale === 'x' ? [0, length] : [length, 0]);
          break;
        case 'time':
          d3Axis = _d.time.scale();
          d3Axis.domain(domainRange ? (0, _shared.calcDefaultDomain)(domainRange, type, this.parseDate) : (0, _shared.findLargestExtent)(data, (0, _shared.getValueFunction)(scale, type, this.parseDate)));
          d3Axis.range(scale === 'x' ? [0, length] : [length, 0]);
          break;
        default:
          break;
      }
      return d3Axis;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props;
      var data = _props.data;
      var xType = _props.xType;
      var yType = _props.yType;
      var style = _props.style;
      var axes = _props.axes;
      var axisLabels = _props.axisLabels;
      var xDomainRange = _props.xDomainRange;
      var yDomainRange = _props.yDomainRange;
      var xTicks = _props.xTicks;
      var yTicks = _props.yTicks;
      var interpolate = _props.interpolate;
      var grid = _props.grid;
      var tickTimeDisplayFormat = _props.tickTimeDisplayFormat;
      var mouseOverHandler = _props.mouseOverHandler;
      var mouseOutHandler = _props.mouseOutHandler;
      var mouseMoveHandler = _props.mouseMoveHandler;
      var clickHandler = _props.clickHandler;
      var dataPoints = _props.dataPoints;
      var areaColors = _props.areaColors;

      var margin = (0, _shared.calcMargin)(axes, this.props.margin);
      var width = (0, _shared.reduce)(this.props.width, margin.left, margin.right);

      var height = (0, _shared.reduce)(this.props.height, margin.top, margin.bottom);

      var x = this.setDomainAndRange('x', xDomainRange, data, xType, width);
      var y = this.setDomainAndRange('y', yDomainRange, data, yType, height);

      var yValue = (0, _shared.getValueFunction)('y', yType, this.parseDate);
      var xValue = (0, _shared.getValueFunction)('x', xType, this.parseDate);
      var area = _d.svg.area().interpolate(interpolate).x(function (d) {
        return x(xValue(d));
      }).y0(height).y1(function (d) {
        return y(yValue(d));
      });

      var svgNode = (0, _reactFauxDom.createElement)('svg');
      (0, _d.select)(svgNode).attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom);
      var root = (0, _d.select)(svgNode).append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
      areaColors.concat(['steelblue', 'orange', 'yellow', 'red']).map(function (fillCol, i) {
        var gradient = (0, _d.select)(svgNode).append('defs').append('linearGradient').attr('id', 'gradient-' + i + '-' + _this2.uid).attr('x1', '0%').attr('x2', '0%').attr('y1', '0%').attr('y2', '100%');

        defaultStyle['.dot' + i] = { fill: fillCol };
        gradient.append('stop').attr('offset', '0%').attr('style', 'stop-color:' + fillCol + ';stop-opacity:0.8');

        gradient.append('stop').attr('offset', '100%').attr('style', 'stop-color:' + fillCol + ';stop-opacity:0.2');
      });

      if (axes) {
        var xAxis = _d.svg.axis().scale(x).orient('bottom');
        if (xType === 'time' && tickTimeDisplayFormat) {
          xAxis.tickFormat(_d.time.format(tickTimeDisplayFormat));
        }
        if (grid) xAxis.tickSize(-height, 6).tickPadding(12);
        if (xTicks) xAxis.ticks(xTicks);
        root.append('g').attr('class', 'x axis').attr('transform', 'translate(0,' + height + ')').call(xAxis).append('text').attr('class', 'label').attr('y', margin.bottom - 3).attr('x', width).style('text-anchor', 'end').text(axisLabels.x);

        var yAxis = _d.svg.axis().scale(y).orient('left');
        if (yType === 'time' && tickTimeDisplayFormat) {
          yAxis.tickFormat(_d.time.format(tickTimeDisplayFormat));
        }
        if (grid) yAxis.tickSize(-width, 6).tickPadding(12);
        if (yTicks) yAxis.ticks(yTicks);
        root.append('g').attr('class', 'y axis').call(yAxis).append('text').attr('class', 'label').attr('transform', 'rotate(-90)').attr('x', 0).attr('y', -margin.left).attr('dy', '.9em').style('text-anchor', 'end').text(axisLabels.y);
      }
      data.map(function (dataElelment, i) {
        root.append('path').datum(dataElelment).attr('d', area).style('fill', 'url(#gradient-' + i + '-' + _this2.uid + ')');
      });
      if (dataPoints) {
        data.map(function (dataElelment, i) {
          dataElelment.map(function (dotData) {
            root.append('circle').attr('class', 'dot dot' + i).attr('cx', function () {
              switch (xType) {
                case 'time':
                  return x(_this2.parseDate(dotData.x));
                default:
                  return x(dotData.x);
              }
            }).attr('cy', function () {
              switch (yType) {
                case 'time':
                  return y(_this2.parseDate(dotData.y));
                default:
                  return y(dotData.y);
              }
            }).on('mouseover', function () {
              return mouseOverHandler(dotData, _d.event);
            }).on('mouseout', function () {
              return mouseOutHandler(dotData, _d.event);
            }).on('mousemove', function () {
              return mouseMoveHandler(_d.event);
            }).on('click', function () {
              return clickHandler(dotData, _d.event);
            });
          });
        });
      }

      return _react2.default.createElement(
        'div',
        { className: 'area-chart' + this.uid },
        _react2.default.createElement(_radium.Style, { scopeSelector: '.area-chart' + this.uid, rules: (0, _lodash2.default)({}, defaultStyle, style) }),
        svgNode.toReact()
      );
    }
  }]);

  return AreaChart;
})(_react2.default.Component);

exports.default = AreaChart;