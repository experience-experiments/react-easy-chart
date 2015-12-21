import data from './data.js';
import React from 'react';
import ReactDom from 'react-dom';
import LineChart from '../../modules/line-chart';

ReactDom.render(<LineChart data={data} width={600} height={400} marginLeft={10} marginTop={10}/>, document.getElementById('root'));
