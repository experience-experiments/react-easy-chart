import React from 'react';
import ReactDOM from 'react-dom';
import ScatterplotChart from 'rc-d3/scatterplot-chart';

export default class ScatterplotContainer extends React.Component {
  render() {
    return (
      <div>
        <h1>Scatterplot Chart Container</h1>
        <ScatterplotChart />
      </div>
    );
  }
}

ReactDOM.render(
  <ScatterplotContainer />, document.getElementById('root'));
