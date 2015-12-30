import React from 'react';
import ReactDOM from 'react-dom';
import ToolTip from '../ToolTip';
import PieChart from 'rc-d3/pie-chart';

export default class PieChartContainer extends React.Component {
    constructor(props) {
      super(props);
      this.data = this.generateData();
      this.state = {showToolTip: false};
      this.styles = {
        '.arc path': {
          stroke: 'rgba(0, 0, 0, 1)',
          strokeWidth: 2
        },
        '.arc text': {
          fontSize: '12px',
          fill: 'white'
        }
      };
    }

    getRandomArbitrary(min, max) {
      return Math.random() * (max - min) + min;
    }

    generateData() {
      const data = [];
      const labels = ['A', 'B', 'C', 'D'];

      labels.map((label) => {
        data.push({label: label, value: this.getRandomArbitrary(1, 1000)});
      });

      return data;
    }

    turnOnSetTimeout() {
      setInterval(this.updateData.bind(this), 500);
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
        {this.state.showToolTip ? <ToolTip top={this.state.top} left={this.state.left}>The value is {this.state.value}</ToolTip> : null}
        <input
          type="button"
          value="reset the data"
          onClick={this.updateData.bind(this)}
        />
        <input type="button" value="Turn on random data" onClick={this.turnOnSetTimeout.bind(this)}></input>
        <PieChart
          data={this.data}
          mouseOverHandler={this.mouseOverHandler.bind(this)}
          mouseOutHandler={this.mouseOutHandler.bind(this)}
          mouseMoveHandler={this.mouseMoveHandler.bind(this)}
          clickHandler={this.clickHandler.bind(this)}
          innerRadius={100}
          labelRadius={180}
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
