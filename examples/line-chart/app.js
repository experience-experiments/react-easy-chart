import React from 'react';
import ReactDom from 'react-dom';
import ToolTip from '../ToolTip';

import {LineChart} from 'rc-d3';

const style = {
  '.line': {
    stroke: 'green'
  }
};

class LineChartContainer extends React.Component {
    constructor(props) {
      super(props);
      // Generate multiple lines of data
      this.data = [this.generateData(), this.generateData(), this.generateData(), this.generateData()];
      this.state = {showToolTip: false};
    }

    getRandomArbitrary(min, max) {
      return Math.random() * (max - min) + min;
    }

    generateData() {
      const data = [];
      const keys = ['1-Jan-15', '1-Feb-15', '1-Mar-15', '1-Apr-15', '1-Jun-15', '1-Jul-15', '1-Aug-15'];

      keys.map((key) => {
        data.push({key: key, value: this.getRandomArbitrary(0, 100)});
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
      this.data = [this.generateData(), this.generateData(), this.generateData(), this.generateData()];
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
        {
          this.state.randomDataIntervalId ? <input type="button" value="Stop random data" onClick={this.turnOffRandomData.bind(this)}></input>
          :
          <input type="button" value="Start random data" onClick={this.turnOnRandomData.bind(this)}></input>
        }
        <LineChart
          data={this.data}
          datePattern={'%d-%b-%y'}
          xType={'time'}
          style={style}
          width={100}
          height={50}
        />
        <LineChart
          data={this.data}
          datePattern={'%d-%b-%y'}
          xType={'time'}
          width={500}
          height={200}
          yDomainRange={[0, 100]}
          xDomainRange={['1-Jan-15', '1-Aug-15']}
          axes
        />
        {this.state.dataDisplay}
        </div>
      );
    }
}


ReactDom.render(<LineChartContainer/>, document.getElementById('root'));
