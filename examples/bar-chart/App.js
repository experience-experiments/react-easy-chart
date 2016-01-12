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
      const xs = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];
      xs.map((x) => {
        data.push({x: x, y: this.getRandomArbitrary(1, 100)});
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
      this.data[0].y = this.getRandomArbitrary(0.08, 0);
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
        y: d.y,
        x: d.x});
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
      this.setState({dataDisplay: `The amount selected is ${d.y}`});
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
   data={[{x: 'A', y: 20}, {x: 'B', y: 30}, {x: 'C', y: 40},
    {x: 'D', y: 20}, {x: 'E', y: 40}, {x: 'F', y: 25}, {x: 'G', y: 5}]}
 />
         `)}}
         />
         </pre>

        <BarChart
          data={[{x: 'A', y: 20}, {x: 'B', y: 30}, {x: 'C', y: 40}, {x: 'D', y: 20}, {x: 'E', y: 40}, {x: 'F', y: 25}, {x: 'G', y: 5}]}
        />

        <h3>Height and Width</h3>
        <p>The height and width can be easily set by passing in a numeric y in as a prop.</p>
         <pre>
         <code dangerouslySetInnerHTML={{__html: escapeHTML(`
 <BarChart
   height={150}
   width={150}
   data={[{x: 'A', y: 20}, {x: 'B', y: 30}, {x: 'C', y: 40},
    {x: 'D', y: 20}, {x: 'E', y: 40}, {x: 'F', y: 25}, {x: 'G', y: 5}]}
 />
         `)}}
         />
         </pre>

        <BarChart
          height={150}
          width={150}
          data={[{x: 'A', y: 20}, {x: 'B', y: 30}, {x: 'C', y: 40}, {x: 'D', y: 20}, {x: 'E', y: 40}, {x: 'F', y: 25}, {x: 'G', y: 5}]}
        />

        <h3>ColorBars</h3>
        <p>The bars can be automatically colored by turning on the colorBars boolean.</p>
         <pre>
         <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<BarChart
 colorBars
 data={[{x: 'A', y: 20}, {x: 'B', y: 30}, {x: 'C', y: 40},
  {x: 'D', y: 20}, {x: 'E', y: 40}, {x: 'F', y: 25}, {x: 'G', y: 5}]}
/>
         `)}}
         />
         </pre>

        <BarChart
          colorBars
          data={[{x: 'A', y: 20}, {x: 'B', y: 30}, {x: 'C', y: 40}, {x: 'D', y: 20}, {x: 'E', y: 40}, {x: 'F', y: 25}, {x: 'G', y: 5}]}
        />


        <h3>Overriding Bar colors</h3>
        <p>A single bar or number of bars can be colored by adding a color prop to the relevent data item.</p>
         <pre>
         <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<BarChart
data={[{x: 'A', y: 20}, {x: 'B', y: 30}, {x: 'C', y: 40},
 {x: 'D', y: 20}, {x: 'E', y: 40}, {x: 'F', y: 25}, {x: 'G', y: 5, color: 'orange'}]}
