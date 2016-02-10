import React from 'react';
import ReactDOM from 'react-dom';
import {ScatterplotChart} from 'react-easy-chart';
import ToolTip from '../ToolTip';
import Legend from '../Legend';
import {escapeHTML} from '../util';
import Scrollspy from 'react-scrollspy';

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
    color: '#1e313c',
    stroke: 'black'
  },
  {
    type: 'Two',
    color: '#3f4c55',
    stroke: 'black'
  },
  {
    type: 'Three',
    color: '#667178',
    stroke: 'black'
  },
  {
    type: 'Four',
    color: '#f4e956',
    stroke: 'black'
  },
  {
    type: 'Five',
    color: '#e3a51a',
    stroke: 'black'
  },
  {
    type: 'Six',
    color: '#aaac84',
    stroke: 'black'
  },
  {
    type: 'Seven',
    color: '#dce7c5',
    stroke: 'black'
  },
  {
    type: 'Eight',
    color: '#e4e8ec',
    stroke: 'black'
  }
];

export default class ScatterplotContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataDisplay: '',
      showToolTip: false,
      randomDataIntervalId: null,
      windowWidth: 400,
      componentWidth: 1000
    };
    this.data = this.generateData();
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize.bind(this));
    this.handleResize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  generateData() {
    const data = [];
    const keys = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

    keys.map((key) => {
      data.push({type: key, x: this.getRandomArbitrary(1, 1000), y: this.getRandomArbitrary(1, 1000)});
    });
    return data;
  }

  handleResize() {
    this.setState({
      windowWidth: window.innerWidth - 100,
      componentWidth: this.refs.component.offsetWidth
    });
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

  toggleState() {
    this.setState({
      active: !this.state.active
    });
  }

  render() {
    const cn = this.state.active ? 'menu active' : 'menu';
    return (
      <div>
        <aside id="menu" className={cn}>
          <a id="menuToggle" className="menu__toggle" aria-hidden="true" href="#" onClick={this.toggleState.bind(this)}>
            <span>Toggle menu</span>
          </a>
          <nav className="menu__nav">
            <ul>
              <li><a href="../" className="menu__all-charts">&#8592; All charts</a></li>
            </ul>
            <Scrollspy
              items={
                ['introduction',
                'data',
                'heightAndWidth',
                'margin',
                'axes',
                'yaxesorientation',
                'axesLabels',
                'dotRadius',
                'config',
                'grid',
                'verticalGrid',
                'axisType',
                'domainRange',
                'mouseEvents',
                'customLegend',
                'dataType',
                'generateData',
                'fluid'
                ]
              }
              currentClassName="active"
            >
              <li><a href="#introduction">Introduction</a></li>
              <li><a href="#data">Data</a></li>
              <li><a href="#heightAndWidth">Height &amp; Width</a></li>
              <li><a href="#margin">Margin</a></li>
              <li><a href="#axes">Axes</a></li>
              <li><a href="#yaxesorientation">Y Axis orientation</a></li>
              <li><a href="#axesLabels">Axes labels</a></li>
              <li><a href="#dotRadius">Dot Radius</a></li>
              <li><a href="#config">Config</a></li>
              <li><a href="#grid">Grid</a></li>
              <li><a href="#verticalGrid">Vertical Grid</a></li>
              <li><a href="#axisType">Axis type</a></li>
              <li><a href="#domainRange">Domain range</a></li>
              <li><a href="#mouseEvents">Mouse events</a></li>
              <li><a href="#customLegend">Custom legend</a></li>
              <li><a href="#dataType">3rd data type</a></li>
              <li><a href="#generateData">Generate data</a></li>
              <li><a href="#fluid">Fluid</a></li>
            </Scrollspy>
          </nav>
        </aside>
        <div className="content">
          <h1>Scatterplot chart</h1>
          <div ref="component">
            <ScatterplotChart
              data={this.data}
              dotRadius={20}
              width={this.state.componentWidth}
              height={this.state.componentWidth / 2}
            />
          </div>
          <section id="introduction">
          <h2>Introduction</h2>
          <p>A scatter plot, scatterplot, or scattergraph is a type of mathematical diagram using Cartesian coordinates to display values for typically two variables for a set of data.<sup>(<a href="https://en.wikipedia.org/wiki/Scatter_plot">ref</a>)</sup></p>
          </section>

          <section id="data">
          <h2>Data</h2>
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
         </section>

         <section id="heightAndWidth">
         <h2>Height and Width</h2>
         <p>The height and width can be easily set by passing in a numeric value in as a prop.</p>
         <pre>
         <code dangerouslySetInnerHTML={{__html: escapeHTML(`
  <ScatterplotChart data={data} width={160} height={90} />
         `)}}
         />
         </pre>
         <ScatterplotChart data={bigData} width={160} height={90} />
         </section>

         <section id="margin">
         <h2>Margin</h2>
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
         </section>

         <section id="axes">
         <h2>Axes</h2>
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
         </section>

         <section id="yaxesorientation">
         <h2>Y Axis orientation</h2>
           <p>The Y axis can be placed on the right hand side by passing a boolean flag to true for yAxisOrientRight</p>
            <pre>
            <code dangerouslySetInnerHTML={{__html: escapeHTML(`
  <ScatterplotChart
    data={bigData}
    axes
    yAxisOrientRight
    axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
    width={480}
    height={270}
  />
            `)}}
            />
            </pre>
            <ScatterplotChart
              data={bigData}
              axes
              yAxisOrientRight
              axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
              width={480}
              height={270}
            />
        </section>


        <section id="axesLabels">
         <h2>Axes labels</h2>
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
         </section>

         <section id="dotRadius">
         <h2>Dot radius</h2>
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
         </section>

         <section id="config">
         <h2>Config</h2>
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
         </section>

         <section id="grid">
          <h2>Grid</h2>
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
        </section>

        <section id="verticalGrid">
        <h2>Vertical Grid</h2>
        <p>A vertical grid can be added to the graph by just passing in a boolean for verticalGrid.</p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<ScatterplotChart
  data={data}
  axes
  verticalGrid
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
          verticalGrid
          axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
          dotRadius={6}
          width={480}
          height={270}
          grid
        />
        </section>

        <section id="axisType">
        <h2>Axis type</h2>
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
          </section>

          <section id="domainRange">
          <h2>Domain Range</h2>
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
          </section>

          <section id="mouseEvents">
          <h2>Mouse events</h2>
          <p>The chart accepts the following mouse events</p>
          <ul>
            <li>- Mouse over</li>
            <li>- Mouse out</li>
            <li>- Mouse move</li>
            <li>- Click</li>
          </ul>
          <p>The event handlers provides the mouse event and the point data.</p>
          <p>The example below demostrates a simple tooltip</p>
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
          </section>

          <section id="customLegend">
          <h2>Custom legend</h2>
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
          </section>

          <section id="dataType">
          <h2>3rd data type</h2>
          <p>Its also possible to pass in a third variable (z). This variable is a number and is used to scale the radius of the dot</p>
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
          </section>

        <section id="generateData">
        <h2>Generate data</h2>
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
            grid
            axes
            axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
            margin={{top: 10, right: 10, bottom: 30, left: 60}}
            width={480}
            height={270}
          />
          <h2 id="fluid">Fluid</h2>
          <p>Because the width and height of the chart can be passed in by a param then changes to the size of a window or container can change the chart dynamically. If you shrink your browser window width you will see the chart change in a fluid manor. You can also introduce basic break points such as removing the axes if below a certain width width.</p>
          <ScatterplotChart
            data={this.data}
            grid
            axes={(this.state.componentWidth) > 400 ? true : false}
            axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
            margin={{top: 10, right: 10, bottom: 30, left: 60}}
            width={this.state.componentWidth}
            height={this.state.componentWidth / 2}
          />
          </section>
          <br />
          <br />
          <br />
          {this.state.showToolTip ?
            <ToolTip top={this.state.top} left={this.state.left}>The x value is {this.state.x} and the y value is {this.state.y}</ToolTip>
              : null}
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <ScatterplotContainer />, document.getElementById('root'));
