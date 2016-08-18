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

var _d3TimeFormat = require('d3-time-format');

var _d3Array = require('d3-array');

var _reactFauxDom = require('react-faux-dom');

var _radium = require('radium');

var _lodash = require('lodash.merge');

var _lodash2 = _interopRequireDefault(_lodash);

var _shared = require('../../shared');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dateParser = {};

var color = _d.scale.category20();

var axisMargin = 18;

var ScatterplotChart = function (_React$Component) {
  (0, _inherits3.default)(ScatterplotChart, _React$Component);
  (0, _createClass3.default)(ScatterplotChart, null, [{
    key: 'propTypes',
    get: function get() {
      return {
        axes: _react2.default.PropTypes.bool,
        axisLabels: _react2.default.PropTypes.shape({
          x: _react2.default.PropTypes.string,
          y: _react2.default.PropTypes.string
        }),
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
        xTicks: _react2.default.PropTypes.number,
        yTicks: _react2.default.PropTypes.number,
        xType: _react2.default.PropTypes.string,
        yType: _react2.default.PropTypes.string
      };
    }
  }, {
    key: 'defaultProps',
    get: function get() {
      return {
        axes: false,
        axisLabels: {
          x: '',
          y: ''
        },
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
    (0, _classCallCheck3.default)(this, ScatterplotChart);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ScatterplotChart).call(this, props));

    _this.uid = (0, _shared.createUniqueID)(props);
    return _this;
  }

  (0, _createClass3.default)(ScatterplotChart, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var ref = this.refs.scatterplotChart;
      (0, _shared.createCircularTicks)(ref);
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      var ref = this.refs.scatterplotChart;
      (0, _shared.createCircularTicks)(ref);
    }
  }, {
    key: 'getScale',
    value: function getScale(type) {
      switch (type) {
        case 'time':
          return _d.time.scale();
        case 'text':
          return (0, _d3Scale.scalePoint)();
        default:
          return (0, _d3Scale.scaleLinear)();
      }
    }
  }, {
    key: 'getDataConfig',
    value: function getDataConfig(type) {
      var config = this.props.config;


      var index = config.findIndex(function (item) {
        return item.type === type;
      });
      return config[index];
    }
  }, {
    key: 'getFill',
    value: function getFill(data) {
      var configItem = this.getDataConfig(data.type);
      return configItem ? configItem.color : color(data.type);
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
      return configItem ? configItem.stroke : 'none'; // typeof configItem !== 'undefined' ? configItem.stroke : 'none';
    }
  }, {
    key: 'createDomainRangeGenerator',
    value: function createDomainRangeGenerator(axisType, domainRange, data, type, length, yAxisOrientRight) {
      var _this2 = this;

      var dataIndex = axisType === 'x' ? 'x' : 'y';

      var axis = void 0;
      var minAmount = void 0;
      var maxAmount = void 0;

      var parseDate = function parseDate(v) {
        return _this2.parseDate(v);
      };

      switch (type) {
        case 'text':
          axis = (0, _d3Scale.scalePoint)();
          axis.domain(data.map(function (d) {
            return d[dataIndex];
          })) // , 1)
          .range([0, length]).padding(1);
          break;
        case 'linear':
          axis = (0, _d3Scale.scaleLinear)();
          minAmount = (0, _d.min)(data, function (d) {
            return d[dataIndex];
          });
          maxAmount = (0, _d.max)(data, function (d) {
            return d[dataIndex];
          });
          if (domainRange) {
            axis.domain(domainRange); // calculateDomainRange(domainRange, type, parseDate));
          } else {
            // set initial domain
            axis.domain([minAmount, maxAmount]);
            // calculate 1 tick offset
            var ticks = axis.ticks();

            minAmount = yAxisOrientRight && axisType === 'x' ? minAmount : minAmount - (ticks[1] - ticks[0]);

            maxAmount = yAxisOrientRight && axisType === 'x' ? maxAmount + (ticks[1] - ticks[0]) : maxAmount;

            axis.domain([minAmount, maxAmount]);
          }
          axis.range(axisType === 'x' ? [0, length] : [length, 0]);
          break;
        case 'time':
          axis = _d.time.scale();
          axis.domain(domainRange ? (0, _shared.calculateDomainRange)(domainRange) : (0, _d3Array.extent)(data, function (d) {
            return parseDate(d[dataIndex]);
          })).range(axisType === 'x' ? [0, length] : [length, 0]);
          break;
        default:
          break;
      }
      return axis;
    }
  }, {
    key: 'calculateMargin',
    value: function calculateMargin(axes, spacer, yAxisOrientRight) {
      if (yAxisOrientRight) {
        return axes ? { top: 24, right: 48, bottom: 24, left: 24 } : { top: spacer, right: spacer, bottom: spacer, left: spacer };
      }
      return axes ? { top: 24, right: 24, bottom: 24, left: 48 } : { top: spacer, right: spacer, bottom: spacer, left: spacer };
    }
  }, {
    key: 'calculateInnerW',
    value: function calculateInnerW(w, m) {
      return w - (m.left + m.right);
    }
  }, {
    key: 'calculateInnerH',
    value: function calculateInnerH(h, m) {
      var dotRadius = this.props.dotRadius;


      return h - (m.top + m.bottom + dotRadius * 2);
    }
  }, {
    key: 'calculateXAxis',
    value: function calculateXAxis(_ref) {
      var h = _ref.h;
      var x = _ref.x;
      var _props = this.props;
      var xType = _props.xType;
      var tickTimeDisplayFormat = _props.tickTimeDisplayFormat;
      var xTickNumber = _props.xTickNumber;
      var grid = _props.grid;
      var verticalGrid = _props.verticalGrid;
      var xTicks = _props.xTicks;


      var axis = _d.svg.axis().scale(x).orient('bottom');

      if (xType === 'time' && tickTimeDisplayFormat) {
        axis.tickFormat(_d.time.format(tickTimeDisplayFormat));
      }

      if (xTickNumber) {
        axis.ticks(xTickNumber);
      }

      if (grid && verticalGrid) {
        axis.tickSize(-h, 6).tickPadding(15);
      } else {
        axis.tickSize(0).tickPadding(15);
      }

      if (xTicks) {
        axis.ticks(xTicks);
      }

      return axis;
    }
  }, {
    key: 'calculateYAxis',
    value: function calculateYAxis(_ref2) {
      var y = _ref2.y;
      var innerW = _ref2.innerW;
      var _props2 = this.props;
      var grid = _props2.grid;
      var yTicks = _props2.yTicks;
      var yAxisOrientRight = _props2.yAxisOrientRight;


      var axis = _d.svg.axis().scale(y).orient(yAxisOrientRight ? 'right' : 'left');

      if (grid) {
        axis.tickSize(-innerW, 6).tickPadding(12);
      } else {
        axis.tickPadding(10);
      }

      if (yTicks) {
        axis.ticks(yTicks);
      }

      return axis;
    }
  }, {
    key: 'createSvgNode',
    value: function createSvgNode(_ref3) {
      var m = _ref3.m;
      var w = _ref3.w;
      var h = _ref3.h;

      var node = (0, _reactFauxDom.createElement)('svg');
      node.setAttribute('width', w + m.left + m.right);
      node.setAttribute('height', h + m.top + m.bottom);
      return node;
    }
  }, {
    key: 'createSvgRoot',
    value: function createSvgRoot(_ref4) {
      var node = _ref4.node;
      var m = _ref4.m;

      return (0, _d.select)(node).append('g').attr('transform', 'translate(' + m.left + ', ' + m.top + ')');
    }
  }, {
    key: 'createXAxis',
    value: function createXAxis(_ref5) {
      var m = _ref5.m;
      var innerW = _ref5.innerW;
      var innerH = _ref5.innerH;
      var xAxis = _ref5.xAxis;
      var root = _ref5.root;
      var _props3 = this.props;
      var yAxisOrientRight = _props3.yAxisOrientRight;
      var label = _props3.axisLabels.x;


      var group = root.append('g').attr('class', 'x axis').attr('transform', 'translate(0, ' + innerH + ')');

      group.call(xAxis);

      if (label) {
        group.append('text').attr('class', 'label').attr('x', yAxisOrientRight ? 0 : innerW).attr('y', m.bottom + axisMargin).style('text-anchor', yAxisOrientRight ? 'start' : 'end').text(label);
      }
    }
  }, {
    key: 'createYAxis',
    value: function createYAxis(_ref6) {
      var m = _ref6.m;
      var innerW = _ref6.innerW;
      var yAxis = _ref6.yAxis;
      var root = _ref6.root;
      var _props4 = this.props;
      var yAxisOrientRight = _props4.yAxisOrientRight;
      var label = _props4.axisLabels.y;


      var group = root.append('g').attr('class', 'y axis').attr('transform', yAxisOrientRight ? 'translate(' + innerW + ', 0)' : 'translate(0, 0)');

      group.call(yAxis);

      if (label) {
        group.append('text').attr('class', 'label').attr('transform', 'rotate(-90)').attr('y', yAxisOrientRight ? -25 + m.right : 10 - m.left).attr('dy', '.71em').style('text-anchor', 'end').text(label);
      }
    }
  }, {
    key: 'createScatterplotChart',
    value: function createScatterplotChart(_ref7) {
      var _this3 = this;

      var x = _ref7.x;
      var y = _ref7.y;
      var root = _ref7.root;
      var _props5 = this.props;
      var data = _props5.data;
      var dotRadius = _props5.dotRadius;
      var xType = _props5.xType;
      var mouseOverHandler = _props5.mouseOverHandler;
      var mouseOutHandler = _props5.mouseOutHandler;
      var mouseMoveHandler = _props5.mouseMoveHandler;
      var clickHandler = _props5.clickHandler;


      var calculateDate = function calculateDate(v) {
        return _this3.parseDate(v);
      };

      var calculateR = function calculateR(d) {
        return _this3.getRadius(data, d, dotRadius);
      };
      var calculateCX = function calculateCX(d) {
        return xType === 'time' ? x(calculateDate(d.x)) : x(d.x);
      };
      var calculateCY = function calculateCY(d) {
        return y(d.y);
      };

      var getFill = function getFill(d) {
        return _this3.getFill(d);
      };
      var getStroke = function getStroke(d) {
        return _this3.getStroke(d);
      };

      var mouseOver = function mouseOver(d) {
        return mouseOverHandler(d, _d.event);
      };
      var mouseOut = function mouseOut(d) {
        return mouseOutHandler(d, _d.event);
      };
      var mouseMove = function mouseMove(d) {
        return mouseMoveHandler(d, _d.event);
      };
      var click = function click(d) {
        return clickHandler(d, _d.event);
      };

      var circle = root.append('g').selectAll('circle') // '.dot'
      .data(data);

      circle.enter().append('circle').attr('class', 'dot').attr('r', calculateR).attr('cx', calculateCX).attr('cy', calculateCY).style('fill', getFill).style('stroke', getStroke).on('mouseover', mouseOver).on('mouseout', mouseOut).on('mousemove', mouseMove).on('click', click);

      circle.exit().remove();
    }
  }, {
    key: 'createStyle',
    value: function createStyle() {
      var _props6 = this.props;
      var style = _props6.style;
      var grid = _props6.grid;
      var verticalGrid = _props6.verticalGrid;
      var yAxisOrientRight = _props6.yAxisOrientRight;


      var uid = this.uid;
      var scope = '.scatterplot-chart-' + uid;
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
      var _this4 = this;

      var _props7 = this.props;
      var axes = _props7.axes;
      var data = _props7.data;
      var margin = _props7.margin;
      var width = _props7.width;
      var height = _props7.height;
      var dotRadius = _props7.dotRadius;
      var xType = _props7.xType;
      var yType = _props7.yType;
      var xDomainRange = _props7.xDomainRange;
      var yDomainRange = _props7.yDomainRange;
      var yAxisOrientRight = _props7.yAxisOrientRight;

      /*
       * We could "bind"!
       */

      var parseDate = function parseDate(v) {
        return _this4.parseDate(v);
      };

      var m = margin || this.calculateMargin(axes, dotRadius * 2, yAxisOrientRight);
      var w = width;
      var h = height + dotRadius * 3;

      var innerW = this.calculateInnerW(width, m);
      var innerH = this.calculateInnerH(height, m);

      var defaultXDomainRange = (0, _shared.calculateDomainRange)(xDomainRange, xType, parseDate);
      var defaultYDomainRange = (0, _shared.calculateDomainRange)(yDomainRange, yType, parseDate);

      var x = this.createDomainRangeGenerator('x', defaultXDomainRange, data, xType, innerW, yAxisOrientRight);
      var y = this.createDomainRangeGenerator('y', defaultYDomainRange, data, yType, innerH, yAxisOrientRight);

      var xAxis = this.calculateXAxis({ m: m, h: h, x: x, innerW: innerW });
      var yAxis = this.calculateYAxis({ m: m, y: y, innerW: innerW });

      var node = this.createSvgNode({ m: m, w: w, h: h });
      var root = this.createSvgRoot({ node: node, m: m });

      return {
        m: m,
        w: w,
        h: h,
        innerW: innerW,
        innerH: innerH,
        x: x,
        y: y,
        xAxis: xAxis,
        yAxis: yAxis,
        node: node,
        root: root
      };
    }
  }, {
    key: 'render',
    value: function render() {
      var axes = this.props.axes;


      var p = this.calculateChartParameters();

      if (axes) {
        this.createXAxis(p);

        this.createYAxis(p);
      }

      this.createScatterplotChart(p);

      var uid = this.uid;
      var className = 'scatterplot-chart-' + uid;
      var node = p.node;


      return _react2.default.createElement(
        'div',
        { ref: 'scatterplotChart', className: className },
        this.createStyle(),
        node.toReact()
      );
    }
  }]);
  return ScatterplotChart;
}(_react2.default.Component);

exports.default = ScatterplotChart;
module.exports = exports['default'];
//# sourceMappingURL=index.js.map