import React from 'react';
import ReactDOM from 'react-dom';
import ScatterplotChart from 'react-easy-chart/scatterplot-chart';
import ToolTip from '../ToolTip';
import Legend from '../Legend';
import {escapeHTML} from '../util';

const exampleText = [
  {
    type: 1,
    x: 'Tue',
    y: 10
  },
  {
    type: 1,
    x: 'Wed',
    y: 20
  },
  {
    type: 2,
    x: 'Thu',
    y: 30
  },
  {
    type: 3,
    x: 'Wed',
    y: 40
  }
];

const exampleTime = [
  {
    type: 1,
    x: '1-Jan-15',
    y: 10
  },
  {
    type: 1,
    x: '2-Jan-15',
    y: 20
  },
  {
    type: 2,
    x: '1-Jan-15',
    y: 30
  },
  {
    type: 2,
    x: '2-Jan-15',
    y: 30
  },
  {
    type: 3,
    x: '3-Jan-15',
    y: 40
  }
];

const bigData = [
  {
    'type': 'One',
    'x': 1,
    'y': 5
  },
  {
    'type': 'Two',
    'x': 3,
    'y': 1
  },
  {
    'type': 'Three',
    'x': 0,
    'y': 6
  },
  {
    'type': 'Four',
    'x': 5,
    'y': 2
  },
  {
    'type': 'Five',
    'x': 4,
    'y': 4
  },
  {
    'type': 'Six',
    'x': 5,
    'y': 9
  },
  {
    'type': 'Seven',
    'x': 9,
    'y': 1
  },
  {
    'type': 'Eight',
    'x': 5,
    'y': 6
  },
  {
    'type': 'Nine',
    'x': 3,
    'y': 9
  },
  {
    'type': 'Ten',
    'x': 7,
    'y': 9
  }
];

const bigDataZ = [
  {
    'type': 'One',
    'x': 1,
    'y': 5,
    'z': 500
  },
  {
    'type': 'One',
    'x': 3,
    'y': 1,
    'z': 100
  },
  {
    'type': 'One',
    'x': 0,
    'y': 6,
    'z': 600
  },
  {
    'type': 'One',
    'x': 5,
    'y': 2,
    'z': 200
  },
  {
    'type': 'One',
    'x': 4,
    'y': 4,
    'z': 400
  },
  {
    'type': 'One',
    'x': 5,
    'y': 9,
    'z': 900
  },
  {
    'type': 'One',
    'x': 9,
    'y': 1,
    'z': 100
  },
  {
    'type': 'One',
    'x': 5,
    'y': 6,
    'z': 600
  },
  {
    'type': 'One',
    'x': 3,
    'y': 9,
    'z': 900
  },
  {
    'type': 'One',
    'x': 7,
    'y': 9,
    'z': 900
  }
];

const config = [
  {
    type: 'One',
    color: '#ff0000',
    stroke: 'blue'
  },
  {
    type: 'Two',
    color: '#00ff00',
    stroke: 'blue'
  },
  {
    type: 'Three',
    color: '#ffffff',
    stroke: 'black'
  }
];

