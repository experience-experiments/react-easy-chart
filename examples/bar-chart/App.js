import React from 'react';
import ReactDOM from 'react-dom';
import {BarChart} from 'react-easy-chart';
import ToolTip from '../ToolTip';
import {escapeHTML} from '../util';
import Scrollspy from 'react-scrollspy';

export default class BarChartContainer extends React.Component {
    constructor(props) {
      super(props);
      this.data = this.generateData();
      const initialWidth = window.innerWidth > 0 ? window.innerWidth : 500;
      this.state = {
        showToolTip: false,
        windowWidth: initialWidth - 100,
        componentWidth: 300
      };
      this.defaultData = [{
        'x': 'A',
        'y': 46
      },
      {
        'x': 'B',
        'y': 49
      },
      {
        'x': 'C',
        'y': 6
      },
      {
        'x': 'D',
        'y': 6
      },
      {
        'x': 'E',
        'y': 20
      },
      {
        'x': 'F',
        'y': 51
      },
      {
        'x': 'G',
        'y': 75
      },
      {
        'x': 'H',
        'y': 35
      },
      {
        'x': 'I',
        'y': 95
      },
      {
        'x': 'J',
        'y': 61
      },
      {
        'x': 'K',
        'y': 95
      },
      {
        'x': 'L',
        'y': 60
      },
      {
        'x': 'M',
        'y': 59
      },
      {
        'x': 'N',
        'y': 24
      },
      {
        'x': 'O',
        'y': 88
      },
      {
        'x': 'P',
        'y': 45
      },
      {
        'x': 'Q',
        'y': 30
      },
      {
        'x': 'R',
        'y': 59
      },
      {
        'x': 'S',
        'y': 34
      },
      {
        'x': 'T',
        'y': 18
      }];
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

    handleResize() {
      this.setState({
        windowWidth: window.innerWidth - 100,
        componentWidth: this.refs.component.offsetWidth
      });
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
      this.setState({randomDataIntervalId: setInterval(this.updateData.bind(this), 1000)});
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

    toggleState() {
      this.setState({
        active: !this.state.active
      });
    }

    render() {
      const cn = this.state.active ? 'menu active' : 'menu';
      return (<div>
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
                'colorBars',
                'margin',
                'overridingBarColors',
                'axes',
                'yaxesorientation',
                'axesLabels',
                'axesType',
                'datePattern',
                'barWidth',
                'domainRange',
                'tickDisplay',
                'numberOfTicks',
                'grid',
                'mouseHandlers',
                'clickHandler',
                'updateData',
                'fluid'
                ]
              }
              currentClassName="active"
            >
              <li><a href="#introduction">Introduction</a></li>
              <li><a href="#data">Data</a></li>
              <li><a href="#heightAndWidth">Height &amp; Width</a></li>
              <li><a href="#colorBars">ColorBars</a></li>
              <li><a href="#margin">Margin</a></li>
              <li><a href="#overridingBarColors">Overriding bar colors</a></li>
              <li><a href="#axes">Axes</a></li>
              <li><a href="#yaxesorientation">Y Axis orientation</a></li>
              <li><a href="#axesLabels">Axes labels</a></li>
              <li><a href="#axesType">Axes type</a></li>
              <li><a href="#datePattern">Date Pattern</a></li>
              <li><a href="#barWidth">Bar width</a></li>
              <li><a href="#domainRange">Domain range</a></li>
              <li><a href="#tickDisplay">Tick display format</a></li>
              <li><a href="#numberOfTicks">Number of ticks</a></li>
              <li><a href="#grid">Grid</a></li>
              <li><a href="#mouseHandlers">Mouse handlers</a></li>
              <li><a href="#clickHandler">Click handler</a></li>
              <li><a href="#updateData">Updating the data</a></li>
              <li><a href="#fluid">Fluid</a></li>
            </Scrollspy>
          </nav>
        </aside>
        <div className="content">
        <h1>The React Easy Bar Chart</h1>
        <div ref="component">
          <BarChart
            axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
            axes={(this.state.componentWidth / 3) > 400 ? true : false}
            colorBars
            grid
            width={this.state.componentWidth}
            height={this.state.componentWidth / 2}
            xTickNumber={5}
            yTickNumber={5}
            yDomainRange={[0, 100]}
            data={this.defaultData}
          />
        </div>
        <h2 id="introduction">Introduction</h2>
        <p>A bar chart or bar graph is a chart that presents Grouped data with rectangular bars with lengths proportional to the values that they represent.<sup>(<a href="https://en.wikipedia.org/wiki/Bar_chart">ref</a>)</sup></p>
        <h2 id="data">Data</h2>
        <p>At the most basic the Bar chart can just take a single data file supplied in a JSON format and will render a simple Bar chart.</p>
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

      <h2 id="heightAndWidth">Height and Width</h2>
        <p>The height and width can be easily set by passing in a numeric y in as a prop.</p>
         <pre>
         <code dangerouslySetInnerHTML={{__html: escapeHTML(`
 <BarChart
   height={150}
   width={350}
   data={[
    {
      'x': 'A',
      'y': 46
    },
    {
      'x': 'B',
      'y': 26
    }....
  ]}
 />
         `)}}
         />
         </pre>
        <BarChart
          height={150}
          width={650}
          data={this.defaultData}
        />

        <h2 id="colorBars">ColorBars</h2>
        <p>The bars can be automatically colored by turning on the colorBars boolean.</p>
         <pre>
         <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<BarChart
 colorBars
 height={150}
 width={650}
 data={[
  {
    'x': 'A',
    'y': 46
  },
  {
    'x': 'B',
    'y': 26
  }....
]}
/>
         `)}}
         />
         </pre>

        <BarChart
          colorBars
          height={150}
          width={650}
          data={this.defaultData}
        />

        <h2 id="margin">Margin</h2>
        <p>The Margin can be overridden by passing in a margin object. The margin object must define the following: top, right, bottom and left</p>
        <p>This can be particulary useful if a label is cut off.</p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<BarChart
  colorBars
  height={150}
  width={650}
  data={this.defaultData}
  margin={{top: 0, right: 0, bottom: 30, left: 100}}
/>
        `)}}
        />
        </pre>

        <BarChart
          colorBars
          height={150}
          width={650}
          data={this.defaultData}
          margin={{top: 0, right: 0, bottom: 30, left: 100}}
        />

      <h2 id="overridingBarColors">Overriding Bar colors</h2>
        <p>A single bar or number of bars can be colored by adding a color prop to the relevent data item.</p>
         <pre>
         <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<BarChart
 data={[
   {x: 'A', y: 20},
    {x: 'B', y: 30, color: '#f00'},
     {x: 'C', y: 40},
      {x: 'D', y: 20},
       {x: 'E', y: 40},
        {x: 'F', y: 25},
         {x: 'G', y: 5, color: 'orange'}]}
