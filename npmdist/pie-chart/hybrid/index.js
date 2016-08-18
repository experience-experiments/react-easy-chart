'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

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

var _d = require('d3');

var _shared = require('../../shared');

var _reactFauxDom = require('react-faux-dom');

var _radium = require('radium');

var _lodash = require('lodash.merge');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var color = _d.scale.category20();
var pie = _d.layout.pie().value(function (d) {
  return d.value;
}).sort(null);

var getSliceFill = function getSliceFill(d, i) {
  return d.data.color ? d.data.color : color(i);
};

var getLabelText = function getLabelText(d) {
  return d.data.key;
};

var PieChart = function (_React$Component) {
  (0, _inherits3.default)(PieChart, _React$Component);
  (0, _createClass3.default)(PieChart, null, [{
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
    (0, _classCallCheck3.default)(this, PieChart);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(PieChart).call(this, props));

    _this.uid = (0, _shared.createUniqueID)(props);
    _this.currentSlices = [];
    _this.currentLabels = [];
    _this.tweenSlice = function (slice, index) {
      var currentSlice = _this.currentSlices[index];
      var i = (0, _d.interpolate)(currentSlice, slice);
      _this.currentSlices[index] = slice;
      return function (t) {
        return _this.getSliceArc()(i(t));
      };
    };
    return _this;
  }

  (0, _createClass3.default)(PieChart, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.initialise();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.transition();
    }
  }, {
    key: 'getSliceArc',
    value: function getSliceArc() {
      var padding = this.props.padding;


      var innerRadius = this.getInnerRadius();
      var outerRadius = this.getOuterRadius();

      return _d.svg.arc().innerRadius(innerRadius - padding).outerRadius(outerRadius - padding);
    }
  }, {
    key: 'getLabelArc',
    value: function getLabelArc() {
      var padding = this.props.padding;


      var outerRadius = this.getOuterRadius();
      var radius = outerRadius - padding - 20 * outerRadius / 100;

      return _d.svg.arc().outerRadius(radius).innerRadius(radius);
    }
  }, {
    key: 'getOuterRadius',
    value: function getOuterRadius() {
      return this.props.size * 0.5;
    }
  }, {
    key: 'getInnerRadius',
    value: function getInnerRadius() {
      return this.props.innerHoleSize * 0.5;
    }
  }, {
    key: 'getSlices',
    value: function getSlices() {
      var data = this.props.data;


      var uid = this.uid;

      return (0, _d.select)('#slices-' + uid).datum(data).selectAll('path');
    }
  }, {
    key: 'getLabels',
    value: function getLabels() {
      var data = this.props.data;


      var uid = this.uid;

      return (0, _d.select)('#labels-' + uid).datum(data).selectAll('text');
    }
  }, {
    key: 'createSvgNode',
    value: function createSvgNode(_ref) {
      var size = _ref.size;

      var node = (0, _reactFauxDom.createElement)('svg');
      node.setAttribute('width', size);
      node.setAttribute('height', size);
      return node;
    }
  }, {
    key: 'createSvgRoot',
    value: function createSvgRoot(_ref2) {
      var node = _ref2.node;

      return (0, _d.select)(node);
    }
  }, {
    key: 'initialiseLabels',
    value: function initialiseLabels() {
      var _this2 = this;

      var text = this.getLabels().data(pie);

      var getLabelArcTransform = function getLabelArcTransform(d) {
        var _getLabelArc$centroid = _this2.getLabelArc().centroid(d);

        var _getLabelArc$centroid2 = (0, _slicedToArray3.default)(_getLabelArc$centroid, 2);

        var labelX = _getLabelArc$centroid2[0];
        var labelY = _getLabelArc$centroid2[1];

        return 'translate(' + labelX + ', ' + labelY + ')';
      };

      var currentLabels = this.currentLabels;

      text.enter().append('text').attr('dy', '.35em').attr('class', 'pie-chart-label').attr('transform', getLabelArcTransform).text(getLabelText).each(function (d) {
        return currentLabels.push(d);
      });
    }
  }, {
    key: 'initialiseSlices',
    value: function initialiseSlices() {
      var _props = this.props;
      var mouseOverHandler = _props.mouseOverHandler;
      var mouseOutHandler = _props.mouseOutHandler;
      var mouseMoveHandler = _props.mouseMoveHandler;
      var clickHandler = _props.clickHandler;


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

      var currentSlices = this.currentSlices;

      var path = this.getSlices().data(pie);

      path.enter().append('path').attr('class', 'pie-chart-slice').attr('fill', getSliceFill).attr('d', this.getSliceArc()).on('mouseover', mouseover).on('mouseout', mouseout).on('mousemove', mousemove).on('click', click).each(function (d) {
        return currentSlices.push(d);
      });
    }
  }, {
    key: 'initialise',
    value: function initialise() {
      var labels = this.props.labels;


      this.initialiseSlices();

      if (labels) {
        this.initialiseLabels();
      }
    }
  }, {
    key: 'transitionSlices',
    value: function transitionSlices() {
      var _props2 = this.props;
      var data = _props2.data;
      var mouseOverHandler = _props2.mouseOverHandler;
      var mouseOutHandler = _props2.mouseOutHandler;
      var mouseMoveHandler = _props2.mouseMoveHandler;
      var clickHandler = _props2.clickHandler;


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

      var n = data.length;
      var currentSlices = this.currentSlices;

      var path = this.getSlices().data(pie);

      if (n) {
        // we don't need to do this, but it's fun
        /*
         * Change current slices
         * Transition current slice dimensions
         */
        path.attr('fill', getSliceFill).on('mouseover', mouseover).on('mouseout', mouseout).on('mousemove', mousemove).on('click', click).transition().duration(750).attrTween('d', this.tweenSlice);

        /*
         * Add new slices
         */
        path.enter().append('path').attr('class', 'pie-chart-slice').attr('fill', getSliceFill).on('mouseover', mouseover).on('mouseout', mouseout).on('mousemove', mousemove).on('click', click).each(function (d, i) {
          return currentSlices.splice(i, 1, d);
        }).transition().duration(750).attrTween('d', this.tweenSlice);
      }

      /*
       * Remove old slices
       */
      path.exit().remove();

      currentSlices.length = n; // = this.currentSlices.slice(0, n)
    }
  }, {
    key: 'transitionLabels',
    value: function transitionLabels() {
      var _this3 = this;

      var data = this.props.data;


      var getLabelArcTransform = function getLabelArcTransform(d) {
        var _getLabelArc$centroid3 = _this3.getLabelArc().centroid(d);

        var _getLabelArc$centroid4 = (0, _slicedToArray3.default)(_getLabelArc$centroid3, 2);

        var labelX = _getLabelArc$centroid4[0];
        var labelY = _getLabelArc$centroid4[1];

        return 'translate(' + labelX + ', ' + labelY + ')';
      };

      var n = data.length;
      var currentLabels = this.currentLabels;
      var text = this.getLabels().data(pie);

      if (n) {
        // we don't need to do this, but it's fun
        /*
         * Change current labels
         */
        text.transition().duration(750).attr('transform', getLabelArcTransform).text(getLabelText);

        /*
         * Add new labels
         */
        text.enter().append('text').attr('dy', '.35em').attr('class', 'pie-chart-label').attr('transform', getLabelArcTransform).text(getLabelText).each(function (d, i) {
          return currentLabels.splice(i, 1, d);
        }).transition().duration(750);
      }

      /*
       * Remove old labels
       */
      text.exit().remove();

      currentLabels.length = n;
    }
  }, {
    key: 'transition',
    value: function transition() {
      var labels = this.props.labels;


      this.transitionSlices();

      if (labels) {
        this.transitionLabels();
      }
    }
  }, {
    key: 'createSlices',
    value: function createSlices(_ref3) {
      var root = _ref3.root;

      var uid = this.uid;
      var radius = this.getOuterRadius();

      root.append('g').attr('id', 'slices-' + uid).attr('transform', 'translate(' + radius + ', ' + radius + ')');
    }
  }, {
    key: 'createLabels',
    value: function createLabels(_ref4) {
      var root = _ref4.root;

      var uid = this.uid;
      var radius = this.getOuterRadius();

      root.append('g').attr('id', 'labels-' + uid).attr('transform', 'translate(' + radius + ', ' + radius + ')');
    }
  }, {
    key: 'createStyle',
    value: function createStyle() {
      var styles = this.props.styles;


      var uid = this.uid;
      var scope = '.pie-chart-' + uid;
      var rules = (0, _lodash2.default)({}, _shared.defaultStyles, styles);

      return _react2.default.createElement(_radium.Style, {
        scopeSelector: scope,
        rules: rules
      });
    }
  }, {
    key: 'calculateChartParameters',
    value: function calculateChartParameters() {
      var size = this.props.size;


      var node = this.createSvgNode({ size: size });
      var root = this.createSvgRoot({ node: node });

      return {
        node: node,
        root: root
      };
    }
  }, {
    key: 'render',
    value: function render() {
      var labels = this.props.labels;


      var p = this.calculateChartParameters();

      this.createSlices(p);

      if (labels) {
        this.createLabels(p);
      }

      var uid = this.uid;
      var className = 'pie-chart-' + uid;
      var node = p.node;


      return _react2.default.createElement(
        'div',
        { className: className },
        this.createStyle(),
        node.toReact()
      );
    }
  }]);
  return PieChart;
}(_react2.default.Component);

exports.default = PieChart;
module.exports = exports['default'];
//# sourceMappingURL=index.js.map