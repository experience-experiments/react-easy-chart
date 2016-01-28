'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _d3Scale = require('d3-scale');

var _d = require('d3');

var _shared = require('../shared');

var _d3Array = require('d3-array');

var _d3TimeFormat = require('d3-time-format');

var _reactFauxDom = require('react-faux-dom');

var _radium = require('radium');

var _lodash = require('lodash.merge');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var defaultStyle = {
  '.bar': {
    fill: 'blue',
    transition: 'height 0.5s ease-in, y 0.5s ease-in'
  },
  '.bar:hover': {
    opacity: 0.5
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
  },
  '.example-appear': {
    opacity: 0.01
  },
  '.example-appear.example-appear-active': {
    opacity: 1,
    fill: 'red',
    transition: 'all 1s ease-in'
  }
};
var colorScale = _d.scale.category20();

var BarChart = function (_React$Component) {
  _inherits(BarChart, _React$Component);

  _createClass(BarChart, null, [{
    key: 'propTypes',
    get: function get() {
      return {
        data: _react2.default.PropTypes.array.isRequired,
        width: _react2.default.PropTypes.number,
        height: _react2.default.PropTypes.number,
        margin: _react2.default.PropTypes.object,
        mouseOverHandler: _react2.default.PropTypes.func,
        mouseOutHandler: _react2.default.PropTypes.func,
        mouseMoveHandler: _react2.default.PropTypes.func,
        clickHandler: _react2.default.PropTypes.func,
        style: _react2.default.PropTypes.object,
        colorBars: _react2.default.PropTypes.bool,
        axes: _react2.default.PropTypes.bool,
        grid: _react2.default.PropTypes.bool,
        axisLabels: _react2.default.PropTypes.object,
        xType: _react2.default.PropTypes.string,
        yType: _react2.default.PropTypes.string,
        xDomainRange: _react2.default.PropTypes.array,
        yDomainRange: _react2.default.PropTypes.array,
        datePattern: _react2.default.PropTypes.string,
        tickTimeDisplayFormat: _react2.default.PropTypes.string,
        barWidth: _react2.default.PropTypes.number,
        xTickNumber: _react2.default.PropTypes.number,
        yTickNumber: _react2.default.PropTypes.number
      };
    }
  }, {
    key: 'defaultProps',
    get: function get() {
      return {
        width: 400,
        height: 200,
        barWidth: 10,
        axes: false,
        xType: 'text',
        yType: 'linear',
        mouseOverHandler: function mouseOverHandler() {},
        mouseOutHandler: function mouseOutHandler() {},
        mouseMoveHandler: function mouseMoveHandler() {},
        clickHandler: function clickHandler() {},
        datePattern: '%d-%b-%y',
        axisLabels: { x: '', y: '' }
      };
    }
  }]);

  function BarChart(props) {
    _classCallCheck(this, BarChart);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(BarChart).call(this, props));

    _this.parseDate = (0, _d3TimeFormat.format)(props.datePattern).parse;
    _this.uid = Math.floor(Math.random() * new Date().getTime());
    return _this;
  }

  _createClass(BarChart, [{
    key: 'setScaleDomainRange',
    value: function setScaleDomainRange(axesType, domainRange, data, type, length) {
      var _this2 = this;

      var dataIndex = axesType === 'x' ? 'x' : 'y';
      var barPadding = length / data.length > 40 ? 0.02 : 0.04;
      var d3Axis = undefined;
      switch (type) {
        case 'text':
          d3Axis = (0, _d3Scale.ordinal)();
          d3Axis.domain(data.map(function (d) {
            return d[dataIndex];
          }));
          d3Axis.rangeBands([0, length], barPadding);
          break;
        case 'linear':
          d3Axis = (0, _d3Scale.linear)();
          d3Axis.domain(domainRange ? (0, _shared.calcDefaultDomain)(domainRange, type, this.parseDate) : [0, (0, _d.max)(data, function (d) {
            return d[dataIndex];
          })]);
          d3Axis.range(axesType === 'x' ? [0, length] : [length, 0]);
          break;
        case 'time':
          d3Axis = _d.time.scale();
          d3Axis.domain(domainRange ? (0, _shared.calcDefaultDomain)(domainRange, type, this.parseDate) : (0, _d3Array.extent)(data, function (d) {
            return _this2.parseDate(d[dataIndex]);
          }));
          d3Axis.range(axesType === 'x' ? [0, length] : [length, 0]);
          break;
        default:
          break;
      }
      return d3Axis;
    }
  }, {
    key: 'defineColor',
    value: function defineColor(i, d, colorBars) {
      if (d.color) return d.color;
      if (colorBars) return colorScale(i);
      return null;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _props = this.props;
      var data = _props.data;
      var mouseOverHandler = _props.mouseOverHandler;
      var mouseOutHandler = _props.mouseOutHandler;
      var mouseMoveHandler = _props.mouseMoveHandler;
      var clickHandler = _props.clickHandler;
      var style = _props.style;
      var axes = _props.axes;
      var axisLabels = _props.axisLabels;
      var colorBars = _props.colorBars;
      var xType = _props.xType;
      var yType = _props.yType;
      var barWidth = _props.barWidth;
      var tickTimeDisplayFormat = _props.tickTimeDisplayFormat;
      var xTickNumber = _props.xTickNumber;
      var yTickNumber = _props.yTickNumber;
      var grid = _props.grid;
      var xDomainRange = _props.xDomainRange;
      var yDomainRange = _props.yDomainRange;

      var margin = (0, _shared.calcMargin)(axes, this.props.margin);
      var width = (0, _shared.reduce)(this.props.width, margin.left, margin.right);
      var height = (0, _shared.reduce)(this.props.height, margin.top, margin.bottom);

      var x = this.setScaleDomainRange('x', xDomainRange, data, xType, width);
      var y = this.setScaleDomainRange('y', yDomainRange, data, yType, height);

      var svgNode = (0, _reactFauxDom.createElement)('svg');
      (0, _d.select)(svgNode).attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom);
      var root = (0, _d.select)(svgNode).append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      if (axes) {
        var xAxis = _d.svg.axis().scale(x).orient('bottom');
        if (xType === 'time' && tickTimeDisplayFormat) {
          xAxis.tickFormat(_d.time.format(tickTimeDisplayFormat));
        }
        if (xTickNumber) xAxis.ticks(xTickNumber);
        root.append('g').attr('class', 'x axis').attr('transform', 'translate(0,' + height + ')').call(xAxis).append('text').attr('class', 'label').attr('y', margin.bottom - 4).attr('x', width).style('text-anchor', 'end').text(axisLabels.x);

        var yAxis = _d.svg.axis().scale(y).orient('left');
        if (yTickNumber) yAxis.ticks(yTickNumber);
        if (grid) yAxis.tickSize(-width, 6).tickPadding(12);
        root.append('g').attr('class', 'y axis').call(yAxis).append('text').attr('class', 'label').attr('transform', 'rotate(-90)').attr('x', 0).attr('y', 0 - margin.left).attr('dy', '.9em').style('text-anchor', 'end').text(axisLabels.y);
      }

      data.map(function () {
        root.selectAll('.bar').data(data).enter().append('rect').attr('class', 'bar').style('fill', function (d, i) {
          return _this3.defineColor(i, d, colorBars);
        }).attr('x', function (d) {
          switch (xType) {
            case 'time':
              return x(_this3.parseDate(d.x));
            default:
              return x(d.x);
          }
        }).attr('width', function () {
          switch (xType) {
            case 'text':
              return x.rangeBand();
            default:
              return barWidth;
          }
        }).style('y', function (d) {
          return y(d.y);
        }).style('height', function (d) {
          return height - y(d.y);
        }).on('mouseover', function (d) {
          return mouseOverHandler(d, _d.event);
        }).on('mouseout', function (d) {
          return mouseOutHandler(d, _d.event);
        }).on('mousemove', function () {
          return mouseMoveHandler(_d.event);
        }).on('click', function (d) {
          return clickHandler(d, _d.event);
        });
      });

      return _react2.default.createElement(
        'div',
        { className: 'bar-chart' + this.uid },
        _react2.default.createElement(_radium.Style, { scopeSelector: '.bar-chart' + this.uid, rules: (0, _lodash2.default)({}, defaultStyle, style) }),
        svgNode.toReact()
      );
    }
  }]);

  return BarChart;
}(_react2.default.Component);

exports.default = BarChart;
module.exports = exports['default'];
//# sourceMappingURL=index.js.map