/>
         `)}}
         />
         </pre>

        <BarChart
          data={[{x: 'A', y: 20}, {x: 'B', y: 30, color: '#f00'}, {x: 'C', y: 40}, {x: 'D', y: 20}, {x: 'E', y: 40}, {x: 'F', y: 25}, {x: 'G', y: 5, color: 'orange'}]}
        />

      <h2 id="axes">Axes</h2>
        <p>The axes can be turned on by simply passing a boolean flag to true for axes</p>
         <pre>
         <code dangerouslySetInnerHTML={{__html: escapeHTML(`
 <BarChart
   axes
   height={250}
   width={650}
   data={[
    {
      'x': 'A',
      'y': 46
    },
    {
      'x': 'B',
      'y': 26
    }....
 />
         `)}}
         />
         </pre>
        <BarChart
          height={250}
          width={650}
          axes
          data={this.defaultData}
        />

        <h2 id="axesLabels">Axes Labels</h2>
        <p>The axes labels can be overridden by simply passing <b>axisLabels</b> object with both a x and y y.</p>
         <pre>
         <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<BarChart
  axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
  axes
  data={[
   {
     'x': 'A',
     'y': 46
   },
   {
     'x': 'B',
     'y': 26
   }....
/>
         `)}}
         />
         </pre>
        <BarChart
          axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
          axes
          height={250}
          width={650}
          data={this.defaultData}
        />

        <h2 id="yaxesorientation">Y Axis orientation</h2>
          <p>The Y axis can be placed on the right hand side by passing a boolean flag to true for yAxisOrientRight</p>
           <pre>
           <code dangerouslySetInnerHTML={{__html: escapeHTML(`
      <BarChart
      axes
      axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
      yAxisOrientRight
      height={250}
      width={650}
      data={[
      {
        'x': 'A',
        'y': 46
      },
      {
        'x': 'B',
        'y': 26
      }....
      />
           `)}}
           />
           </pre>
          <BarChart
            height={250}
            width={650}
            axes
            axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
            yAxisOrientRight
            data={this.defaultData}
          />


      <h2 id="axesType">Axes type</h2>
        <p>The data passed associated to the particular axes can be in numeric, date (the default format is for example 1-Jan-15 but can be overridden) or textual formats (used for labelling).</p>

        <p>By default the xType is text (or ordinal in d3) and so allows text labelling. The example below passes 'linear' as the xType and the data x is numeric.</p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<BarChart
  axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
  axes
  height={250}
  width={650}
  xType={'linear'}
  data={[{x: 10, y: 20}, {x: 12, y: 20}, {x: 30, y: 30, color: '#f00'}, {x: 40, y: 40}]}