/>
         `)}}
         />
         </pre>

        <BarChart
          data={[{x: 'A', y: 20}, {x: 'B', y: 30, color: '#f00'}, {x: 'C', y: 40}, {x: 'D', y: 20}, {x: 'E', y: 40}, {x: 'F', y: 25}, {x: 'G', y: 5, color: 'orange'}]}
        />

        <h3>Axes</h3>
        <p>The axes can be turned on by simply passing a boolean flag to true for axes</p>
         <pre>
         <code dangerouslySetInnerHTML={{__html: escapeHTML(`
 <BarChart
   axes
   data={[{x: 'A', y: 20}, {x: 'B', y: 30, color: '#f00'}, {x: 'C', y: 40},
    {x: 'D', y: 20}, {x: 'E', y: 40}, {x: 'F', y: 25}, {x: 'G', y: 5, color: 'orange'}]}
 />
         `)}}
         />
         </pre>
        <BarChart
          axes
          data={[{x: 'A', y: 20}, {x: 'B', y: 30, color: '#f00'}, {x: 'C', y: 40},
           {x: 'D', y: 20}, {x: 'E', y: 40}, {x: 'F', y: 25}, {x: 'G', y: 5, color: 'orange'}]}
        />

        <h3>Axes Labels</h3>
        <p>The axes labels can be overridden by simply passing <b>axisLabels</b> object with both a x and y y.</p>
         <pre>
         <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<BarChart
  axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
  axes
  data={[{x: 'A', y: 20}, {x: 'B', y: 30, color: '#f00'}, {x: 'C', y: 40},
    {x: 'D', y: 20}, {x: 'E', y: 40}, {x: 'F', y: 25}, {x: 'G', y: 5, color: 'orange'}]}
/>
         `)}}
         />
         </pre>
        <BarChart
          axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
          axes
          data={[{x: 'A', y: 20}, {x: 'B', y: 30, color: '#f00'}, {x: 'C', y: 40},
           {x: 'D', y: 20}, {x: 'E', y: 40}, {x: 'F', y: 25}, {x: 'G', y: 5, color: 'orange'}]}
        />

        <h3>xType / yType</h3>
        <p>The data passed associated to the particular axes can be in numeric, date (the default format is for example 1-Jan-15 but can be overridden) or textual formats (used for labelling).</p>

        <p>By default the xType is text (or ordinal in d3) and so allows text labelling. The example below passes 'linear' as the xType and the data x is numeric.</p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<BarChart
  axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
  axes
  xType={'linear'}
  data={[{x: 10, y: 20}, {x: 12, y: 20}, {x: 30, y: 30, color: '#f00'}, {x: 40, y: 40}]}
/>
        `)}}
        />
        </pre>
        <BarChart
          axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
          axes
          xType={'linear'}
          data={[{x: 10, y: 20}, {x: 12, y: 20}, {x: 30, y: 30, color: '#f00'}, {x: 40, y: 40}]}
        />

        <p>The xType can also be a time based y. The default format for the date data is for example 1-Jan-15 but can be overridden.</p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<BarChart
  axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
  axes
  colorBars
  xType={'time'}
  data={[{x: '1-Jan-15', y: 20}, {x: '2-Jan-15', y: 10}, {x: '3-Jan-15', y: 33}]}
/>
        `)}}
        />
        </pre>
        <BarChart
          axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
          axes
          colorBars
          xType={'time'}
          data={[{x: '1-Jan-15', y: 20}, {x: '2-Jan-15', y: 10}, {x: '3-Jan-15', y: 33}]}
        />

        <p>The bar width can also be overridden. The default 10px.</p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<BarChart
  axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
  axes
  colorBars
  barWidth={20}
  xType={'time'}
  data={[{x: '1-Jan-15', y: 20}, {x: '2-Jan-15', y: 10}, {x: '3-Jan-15', y: 33}]}
