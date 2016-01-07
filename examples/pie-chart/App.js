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
        <h3>data</h3>
        <p>At the most basic the Pie chart can just take a single data file supplied in a JSON format and will render a
         simple Pie chart. This is a single array of JavaScript objects with a key and value.</p>
         <pre>
         <code dangerouslySetInnerHTML={{__html: escapeHTML(`
 <PieChart
 data={[{key: 1, value: 20}, {key: 2, value: 10}, {key: 3, value: 25}]}/>
 `)}}
         />
         </pre>
        <PieChart
          data={[{key: 'A', value: 100}, {key: 'B', value: 200}, {key: 'C', value: 50}]}
        />
        <p>By default the color is generated randomly. The color can be overwritten for each section of the pie by providing an extra color hex value to the object.</p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<PieChart
  data={[{key: 'A', value: 100, color: '#ff0000'}, {key: 'B', value: 200, color: 'green'}, {key: 'C', value: 50, color: 'grey'}]}
/>
       `)}}
        />
        </pre>
       <PieChart
         data={[{key: 'A', value: 100, color: '#ff0000'}, {key: 'B', value: 200, color: 'green'}, {key: 'C', value: 50, color: 'grey'}]}
       />

       <h3>size</h3>
       <p>The size of the pie chart can be set easily by passing in a size param number.</p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<PieChart
  size={50}
  data={[{key: 'A', value: 100, color: '#ff0000'}, {key: 'B', value: 200, color: 'green'}, {key: 'C', value: 50, color: 'grey'}]}
/>
`)}}
        />
       </pre>
       <PieChart
         size={50}
         data={[{key: 'A', value: 100, color: '#ff0000'}, {key: 'B', value: 200, color: 'green'}, {key: 'C', value: 50, color: 'grey'}]}
       />

       <h3>donut</h3>
       <p>A donut can be produced by passing in a innerHoleSize prop. This should be less than the size prop.</p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<PieChart
  size={150}
  innerHoleSize={120}
  data={[{key: 'A', value: 100, color: '#ff0000'}, {key: 'B', value: 200, color: 'green'}, {key: 'C', value: 50, color: 'grey'}]}
/>
       `)}}
        />
       </pre>
       <PieChart
         size={150}
         innerHoleSize={120}
         data={[{key: 'A', value: 100, color: '#ff0000'}, {key: 'B', value: 200, color: 'green'}, {key: 'C', value: 50, color: 'grey'}]}
       />

       <h3>padding</h3>
       <p>padding can be set by passing in a padding prop.</p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<PieChart
  padding={50}
  data={[{key: 'A', value: 100, color: '#ff0000'}, {key: 'B', value: 200, color: 'green'}, {key: 'C', value: 50, color: 'grey'}]}
/>
       `)}}
        />
       </pre>
       <PieChart
         padding={50}
         data={[{key: 'A', value: 100, color: '#ff0000'}, {key: 'B', value: 200, color: 'green'}, {key: 'C', value: 50, color: 'grey'}]}
       />

       <h3>labels</h3>
       <p>Labels can be added by passing in a labels boolean prop. The labels will be the key value passed in with the data.</p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<PieChart
  labels
  data={[{key: 'A', value: 100, color: '#ff0000'}, {key: 'B', value: 200, color: 'green'}, {key: 'C', value: 50, color: 'grey'}]}
/>
       `)}}
        />
       </pre>
       <PieChart
         labels
         data={[{key: 'A', value: 100, color: '#ff0000'}, {key: 'B', value: 200, color: 'green'}, {key: 'C', value: 50, color: 'grey'}]}
       />

       <h3>style</h3>
       <p>Styles for the lines and the text can be overridden by passing in a styles object prop.</p>
       <pre>
       <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<PieChart
  labels
  styles={{
    '.chart_lines': {
      strokeWidth: 0
    },
    '.chart_text': {
      fontFamily: 'arial',
      fontSize: '15px',
      textAnchor: 'middle',
      fill: '#000'
    }
  }}
  data={[{key: 'A', value: 100, color: '#ff0000'}, {key: 'B', value: 200, color: 'green'}, {key: 'C', value: 50, color: 'grey'}]}
/>      `)}}
       />
       </pre>
       <PieChart
         labels
         styles={{
           '.chart_lines': {
             strokeWidth: 0
           },
           '.chart_text': {
             fontFamily: 'arial',
             fontSize: '15px',
             textAnchor: 'middle',
             fill: '#000'
           }
         }}
         data={[{key: 'A', value: 100, color: '#ff0000'}, {key: 'B', value: 200, color: 'green'}, {key: 'C', value: 50, color: 'grey'}]}
       />

       <h3>Large Chart - mouseover and click handler functionality</h3>
        <PieChart
          data={this.data}
          mouseOverHandler={this.mouseOverHandler.bind(this)}
          mouseOutHandler={this.mouseOutHandler.bind(this)}
          mouseMoveHandler={this.mouseMoveHandler.bind(this)}
          clickHandler={this.clickHandler.bind(this)}
          innerHoleHeight={0}
          size={200}
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
