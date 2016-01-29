'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _d = require('d3');

var _reactFauxDom = require('react-faux-dom');

var _radium = require('radium');

var _lodash = require('lodash.merge');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var defaultStyles = {
  '.chart_lines': {
    stroke: '#fff',
    strokeWidth: 1
  },
  '.chart_text': {
    fontFamily: 'sans-serif',
    fontSize: '12px',
    textAnchor: 'middle',
    fill: '#fff'
  }
};

var PieChart = function (_React$Component) {
  _inherits(PieChart, _React$Component);

  function PieChart() {
    _classCallCheck(this, PieChart);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(PieChart).apply(this, arguments));
  }

  _createClass(PieChart, [{
    key: 'render',
    value: function render() {
      var _props = this.props;
      var mouseOverHandler = _props.mouseOverHandler;
      var mouseOutHandler = _props.mouseOutHandler;
      var mouseMoveHandler = _props.mouseMoveHandler;
      var clickHandler = _props.clickHandler;
      var styles = _props.styles;
      var innerHoleSize = _props.innerHoleSize;
      var size = _props.size;
      var padding = _props.padding;
      var labels = _props.labels;

      var outerRadius = size / 2;
      var arc = _d.svg.arc().outerRadius(outerRadius - padding).innerRadius(innerHoleSize / 2 - padding);

      var labelArc = _d.svg.arc().outerRadius(outerRadius - padding - 20 * outerRadius / 100).innerRadius(outerRadius - padding - 20 * outerRadius / 100);

      var color = _d.scale.category20();
      var node = (0, _reactFauxDom.createElement)('svg');

      var svgNode = (0, _d.select)(node).attr('width', size).attr('height', size).append('g').attr('transform', 'translate(' + outerRadius + ', ' + outerRadius + ')');

      var g = svgNode.selectAll('.arc').data(_d.layout.pie().value(function (d) {
        return d.value;
      })(this.props.data)).enter().append('g');

      g.append('path').attr('d', arc).attr('class', 'chart_lines').style('fill', function (d, i) {
        return d.data.color ? d.data.color : color(i);
      }).on('mouseover', function (d) {
        return mouseOverHandler(d, _d.event);
      }).on('mouseout', function (d) {
        return mouseOutHandler(d, _d.event);
      }).on('mousemove', function () {
        return mouseMoveHandler(_d.event);
      }).on('click', function (d) {
        return clickHandler(d, _d.event);
      });

      if (labels) {
        g.append('text').attr('transform', function (d) {
          return 'translate(' + labelArc.centroid(d) + ')';
        }).text(function (d) {
          return d.data.key;
        }).attr('class', 'chart_text').on('click', function (d) {
          return clickHandler(d, _d.event);
        });
      }
      var uid = Math.floor(Math.random() * new Date().getTime());

      return _react2.default.createElement(
        'div',
        { className: 'pie_chart' + uid },
        _react2.default.createElement(_radium.Style, { scopeSelector: '.pie_chart' + uid, rules: (0, _lodash2.default)({}, defaultStyles, styles) }),
        node.toReact()
      );
    }
  }], [{
    key: 'propTypes',
    get: function get() {
      return {
        data: _react2.default.PropTypes.array.isRequired,
        innerHoleSize: _react2.default.PropTypes.number,
        size: _react2.default.PropTypes.number,
        padding: _react2.default.PropTypes.number,
        labels: _react2.default.PropTypes.bool,
        styles: _react2.default.PropTypes.object,
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
        size: 200,
        innerHoleSize: 0,
        padding: 2,
        labels: false,
        styles: {},
        mouseOverHandler: function mouseOverHandler() {},
        mouseOutHandler: function mouseOutHandler() {},
        mouseMoveHandler: function mouseMoveHandler() {},
        clickHandler: function clickHandler() {}
      };
    }
  }]);

  return PieChart;
}(_react2.default.Component);

exports.default = PieChart;
module.exports = exports['default'];
//# sourceMappingURL=index.js.map