export default class ScatterplotContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataDisplay: '',
      showToolTip: false,
      randomDataIntervalId: null
    };
    this.data = this.generateData();
  }

  getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  generateData() {
    const data = [];
    const keys = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

    keys.map((key) => {
      data.push({type: key, x: this.getRandomArbitrary(1, 1000), y: this.getRandomArbitrary(1, 1000)});
    });
    return data;
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

  render() {
    return (
      <div>
        <h2>The R2-D3 scatterplot chart</h2>
        <h3>Data</h3>
        <p>At the most basic the scatterplot chart can just take a single data file supplied in a JSON format and will render a
         simple scatterplot chart.</p>
        <p>The format of the data is an array of objects, with each object representing a single data item to be plotted.</p>
        <p>Each data item is give a type identifier and two variables</p>
        <ul>
          <li><b>type</b>: a generic identifier for the data. Muliple instances of the same type can exist</li>
          <li><b>x</b>: data value for the x axis</li>
          <li><b>y</b>: data value for the y axis</li>
        </ul>
        <pre>
          <code dangerouslySetInnerHTML={{__html: escapeHTML(`
const data = [
  {
    'type': 'One',
    'x': 1,
    'y': 5
  },
  {
    'type': 'Two',
    'x': 3,
    'y': 1
  },
  {
    'type': 'Three',
    'x': 0,
    'y': 6
  },
  {
    'type': 'Four',
    'x': 5,
    'y': 2
  },
  {
    'type': 'Five',
    'x': 4,
    'y': 4
  },
  {
    'type': 'Six',
    'x': 5,
    'y': 9
  },
  {
    'type': 'Seven',
    'x': 9,
    'y': 1
  },
  {
    'type': 'Eight',
    'x': 5,
    'y': 6
  },
  {
    'type': 'Nine',
    'x': 3,
    'y': 9
  },
  {
    'type': 'Ten',
    'x': 7,
    'y': 9
  }
];

<ScatterplotChart data={data} />
       `)}}
          />
       </pre>
       <ScatterplotChart data={bigData} />
       <h3>Height and Width</h3>
       <p>The height and width can be easily set by passing in a numeric value in as a prop.</p>
       <pre>
       <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<ScatterplotChart data={data} width={160} height={90} />
       `)}}
       />
       </pre>
       <ScatterplotChart data={bigData} width={160} height={90} />
       <h3>Margin</h3>
       <p>The Margin can be overridden by passing in a margin object. The margin object must define the following: top, right, bottom and left</p>
       <p>This can be particulary useful if a label is cut off.</p>
       <pre>
       <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<ScatterplotChart
  data={data}
  margin={{top: 10, right: 10, bottom: 30, left: 100}} />
       `)}}
       />
       </pre>
       <ScatterplotChart data={bigData} margin={{top: 10, right: 10, bottom: 30, left: 100}} />
       <h3>Axes</h3>
       <p>The axes can be turned on by simply passing a boolean flag to true for <strong>axes</strong>.</p>
       <pre>
       <code dangerouslySetInnerHTML={{__html: escapeHTML(`
  <ScatterplotChart
    data={data}
    axes
    width={480}
    height={270} />
       `)}}
       />
       </pre>
       <ScatterplotChart data={bigData} axes width={480} height={270} />
       <h3>Axes labels</h3>
       <p>The axes labels (<strong>axisLabels</strong>) can be passed in for the x and y value.</p>
       <pre>
       <code dangerouslySetInnerHTML={{__html: escapeHTML(`
 <ScatterplotChart
   data={data}
   axes
   axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
   width={480}
   height={270} />
       `)}}
       />
       </pre>
       <ScatterplotChart
         data={bigData}
         axes
         axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
         width={480}
         height={270}
       />
       <h3>Dot radius</h3>
       <p>The default size of the dot can be changed via the <strong>dotRadius</strong> parameter</p>
       <pre>
       <code dangerouslySetInnerHTML={{__html: escapeHTML(`
 <ScatterplotChart
   data={data}
   axes
   axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
   dotRadius={10}
   width={480}
   height={270} />
       `)}}
       />
       </pre>
       <ScatterplotChart
         data={bigData}
         axes
         axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
         dotRadius={10}
         width={480}
         height={270}
       />
       <h3>Config</h3>
       <p>The <strong>config</strong> property allows for greater control over the look and feel.</p>
       <ul>
         <li><strong>type</strong>: a reference to the type value in the data object</li>
         <li><strong>color</strong>: dot color as a hex value</li>
         <li><strong>stroke</strong>: stroke color as a hex value</li>
       </ul>
       <p>The following example changes the default color for types 'One', 'Two' and 'Three' and adds a stroke</p>
       <pre>
       <code dangerouslySetInnerHTML={{__html: escapeHTML(`
 const config = [
   {
     type: 'One',
     color: '#ff0000',
     stroke: 'blue'
   },
   {
     type: 'Two',
     color: '#00ff00',
     stroke: 'blue'
   },
   {
     type: 'Three',
     color: '#ffffff',
     stroke: 'black'
   }
 ];
       `)}}
       />
       </pre>
       <ScatterplotChart
         data={bigData}
         axes
         axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
         dotRadius={10}
         width={480}
         height={270}
         config={config}
       />
        <h3>Grid</h3>
        <p>Apply a background grid with the grid boolean property</p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
  <ScatterplotChart
    data={data}
    axes
    axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
    dotRadius={10}
    width={480}
    height={270}
    grid
  />
        `)}}
        />
        </pre>
        <ScatterplotChart
          data={bigData}
          axes
          axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
          dotRadius={6}
          width={480}
          height={270}
          grid
        />
      <h3>Axis type</h3>
      <p>The data passed associated to the particular axes can be in numeric, date (the default format is for example 1-Jan-15 but can be overridden) or textual formats (used for labelling).</p>
      <p>For the example below the data for the x is text and so the <strong>xType</strong> needs to be changed to <strong>text</strong>.</p>
      <ul>
        <li><strong>xType</strong></li>
        <li><strong>yType</strong></li>
      </ul>
      <pre>
      <code dangerouslySetInnerHTML={{__html: escapeHTML(`