/>
        `)}}
        />
        </pre>
        <BarChart
          axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
          axes
          colorBars
          barWidth={20}
          xType={'time'}
          data={[{x: '1-Jan-15', y: 20}, {x: '2-Jan-15', y: 10}, {x: '3-Jan-15', y: 33}]}
        />

        <h3>range yDomainRange, xDomainRange</h3>
        <p>By default the axis ranges are automatically calculated based on the smallest and the largest ys.</p>
        <p>The range can be fixed by passing an array param of 2 numbers for the particular axis.
        The first number is the bottom of the range the second is the higher point of the range.</p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<BarChart
  axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
  axes
  colorBars
  barWidth={20}
  xType={'time'}
  xDomainRange={['1-Jan-15', '20-Jan-15']}
  yDomainRange={[5, 50]}
  data={[{x: '10-Jan-15', y: 20}, {x: '12-Jan-15', y: 10}, {x: '15-Jan-15', y: 33}]}
/>
        `)}}
        />
        </pre>
        <BarChart
          axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
          axes
          colorBars
          barWidth={20}
          xType={'time'}
          xDomainRange={['1-Jan-15', '20-Jan-15']}
          yDomainRange={[5, 50]}
          data={[{x: '10-Jan-15', y: 20}, {x: '12-Jan-15', y: 10}, {x: '15-Jan-15', y: 33}]}
        />

        <h3>Tick display format</h3>
        <p>If the x or y axis  has an xType of time then a display for the axis can be overridden by setting the tickTimeDisplayFormat.</p>
        <p>The options are very flexible and can be seen here <a href="https://github.com/mbostock/d3/wiki/Time-Formatting">Time Formatting</a></p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<BarChart
  axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
  axes
  colorBars
  barWidth={20}
  xType={'time'}
  tickTimeDisplayFormat={'%a'}
  xDomainRange={['1-Jan-15', '20-Jan-15']}
  data={[{x: '10-Jan-15', y: 20}, {x: '12-Jan-15', y: 10}, {x: '15-Jan-15', y: 33}]}
/>
        `)}}
        />
        </pre>
        <BarChart
          axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
          axes
          colorBars
          barWidth={20}
          xType={'time'}
          tickTimeDisplayFormat={'%a'}
          xDomainRange={['1-Jan-15', '20-Jan-15']}
          data={[{x: '10-Jan-15', y: 20}, {x: '12-Jan-15', y: 10}, {x: '15-Jan-15', y: 33}]}
        />

        <h3>Number of ticks</h3>
        <p>The number of ticks of the x and y axis can be overridden by setting the xTickNumber or yTickNumber.</p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<BarChart
  axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
  axes
  colorBars
  barWidth={20}
  xTickNumber={5}
  yTickNumber={3}
  xType={'time'}
  xDomainRange={['1-Jan-15', '20-Jan-15']}
  data={[{x: '10-Jan-15', y: 20}, {x: '12-Jan-15', y: 10}, {x: '15-Jan-15', y: 33}]}
/>
        `)}}
        />
        </pre>
        <BarChart
          axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
          axes
          colorBars
          barWidth={20}
          xTickNumber={5}
          yTickNumber={3}
          xType={'time'}
          xDomainRange={['1-Jan-15', '20-Jan-15']}
          data={[{x: '10-Jan-15', y: 20}, {x: '12-Jan-15', y: 10}, {x: '15-Jan-15', y: 33}]}
        />

        <h3>Grid</h3>
        <p>A grid can be added to the graph by just passing in a boolean.</p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<BarChart
  axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
  axes
  grid
  colorBars
  barWidth={20}
  xTickNumber={5}
  yTickNumber={3}
  xType={'time'}
  xDomainRange={['1-Jan-15', '20-Jan-15']}
  data={[{x: '10-Jan-15', y: 20}, {x: '12-Jan-15', y: 10}, {x: '15-Jan-15', y: 33}]}
/>
        `)}}
        />
        </pre>
<BarChart
  axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
  axes
  grid
  colorBars
  barWidth={20}
  xTickNumber={5}
  yTickNumber={3}
  xType={'time'}
  xDomainRange={['1-Jan-15', '20-Jan-15']}
  data={[{x: '10-Jan-15', y: 20}, {x: '12-Jan-15', y: 10}, {x: '15-Jan-15', y: 33}]}
/>


        <h3>mouseOverHandler, mouseOverHandler, mouseMoveHandler</h3>
        <p>The chart will send out a mouseOver event, mouseMove and mouseOut event. This can be used by your react application in anyway you would require.
         The event handlers provides the mouse event and the bar data. The mouse event can for instance provide the x and y coordinates which can be used for a tool tip.
          The data is related to the bar currently moused over.</p>
          <pre>
          <code dangerouslySetInnerHTML={{__html: escapeHTML(`
