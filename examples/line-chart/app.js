import React from 'react';
import ReactDom from 'react-dom';

import marketData from './data.js';
import {LineChart} from 'rc-d3';

ReactDom.render(<LineChart data={marketData} width={600} height={400} marginLeft={0} marginTop={0}/>, document.getElementById('root'));
