'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _d3Scale = require('d3-scale');

var _d = require('d3');

var _d3TimeFormat = require('d3-time-format');

var _d3Array = require('d3-array');

var _reactFauxDom = require('react-faux-dom');

var _radium = require('radium');

var _lodash = require('lodash.merge');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var defaultStyle = {
  '.line': {
    fill: 'none',
    strokeWidth: 1.5
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
  '.dot': {
    stroke: '#000',
    opacity: 0.85
  },
  '.tick line': {
    stroke: 'lightgrey',
    opacity: '0.7'
  }
};

var parseDate = null;

var ScatterplotChart = function (_React$Component) {
  _inherits(ScatterplotChart, _React$Component);

  _createClass(ScatterplotChart, null, [{
    key: 'propTypes',
    get: function get() {
      return {
        axes: _react2.default.PropTypes.bool,
        axisLabels: _react2.default.PropTypes.object,
        clickHandler: _react2.default.PropTypes.func,
        config: _react2.default.PropTypes.array,
        data: _react2.default.PropTypes.array.isRequired,
        datePattern: _react2.default.PropTypes.string,
        yAxisOrientRight: _react2.default.PropTypes.bool,
        dotRadius: _react2.default.PropTypes.number,
        grid: _react2.default.PropTypes.bool,
        height: _react2.default.PropTypes.number,
        useLegend: _react2.default.PropTypes.bool,
        margin: _react2.default.PropTypes.object,
        mouseOverHandler: _react2.default.PropTypes.func,
        mouseOutHandler: _react2.default.PropTypes.func,
        mouseMoveHandler: _react2.default.PropTypes.func,
        style: _react2.default.PropTypes.object,
        tickTimeDisplayFormat: _react2.default.PropTypes.string,
        width: _react2.default.PropTypes.number,
        xDomainRange: _react2.default.PropTypes.array,
        yDomainRange: _react2.default.PropTypes.array,
        xTickNumber: _react2.default.PropTypes.number,
        yTickNumber: _react2.default.PropTypes.number,
        yTicks: _react2.default.PropTypes.number,
        xTicks: _react2.default.PropTypes.number,
        xType: _react2.default.PropTypes.string,
        yType: _react2.default.PropTypes.string
      };
    }
  }, {
    key: 'defaultProps',
    get: function get() {
      return {
        axes: false,
        axisLabels: {},
        clickHandler: function clickHandler() {},
        config: [],
        datePattern: '%d-%b-%y',
        dotRadius: 5,
        grid: false,
        mouseOverHandler: function mouseOverHandler() {},
        mouseOutHandler: function mouseOutHandler() {},
        mouseMoveHandler: function mouseMoveHandler() {},
        width: 320,
        height: 180,
        xType: 'linear',
        yType: 'linear'
      };
    }
  }]);

  function ScatterplotChart(props) {
    _classCallCheck(this, ScatterplotChart);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ScatterplotChart).call(this, props));

    _this.color = _d.scale.category20();
    return _this;
  }

  _createClass(ScatterplotChart, [{
    key: 'getScale',
    value: function getScale(type) {
      switch (type) {
        case 'time':
          return _d.time.scale();
        case 'text':
          return (0, _d3Scale.ordinal)();
        default:
          return (0, _d3Scale.linear)();
      }
    }
  }, {
    key: 'setDomainAndRange',
    value: function setDomainAndRange(axesType, domainRange, data, type, length, yAxisOrientRight) {
      var dataIndex = axesType === 'x' ? 'x' : 'y';
      var d3Axis = undefined;
      switch (type) {
        case 'text':
          d3Axis = (0, _d3Scale.ordinal)();
          d3Axis.domain(data.map(function (d) {
            return d[dataIndex];
          }), 1);
          d3Axis.rangePoints([0, length], 1);
          break;
        case 'linear':
          var minAmount = (0, _d.min)(data, function (d) {
            return d[dataIndex];
          });
          var maxAmount = (0, _d.max)(data, function (d) {
            return d[dataIndex];
          });
          d3Axis = (0, _d3Scale.linear)();
          if (domainRange) {
            d3Axis.domain(this.calcDefaultDomain(domainRange, type));
          } else {
            // set initial domain
            d3Axis.domain([minAmount, maxAmount]);
            // calculate 1 tick offset
            var ticks = d3Axis.ticks();
            minAmount = yAxisOrientRight && axesType === 'x' ? minAmount : minAmount - (ticks[1] - ticks[0]);
            maxAmount = yAxisOrientRight && axesType === 'x' ? maxAmount + (ticks[1] - ticks[0]) : maxAmount;
            d3Axis.domain([minAmount, maxAmount]);
          }
          d3Axis.range(axesType === 'x' ? [0, length] : [length, 0]);
          break;
        case 'time':
          d3Axis = _d.time.scale();
          if (domainRange) {
            d3Axis.domain(this.calcDefaultDomain(domainRange));
          } else {
            d3Axis.domain((0, _d3Array.extent)(data, function (d) {
              return parseDate(d[dataIndex]);
            }));
          }
          d3Axis.range(axesType === 'x' ? [0, length] : [length, 0], 1);
          break;
        default:
          break;
      }
      return d3Axis;
    }
  }, {
    key: 'getDataConfig',
    value: function getDataConfig(type) {
      var index = this.props.config.findIndex(function (item) {
        return item.type === type;
      });
      return this.props.config[index];
    }
  }, {
    key: 'getFill',
    value: function getFill(data) {
      var configItem = this.getDataConfig(data.type);
      return typeof configItem !== 'undefined' ? configItem.color : this.color(data.type);
    }
  }, {
    key: 'getRadius',
    value: function getRadius(data, dataItem, dotRadius) {
      if (typeof data[0].z !== 'undefined') {
        var range = (0, _d3Array.extent)(data, function (d) {
          return d.z;
        });
        var mn = range[0];
        var mx = range[1];
        var p = (dataItem.z - mn) / (mx - mn);
        var minRad = 5;
        var maxRad = 20;
        var rad = minRad + (maxRad - minRad) * p;
        return rad;
      }
      return dotRadius;
    }
  }, {
    key: 'getStroke',
    value: function getStroke(data) {
      var configItem = this.getDataConfig(data.type);
      return typeof configItem !== 'undefined' ? configItem.stroke : 'none';
    }
  }, {
    key: 'calcDefaultDomain',
    value: function calcDefaultDomain(domainRange, type) {
      switch (type) {
        case 'time':
          var arr = [parseDate(domainRange[0]), parseDate(domainRange[1])];
          return arr;
        default:
          return domainRange;
      }
    }
  }, {
    key: 'findLargestExtent',
    value: function findLargestExtent(data, value) {
      var low = undefined;
      var high = undefined;
      data.map(function (dataElelment) {
        var calcDomainRange = (0, _d3Array.extent)(dataElelment, value);
        low = low < calcDomainRange[0] ? low : calcDomainRange[0];
        high = high > calcDomainRange[1] ? high : calcDomainRange[1];
      });
      return [low, high];
    }
  }, {
    key: 'calcMargin',
    value: function calcMargin(axes, spacer, yAxisOrientRight) {
      var defaultMargins = axes ? { top: 24, right: 24, bottom: 24, left: 48 } : { top: spacer, right: spacer, bottom: spacer, left: spacer };
      if (yAxisOrientRight) {
        defaultMargins = axes ? { top: 24, right: 48, bottom: 24, left: 24 } : { top: spacer, right: spacer, bottom: spacer, left: spacer };
      }
      return defaultMargins;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props;
      var axes = _props.axes;
      var yAxisOrientRight = _props.yAxisOrientRight;
      var axisLabels = _props.axisLabels;
      var clickHandler = _props.clickHandler;
      var data = _props.data;
      var dotRadius = _props.dotRadius;
      var grid = _props.grid;
      var mouseOverHandler = _props.mouseOverHandler;
      var mouseOutHandler = _props.mouseOutHandler;
      var mouseMoveHandler = _props.mouseMoveHandler;
      var style = _props.style;
      var tickTimeDisplayFormat = _props.tickTimeDisplayFormat;
      var xTickNumber = _props.xTickNumber;
      var xTicks = _props.xTicks;
      var yTicks = _props.yTicks;
      var xType = _props.xType;
      var yType = _props.yType;
      var _props2 = this.props;
      var width = _props2.width;
      var height = _props2.height;
      var margin = _props2.margin;
      var xDomainRange = _props2.xDomainRange;
      var yDomainRange = _props2.yDomainRange;

      parseDate = (0, _d3TimeFormat.format)(this.props.datePattern).parse;

      margin = margin ? margin : this.calcMargin(axes, dotRadius * 2, yAxisOrientRight);

      width = width - (margin.left + margin.right);
      height = height - (margin.top + margin.bottom + dotRadius * 2);

      yDomainRange = yDomainRange ? this.calcDefaultDomain(yDomainRange, yType) : null;
      xDomainRange = xDomainRange ? this.calcDefaultDomain(xDomainRange, xType) : null;

      var x = this.setDomainAndRange('x', xDomainRange, data, xType, width, yAxisOrientRight);
      var y = this.setDomainAndRange('y', yDomainRange, data, yType, height, yAxisOrientRight);
      var axisMargin = 18;

      var node = (0, _reactFauxDom.createElement)('svg');
      var chart = (0, _d.select)(node).attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom + axisMargin + 6).append('g').attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

      if (axes) {
        var xAxis = _d.svg.axis().scale(x).orient('bottom');
        if (xType === 'time' && tickTimeDisplayFormat) {
          xAxis.tickFormat(_d.time.format(tickTimeDisplayFormat));
        }
        if (xTickNumber) xAxis.ticks(xTickNumber);

        var yAxis = _d.svg.axis().scale(y).orient(yAxisOrientRight ? 'right' : 'left');

        if (grid) xAxis.tickSize(-height, 6).tickPadding(12);
        if (grid) yAxis.tickSize(-width, 6).tickPadding(12);
        if (xTicks) xAxis.ticks(xTicks);
        if (yTicks) yAxis.ticks(yTicks);

        chart.append('g').attr('class', 'x axis').attr('transform', 'translate(0, ' + height + ')').call(xAxis).append('text').attr('class', 'label').attr('x', yAxisOrientRight ? 0 : width).attr('y', margin.bottom + axisMargin).style('text-anchor', yAxisOrientRight ? 'start' : 'end').text(axisLabels.x);

        chart.append('g').attr('class', 'y axis').call(yAxis).attr('transform', yAxisOrientRight ? 'translate(' + width + ', 0)' : 'translate(0, 0)').append('text').attr('class', 'label').attr('transform', 'rotate(-90)').attr('y', yAxisOrientRight ? -25 + margin.right : 10 - margin.left).attr('dy', '.71em').style('text-anchor', 'end').text(axisLabels.y);
      }

      chart.selectAll('.dot').data(data).enter().append('circle').attr('class', 'dot').attr('r', function (d) {
        return _this2.getRadius(data, d, dotRadius);
      }).attr('cx', function (d) {
        switch (xType) {
          case 'time':
            return x(parseDate(d.x));
          default:
            return x(d.x);
        }
      }).attr('cy', function (d) {
        return y(d.y);
      }).style('fill', function (d) {
        return _this2.getFill(d);
      }).style('stroke', function (d) {
        return _this2.getStroke(d);
      }).on('mouseover', function (d) {
        return mouseOverHandler(d, _d.event);
      }).on('mouseout', function (d) {
        return mouseOutHandler(d, _d.event);
      }).on('mousemove', function () {
        return mouseMoveHandler(_d.event);
      }).on('click', function (d) {
        return clickHandler(d, _d.event);
      });

      var uid = Math.floor(Math.random() * new Date().getTime());

      return _react2.default.createElement(
        'div',
        { className: 'scatterplot_chart' + uid },
        _react2.default.createElement(_radium.Style, { scopeSelector: '.scatterplot_chart' + uid, rules: (0, _lodash2.default)({}, defaultStyle, style) }),
        node.toReact()
      );
    }
  }]);

  return ScatterplotChart;
}(_react2.default.Component);

exports.default = ScatterplotChart;
module.exports = exports['default'];
//# sourceMappingURL=index.js.map