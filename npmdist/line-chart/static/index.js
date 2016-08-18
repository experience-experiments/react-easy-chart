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

var _reactFauxDom = require('react-faux-dom');

var _d = require('d3');

var _shared = require('../../shared');

var _radium = require('radium');

var _lodash = require('lodash.merge');

var _lodash2 = _interopRequireDefault(_lodash);

var _d3TimeFormat = require('d3-time-format');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dateParser = {};

var LineChart = function (_React$Component) {
  (0, _inherits3.default)(LineChart, _React$Component);
  (0, _createClass3.default)(LineChart, null, [{
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
        tickTimeDisplayFormat: _react2.default.PropTypes.string,
        yTicks: _react2.default.PropTypes.number,
        xTicks: _react2.default.PropTypes.number,
        dataPoints: _react2.default.PropTypes.bool,
        lineColors: _react2.default.PropTypes.array,
        axisLabels: _react2.default.PropTypes.shape({
          x: _react2.default.PropTypes.string,
          y: _react2.default.PropTypes.string
        }),
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
        axisLabels: {
          x: '',
          y: ''
        },
        mouseOverHandler: function mouseOverHandler() {},
        mouseOutHandler: function mouseOutHandler() {},
        mouseMoveHandler: function mouseMoveHandler() {},
        clickHandler: function clickHandler() {}
      };
    }
  }]);

  function LineChart(props) {
    (0, _classCallCheck3.default)(this, LineChart);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(LineChart).call(this, props));

    _this.uid = (0, _shared.createUniqueID)();
    return _this;
  }

  (0, _createClass3.default)(LineChart, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var lineChart = this.refs.lineChart;
      (0, _shared.createCircularTicks)(lineChart);
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      var lineChart = this.refs.lineChart;
      (0, _shared.createCircularTicks)(lineChart);
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
      var xType = _props.xType;
      var label = _props.axisLabels.x;
      var xTicks = _props.xTicks;
      var grid = _props.grid;
      var verticalGrid = _props.verticalGrid;
      var tickTimeDisplayFormat = _props.tickTimeDisplayFormat;
      var yAxisOrientRight = _props.yAxisOrientRight;


      var axis = _d.svg.axis().scale(x).orient('bottom');

      if (xType === 'time' && tickTimeDisplayFormat) {
        axis.tickFormat(_d.time.format(tickTimeDisplayFormat));
      }

      if (grid && verticalGrid) {
        axis.tickSize(-h, 6).tickPadding(10);
      } else {
        axis.tickSize(0, 6).tickPadding(16); // wut
      }

      if (xTicks) {
        axis.ticks(xTicks);
      }

      var group = root.append('g').attr('class', 'x axis').attr('transform', 'translate(0, ' + h + ')');

      group.call(axis);

      if (label) {
        group.append('text').attr('class', 'label').attr('x', yAxisOrientRight ? 0 : w).attr('y', m.bottom - m.top).attr('dx', yAxisOrientRight ? '0em' : '-.175em').attr('dy', '-.175em').style('dominant-baseline', 'ideographic').style('text-anchor', yAxisOrientRight ? 'start' : 'end').text(label);
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
      var yType = _props2.yType;
      var label = _props2.axisLabels.y;
      var yTicks = _props2.yTicks;
      var grid = _props2.grid;
      var tickTimeDisplayFormat = _props2.tickTimeDisplayFormat;
      var yAxisOrientRight = _props2.yAxisOrientRight;


      var axis = _d.svg.axis().scale(y).orient(yAxisOrientRight ? 'right' : 'left');

      if (yType === 'time' && tickTimeDisplayFormat) {
        axis.tickFormat(_d.time.format(tickTimeDisplayFormat));
      }

      if (grid) {
        axis.tickSize(-w, 6).tickPadding(10);
      } else {
        axis.tickSize(0, 6).tickPadding(16); // wut
      }

      if (yTicks) {
        axis.ticks(yTicks);
      }

      var group = root.append('g').attr('class', 'y axis').attr('transform', yAxisOrientRight ? 'translate(' + w + ', 0)' : 'translate(0, 0)');

      group.call(axis);

      if (label) {
        group.append('text').attr('class', 'label').attr('transform', 'rotate(-90)').attr('x', 0).attr('y', yAxisOrientRight ? +m.right - m.left : -m.left + m.right).attr('dx', 0).attr('dy', yAxisOrientRight ? '-.175em' : '1em').style('dominant-baseline', 'ideographic').style('text-anchor', 'end').text(label);
      }
    }
  }, {
    key: 'createLinePathChart',
    value: function createLinePathChart(_ref5) {
      var root = _ref5.root;
      var x = _ref5.x;
      var y = _ref5.y;
      var xValue = _ref5.xValue;
      var yValue = _ref5.yValue;
      var colors = _ref5.colors;
      var _props3 = this.props;
      var data = _props3.data;
      var interpolate = _props3.interpolate;


      var getStroke = function getStroke(d, i) {
        return colors[i];
      };

      var linePath = _d.svg.line().interpolate(interpolate).x(function (d) {
        return x(xValue(d));
      }).y(function (d) {
        return y(yValue(d));
      });

      var group = root.append('g').attr('class', 'lineChart');

      group.selectAll('path').data(data).enter().append('path').attr('class', 'line').style('stroke', getStroke).attr('d', linePath);
    }
  }, {
    key: 'createPoints',
    value: function createPoints(_ref6) {
      var _this2 = this;

      var root = _ref6.root;
      var x = _ref6.x;
      var y = _ref6.y;
      var colors = _ref6.colors;
      var _props4 = this.props;
      var data = _props4.data;
      var xType = _props4.xType;
      var yType = _props4.yType;
      var mouseOverHandler = _props4.mouseOverHandler;
      var mouseOutHandler = _props4.mouseOutHandler;
      var mouseMoveHandler = _props4.mouseMoveHandler;
      var clickHandler = _props4.clickHandler;

      /*
       * We don't really need to do this, but it
       * avoids obscure "this" below
       */

      var calculateDate = function calculateDate(v) {
        return _this2.parseDate(v);
      };

      var getStroke = function getStroke(d, i) {
        return colors[i];
      };

      /*
       * Creating the calculation functions
       */
      var calculateCX = function calculateCX(d) {
        return xType === 'time' ? x(calculateDate(d.x)) : x(d.x);
      };
      var calculateCY = function calculateCY(d) {
        return yType === 'time' ? y(calculateDate(d.y)) : y(d.y);
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

      var group = root.append('g').attr('class', 'dataPoints');

      data.forEach(function (item) {
        item.forEach(function (d) {
          /*
           * Applying the calculation functions
           */
          group.datum(d).append('circle').attr('class', 'data-point').style('strokeWidth', '2px').style('stroke', getStroke).style('fill', 'white').attr('cx', calculateCX).attr('cy', calculateCY).on('mouseover', mouseover).on('mouseout', mouseout).on('mousemove', mousemove).on('click', click);
        });
      });
    }
  }, {
    key: 'createStyle',
    value: function createStyle() {
      var _props5 = this.props;
      var style = _props5.style;
      var grid = _props5.grid;
      var verticalGrid = _props5.verticalGrid;
      var yAxisOrientRight = _props5.yAxisOrientRight;


      var uid = this.uid;
      var scope = '.line-chart-' + uid;
      var axisStyles = (0, _shared.getAxisStyles)(grid, verticalGrid, yAxisOrientRight);
      var rules = (0, _lodash2.default)({}, _shared.defaultStyles, style, axisStyles);

      return _react2.default.createElement(_radium.Style, {
        scopeSelector: scope,
        rules: rules
      });
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
      var _this3 = this;

      var _props6 = this.props;
      var data = _props6.data;
      var axes = _props6.axes;
      var xType = _props6.xType;
      var yType = _props6.yType;
      var xDomainRange = _props6.xDomainRange;
      var yDomainRange = _props6.yDomainRange;
      var margin = _props6.margin;
      var width = _props6.width;
      var height = _props6.height;
      var lineColors = _props6.lineColors;
      var yAxisOrientRight = _props6.yAxisOrientRight;

      /*
       * We could "bind"!
       */

      var parseDate = function parseDate(v) {
        return _this3.parseDate(v);
      };

      /*
       * 'w' and 'h' are the width and height of the graph canvas
       * (excluding axes and other furniture)
       */
      var m = (0, _shared.calculateMargin)(axes, margin, yAxisOrientRight);
      var w = (0, _shared.reduce)(width, m.left, m.right);
      var h = (0, _shared.reduce)(height, m.top, m.bottom);

      var x = (0, _shared.createDomainRangeGenerator)('x', xDomainRange, data, xType, w, parseDate);
      var y = (0, _shared.createDomainRangeGenerator)('y', yDomainRange, data, yType, h, parseDate);

      var xValue = (0, _shared.createValueGenerator)('x', xType, parseDate);
      var yValue = (0, _shared.createValueGenerator)('y', yType, parseDate);

      var colors = lineColors.concat(_shared.defaultColors);

      var node = this.createSvgNode({ m: m, w: w, h: h });
      var root = this.createSvgRoot({ node: node, m: m });

      return {
        m: m,
        w: w,
        h: h,
        x: x,
        y: y,
        xValue: xValue,
        yValue: yValue,
        colors: colors,
        node: node,
        root: root
      };
    }
  }, {
    key: 'render',
    value: function render() {
      var _props7 = this.props;
      var axes = _props7.axes;
      var dataPoints = _props7.dataPoints;


      var p = this.calculateChartParameters();

      if (axes) {
        this.createXAxis(p);

        this.createYAxis(p);
      }

      this.createLinePathChart(p);

      if (dataPoints) {
        this.createPoints(p);
      }

      var uid = this.uid;
      var className = 'line-chart-' + uid;
      var node = p.node;


      return _react2.default.createElement(
        'div',
        { ref: 'lineChart', className: className },
        this.createStyle(),
        node.toReact()
      );
    }
  }]);
  return LineChart;
}(_react2.default.Component);

exports.default = LineChart;
module.exports = exports['default'];
//# sourceMappingURL=index.js.map