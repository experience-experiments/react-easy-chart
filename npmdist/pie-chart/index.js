'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _d = require('d3');

var _shared = require('../shared');

var _reactFauxDom = require('react-faux-dom');

var _radium = require('radium');

var _lodash = require('lodash.merge');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PieChart = function (_React$Component) {
  _inherits(PieChart, _React$Component);

  _createClass(PieChart, null, [{
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
        size: 400,
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

  function PieChart(props) {
    _classCallCheck(this, PieChart);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(PieChart).call(this, props));

    _this.uid = Math.floor(Math.random() * new Date().getTime());
    _this.color = _d.scale.category20();
    _this.path = null;
    _this.text = null;
    _this.pie = _d.layout.pie().value(function (d) {
      return d.value;
    }).sort(null);
    _this.current = [];
    _this.currentTxt = [];
    return _this;
  }

  _createClass(PieChart, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.draw();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.update();
    }
  }, {
    key: 'getArc',
    value: function getArc() {
      return _d.svg.arc().innerRadius(this.getInnerRadius() - this.props.padding).outerRadius(this.getRadius() - this.props.padding);
    }
  }, {
    key: 'getLabelArc',
    value: function getLabelArc() {
      return _d.svg.arc().outerRadius(this.getRadius() - this.props.padding - 20 * this.getRadius() / 100).innerRadius(this.getRadius() - this.props.padding - 20 * this.getRadius() / 100);
    }
  }, {
    key: 'getRadius',
    value: function getRadius() {
      return this.props.size * 0.5;
    }
  }, {
    key: 'getInnerRadius',
    value: function getInnerRadius() {
      return this.props.innerHoleSize * 0.5;
    }
  }, {
    key: 'draw',
    value: function draw() {
      var _this2 = this;

      this.path = (0, _d.select)('#pie_' + this.uid).selectAll('path').data(this.pie(this.props.data)).enter().append('path').attr('fill', function (d, i) {
        return d.data.color ? d.data.color : _this2.color(i);
      }).attr('d', this.getArc()).attr('class', 'pie_chart_lines').on('mouseover', function (d) {
        return _this2.props.mouseOverHandler(d, _d.event);
      }).on('mouseout', function (d) {
        return _this2.props.mouseOutHandler(d, _d.event);
      }).on('mousemove', function () {
        return _this2.props.mouseMoveHandler(_d.event);
      }).on('click', function (d) {
        return _this2.props.clickHandler(d, _d.event);
      }).each(function (d) {
        _this2.current.push(d);
      });
      if (this.props.labels) {
        this.text = (0, _d.select)('#labels_' + this.uid).selectAll('text').data(this.pie(this.props.data)).enter().append('text').attr('transform', function (d) {
          return 'translate(' + _this2.getLabelArc().centroid(d) + ')';
        }).attr('dy', '.35em').attr('class', 'pie_chart_text').text(function (d) {
          return d.data.key;
        }).each(function (d) {
          _this2.currentTxt.push(d);
        });
      }
    }
  }, {
    key: 'update',
    value: function update() {
      var _this3 = this;

      this.path.data(this.pie(this.props.data)).transition().duration(750).attrTween('d', this.tween.bind(this));
      if (this.props.labels) {
        this.text.data(this.pie(this.props.data)).transition().duration(750).attr('transform', function (d) {
          return 'translate(' + _this3.getLabelArc().centroid(d) + ')';
        });
      }
    }
  }, {
    key: 'tween',
    value: function tween(a, index) {
      var _this4 = this;

      var cur = this.current[index];
      var i = (0, _d.interpolate)(cur, a);
      this.current[index] = a;
      return function (t) {
        return _this4.getArc()(i(t));
      };
    }
  }, {
    key: 'render',
    value: function render() {
      var node = (0, _reactFauxDom.createElement)('svg');
      (0, _d.select)(node).attr('width', this.props.size).attr('height', this.props.size).append('g').attr('id', 'pie_' + this.uid).attr('transform', 'translate(' + this.getRadius() + ', ' + this.getRadius() + ')');
      (0, _d.select)(node).attr('width', this.props.size).attr('height', this.props.size).append('g').attr('id', 'labels_' + this.uid).attr('transform', 'translate(' + this.getRadius() + ', ' + this.getRadius() + ')');

      var uid = Math.floor(Math.random() * new Date().getTime());

      return _react2.default.createElement(
        'div',
        { className: 'pie_chart' + uid },
        _react2.default.createElement(_radium.Style, {
          scopeSelector: '.pie_chart' + uid,
          rules: (0, _lodash2.default)({}, _shared.defaultStyle, this.props.styles)
        }),
        node.toReact()
      );
    }
  }]);

  return PieChart;
}(_react2.default.Component);

exports.default = PieChart;
module.exports = exports['default'];
//# sourceMappingURL=index.js.map