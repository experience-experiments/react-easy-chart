import React from 'react';
import ReactDOM from 'react-dom';

import PieChart from 'rc-d3/pie-chart';

const pieData = [
  {
    value: 20
  },
  {
    label: '5-13',
    value: 40
  },
  {
    label: '14-17',
    value: 10
  },
  {
    label: '18-24',
    value: 15
  },
  {
    label: '25-44',
    value: 5
  },
  {
    label: '45-64',
    value: 19
  },
  {
    value: 1
  }
];

const styles = {
  '.arc path': {
    stroke: 'rgba(0, 0, 0, 1)',
    strokeWidth: 2
  },
  '.arc text': {
    fontSize: '12px',
    fill: 'white'
  }
};

ReactDOM.render(
  <PieChart data={pieData}
    innerRadius={100}
    outerRadius={240}
    labelRadius={180}
    padding={10}
    hasLabels
    styles={styles}
  />, document.getElementById('root'));
