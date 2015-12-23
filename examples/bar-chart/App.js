import React from 'react';
import ReactDOM from 'react-dom';
import BarChart from 'rc-d3/bar-chart';
import ToolTip from './ToolTip';

export default class BarChartContainer extends React.Component {
    constructor(props) {
      super(props);
      this.data = this.generateData();
      this.state = {showToolTip: false, key: null, value: null};
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
      this.setState({showToolTip: true});
      this.setState({
        showToolTip: true,
        top: `${e.y}px`,
        left: `${e.x}px`,
        value: d.value,
        key: d.key});
    }

    mouseOutHandler() {
      this.setState({showToolTip: false});
    }

    clickHandler() {
      console.log('click happening');
    }

    render() {
      return (<div>
          {this.state.showToolTip ? <ToolTip top={this.state.top} left={this.state.left}>The value of {this.state.key} is {this.state.value}</ToolTip> : null}
          <input type="button" value="reset the data" onClick={this.updateData.bind(this)}></input>
          <input type="button" value="Turn On setTimeOut" onClick={this.turnOnSetTimeout.bind(this)}></input>
          <BarChart mouseOverHandler={this.mouseOverHandler.bind(this)} mouseOutHandler={this.mouseOutHandler.bind(this)} clickHandler={this.clickHandler.bind(this)} data={this.data}/>
        </div>
      );
    }
}


ReactDOM.render(<BarChartContainer/>, document.getElementById('root'));
