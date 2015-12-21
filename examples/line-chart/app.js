import data from './data.js';
import React from 'react';
import ReactDom from 'react-dom';
import LineChart from '../../modules/line-chart';

ReactDom.render(<LineChart data={data} width={500} height={500} marginLeft={50} marginTop={20}/>, document.getElementById('root'));
