import React from 'react';
import ReactDOM from 'react-dom';
import {escapeHTML} from '../util';
import PieChart from 'react-easy-chart/pie-chart';


export default class PieChartContainer extends React.Component {
    constructor(props) {
      super(props);
      this.data = this.generateData();
      this.state = {
        showToolTip: false,
        componentWidth: 300
      };
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
      const keys = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

      keys.map((key) => {
        data.push({key: key, value: this.getRandomArbitrary(1, 1000)});
      });

      return data;
    }

    turnOnRandomData() {
      this.setState({randomDataIntervalId: setInterval(this.updateData.bind(this), 1000)});
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
        value: d.value,
        key: d.data.key});
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

    toggleState() {
      this.setState({
        active: !this.state.active
      });
    }

    render() {
      return (<div>
      <h2 id="updateData">Updating the data</h2>
       <p>By selecting the button below to start the random data you can see a simulation of the performance if a data feed is passed in.
       React provides the functionality to only update the elements of the dom when required so will just change the path attributes.
       The data is passed in as a react param only and as soon as that data changes the chart will reflect that change automatically.</p>
       <br/>
       {
         this.state.randomDataIntervalId ? <input type="button" value="Stop random data" onClick={this.turnOffRandomData.bind(this)}></input>
         :
         <input type="button" value="Start random data" onClick={this.turnOnRandomData.bind(this)}></input>
       }
       <pre>
       <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<PieChart
 labels
 data={this.data}
/>
      `)}}
       />
      </pre>
      <PieChart
        labels
        data={this.data}
      />
      </div>
      );
    }
}


ReactDOM.render(
  <PieChartContainer />, document.getElementById('root'));
