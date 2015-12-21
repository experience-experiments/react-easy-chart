import React from 'react';
import ReactDOM from 'react-dom';

import PieChart from 'rc-d3/pie-chart';

const pieData = [
  {
    age: '<5',
    population: 2704659
  },
  {
    age: '5-13',
    population: 4499890
  },
  {
    age: '14-17',
    population: 2159981
  },
  {
    age: '18-24',
    population: 3853788
  },
  {
    age: '25-44',
    population: 14106543
  },
  {
    age: '45-64',
    population: 8819342
  },
  {
    age: '>65',
    population: 612463
  }
];

ReactDOM.render(<PieChart data={pieData} />, document.getElementById('root'));