import React from 'react';
import ReactDom from 'react-dom';

import {LineChart} from 'rc-d3';

import {format} from 'd3-time-format';
import {linear, time} from 'd3-scale';
import marketData from './data.js';

const parseDate = format('%d-%b-%y').parse;
const xValue = (d) => parseDate(d[0]);
const yValue = (d) => d[1];
const lineStyle = {
  stroke: 'blue'
};

ReactDom.render(<LineChart
  width={600}
  height={400}
  data={marketData}
  xValue={xValue}
  yValue={yValue}
  lineStyle={lineStyle}
  xScale={time}
  yScale={linear}
/>, document.getElementById('root')
);
