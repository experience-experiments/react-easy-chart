import React from 'react';
import ReactDOM from 'react-dom';
import BarChart from 'rc-d3/bar-chart';
import ToolTip from '../ToolTip';
import {escapeHTML} from '../util';

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
        data.push({key: key, value: this.getRandomArbitrary(1, 100)});
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
        top: `${e.screenY - 10}px`,
        left: `${e.screenX + 10}px`,
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
        <h2>The R2-D3 Bar chart</h2>
        <h3>Data</h3>
        <p>At the most basic the Bar chart can just take a single data file supplied in a JSON format and will render a
         simple Bar chart.</p>
         <pre>
         <code dangerouslySetInnerHTML={{__html: escapeHTML(`
 <BarChart
   data={[{key: 'A', value: 20}, {key: 'B', value: 30}, {key: 'C', value: 40},
    {key: 'D', value: 20}, {key: 'E', value: 40}, {key: 'F', value: 25}, {key: 'G', value: 5}]}
 />
         `)}}
         />
         </pre>

        <BarChart
          data={[{key: 'A', value: 20}, {key: 'B', value: 30}, {key: 'C', value: 40}, {key: 'D', value: 20}, {key: 'E', value: 40}, {key: 'F', value: 25}, {key: 'G', value: 5}]}
        />

        <h3>Height and Width</h3>
        <p>The height and width can be easily set by passing in a numeric value in as a prop.</p>
         <pre>
         <code dangerouslySetInnerHTML={{__html: escapeHTML(`
 <BarChart
   height={150}
   width={150}
   data={[{key: 'A', value: 20}, {key: 'B', value: 30}, {key: 'C', value: 40},
    {key: 'D', value: 20}, {key: 'E', value: 40}, {key: 'F', value: 25}, {key: 'G', value: 5}]}
 />
         `)}}
         />
         </pre>

        <BarChart
          height={150}
          width={150}
          data={[{key: 'A', value: 20}, {key: 'B', value: 30}, {key: 'C', value: 40}, {key: 'D', value: 20}, {key: 'E', value: 40}, {key: 'F', value: 25}, {key: 'G', value: 5}]}
        />

        <h3>ColorBars</h3>
        <p>The bars can be automatically colored by turning on the color boolean.</p>
         <pre>
         <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<BarChart
 colorBars
 data={[{key: 'A', value: 20}, {key: 'B', value: 30}, {key: 'C', value: 40},
  {key: 'D', value: 20}, {key: 'E', value: 40}, {key: 'F', value: 25}, {key: 'G', value: 5}]}
/>
         `)}}
         />
         </pre>

        <BarChart
          colorBars
          data={[{key: 'A', value: 20}, {key: 'B', value: 30}, {key: 'C', value: 40}, {key: 'D', value: 20}, {key: 'E', value: 40}, {key: 'F', value: 25}, {key: 'G', value: 5}]}
        />


        <h3>Overriding Bar colors</h3>
        <p>A single bar or number of bars can be colored by adding a color prop to the relevent data item.</p>
         <pre>
         <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<BarChart
data={[{key: 'A', value: 20}, {key: 'B', value: 30}, {key: 'C', value: 40},
 {key: 'D', value: 20}, {key: 'E', value: 40}, {key: 'F', value: 25}, {key: 'G', value: 5, color: 'orange'}]}
/>
         `)}}
         />
         </pre>

        <BarChart
          data={[{key: 'A', value: 20}, {key: 'B', value: 30, color: '#f00'}, {key: 'C', value: 40}, {key: 'D', value: 20}, {key: 'E', value: 40}, {key: 'F', value: 25}, {key: 'G', value: 5, color: 'orange'}]}
        />

        <h3>Axes</h3>
        <p>The axes can be turned on by simply passing a boolean flag to true for axes</p>
         <pre>
         <code dangerouslySetInnerHTML={{__html: escapeHTML(`
 <BarChart
   axes
   data={[{key: 'A', value: 20}, {key: 'B', value: 30, color: '#f00'}, {key: 'C', value: 40},
    {key: 'D', value: 20}, {key: 'E', value: 40}, {key: 'F', value: 25}, {key: 'G', value: 5, color: 'orange'}]}
 />
         `)}}
         />
         </pre>

        <BarChart
          axes
          data={[{key: 'A', value: 20}, {key: 'B', value: 30, color: '#f00'}, {key: 'C', value: 40},
           {key: 'D', value: 20}, {key: 'E', value: 40}, {key: 'F', value: 25}, {key: 'G', value: 5, color: 'orange'}]}
        />
        <br/>
        <br/>
        <br/>
        {this.state.showToolTip ? <ToolTip top={this.state.top} left={this.state.left}>The value of {this.state.key} is {this.state.value}</ToolTip> : null}
        {
          this.state.randomDataIntervalId ? <input type="button" value="Stop random data" onClick={this.turnOffRandomData.bind(this)}></input>
          :
          <input type="button" value="Start random data" onClick={this.turnOnRandomData.bind(this)}></input>
        }
        </div>
      );
    }
}

// <BarChart
//   width={200}
//   height={150}
//   axes={false}
//   data={this.data}
//   margin={{top: 0, right: 0, bottom: 0, left: 0}}
//   style={{'.bar': {fill: 'red'}}}
// />
// <BarChart
//   mouseOverHandler={this.mouseOverHandler.bind(this)}
//   mouseOutHandler={this.mouseOutHandler.bind(this)}
//   mouseMoveHandler={this.mouseMoveHandler.bind(this)}
//   clickHandler={this.clickHandler.bind(this)}
//   data={this.data}
//   style={{'.bar': {fill: 'green'}}}
//   yDomainRange={[0, 100]}
// />
// {this.state.dataDisplay}


ReactDOM.render(<BarChartContainer/>, document.getElementById('root'));