mouseOverHandler(d, e) {
  this.setState({
    showToolTip: true,
    top: \`\${e.screenY - 10}px\`,
    left: \`\${e.screenX + 10}px\`,
    y: d.y,
    x: d.x});
}

mouseMoveHandler(e) {
  if (this.state.showToolTip) {
    this.setState({top: \`\${e.y - 10}px\`, left: \`\${e.x + 10}px\`});
  }
}

mouseOutHandler() {
  this.setState({showToolTip: false});
}

<BarChart
  axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
  axes
  colorBars
  barWidth={20}
  xTickNumber={5}
  yTickNumber={5}
  xType={'time'}
  mouseOverHandler={this.mouseOverHandler.bind(this)}
  mouseOutHandler={this.mouseOutHandler.bind(this)}
  mouseMoveHandler={this.mouseMoveHandler.bind(this)}
  xDomainRange={['1-Jan-15', '20-Jan-15']}
  yDomainRange={[0, 50]}
  data={[{x: '10-Jan-15', y: 20}, {x: '12-Jan-15', y: 10}, {x: '15-Jan-15', y: 33}]}
/>
          `)}}
          />
          </pre>
          <BarChart
            axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
            axes
            colorBars
            barWidth={20}
            xTickNumber={5}
            yTickNumber={5}
            xType={'time'}
            mouseOverHandler={this.mouseOverHandler.bind(this)}
            mouseOutHandler={this.mouseOutHandler.bind(this)}
            mouseMoveHandler={this.mouseMoveHandler.bind(this)}
            xDomainRange={['1-Jan-15', '20-Jan-15']}
            yDomainRange={[0, 50]}
            data={[{x: '10-Jan-15', y: 20}, {x: '12-Jan-15', y: 10}, {x: '15-Jan-15', y: 33}]}
          />

        <h3>Click Handler</h3>
        <p>The chart will send out a click event. The event will pass the data and the event. This allows the data to be presented from the clicking of a segment in any way the react developer requires.</p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<div>
  <div style={{display: 'inline-block'}}>
  <BarChart
    axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
    axes
    colorBars
    barWidth={20}
    xTickNumber={5}
    yTickNumber={5}
    xType={'time'}
    data={[{x: '10-Jan-15', y: 20}, {x: '12-Jan-15', y: 10}, {x: '15-Jan-15', y: 33}]}
    clickHandler={(d) => this.setState({dataDisplay: \`The value on the \${d.x} is \${d.y}\`})}
  />
  </div>
  <div style={{display: 'inline-block', verticalAlign: 'top', paddingLeft: '20px'}}>
    {this.state.dataDisplay ? this.state.dataDisplay : 'Click on a bar to show the value'}
  </div>
</div>
          `)}}
        />
        </pre>
        <div>
          <div style={{display: 'inline-block'}}>
          <BarChart
            axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
            axes
            colorBars
            grid
            barWidth={20}
            xTickNumber={5}
            yTickNumber={5}
            xType={'time'}
            data={[{x: '10-Jan-15', y: 20}, {x: '12-Jan-15', y: 10}, {x: '15-Jan-15', y: 33}]}
            clickHandler={(d) => this.setState({dataDisplay: `The value on the ${d.x} is ${d.y}`})}
          />
          </div>
          <div style={{display: 'inline-block', verticalAlign: 'top', paddingLeft: '20px'}}>
            {this.state.dataDisplay ? this.state.dataDisplay : 'Click on a bar to show the value'}
          </div>
        </div>
        {
          this.state.randomDataIntervalId ? <input type="button" value="Stop random data" onClick={this.turnOffRandomData.bind(this)}></input>
          :
          <input type="button" value="Start random data" onClick={this.turnOnRandomData.bind(this)}></input>
        }
        <br/>
        <br/>
        <br/>
        {this.state.showToolTip ? <ToolTip top={this.state.top} left={this.state.left}>The value on the {this.state.x} is {this.state.y}</ToolTip> : null}
        </div>
      );
    }
}

ReactDOM.render(<BarChartContainer/>, document.getElementById('root'));