const data = [
  {
    type: 1,
    x: 'Tue',
    y: 10
  },
  {
    type: 1,
    x: 'Wed',
    y: 20
  },
  {
    type: 2,
    x: 'Tue',
    y: 30
  },
  {
    type: 3,
    x: 'Thu',
    y: 40
  }
];

<ScatterplotChart
  data={data}
  axes
  axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
  dotRadius={6}
  width={480}
  height={270}
  grid
  xType="text"
/>
      `)}}
      />
      </pre>
        <ScatterplotChart
          data={exampleText}
          axes
          axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
          dotRadius={6}
          width={480}
          height={270}
          grid
          xType="text"
        />
        <h3>Domain Range</h3>
        <p>By default the axis ranges are automatically calculated based on the smallest and the largest values</p>
        <p>The range can be fixed by passing an array param of 2 value for the particular axis. The first number is the bottom of the range the second is the higher point of the range.</p>
        <p>The following example sets the <strong>xType</strong> to time then passes a date range to <strong>xDomainRange</strong></p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
  const data = [
    {
      type: 1,
      x: '1-Jan-15',
      y: 10
    },
    {
      type: 1,
      x: '2-Jan-15',
      y: 20
    },
    {
      type: 2,
      x: '1-Jan-15',
      y: 30
    },
    {
      type: 2,
      x: '2-Jan-15',
      y: 30
    },
    {
      type: 3,
      x: '3-Jan-15',
      y: 40
    }
  ];

  <ScatterplotChart
    data={data}
    axes
    axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
    dotRadius={6}
    width={480}
    height={270}
    grid
    xType="time"
    xDomainRange={['31-Dec-14', '4-Jan-15']}
  />
        `)}}
        />
        </pre>
        <ScatterplotChart
          data={exampleTime}
          axes
          axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
          dotRadius={6}
          width={480}
          height={270}
          grid
          xType="time"
          xDomainRange={['31-Dec-14', '4-Jan-15']}
        />
        <h3>Mouse events</h3>
        <p>The chart accepts the following mouse events</p>
        <ul>
          <li>- Mouse over</li>
          <li>- Mouse out</li>
          <li>- Mouse move</li>
          <li>- Click</li>
        </ul>
        <p>How to handle these events is entirely up to you.</p>
        <p>The event returns a d3 event</p>
        <p>The example below demostrates a simple tooltip</p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
  <ScatterplotChart
    data={exampleOne}
    axes
    axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
    dotRadius={6}
    width={480}
    height={270}
    grid
    mouseOverHandler={this.mouseOverHandler.bind(this)}
    mouseOutHandler={this.mouseOutHandler.bind(this)}
    mouseMoveHandler={this.mouseMoveHandler.bind(this)}
    clickHandler={this.clickHandler.bind(this)}
  />
        `)}}
        />
        </pre>
        <ScatterplotChart
          data={bigData}
          axes
          axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
          dotRadius={6}
          width={480}
          height={270}
          grid
          mouseOverHandler={this.mouseOverHandler.bind(this)}
          mouseOutHandler={this.mouseOutHandler.bind(this)}
          mouseMoveHandler={this.mouseMoveHandler.bind(this)}
          clickHandler={(d) => this.setState({dataDisplay: `The x value id ${d.x} and the y value is ${d.y}`})}
        />
        <div style={{display: 'inline-block', verticalAlign: 'top', paddingLeft: '20px'}}>
          {this.state.dataDisplay ? this.state.dataDisplay : 'Click on a circle to show the value'}
        </div>
        <h3>Custom legend</h3>
        <p>The scatterplot does not provide a legend by default. Below is an example of custom implementation</p>
        <ScatterplotChart
          data={bigData}
          axes
          axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
          dotRadius={6}
          width={480}
          height={270}
          grid
          mouseOverHandler={this.mouseOverHandler.bind(this)}
          mouseOutHandler={this.mouseOutHandler.bind(this)}
          mouseMoveHandler={this.mouseMoveHandler.bind(this)}
          clickHandler={(d) => this.setState({dataDisplay: `The x value id ${d.x} and the y value is ${d.y}`})}
        />
        <div style={{width: '480px'}} >
          <Legend data={bigData} />
        </div>
        <h3>3rd data type</h3>
        <p>It's also possible to pass in a third variable (z). This variable is a number and is used to scale the radius of the dot</p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
const data = [
  {
    'type': 'One',
    'x': 1,
    'y': 5,
    'z': 500
  },
  {
    'type': 'One',
    'x': 3,
    'y': 1,
    'z': 100
  },
  {
    'type': 'One',
    'x': 0,
    'y': 6,
    'z': 600
  },
  {
    'type': 'One',
    'x': 5,
    'y': 2,
    'z': 200
  },
  {
    'type': 'One',
    'x': 4,
    'y': 4,
    'z': 400
  },
  {
    'type': 'One',
    'x': 5,
    'y': 9,
    'z': 900
  },
  {
    'type': 'One',
    'x': 9,
    'y': 1,
    'z': 100
  },
  {
    'type': 'One',
    'x': 5,
    'y': 6,
    'z': 600
  },
  {
    'type': 'One',
    'x': 3,
    'y': 9,
    'z': 900
  },
  {
    'type': 'One',
    'x': 7,
    'y': 9,
    'z': 900
  }
];

<ScatterplotChart
  data={bigDataZ}
  axes
  axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
  width={480}
  height={270}
  grid
  mouseOverHandler={this.mouseOverHandler.bind(this)}
  mouseOutHandler={this.mouseOutHandler.bind(this)}
  mouseMoveHandler={this.mouseMoveHandler.bind(this)}
/>
        `)}}
        />
        </pre>
        <ScatterplotChart
          data={bigDataZ}
          axes
          axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
          width={480}
          height={270}
          grid
          mouseOverHandler={this.mouseOverHandler.bind(this)}
          mouseOutHandler={this.mouseOutHandler.bind(this)}
          mouseMoveHandler={this.mouseMoveHandler.bind(this)}
        />
        <h3>Generate data</h3>
          <p>By selecting the button below to start the random data you can see a simulation of the performance if a data feed is passed in.
          React provides the functionality to only update the elements of the dom when required so will just change the path attributes.
          The data is passed in as a react param only and as soon as that data changes the chart will reflect that change automatically.</p>
          <br/>
          {
            this.state.randomDataIntervalId ? <input type="button" value="Stop random data" onClick={this.turnOffRandomData.bind(this)}></input>
            :
            <input type="button" value="Start random data" onClick={this.turnOnRandomData.bind(this)}></input>
          }
        <ScatterplotChart
          data={this.data}
          axes
          axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
          width={480}
          height={270}
        />
        <br />
        <br />
        <br />
        {this.state.showToolTip ?
          <ToolTip top={this.state.top} left={this.state.left}>The x value is {this.state.x} and the y value is {this.state.y}</ToolTip>
            : null}
      </div>
    );
  }
}

ReactDOM.render(
  <ScatterplotContainer />, document.getElementById('root'));
