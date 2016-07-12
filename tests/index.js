/* eslint-env node */
var context;

(context = require.context('.', true, /test\.js$/))
  .keys()
  .forEach(context);

(context = require.context('../modules', true, /\.js$/))
  .keys()
  .forEach(context);
