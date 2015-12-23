import React from 'react';
import ReactDom from 'react-dom';

import {LineChart} from 'rc-d3';

import {format} from 'd3-time-format';
import {linear} from 'd3-scale';
import {time} from 'd3';

import marketData from './data.js';

const parseDate = format('%d-%b-%y').parse;
const xValue = (d) => parseDate(d[0]);
const yValue = (d) => d[1];

const style = {
  '.line': {
    stroke: 'green'
  }
};

ReactDom.render(<LineChart
  data={marketData}
  xValue={xValue}
  yValue={yValue}
  xScale={time.scale}
  yScale={linear}
  style={style}
/>, document.getElementById('root')
);
