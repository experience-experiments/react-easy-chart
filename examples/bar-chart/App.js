import React from 'react';
import ReactDOM from 'react-dom';
import BarChart from 'rc-d3/bar-chart';
import ToolTip from '../ToolTip';

export default class BarChartContainer extends React.Component {
    constructor(props) {
      super(props);
      this.data = this.generateData();
      this.state = {showToolTip: false};
    }

    getRandomArbitrary(min, max) {
      return Math.random() * (max - min) + min;
    }

    generateData() {
      const data = [];
      const keys = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];

      keys.map((key) => {
        data.push({key: key, value: this.getRandomArbitrary(0.1, 0)});
      });

      return data;
    }

    turnOnSetTimeout() {
      setInterval(this.updateData.bind(this), 500);
    }

    generateDataSingle() {
      this.data[0].value = this.getRandomArbitrary(0.08, 0);
      return this.data;
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
        key: d.key});
    }

    mouseMoveHandler(e) {
      if (this.state.showToolTip) {
        this.setState({top: `${e.y - 10}px`, left: `${e.x + 10}px`});
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
        {this.state.showToolTip ? <ToolTip top={this.state.top} left={this.state.left}>The value of {this.state.key} is {this.state.value}</ToolTip> : null}
        <input
          type="button"
          value="reset the data"
          onClick={this.updateData.bind(this)}
        />
        <input type="button" value="Turn On setTimeOut" onClick={this.turnOnSetTimeout.bind(this)}></input>
        <BarChart
          width={90}
          height={40}
          axes={false}
          data={this.data}
          margin={{top: 0, right: 0, bottom: 0, left: 0}}
        />
        <BarChart
          width={20}
          height={15}
          axes={false}
          data={this.data}
          margin={{top: 0, right: 0, bottom: 0, left: 0}}
        />
        <BarChart
          width={200}
          height={150}
          axes={false}
          data={this.data}
          margin={{top: 0, right: 0, bottom: 0, left: 0}}
          style={{'.bar': {fill: 'red'}}}
        />
        <BarChart
          mouseOverHandler={this.mouseOverHandler.bind(this)}
          mouseOutHandler={this.mouseOutHandler.bind(this)}
          mouseMoveHandler={this.mouseMoveHandler.bind(this)}
          clickHandler={this.clickHandler.bind(this)}
          data={this.data}
          style={{'.bar': {fill: 'green'}}}
        />
        {this.state.dataDisplay}
        </div>
      );
    }
}


ReactDOM.render(<BarChartContainer/>, document.getElementById('root'));
