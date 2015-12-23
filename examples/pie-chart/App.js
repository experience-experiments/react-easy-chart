import React from 'react';
import ReactDOM from 'react-dom';

import PieChart from 'rc-d3/pie-chart';

const pieData = [
  {
    label: '<5',
    value: 2704659,
    color: '#1f77b4'
  },
  {
    label: '5-13',
    value: 4499890,
    color: '#ff7f0e'
  },
  {
    label: '14-17',
    value: 2159981,
    color: '#2ca02c'
  },
  {
    label: '18-24',
    value: 3853788,
    color: '#d62728'
  },
  {
    label: '25-44',
    value: 14106543,
    color: '#9467bd'
  },
  {
    label: '45-64',
    value: 8819342,
    color: '#8c564b'
  },
  {
    label: '>65',
    value: 612463,
    color: '#e377c2'
  }
];

const settingsA = {
  innerRadius: 100,
  outerRadius: 240,
  labelRadius: 180,
  padding: 10,
  hasLabels: true
};

const settingsB = {
  innerRadius: 60,
  outerRadius: 180,
  labelRadius: 120,
  padding: 10,
  hasLabels: false
};

const stylesA = {
  '.arc path': {
    stroke: 'rgba(0, 0, 0, 1)',
    strokeWidth: 2
  },
  '.arc text': {
    fontSize: '12px',
    fill: 'white'
  }
};

const stylesB = {
  '.arc path': {
    strokeWidth: 1
  },
  '.arc text': {
    fontSize: '12px',
    fill: 'black'
  }
};

class PieChartContainer extends React.Component {
  render() {
    return (
      <div>
        <div>
          <h1>Pie &amp; Doughnut Charts</h1>
        </div>
        <div>
          <h2>Default example</h2>
          <PieChart data={pieData} />
          <pre>
            <code>
              <span>const data = &#91;&#123;label: '25-44', value: 14106543, color: '#9467bd'&#125;&#93;</span>
            </code>
          </pre>
        </div>
        <div>
          <PieChart data={pieData} settings={settingsA} styles={stylesA} />
        </div>
        <div>
          <PieChart data={pieData} settings={settingsB} styles={stylesB} />
        </div>
      </div>
    );
  }
}

export default PieChartContainer;

ReactDOM.render(<PieChartContainer />, document.getElementById('root'));