/>
        `)}}
        />
        </pre>
        <BarChart
          axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
          axes
          height={250}
          width={650}
          xType={'linear'}
          data={[{x: 10, y: 20}, {x: 12, y: 20}, {x: 30, y: 30, color: '#f00'}, {x: 40, y: 40}]}
        />

        <p>The xType can also be a time based y. The default format for the date data is for example 1-Jan-15 but can be overridden.</p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<BarChart
  axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
  axes
  height={250}
  width={650}
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
          height={250}
          width={650}
          colorBars
          xType={'time'}
          data={[{x: '1-Jan-15', y: 20}, {x: '2-Jan-15', y: 10}, {x: '3-Jan-15', y: 33}]}
        />

        <h2 id="datePattern">Date Pattern</h2>
        <p>The datePattern can be overridden to allow any textual representation of the date to be parsed.</p>
        <p>The datePattern is passed in as a string param and uses for example <b>%d-%b-%y</b> to pass a value such as 15-Jan-15.
         More information on the d3 patterns can be found <a href="https://github.com/mbostock/d3/wiki/Time-Formatting">here</a></p>
         <pre>
         <code dangerouslySetInnerHTML={{__html: escapeHTML(`
 <BarChart
   axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
   axes
   height={250}
   width={650}
   datePattern="%d-%b-%y %H:%M"
   colorBars
   xType={'time'}
   data={[{x: '1-Jan-15 13:00', y: 20}, {x: '1-Jan-15 14:00', y: 10}, {x: '1-Jan-15 15:00', y: 33}]}
 />
         `)}}
         />
         </pre>
         <BarChart
           axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
           axes
           height={250}
           width={650}
           datePattern="%d-%b-%y %H:%M"
           colorBars
           xType={'time'}
           data={[{x: '1-Jan-15 13:00', y: 20}, {x: '1-Jan-15 14:00', y: 10}, {x: '1-Jan-15 15:00', y: 33}]}
         />

        <h2 id="barWidth">Bar Width</h2>
        <p>The bar width can also be overridden. The default is 10px. This will only affect linear or time based x axis.</p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<BarChart
  axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
  axes
  height={250}
  width={650}
  margin={{top: 50, right: 100, bottom: 50, left: 100}}
  colorBars
  barWidth={40}
  xType={'time'}
  data={[{x: '1-Jan-15', y: 20}, {x: '2-Jan-15', y: 10}, {x: '3-Jan-15', y: 33}]}
/>
        `)}}
        />
        </pre>
        <BarChart
          axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
          axes
          height={250}
          width={650}
          margin={{top: 50, right: 100, bottom: 50, left: 100}}
          colorBars
          barWidth={40}
          xType={'time'}
          data={[{x: '1-Jan-15', y: 20}, {x: '2-Jan-15', y: 10}, {x: '3-Jan-15', y: 33}]}
        />

      <h2 id="domainRange">Domain range</h2>
        <p>By default the axis ranges are automatically calculated based on the smallest and the largest ys.</p>
        <p>The range can be fixed by passing an array param of 2 numbers for the particular axis.
        The first number is the bottom of the range the second is the higher point of the range.</p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<BarChart
  axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
  axes
  colorBars
  height={250}
  width={650}
  barWidth={20}
  xType={'time'}
  xDomainRange={['5-Jan-15', '18-Jan-15']}
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
          height={250}
          width={650}
          barWidth={20}
          xType={'time'}
          xDomainRange={['5-Jan-15', '18-Jan-15']}
          yDomainRange={[5, 50]}
          data={[{x: '10-Jan-15', y: 20}, {x: '12-Jan-15', y: 10}, {x: '15-Jan-15', y: 33}]}
        />

        <h2 id="tickDisplay">Tick display format</h2>
        <p>If the x or y axis  has an xType of time then a display for the axis can be overridden by setting the tickTimeDisplayFormat.</p>
        <p>The options are very flexible and can be seen here <a href="https://github.com/mbostock/d3/wiki/Time-Formatting">Time Formatting</a></p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<BarChart
  axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
  axes
  colorBars
  height={250}
  width={650}
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
          height={250}
          width={650}
          barWidth={20}
          xType={'time'}
          tickTimeDisplayFormat={'%a'}
          xDomainRange={['1-Jan-15', '20-Jan-15']}
          data={[{x: '10-Jan-15', y: 20}, {x: '12-Jan-15', y: 10}, {x: '15-Jan-15', y: 33}]}
        />

        <h2 id="numberOfTicks">Number of ticks</h2>
        <p>The number of ticks of the x and y axis can be overridden by setting the xTickNumber or yTickNumber.</p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<BarChart
  axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
  axes
  colorBars
  height={250}
  width={650}
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
          height={250}
          width={650}
          barWidth={20}
          xTickNumber={5}
          yTickNumber={3}
          xType={'time'}
          xDomainRange={['1-Jan-15', '20-Jan-15']}
          data={[{x: '10-Jan-15', y: 20}, {x: '12-Jan-15', y: 10}, {x: '15-Jan-15', y: 33}]}
        />

        <h2 id="grid">Grid</h2>
        <p>A grid can be added to the graph by just passing in a boolean.</p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<BarChart
  axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
  axes
  grid
  colorBars
  height={250}
  width={650}
  data={[
   {
     'x': 'A',
     'y': 46
   },
   {
     'x': 'B',
     'y': 26
   }....
  ]}
