import React from 'react';
import ReactDOM from 'react-dom';
import ToolTip from '../ToolTip';
import {escapeHTML} from '../util';
import PieChart from 'rc-d3/pie-chart';

export default class PieChartContainer extends React.Component {
    constructor(props) {
      super(props);
      this.data = this.generateData();
      this.state = {showToolTip: false};
      this.styles = {
        '.pie-chart-lines': {
          stroke: 'rgba(0, 0, 0, 1)',
          strokeWidth: 1
        },
        '.pie-chart-text': {
          fontSize: '10px',
          fill: 'white'
        }
      };
    }

    getRandomArbitrary(min, max) {
      return Math.random() * (max - min) + min;
    }

    generateData() {
      const data = [];
      const labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

      labels.map((label) => {
        data.push({label: label, value: this.getRandomArbitrary(1, 1000)});
      });

      return data;
    }

    turnOnRandomData() {
      this.setState({randomDataIntervalId: setInterval(this.updateData.bind(this), 500)});
    }

    turnOffRandomData() {
      clearInterval(this.state.randomDataIntervalId);
      this.setState({randomDataIntervalId: null});
    }

    updateData() {
      this.data = this.generateData();
      this.forceUpdate();
    }

    mouseOverHandler(d, e) {
      this.setState({
        showToolTip: true,
        top: `${e.y - 10}px`,
        left: `${e.x + 10}px`,
        value: d.value});
    }

    mouseMoveHandler(e) {
      if (this.state.showToolTip) {
        this.setState({top: `${e.y}px`, left: `${e.x + 10}px`});
      }
    }

    mouseOutHandler() {
      this.setState({showToolTip: false});
    }

    clickHandler(d) {
      this.setState({dataDisplay: `The amount selected is ${d.value}`});
    }

    render() {
      return (<div>
        {this.state.showToolTip ? <ToolTip top={this.state.top} left={this.state.left}>The value is {this.state.value}</ToolTip> : null}
        {
          this.state.randomDataIntervalId ? <input type="button" value="Stop random data" onClick={this.turnOffRandomData.bind(this)}></input>
          :
          <input type="button" value="Start random data" onClick={this.turnOnRandomData.bind(this)}></input>
        }

        <h2>The R2-D3 Pie chart</h2>
        <h3>Data</h3>
        <p>At the most basic the Pie chart can just take a single data file supplied in a JSON format and will render a
         simple Pie chart.</p>
        <PieChart
          data={[{key: 'A', value: 100}, {key: 'B', value: 200}, {key: 'C', value: 50}]}
        />
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<PieChart
data={[{key: 1, value: 20}, {key: 2, value: 10}, {key: 3, value: 25}]}/>
`)}}
        />
        </pre>
        <h3>Large Chart - mouseover and click handler functionality</h3>
        <PieChart
          data={this.data}
          mouseOverHandler={this.mouseOverHandler.bind(this)}
          mouseOutHandler={this.mouseOutHandler.bind(this)}
          mouseMoveHandler={this.mouseMoveHandler.bind(this)}
          clickHandler={this.clickHandler.bind(this)}
          innerHoleHeight={0}
          height={200}
          padding={10}
          hasLabels
          styles={this.styles}
        />
        {this.state.dataDisplay}
        </div>
      );
    }
}


ReactDOM.render(
  <PieChartContainer />, document.getElementById('root'));
