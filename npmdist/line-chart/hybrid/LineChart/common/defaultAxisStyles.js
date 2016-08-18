'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var defaultAxisStyles = exports.defaultAxisStyles = function defaultAxisStyles(vGrid, hGrid, orient) {
  return {
    '.x circle.tick-circle': {
      fill: vGrid ? 'none' : 'lightgrey'
    },
    '.y circle.tick-circle': {
      cx: orient === 'right' ? '+6px' : '-6px',
      fill: hGrid ? 'none' : 'lightgrey'
    },
    '.y.axis line': {
      display: hGrid ? 'inline' : 'none',
      stroke: 'lightgrey'
    }
  };
};
//# sourceMappingURL=defaultAxisStyles.js.map