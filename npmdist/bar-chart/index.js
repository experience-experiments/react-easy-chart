'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

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

var dateParser = {};

var colorScale = _d.scale.category20();

var BarChart = function (_React$Component) {
  (0, _inherits3.default)(BarChart, _React$Component);
  (0, _createClass3.default)(BarChart, null, [{
    key: 'propTypes',
    get: function get() {
      return {
        data: _react2.default.PropTypes.array.isRequired,
        lineData: _react2.default.PropTypes.array,
        width: _react2.default.PropTypes.number,
        height: _react2.default.PropTypes.number,
        margin: _react2.default.PropTypes.object,
        mouseOverHandler: _react2.default.PropTypes.func,
        mouseOutHandler: _react2.default.PropTypes.func,
        mouseMoveHandler: _react2.default.PropTypes.func,
        clickHandler: _react2.default.PropTypes.func,
        interpolate: _react2.default.PropTypes.string,
        style: _react2.default.PropTypes.object,
        colorBars: _react2.default.PropTypes.bool,
        axes: _react2.default.PropTypes.bool,
        grid: _react2.default.PropTypes.bool,
        axisLabels: _react2.default.PropTypes.shape({
          x: _react2.default.PropTypes.string,
          y: _react2.default.PropTypes.string
        }),
        xType: _react2.default.PropTypes.string,
        yType: _react2.default.PropTypes.string,
        y2Type: _react2.default.PropTypes.string,
        xDomainRange: _react2.default.PropTypes.array,
        yDomainRange: _react2.default.PropTypes.array,
        datePattern: _react2.default.PropTypes.string,
        tickTimeDisplayFormat: _react2.default.PropTypes.string,
        yAxisOrientRight: _react2.default.PropTypes.bool,
        barWidth: _react2.default.PropTypes.number,
        xTickNumber: _react2.default.PropTypes.number,
        yTickNumber: _react2.default.PropTypes.number
      };
    }
  }, {
    key: 'defaultProps',
    get: function get() {
      return {
        lineData: [],
        width: 400,
        height: 200,
        barWidth: 10,
        axes: false,
        xType: 'text',
        yType: 'linear',
        y2Type: 'linear',
        interpolate: 'linear',
        mouseOverHandler: function mouseOverHandler() {},
        mouseOutHandler: function mouseOutHandler() {},
        mouseMoveHandler: function mouseMoveHandler() {},
        clickHandler: function clickHandler() {},
        datePattern: '%d-%b-%y',
        axisLabels: {
          x: '',
          y: ''
        }
      };
    }
  }]);

  function BarChart(props) {
    (0, _classCallCheck3.default)(this, BarChart);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(BarChart).call(this, props));

    _this.uid = (0, _shared.createUniqueID)(props);
    return _this;
  }

  (0, _createClass3.default)(BarChart, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var ref = this.refs.barChart;
      (0, _shared.createCircularTicks)(ref);
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      var ref = this.refs.barChart;
      (0, _shared.createCircularTicks)(ref);
    }
  }, {
    key: 'createDomainRangeGenerator',
    value: function createDomainRangeGenerator(axesType, domainRange, data, type, length) {
      var _this2 = this;

      var dataIndex = axesType === 'x' ? 'x' : 'y';
      var barPadding = length / data.length > 40 ? 0.02 : 0.04;
      var parseDate = function parseDate(v) {
        return _this2.parseDate(v);
      };
      var axis = void 0;
      switch (type) {
        case 'text':
          axis = (0, _d3Scale.scaleBand)();
          axis.domain(data.map(function (d) {
            return d[dataIndex];
          })).range([0, length]).padding(barPadding);
          break;
        case 'linear':
          axis = (0, _d3Scale.scaleLinear)();
          axis.domain(Array.isArray(domainRange) ? domainRange // calculateDomainRange(domainRange, type, parseDate)
          : [0, (0, _d.max)(data, function (d) {
            return d[dataIndex];
          })]).range(axesType === 'x' ? [0, length] : [length, 0]);
          break;
        case 'time':
          axis = _d.time.scale();
          axis.domain(Array.isArray(domainRange) ? (0, _shared.calculateDomainRange)(domainRange, type, parseDate) : (0, _d3Array.extent)(data, function (d) {
            return parseDate(d[dataIndex]);
          })).range(axesType === 'x' ? [0, length] : [length, 0]);
          break;
        default:
          break;
      }
      return axis;
    }
  }, {
    key: 'defineColor',
    value: function defineColor(i, d, colorBars) {
      if (d.color) return d.color;
      if (colorBars) return colorScale(i);
      return null;
    }
  }, {
    key: 'createSvgNode',
    value: function createSvgNode(_ref) {
      var m = _ref.m;
      var w = _ref.w;
      var h = _ref.h;

      var node = (0, _reactFauxDom.createElement)('svg');
      node.setAttribute('width', w + m.left + m.right);
      node.setAttribute('height', h + m.top + m.bottom);
      return node;
    }
  }, {
    key: 'createSvgRoot',
    value: function createSvgRoot(_ref2) {
      var node = _ref2.node;
      var m = _ref2.m;

      return (0, _d.select)(node).append('g').attr('transform', 'translate(' + m.left + ', ' + m.top + ')');
    }
  }, {
    key: 'createXAxis',
    value: function createXAxis(_ref3) {
      var root = _ref3.root;
      var m = _ref3.m;
      var w = _ref3.w;
      var h = _ref3.h;
      var x = _ref3.x;
      var _props = this.props;
      var label = _props.axisLabels.x;
      var xType = _props.xType;
      var tickTimeDisplayFormat = _props.tickTimeDisplayFormat;
      var xTickNumber = _props.xTickNumber;
      var yAxisOrientRight = _props.yAxisOrientRight;


      var axis = _d.svg.axis().scale(x).orient('bottom');

      if (xType === 'time' && tickTimeDisplayFormat) {
        axis.tickFormat(_d.time.format(tickTimeDisplayFormat));
      }

      axis.tickSize(0).tickPadding(15);

      if (xTickNumber) {
        axis.ticks(xTickNumber);
      }

      var group = root.append('g').attr('class', 'x axis').attr('transform', 'translate(0, ' + h + ')');

      group.call(axis);

      if (label) {
        group.append('text').attr('class', 'label').attr('x', yAxisOrientRight ? 0 : w).attr('y', m.bottom - 10).style('text-anchor', yAxisOrientRight ? 'start' : 'end').text(label);
      }
    }
  }, {
    key: 'createYAxis',
    value: function createYAxis(_ref4) {
      var root = _ref4.root;
      var m = _ref4.m;
      var w = _ref4.w;
      var y = _ref4.y;
      var _props2 = this.props;
      var label = _props2.axisLabels.y;
      var yTickNumber = _props2.yTickNumber;
      var yAxisOrientRight = _props2.yAxisOrientRight;
      var grid = _props2.grid;


      var axis = _d.svg.axis().scale(y).orient(yAxisOrientRight ? 'right' : 'left');

      if (yTickNumber) {
        axis.ticks(yTickNumber);
      }

      if (grid) {
        axis.tickSize(-w, 6).tickPadding(12);
      } else {
        axis.tickPadding(10);
      }

      var group = root.append('g').attr('class', 'y axis');

      group.call(axis);

      if (label) {
        group.attr('transform', yAxisOrientRight ? 'translate(' + w + ', 0)' : 'translate(0, 0)').append('text').attr('class', 'label').attr('transform', 'rotate(-90)').attr('x', 0).attr('y', yAxisOrientRight ? -25 + m.right : 10 - m.left).attr('dy', '.9em').style('text-anchor', 'end').text(label);
      }
    }
  }, {
    key: 'createYAxis2',
    value: function createYAxis2(_ref5) {
      var root = _ref5.root;
      var m = _ref5.m;
      var w = _ref5.w;
      var h = _ref5.h;
      var _props3 = this.props;
      var lineData = _props3.lineData;
      var label = _props3.axisLabels.y2;
      var y2Type = _props3.y2Type;
      var yTickNumber = _props3.yTickNumber;
      var yAxisOrientRight = _props3.yAxisOrientRight;
      var grid = _props3.grid;
      var yDomainRange = _props3.yDomainRange;


      var y = this.createDomainRangeGenerator('y', yDomainRange, lineData, y2Type, h);

      var axis = _d.svg.axis().scale(y).orient(yAxisOrientRight ? 'left' : 'right');

      if (yTickNumber) {
        axis.ticks(yTickNumber);
      }

      if (grid) {
        axis.tickSize(-w, 6).tickPadding(12);
      } else {
        axis.tickPadding(10);
      }

      var group = root.append('g').attr('class', 'y axis');

      group.call(axis);

      if (label) {
        group.attr('transform', yAxisOrientRight ? 'translate(0, 0)' : 'translate(' + w + ', 0)').append('text').attr('class', 'label').attr('transform', 'rotate(-90)').attr('x', 0).attr('y', yAxisOrientRight ? 10 - m.left : -25 + m.right).attr('dy', '.9em').style('text-anchor', 'end').text(label);
      }
    }
  }, {
    key: 'createBarChart',
    value: function createBarChart(_ref6) {
      var _this3 = this;

      var root = _ref6.root;
      var h = _ref6.h;
      var x = _ref6.x;
      var y = _ref6.y;
      var _props4 = this.props;
      var data = _props4.data;
      var mouseOverHandler = _props4.mouseOverHandler;
      var mouseOutHandler = _props4.mouseOutHandler;
      var mouseMoveHandler = _props4.mouseMoveHandler;
      var clickHandler = _props4.clickHandler;
      var colorBars = _props4.colorBars;
      var xType = _props4.xType;
      var barWidth = _props4.barWidth;


      var calculateDate = function calculateDate(v) {
        return _this3.parseDate(v);
      };
      var calculateFill = function calculateFill(d, i) {
        return _this3.defineColor(i, d, colorBars);
      };

      var calculateX = function calculateX(d) {
        return xType === 'time' ? x(calculateDate(d.x)) : x(d.x);
      };
      var calculateY = function calculateY(d) {
        return y(d.y);
      };
      var calculateW = function calculateW() {
        return xType === 'text' ? x.bandwidth() : barWidth;
      };
      var calculateH = function calculateH(d) {
        return h - y(d.y);
      };

      var mouseover = function mouseover(d) {
        return mouseOverHandler(d, _d.event);
      };
      var mouseout = function mouseout(d) {
        return mouseOutHandler(d, _d.event);
      };
      var mousemove = function mousemove(d) {
        return mouseMoveHandler(d, _d.event);
      };
      var click = function click(d) {
        return clickHandler(d, _d.event);
      };

      var group = root.selectAll('rect') // '.bar'
      .data(data);

      group.enter().append('rect').attr('class', 'bar').style('fill', calculateFill).attr('x', calculateX).attr('y', calculateY).attr('width', calculateW).attr('height', calculateH).on('mouseover', mouseover).on('mouseout', mouseout).on('mousemove', mousemove).on('click', click);

      group.exit().remove();
    }
  }, {
    key: 'createLinePath',
    value: function createLinePath(_ref7) {
      var _this4 = this;

      var root = _ref7.root;
      var h = _ref7.h;
      var x = _ref7.x;
      var _props5 = this.props;
      var lineData = _props5.lineData;
      var xType = _props5.xType;
      var y2Type = _props5.y2Type;
      var interpolate = _props5.interpolate;
      var yDomainRange = _props5.yDomainRange;


      var parseDate = function parseDate(v) {
        return _this4.parseDate(v);
      };

      var y = this.createDomainRangeGenerator('y', yDomainRange, lineData, y2Type, h);

      var yValue = (0, _shared.createValueGenerator)('y', y2Type, parseDate);
      var xValue = (0, _shared.createValueGenerator)('x', xType, parseDate);

      var linePath = _d.svg.line().interpolate(interpolate).x(function (d) {
        return x(xValue(d));
      }).y(function (d) {
        return y(yValue(d));
      });

      root.append('path').datum(lineData).attr('class', 'line').attr('style', 'stroke: red').attr('d', linePath);
    }
  }, {
    key: 'createStyle',
    value: function createStyle() {
      var _props6 = this.props;
      var style = _props6.style;
      var yAxisOrientRight = _props6.yAxisOrientRight;
      var grid = _props6.grid;


      var uid = this.uid;
      var scope = '.bar-chart-' + uid;
      var axisStyles = (0, _shared.getAxisStyles)(grid, false, yAxisOrientRight);
      var rules = (0, _lodash2.default)({}, _shared.defaultStyles, style, axisStyles);

      return _react2.default.createElement(_radium.Style, {
        scopeSelector: scope,
        rules: rules
      });
    }
  }, {
    key: 'hasLineData',
    value: function hasLineData() {
      var lineData = this.props.lineData;


      return lineData.length > 0;
    }
  }, {
    key: 'parseDate',
    value: function parseDate(v) {
      var datePattern = this.props.datePattern;


      var datePatternParser = dateParser[datePattern] || (dateParser[datePattern] = (0, _d3TimeFormat.timeParse)(datePattern));

      return datePatternParser(v);
    }
  }, {
    key: 'calculateChartParameters',
    value: function calculateChartParameters() {
      var _props7 = this.props;
      var data = _props7.data;
      var axes = _props7.axes;
      var xType = _props7.xType;
      var yType = _props7.yType;
      var yAxisOrientRight = _props7.yAxisOrientRight;
      var xDomainRange = _props7.xDomainRange;
      var yDomainRange = _props7.yDomainRange;
      var margin = _props7.margin;
      var width = _props7.width;
      var height = _props7.height;


      var hasLineData = this.hasLineData();
      var m = (0, _shared.calculateMargin)(axes, margin, yAxisOrientRight, hasLineData);
      var w = (0, _shared.reduce)(width, m.left, m.right);
      var h = (0, _shared.reduce)(height, m.top, m.bottom);
      var x = this.createDomainRangeGenerator('x', xDomainRange, data, xType, w);
      var y = this.createDomainRangeGenerator('y', yDomainRange, data, yType, h);

      var node = this.createSvgNode({ m: m, w: w, h: h });
      var root = this.createSvgRoot({ node: node, m: m });

      return {
        m: m,
        w: w,
        h: h,
        x: x,
        y: y,
        node: node,
        root: root
      };
    }
  }, {
    key: 'render',
    value: function render() {
      var axes = this.props.axes;


      var hasLineData = this.hasLineData();
      var p = this.calculateChartParameters();

      if (axes) {
        this.createXAxis(p);

        this.createYAxis(p); // const yAxis = this.createYAxis(p);

        if (hasLineData) {
          this.createYAxis2(p); // { ...p, yAxis });
        }
      }

      this.createBarChart(p);

      if (hasLineData) {
        this.createLinePath(p);
      }

      var uid = this.uid;
      var className = 'bar-chart-' + uid;
      var node = p.node;


      return _react2.default.createElement(
        'div',
        { ref: 'barChart', className: className },
        this.createStyle(),
        node.toReact()
      );
    }
  }]);
  return BarChart;
}(_react2.default.Component);

exports.default = BarChart;
module.exports = exports['default'];
//# sourceMappingURL=index.js.map