import React from 'react';
import ReactDOM from 'react-dom';
import ScatterplotChart from 'rc-d3/scatterplot-chart';

const data = [
  {
    type: 1,
    y: 5.1,
    x: 3.5,
    color: '#cccccc'
  },
  {
    type: 1,
    y: 4.9,
    x: 3.0
  },
  {
    type: 1,
    y: 4.7,
    x: 3.2
  },
  {
    type: 1,
    y: 4.6,
    x: 3.1
  },
  {
    type: 1,
    y: 5.0,
    x: 3.6
  },
  {
    type: 2,
    y: 7.0,
    x: 3.2
  },
  {
    type: 2,
    y: 6.4,
    x: 3.2
  },
  {
    type: 2,
    y: 6.9,
    x: 3.1
  },
  {
    type: 2,
    y: 5.5,
    x: 2.3
  },
  {
    type: 2,
    y: 6.5,
    x: 2.8
  },
  {
    type: 3,
    y: 6.3,
    x: 3.0
  },
  {
    type: 3,
    y: 5.8,
    x: 2.7
  },
  {
    type: 3,
    y: 7.1,
    x: 3.0
  },
  {
    type: 3,
    y: 6.3,
    x: 2.9
  },
  {
    type: 3,
    y: 6.3,
    x: 3.0
  },
  {
    type: 4,
    y: 3.0,
    x: 3.0
  }
];

const config = [
  {
    type: 1,
    color: '#ff0000',
    stroke: 'blue'
  },
  {
    type: 2,
    color: '#00ff00',
    stroke: 'blue'
  },
  {
    type: 3,
    color: '#0000ff',
    stroke: 'blue'
  },
  {
    type: 4,
    color: '#ffff00'
  }
];


export default class ScatterplotContainer extends React.Component {
  render() {
    return (
      <div>
        <ScatterplotChart
          axes
          data={data}
          config={config}
          useLegend
          axisLabels={{x: 'Sepal Width (cm)', y: 'Sepal Length (cm)'}}
          width={640}
          height={360}
        />
      </div>
    );
  }
}

ReactDOM.render(
  <ScatterplotContainer />, document.getElementById('root'));
