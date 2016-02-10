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

var _shared = require('../shared');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var parseDate = null;
var axisMargin = 18;

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
        verticalGrid: _react2.default.PropTypes.bool,
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
    _this.margin = 0;
    _this.width = 0;
    _this.height = 0;
    _this.innerWidth = 0;
    _this.innerHeight = 0;
    _this.xDomainRange = null;
    _this.yDomainRange = null;
    _this.x = null;
    _this.y = null;
    _this.axisX = null;
    _this.axisY = null;
    _this.xAxis = null;
    _this.yAxis = null;
    _this.chart = null;
    _this.uid = Math.floor(Math.random() * new Date().getTime());
    return _this;
  }

  _createClass(ScatterplotChart, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      parseDate = (0, _d3TimeFormat.format)(this.props.datePattern).parse;
      this.width = this.props.width;
      this.height = this.props.height;
      this.setMargin();
      this.setWidthAndHeight();
      this.setDomainRange();
      this.setXandY();
      this.setXaxis();
      this.setYaxis();
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.drawAxisX();
      this.drawAxisY();
      this.drawChart();
      (0, _shared.createCircularTicks)(this.refs[this.uid]);
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.setWidthAndHeight();
      this.setDomainRange();
      this.setXandY();
      this.setXaxis();
      this.setYaxis();
      this.updateAxisX();
      this.updateAxisY();
      this.updateChart();
      (0, _shared.createCircularTicks)(this.refs[this.uid]);
    }
  }, {
    key: 'setMargin',
    value: function setMargin() {
      this.margin = this.props.margin ? this.props.margin : this.calcMargin(this.props.axes, this.props.dotRadius * 2, this.props.yAxisOrientRight);
    }
  }, {
    key: 'setWidthAndHeight',
    value: function setWidthAndHeight() {
      this.width = this.props.width;
      this.height = this.props.height + this.props.dotRadius * 3;
      this.innerWidth = this.props.width - (this.margin.left + this.margin.right);
      this.innerHeight = this.props.height - (this.margin.top + this.margin.bottom + this.props.dotRadius * 2);
    }
  }, {
    key: 'setDomainRange',
    value: function setDomainRange() {
      this.yDomainRange = this.props.yDomainRange ? (0, _shared.calcDefaultDomain)(this.props.yDomainRange, this.props.yType, parseDate) : null;
      this.xDomainRange = this.props.xDomainRange ? (0, _shared.calcDefaultDomain)(this.props.xDomainRange, this.props.xType, parseDate) : null;
    }
  }, {
    key: 'setXandY',
    value: function setXandY() {
      var w = this.props.width - (this.margin.left + this.margin.right);
      var h = this.props.height - (this.margin.top + this.margin.bottom + this.props.dotRadius * 2);
      this.x = this.setDomainAndRange('x', this.xDomainRange, this.props.data, this.props.xType, w, this.props.yAxisOrientRight);
      this.y = this.setDomainAndRange('y', this.yDomainRange, this.props.data, this.props.yType, h, this.props.yAxisOrientRight);
    }
  }, {
    key: 'setXaxis',
    value: function setXaxis() {
      this.xAxis = _d.svg.axis().scale(this.x).orient('bottom');
      if (this.props.xType === 'time' && this.props.tickTimeDisplayFormat) {
        this.xAxis.tickFormat(_d.time.format(this.props.tickTimeDisplayFormat));
      }
      if (this.props.xTickNumber) this.xAxis.ticks(this.props.xTickNumber);

      if (this.props.grid && this.props.verticalGrid) {
        this.xAxis.tickSize(-this.height, 6).tickPadding(15);
      } else {
        this.xAxis.tickSize(0).tickPadding(15);
      }

      if (this.props.xTicks) this.xAxis.ticks(this.props.xTicks);
    }
  }, {
    key: 'setYaxis',
    value: function setYaxis() {
      this.yAxis = _d.svg.axis().scale(this.y).orient(this.props.yAxisOrientRight ? 'right' : 'left');
      if (this.props.grid) {
        this.yAxis.tickSize(-this.innerWidth, 6).tickPadding(12);
      } else {
        this.yAxis.tickPadding(10);
      }
      if (this.props.yTicks) this.yAxis.ticks(this.props.yTicks);
    }
  }, {
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
            d3Axis.domain((0, _shared.calcDefaultDomain)(domainRange, type, parseDate));
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
            d3Axis.domain((0, _shared.calcDefaultDomain)(domainRange));
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
    key: 'drawAxisX',
    value: function drawAxisX() {
      if (this.props.axes) {
        this.axisX = (0, _d.select)('#axis-x-' + this.uid).attr('class', 'x axis').attr('transform', 'translate(0, ' + this.innerHeight + ')').call(this.xAxis).append('text').attr('id', 'label-x').attr('class', 'label').attr('x', this.props.yAxisOrientRight ? 0 : this.innerWidth).attr('y', this.margin.bottom + axisMargin).style('text-anchor', this.props.yAxisOrientRight ? 'start' : 'end').text(this.props.axisLabels.x);
      }
    }
  }, {
    key: 'drawAxisY',
    value: function drawAxisY() {
      if (this.props.axes) {
        this.axisY = (0, _d.select)('#axis-y-' + this.uid).attr('class', 'y axis').call(this.yAxis).attr('transform', this.props.yAxisOrientRight ? 'translate(' + this.innerWidth + ', 0)' : 'translate(0, 0)').append('text').attr('class', 'label').attr('transform', 'rotate(-90)').attr('y', this.props.yAxisOrientRight ? -25 + this.margin.right : 10 - this.margin.left).attr('dy', '.71em').style('text-anchor', 'end').text(this.props.axisLabels.y);
      }
    }
  }, {
    key: 'drawChart',
    value: function drawChart() {
      var _this2 = this;

      this.chart = (0, _d.select)('#dots-' + this.uid).selectAll('.dot').data(this.props.data).enter().append('circle').attr('class', 'dot').attr('r', function (d) {
        return _this2.getRadius(_this2.props.data, d, _this2.props.dotRadius);
      }).attr('cx', function (d) {
        switch (_this2.props.xType) {
          case 'time':
            return _this2.x(parseDate(d.x));
          default:
            return _this2.x(d.x);
        }
      }).attr('cy', function (d) {
        return _this2.y(d.y);
      }).style('fill', function (d) {
        return _this2.getFill(d);
      }).style('stroke', function (d) {
        return _this2.getStroke(d);
      }).on('mouseover', function (d) {
        return _this2.props.mouseOverHandler(d, _d.event);
      }).on('mouseout', function (d) {
        return _this2.props.mouseOutHandler(d, _d.event);
      }).on('mousemove', function () {
        return _this2.props.mouseMoveHandler(_d.event);
      }).on('click', function (d) {
        return _this2.props.clickHandler(d, _d.event);
      });
    }
  }, {
    key: 'updateAxisX',
    value: function updateAxisX() {
      if (this.props.axes) {
        this.axisX = (0, _d.select)('#axis-x-' + this.uid).attr('transform', 'translate(0, ' + this.innerHeight + ')').transition().duration(750).call(this.xAxis).select('#label-x').attr('x', this.props.yAxisOrientRight ? 0 : this.innerWidth);
      }
    }
  }, {
    key: 'updateAxisY',
    value: function updateAxisY() {
      if (this.props.axes) {
        this.axisY = (0, _d.select)('#axis-y-' + this.uid).transition().duration(750).call(this.yAxis);
      }
    }
  }, {
    key: 'updateChart',
    value: function updateChart() {
      var _this3 = this;

      this.chart.data(this.props.data).transition().duration(750).attr('cx', function (d) {
        switch (_this3.props.xType) {
          case 'time':
            return _this3.x(parseDate(d.x));
          default:
            return _this3.x(d.x);
        }
      }).attr('cy', function (d) {
        return _this3.y(d.y);
      });
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
      this.setWidthAndHeight();
      var node = (0, _reactFauxDom.createElement)('svg');
      var chart = (0, _d.select)(node).attr('width', this.width).attr('height', this.height).append('g').attr('id', 'area-' + this.uid).attr('transform', 'translate(' + this.margin.left + ', ' + this.margin.top + ')');

      chart.append('g').attr('id', 'axis-x-' + this.uid);
      chart.append('g').attr('id', 'axis-y-' + this.uid);
      chart.append('g').attr('id', 'dots-' + this.uid);

      var uid = Math.floor(Math.random() * new Date().getTime());

      return _react2.default.createElement(
        'div',
        { ref: this.uid, className: 'scatterplot_chart' + uid },
        _react2.default.createElement(_radium.Style, { scopeSelector: '.scatterplot_chart' + uid, rules: (0, _lodash2.default)({}, _shared.defaultStyle, this.props.style, (0, _shared.getAxisStyles)(this.props.grid, this.props.verticalGrid, this.props.yAxisOrientRight)) }),
        node.toReact()
      );
    }
  }]);

  return ScatterplotChart;
}(_react2.default.Component);

exports.default = ScatterplotChart;
module.exports = exports['default'];
//# sourceMappingURL=index.js.map