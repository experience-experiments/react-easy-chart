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

var _radium = require('radium');

var _d = require('d3');

var _shared = require('../shared');

var _lodash = require('lodash.merge');

var _lodash2 = _interopRequireDefault(_lodash);

var _defaultStyles = require('./defaultStyles');

var _defaultStyles2 = _interopRequireDefault(_defaultStyles);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var colors = _d.scale.category20().range();

var Legend = function (_React$Component) {
  (0, _inherits3.default)(Legend, _React$Component);
  (0, _createClass3.default)(Legend, null, [{
    key: 'propTypes',
    get: function get() {
      return {
        config: _react2.default.PropTypes.array,
        data: _react2.default.PropTypes.array.isRequired,
        tags: _react2.default.PropTypes.array,
        dataId: _react2.default.PropTypes.string.isRequired,
        horizontal: _react2.default.PropTypes.bool,
        styles: _react2.default.PropTypes.object
      };
    }
  }, {
    key: 'defaultProps',
    get: function get() {
      return {
        tags: []
      };
    }
  }]);

  function Legend(props) {
    (0, _classCallCheck3.default)(this, Legend);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Legend).call(this, props));

    _this.uid = (0, _shared.createUniqueID)(props);
    return _this;
  }

  (0, _createClass3.default)(Legend, [{
    key: 'getBackgroundColor',
    value: function getBackgroundColor(index) {
      var config = this.props.config;


      if (typeof config !== 'undefined') {
        if (config.length > index) {
          return config[index].color;
        }
      }
      return colors[index];
    }
  }, {
    key: 'createLegend',
    value: function createLegend() {
      var _this2 = this;

      var _props = this.props;
      var dataId = _props.dataId;
      var data = _props.data;
      var tags = _props.tags;
      var horizontal = _props.horizontal;


      var className = horizontal ? 'horizontal' : false;

      data.forEach(function (item) {
        var index = tags.findIndex(function (tag) {
          return tag === item[dataId];
        });
        if (index < 0) tags.push(item[dataId]);
      });

      return _react2.default.createElement(
        'ul',
        { className: 'legend' },
        tags.map(function (item, index) {
          var key = 'legend-' + index;
          var backgroundColor = _this2.getBackgroundColor(index);
          return _react2.default.createElement(
            'li',
            { key: key, className: className },
            _react2.default.createElement('span', {
              className: 'icon',
              style: { backgroundColor: backgroundColor }
            }),
            item
          );
        })
      );
    }
  }, {
    key: 'createStyle',
    value: function createStyle() {
      var styles = this.props.styles;


      var uid = this.uid;
      var rules = (0, _lodash2.default)({}, _defaultStyles2.default, styles);
      var scope = '.legend-container-' + uid;

      return _react2.default.createElement(_radium.Style, {
        scopeSelector: scope,
        rules: rules
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var uid = this.uid;
      var className = 'legend-container-' + uid;
      return _react2.default.createElement(
        'div',
        { className: className },
        this.createStyle(),
        this.createLegend()
      );
    }
  }]);
  return Legend;
}(_react2.default.Component);

exports.default = Legend;
module.exports = exports['default'];
//# sourceMappingURL=index.js.map