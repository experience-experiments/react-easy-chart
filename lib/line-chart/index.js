'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactFauxDom = require('react-faux-dom');

var _d3Scale = require('d3-scale');

var _d3Array = require('d3-array');

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
  '.line': {
    fill: 'none',
    strokeWidth: 1.5
  },
  '.dot': {
    fill: '',
    strokeWidth: 0
  },
  'circle': {
    'r': 4
  },
  'circle:hover': {
    'r': 8,
    'opacity': 0.6
  },
  '.dot0': {
    fill: 'steelblue'
  },
  '.line0': {
    stroke: 'steelblue'
  },
  '.dot1': {
    fill: 'orange'
  },
  '.line1': {
    stroke: 'orange'
  },
  '.dot2': {
    fill: 'red'
  },
  '.line2': {
    stroke: 'red'
  },
  '.dot3': {
    fill: 'darkblue'
  },
  '.line3': {
    stroke: 'darkblue'
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

var LineChart = (function (_React$Component) {
  _inherits(LineChart, _React$Component);

  _createClass(LineChart, null, [{
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

  function LineChart(props) {
    _classCallCheck(this, LineChart);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(LineChart).call(this, props));

    _this.parseDate = (0, _d3TimeFormat.format)(props.datePattern).parse;
    _this.uid = Math.floor(Math.random() * new Date().getTime());
    return _this;
  }

  _createClass(LineChart, [{
    key: 'getValueFunction',
    value: function getValueFunction(scale, type) {
      var _this2 = this;

      var dataIndex = scale === 'x' ? 'x' : 'y';
      switch (type) {
        case 'time':
          return function (d) {
            return _this2.parseDate(d[dataIndex]);
          };
        default:
          return function (d) {
            return d[dataIndex];
          };
      }
    }
  }, {
    key: 'setDomainAndRange',
    value: function setDomainAndRange(scale, domainRange, data, type, length) {
      var dataIndex = scale === 'x' ? 'x' : 'y';
      var d3Axis = undefined;
      switch (type) {
        case 'text':
          d3Axis = (0, _d3Scale.ordinal)();
          d3Axis.domain(domainRange ? this.calcDefaultDomain(domainRange, type) : data[0].map(function (d) {
            return d[dataIndex];
          }));

          d3Axis.rangePoints([0, length], 0);
          break;
        case 'linear':
          d3Axis = (0, _d3Scale.linear)();
          d3Axis.domain(domainRange ? this.calcDefaultDomain(domainRange, type) : this.findLargestExtent(data, this.getValueFunction(scale, type)));
          d3Axis.range(scale === 'x' ? [0, length] : [length, 0]);
          break;
        case 'time':
          d3Axis = _d.time.scale();
          d3Axis.domain(domainRange ? this.calcDefaultDomain(domainRange, type) : this.findLargestExtent(data, this.getValueFunction(scale, type)));
          d3Axis.range(scale === 'x' ? [0, length] : [length, 0]);
          break;
        default:
          break;
      }
      return d3Axis;
    }
  }, {
    key: 'getHeight',
    value: function getHeight(height, margin) {
      return this.props.height - margin.top - margin.bottom;
    }
  }, {
    key: 'findLargestExtent',
    value: function findLargestExtent(data, y) {
      var low = undefined;
      var high = undefined;
      data.map(function (dataElement) {
        var calcDomainRange = (0, _d3Array.extent)(dataElement, y);
        low = low < calcDomainRange[0] ? low : calcDomainRange[0];
        high = high > calcDomainRange[1] ? high : calcDomainRange[1];
      });
      return [low, high];
    }
  }, {
    key: 'calcDefaultDomain',
    value: function calcDefaultDomain(domainRange, type) {
      if (!domainRange) return null;
      switch (type) {
        case 'time':
          return [this.parseDate(domainRange[0]), this.parseDate(domainRange[1])];
        default:
          return domainRange;
      }
    }
  }, {
    key: 'calcMargin',
    value: function calcMargin(axes) {
      return axes ? { top: 10, right: 20, bottom: 50, left: 50 } : { top: 3, right: 3, bottom: 3, left: 3 };
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

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

      var margin = this.props.margin ? this.props.margin : this.calcMargin(axes);
      var width = this.props.width - margin.left - margin.right;
      var height = this.props.height - margin.top - margin.bottom;

      var x = this.setDomainAndRange('x', xDomainRange, data, xType, width);
      var y = this.setDomainAndRange('y', yDomainRange, data, yType, this.getHeight(height, margin));

      var yValue = this.getValueFunction('y', yType);
      var xValue = this.getValueFunction('x', xType);
      var linePath = _d.svg.line().interpolate(interpolate).x(function (d) {
        return x(xValue(d));
      }).y(function (d) {
        return y(yValue(d));
      });

      var svgNode = (0, _reactFauxDom.createElement)('svg');
      (0, _d.select)(svgNode).attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom);
      var root = (0, _d.select)(svgNode).append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

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
        root.append('g').attr('class', 'y axis').call(yAxis).append('text').attr('class', 'label').attr('transform', 'rotate(-90)').attr('x', 0).attr('y', 0 - margin.left).attr('dy', '.9em').style('text-anchor', 'end').text(axisLabels.y);
      }
      data.map(function (dataElelment, i) {
        root.append('path').datum(dataElelment).attr('class', 'line line' + i).attr('d', linePath);
        if (dataPoints) {
          dataElelment.map(function (dotData) {
            root.append('circle').attr('class', 'dot dot' + i).attr('cx', function () {
              switch (xType) {
                case 'time':
                  return x(_this3.parseDate(dotData.x));
                default:
                  return x(dotData.x);
              }
            }).attr('cy', function () {
              switch (yType) {
                case 'time':
                  return y(_this3.parseDate(dotData.y));
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
        }
      });

      return _react2.default.createElement(
        'div',
        { className: 'line-chart' + this.uid },
        _react2.default.createElement(_radium.Style, { scopeSelector: '.line-chart' + this.uid, rules: (0, _lodash2.default)({}, defaultStyle, style) }),
        svgNode.toReact()
      );
    }
  }]);

  return LineChart;
})(_react2.default.Component);

exports.default = LineChart;