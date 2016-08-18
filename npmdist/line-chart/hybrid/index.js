'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _common = require('./LineChart/common');

var _radium = require('radium');

var _lodash = require('lodash.merge');

var _lodash2 = _interopRequireDefault(_lodash);

var _LineChart = require('./LineChart');

var _LineChart2 = _interopRequireDefault(_LineChart);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LineChart = function (_React$Component) {
  (0, _inherits3.default)(LineChart, _React$Component);

  function LineChart(props) {
    (0, _classCallCheck3.default)(this, LineChart);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(LineChart).call(this, props));

    _this.uid = (0, _common.createUniqueID)();
    return _this;
  }

  (0, _createClass3.default)(LineChart, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var chart = this.refs.chart;


      var props = this.props;

      _LineChart2.default.initialise(chart, props);
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      var chart = this.refs.chart;


      var props = this.props;

      _LineChart2.default.transition(chart, props);
    }
  }, {
    key: 'createStyle',
    value: function createStyle() {
      var _props = this.props;
      var style = _props.style;
      var grid = _props.grid;
      var vGrid = _props.vGrid;
      var hGrid = _props.hGrid;
      var orient = _props.orient;


      var uid = this.uid;
      var scope = '.line-chart-' + uid;
      var defaultAxisStyles = (0, _common.getDefaultAxisStyles)(vGrid || grid, hGrid || grid, orient);
      var rules = (0, _lodash2.default)({}, _common.defaultStyles, style, defaultAxisStyles);

      return _react2.default.createElement(_radium.Style, {
        scopeSelector: scope,
        rules: rules
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props;
      var width = _props2.width;
      var height = _props2.height;


      var uid = this.uid;
      var className = 'line-chart-' + uid;

      return _react2.default.createElement(
        'div',
        { ref: 'lineChart', className: className },
        this.createStyle(),
        _react2.default.createElement('svg', { ref: 'chart', width: width, height: height })
      );
    }
  }]);
  return LineChart;
}(_react2.default.Component);

exports.default = LineChart;


LineChart.propTypes = {
  data: _react2.default.PropTypes.array.isRequired,
  axes: _react2.default.PropTypes.bool,
  grid: _react2.default.PropTypes.bool,
  hGrid: _react2.default.PropTypes.bool,
  vGrid: _react2.default.PropTypes.bool,
  type: _react2.default.PropTypes.string,
  xType: _react2.default.PropTypes.string,
  yType: _react2.default.PropTypes.string,
  interpolate: _react2.default.PropTypes.string,
  margin: _react2.default.PropTypes.shape({
    top: _react2.default.PropTypes.number,
    right: _react2.default.PropTypes.number,
    bottom: _react2.default.PropTypes.number,
    left: _react2.default.PropTypes.number
  }),
  width: _react2.default.PropTypes.number,
  height: _react2.default.PropTypes.number,
  orient: _react2.default.PropTypes.string,
  colors: _react2.default.PropTypes.array,
  strokeWidth: _react2.default.PropTypes.number,
  stroke: _react2.default.PropTypes.object,
  style: _react2.default.PropTypes.object,
  xLabel: _react2.default.PropTypes.string,
  yLabel: _react2.default.PropTypes.string,
  xDomain: _react2.default.PropTypes.array,
  yDomain: _react2.default.PropTypes.array,
  pattern: _react2.default.PropTypes.string,
  xPattern: _react2.default.PropTypes.string,
  yPattern: _react2.default.PropTypes.string
};

LineChart.defaultProps = {
  type: 'linear',
  xType: 'linear',
  yType: 'linear',
  interpolate: 'linear',
  margin: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  orient: 'left',
  colors: [],
  strokeWidth: 2,
  style: {}
};
module.exports = exports['default'];
//# sourceMappingURL=index.js.map