/>
        `)}}
        />
        </pre>
        <BarChart
          axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
          axes
          grid
          colorBars
          height={250}
          width={650}
          data={this.defaultData}
        />


        <h2 id="mouseHandlers">Mouse handlers</h2>
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
  grid
  colorBars
  height={250}
  width={650}
  data={[
   {
     'x': 'A',
     'y': 46
   },
   {
     'x': 'B',
     'y': 26
   }....
  ]}
  mouseOverHandler={this.mouseOverHandler.bind(this)}
  mouseOutHandler={this.mouseOutHandler.bind(this)}
  mouseMoveHandler={this.mouseMoveHandler.bind(this)}
  yDomainRange={[0, 100]}
/>
          `)}}
          />
          </pre>
          <BarChart
            axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
            axes
            grid
            colorBars
            height={250}
            width={650}
            data={this.defaultData}
            mouseOverHandler={this.mouseOverHandler.bind(this)}
            mouseOutHandler={this.mouseOutHandler.bind(this)}
            mouseMoveHandler={this.mouseMoveHandler.bind(this)}
            yDomainRange={[0, 100]}
          />

        <h2 id="clickHandler">Click Handler</h2>
        <p>The chart will send out a click event. The event will pass the data and the event. This allows the data to be presented from the clicking of a segment in any way the react developer requires.</p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<div>
  <div style={{display: 'inline-block'}}>
  <BarChart
    axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
    axes
    grid
    colorBars
    height={250}
    width={650}
    data={[
     {
       'x': 'A',
       'y': 46
     },
     {
       'x': 'B',
       'y': 26
     }....
    ]}
    clickHandler={(d) => this.setState({dataDisplay: \`The value on the \${d.x} is \${d.y}\`})}
    yDomainRange={[0, 100]}
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
            grid
            colorBars
            height={250}
            width={650}
            data={this.defaultData}
            clickHandler={(d) => this.setState({dataDisplay: `The value on the ${d.x} is ${d.y}`})}
            yDomainRange={[0, 100]}
          />
          </div>
          <div style={{display: 'inline-block', verticalAlign: 'top', paddingLeft: '20px'}}>
            {this.state.dataDisplay ? this.state.dataDisplay : 'Click on a bar to show the value'}
          </div>
        </div>

        <h2 id="updateData">Updating the data</h2>
        <p>By selecting the button below to start the random data you can see a simulation of the performance if a data feed is passed in.
         React provides the functionality to only update the elements of the dom when required so should just change the line attributes.
          The data is passed in as a
         react param only and as soon as that data changes the chart will reflect that change automatically.</p>
         {
           this.state.randomDataIntervalId ? <input type="button" value="Stop random data" onClick={this.turnOffRandomData.bind(this)}></input>
           :
           <input type="button" value="Start random data" onClick={this.turnOnRandomData.bind(this)}></input>
         }
         <BarChart
           axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
           axes
           colorBars
           grid
           height={250}
           width={650}
           xTickNumber={5}
           yTickNumber={5}
           yDomainRange={[0, 100]}
           data={this.data}
         />

         <h2 id="fluid">Fluid</h2>
         <p>Because the width and height of the chart can be passed in by a param then changes to the size of a window or container can change the chart dynamically.
         If you shrink your browser window width you will see the charts below change in a fluid manor. You can also introduce basic break points such as removing the axes if below a certain width.</p>
         <pre>
         <code dangerouslySetInnerHTML={{__html: escapeHTML(`
 <div style={{display: 'inline-block'}}>
 <h4>2013</h4>
 <BarChart
   axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
   axes={(this.state.componentWidth) > 400 ? true : false}
   colorBars
   grid
   width={this.state.componentWidth}
   height={this.state.componentWidth / 2}
   xTickNumber={5}
   yTickNumber={5}
   yDomainRange={[0, 100]}
   data={this.defaultData}
 />
 </div>
`)}}
         />
         </pre>
         <div style={{display: 'inline-block'}}>
         <h4>2013</h4>
         <BarChart
           axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
           axes={(this.state.componentWidth) > 400 ? true : false}
           colorBars
           grid
           width={this.state.componentWidth}
           height={this.state.componentWidth / 2}
           xTickNumber={5}
           yTickNumber={5}
           yDomainRange={[0, 100]}
           data={this.defaultData}
         />
         </div>
        <br/>
        <br/>
        <br/>
        {this.state.showToolTip ? <ToolTip top={this.state.top} left={this.state.left}>The value on the {this.state.x} is {this.state.y}</ToolTip> : null}
      </div></div>
      );
    }
}

ReactDOM.render(<BarChartContainer/>, document.getElementById('root'));
