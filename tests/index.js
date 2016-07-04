/* eslint-env node */
const testsContext = require.context('.', true, /test\.js$/);
testsContext.keys().forEach(testsContext);

const componentsContext = require.context('../modules', true, /index\.js$/);
componentsContext.keys().forEach(componentsContext);
