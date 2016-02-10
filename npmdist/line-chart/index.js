'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactFauxDom = require('react-faux-dom');

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

var LineChart = function (_React$Component) {
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
        verticalGrid: _react2.default.PropTypes.bool,
        xDomainRange: _react2.default.PropTypes.array,
        yDomainRange: _react2.default.PropTypes.array,
        axisLabels: _react2.default.PropTypes.object,
        tickTimeDisplayFormat: _react2.default.PropTypes.string,
        yTicks: _react2.default.PropTypes.number,
        xTicks: _react2.default.PropTypes.number,
        dataPoints: _react2.default.PropTypes.bool,
        lineColors: _react2.default.PropTypes.array,
        yAxisOrientRight: _react2.default.PropTypes.bool,
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
        lineColors: [],
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
    _this.uid = (0, _shared.getRandomId)();
    return _this;
  }

  _createClass(LineChart, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      (0, _shared.createCircularTicks)(this.refs[this.uid]);
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      if (this.props.width !== prevProps.width) {
        (0, _shared.createCircularTicks)(this.refs[this.uid]);
      }
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
      var verticalGrid = _props.verticalGrid;
      var tickTimeDisplayFormat = _props.tickTimeDisplayFormat;
      var mouseOverHandler = _props.mouseOverHandler;
      var mouseOutHandler = _props.mouseOutHandler;
      var mouseMoveHandler = _props.mouseMoveHandler;
      var clickHandler = _props.clickHandler;
      var dataPoints = _props.dataPoints;
      var lineColors = _props.lineColors;
      var yAxisOrientRight = _props.yAxisOrientRight;

      var margin = (0, _shared.calcMargin)(axes, this.props.margin, yAxisOrientRight);
      var defaultColours = lineColors.concat(_shared.rmaColorPalet);
      var width = (0, _shared.reduce)(this.props.width, margin.left, margin.right);
      var height = (0, _shared.reduce)(this.props.height, margin.top, margin.bottom);

      var x = (0, _shared.setLineDomainAndRange)('x', xDomainRange, data, xType, width, this.parseDate);
      var y = (0, _shared.setLineDomainAndRange)('y', yDomainRange, data, yType, height, this.parseDate);

      var yValue = (0, _shared.getValueFunction)('y', yType, this.parseDate);
      var xValue = (0, _shared.getValueFunction)('x', xType, this.parseDate);
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
        if (grid && verticalGrid) {
          xAxis.tickSize(-height, 6).tickPadding(15);
        } else {
          xAxis.tickSize(0).tickPadding(15);
        }
        if (xTicks) xAxis.ticks(xTicks);
        root.append('g').attr('class', 'x axis').attr('transform', 'translate(0,' + height + ')').call(xAxis).append('text').attr('class', 'label').attr('y', margin.bottom - 10).attr('x', yAxisOrientRight ? 0 : width).style('text-anchor', yAxisOrientRight ? 'start' : 'end').text(axisLabels.x);

        var yAxis = _d.svg.axis().scale(y).orient(yAxisOrientRight ? 'right' : 'left');
        if (yType === 'time' && tickTimeDisplayFormat) {
          yAxis.tickFormat(_d.time.format(tickTimeDisplayFormat));
        }
        if (grid) {
          yAxis.tickSize(-width, 6).tickPadding(12);
        } else {
          yAxis.tickPadding(10);
        }
        if (yTicks) yAxis.ticks(yTicks);
        root.append('g').attr('class', 'y axis').call(yAxis).attr('transform', yAxisOrientRight ? 'translate(' + width + ', 0)' : 'translate(0, 0)').append('text').attr('class', 'label').attr('transform', 'rotate(-90)').attr('x', 0).attr('y', yAxisOrientRight ? -20 + margin.right : 0 - margin.left).attr('dy', '.9em').style('text-anchor', 'end').text(axisLabels.y);
      }

      data.map(function (dataElelment, i) {
        root.append('path').datum(dataElelment).attr('class', 'line').attr('style', 'stroke: ' + defaultColours[i]).attr('d', linePath);
      });

      if (dataPoints) {
        data.map(function (dataElelment, i) {
          dataElelment.map(function (dotData) {
            root.append('circle').attr('class', 'data-point').style('strokeWidth', '2px').style('stroke', defaultColours[i]).style('fill', 'white').attr('cx', function () {
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
        { ref: this.uid, className: 'line-chart' + this.uid },
        _react2.default.createElement(_radium.Style, { scopeSelector: '.line-chart' + this.uid, rules: (0, _lodash2.default)({}, _shared.defaultStyle, style, (0, _shared.getAxisStyles)(grid, verticalGrid, yAxisOrientRight)) }),
        svgNode.toReact()
      );
    }
  }]);

  return LineChart;
}(_react2.default.Component);

exports.default = LineChart;
module.exports = exports['default'];
//# sourceMappingURL=index.js.map