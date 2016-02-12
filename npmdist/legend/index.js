'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _radium = require('radium');

var _d = require('d3');

var _lodash = require('lodash.merge');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var defaultStyles = {
  '.legend': {
    'list-style': 'none',
    margin: 0,
    padding: 0
  },
  '.legend li': {
    display: 'block',
    lineHeight: '24px',
    marginRight: '24px',
    marginBottom: '6px',
    paddingLeft: '24px',
    position: 'relative'
  },
  '.legend li.horizontal': {
    display: 'inline-block'
  },
  '.legend .icon': {
    width: '12px',
    height: '12px',
    borderRadius: '6px',
    position: 'absolute',
    left: '0',
    top: '50%',
    marginTop: '-6px'
  }
};

var colors = _d.scale.category20().range();

var Legend = function (_React$Component) {
  _inherits(Legend, _React$Component);

  _createClass(Legend, null, [{
    key: 'propTypes',
    get: function get() {
      return {
        config: _react2.default.PropTypes.array,
        data: _react2.default.PropTypes.array.isRequired,
        dataId: _react2.default.PropTypes.string.isRequired,
        horizontal: _react2.default.PropTypes.bool,
        styles: _react2.default.PropTypes.object
      };
    }
  }]);

  function Legend(props) {
    _classCallCheck(this, Legend);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Legend).call(this, props));

    _this.tags = [];
    return _this;
  }

  _createClass(Legend, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this2 = this;

      var dataId = this.props.dataId;
      this.props.data.map(function (item) {
        var index = _this2.tags.findIndex(function (tag) {
          return tag === item[dataId];
        });
        if (index === -1) _this2.tags.push(item[dataId]);
      });
    }
  }, {
    key: 'getList',
    value: function getList() {
      var _this3 = this;

      var cn = this.props.horizontal ? 'horizontal' : '';
      return this.tags.map(function (item, index) {
        return _react2.default.createElement(
          'li',
          { key: index, className: cn },
          _react2.default.createElement('span', {
            className: 'icon',
            style: { backgroundColor: _this3.getIconColor(index) }
          }),
          item
        );
      });
    }
  }, {
    key: 'getIconColor',
    value: function getIconColor(index) {
      if (typeof this.props.config !== 'undefined') {
        if (this.props.config.length > index) {
          return this.props.config[index].color;
        }
      }
      return colors[index];
    }
  }, {
    key: 'render',
    value: function render() {
      var uid = Math.floor(Math.random() * new Date().getTime());
      return _react2.default.createElement(
        'div',
        { className: 'legend-container-' + uid },
        _react2.default.createElement(_radium.Style, {
          scopeSelector: '.legend-container-' + uid,
          rules: (0, _lodash2.default)({}, defaultStyles, this.props.styles)
        }),
        _react2.default.createElement(
          'ul',
          { className: 'legend' },
          this.getList()
        )
      );
    }
  }]);

  return Legend;
}(_react2.default.Component);

exports.default = Legend;
module.exports = exports['default'];
//# sourceMappingURL=index.js.map