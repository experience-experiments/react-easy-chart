/* eslint import/no-unresolved: 0 */

import React from 'react';
import ReactDOM from 'react-dom';
import { BarChart } from 'react-easy-chart';
import ToolTip from '../ToolTip';
import { escapeHTML } from '../util';
import { Scrollspy } from 'react-scrollspy';

export default class BarChartContainer extends React.Component {
  constructor(props) {
    super(props);

    this.data = this.generateData();

    this.mouseOverHandler = this.mouseOverHandler.bind(this);
    this.mouseOutHandler = this.mouseOutHandler.bind(this);
    this.mouseMoveHandler = this.mouseMoveHandler.bind(this);

    this.updateData = this.updateData.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.toggleState = this.toggleState.bind(this);

    this.turnOffRandomData = this.turnOffRandomData.bind(this);
    this.turnOnRandomData = this.turnOnRandomData.bind(this);

    const initialWidth = window.innerWidth > 0 ? window.innerWidth : 500;
    this.state = {
      showToolTip: false,
      windowWidth: initialWidth - 100,
      componentWidth: 300
    };

    this.defaultData = [{
      x: 'A',
      y: 46
    },
    {
      x: 'B',
      y: 49
    },
    {
      x: 'C',
      y: 6
    },
    {
      x: 'D',
      y: 6
    },
    {
      x: 'E',
      y: 20
    },
    {
      x: 'F',
      y: 51
    },
    {
      x: 'G',
      y: 75
    },
    {
      x: 'H',
      y: 35
    },
    {
      x: 'I',
      y: 95
    },
    {
      x: 'J',
      y: 61
    },
    {
      x: 'K',
      y: 95
    },
    {
      x: 'L',
      y: 60
    },
    {
      x: 'M',
      y: 59
    },
    {
      x: 'N',
      y: 24
    },
    {
      x: 'O',
      y: 88
    },
    {
      x: 'P',
      y: 45
    },
    {
      x: 'Q',
      y: 30
    },
    {
      x: 'R',
      y: 59
    },
    {
      x: 'S',
      y: 34
    },
    {
      x: 'T',
      y: 18
    }];

    this.defaultLineData = [{
      x: 'A',
      y: 800
    },
    {
      x: 'B',
      y: 1100
    },
    {
      x: 'C',
      y: 1101
    },
    {
      x: 'D',
      y: 2000
    },
    {
      x: 'E',
      y: 900
    },
    {
      x: 'F',
      y: 1000
    },
    {
      x: 'G',
      y: 1500
    },
    {
      x: 'H',
      y: 1580
    },
    {
      x: 'I',
      y: 1900
    },
    {
      x: 'J',
      y: 700
    },
    {
      x: 'K',
      y: 1000
    },
    {
      x: 'L',
      y: 1500
    },
    {
      x: 'M',
      y: 1200
    },
    {
      x: 'N',
      y: 1300
    },
    {
      x: 'O',
      y: 1800
    },
    {
      x: 'P',
      y: 1900
    },
    {
      x: 'Q',
      y: 1200
    },
    {
      x: 'R',
      y: 1500
    },
    {
      x: 'S',
      y: 1900
    },
    {
      x: 'T',
      y: 1400
    }];
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
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
    xs.forEach((x) => {
      data.push({ x, y: this.getRandomArbitrary(1, 100) });
    });
    return data;
  }

  turnOnRandomData() {
    this.setState({ randomDataIntervalId: setInterval(this.updateData, 1000) });
  }

  turnOffRandomData() {
    clearInterval(this.state.randomDataIntervalId);
    this.setState({ randomDataIntervalId: null });
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
      x: d.x });
  }

  mouseMoveHandler(e) {
    if (this.state.showToolTip) {
      this.setState({ top: `${e.y - 10}px`, left: `${e.x + 10}px` });
    }
  }

  mouseOutHandler() {
    this.setState({ showToolTip: false });
  }

  clickHandler(d) {
    this.setState({ dataDisplay: `The amount selected is ${d.y}` });
  }

  toggleState() {
    this.setState({
      active: !this.state.active
    });
  }

  createTooltip() {
    if (this.state.showToolTip) {
      return (
        <ToolTip
          top={this.state.top}
          left={this.state.left}
        >
            The x value is {this.state.x} and the y value is {this.state.y}
        </ToolTip>
      );
    }
    return false;
  }

  render() {
    const cn = this.state.active ? 'menu active' : 'menu';
    return (
      <div>
        <aside id="menu" className={cn}>
          <a
            id="menuToggle"
            className="menu__toggle"
            aria-hidden="true"
            href="#"
            onClick={this.toggleState}
          >
            <span>Toggle menu</span>
          </a>
          <nav className="menu__nav">
            <ul>
              <li><a href="../" className="menu__all-charts">&#8592; All charts</a></li>
            </ul>
            <Scrollspy
              items={[
                'introduction',
                'data',
                'heightAndWidth',
                'colorBars',
                'margin',
                'overridingBarColors',
                'axes',
                'axesLabels',
                'yaxesorientation',
                'axesType',
                'datePattern',
                'barWidth',
                'domainRange',
                'tickDisplay',
                'numberOfTicks',
                'grid',
                'bar_and_line',
                'mouseHandlers',
                'clickHandler',
                'updateData',
                'fluid'
              ]}
              currentClassName="active"
            >
              <li><a href="#introduction">Introduction</a></li>
              <li><a href="#data">Data</a></li>
              <li><a href="#heightAndWidth">Height &amp; Width</a></li>
              <li><a href="#colorBars">Color Bars</a></li>
              <li><a href="#margin">Margin</a></li>
              <li><a href="#overridingBarColors">Overriding bar colors</a></li>
              <li><a href="#axes">Axes</a></li>
              <li><a href="#axesLabels">Axes labels</a></li>
              <li><a href="#yaxesorientation">Y Axis orientation</a></li>
              <li><a href="#axesType">Axes type</a></li>
              <li><a href="#datePattern">Date Pattern</a></li>
              <li><a href="#barWidth">Bar width</a></li>
              <li><a href="#domainRange">Domain range</a></li>
              <li><a href="#tickDisplay">Tick display format</a></li>
              <li><a href="#numberOfTicks">Number of ticks</a></li>
              <li><a href="#grid">Grid</a></li>
              <li><a href="#bar_and_line">Bar and Line</a></li>
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
              axisLabels={{ x: 'My x Axis', y: 'My y Axis' }}
              axes={(this.state.componentWidth / 3) > 400}
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

          <section id="introduction">
            <h2>Introduction</h2>
            <p>
              A bar chart or bar graph is a chart that presents Grouped data with rectangular bars
              with lengths proportional to the values that they
              represent.<sup>(<a href="https://en.wikipedia.org/wiki/Bar_chart">ref</a>)</sup>
            </p>
          </section>

          <section id="data">
            <h2>Data</h2>

            <p>
              At the most basic the Bar chart can just take a single data file supplied in a JSON
              format and will render a simple Bar chart.
            </p>

            <pre>
            {(() => {
              const html = (`
  <BarChart
    data={[
      {x: 'A', y: 20},
      {x: 'B', y: 30},
      {x: 'C', y: 40},
      {x: 'D', y: 20},
      {x: 'E', y: 40},
      {x: 'F', y: 25},
      {x: 'G', y: 5}
    ]}
  />`);
              return (
                <code dangerouslySetInnerHTML={{ __html: escapeHTML(html) }} />
              );
            })()}
            </pre>

            <BarChart
              data={[
                { x: 'A', y: 20 },
                { x: 'B', y: 30 },
                { x: 'C', y: 40 },
                { x: 'D', y: 20 },
                { x: 'E', y: 40 },
                { x: 'F', y: 25 },
                { x: 'G', y: 5 }
              ]}
            />

          </section>

          <section id="heightAndWidth">
            <h2>Height and Width</h2>

            <p>
              The height and width can be easily set by passing in a numeric y in as a prop.
            </p>

            <pre>
            {(() => {
              const html = (`
  <BarChart
    height={150}
    width={350}
    data={[
      {
        x: 'A',
        y: 46
      },
      {
        x: 'B',
        y: 26
      } ...
    ]}
  />`);
              return (
                <code dangerouslySetInnerHTML={{ __html: escapeHTML(html) }} />
              );
            })()}
            </pre>

            <BarChart
              height={150}
              width={650}
              data={this.defaultData}
            />

          </section>

          <section id="colorBars">
            <h2>ColorBars</h2>

            <p>
              The bars can be automatically colored by turning on the colorBars boolean.
            </p>

            <pre>
            {(() => {
              const html = (`
  <BarChart
    colorBars
    height={150}
    width={650}
    data={[
      {
        x: 'A',
        y: 46
      },
      {
        x: 'B',
        y: 26
      } ...
    ]}
  />`);
              return (
                <code dangerouslySetInnerHTML={{ __html: escapeHTML(html) }} />
              );
            })()}
            </pre>

            <BarChart
              colorBars
              height={150}
              width={650}
              data={this.defaultData}
            />

          </section>

          <section id="margin">
            <h2>Margin</h2>

            <p>
              The Margin can be overridden by passing in a margin object. The margin object must
              define the following: top, right, bottom and left.
            </p>

            <p>
              This can be particulary useful if a label is cut off.
            </p>

            <pre>
            {(() => {
              const html = (`
  <BarChart
    colorBars
    height={150}
    width={650}
    data={this.defaultData}
    margin={{top: 0, right: 0, bottom: 30, left: 100}}
  />`);
              return (
                <code dangerouslySetInnerHTML={{ __html: escapeHTML(html) }} />
              );
            })()}
            </pre>

            <BarChart
              colorBars
              height={150}
              width={650}
              data={this.defaultData}
              margin={{ top: 0, right: 0, bottom: 30, left: 100 }}
            />

          </section>

          <section id="overridingBarColors">
            <h2>Overriding Bar colors</h2>

            <p>
              A single bar or number of bars can be colored by adding a color prop to the relevent
              data item.
            </p>

            <pre>
            {(() => {
              const html = (`
  <BarChart
    data={[
      { x: 'A', y: 20 },
      { x: 'B', y: 30, color: '#f00' },
      { x: 'C', y: 40 },
      { x: 'D', y: 20 },
      { x: 'E', y: 40 },
      { x: 'F', y: 25 },
      { x: 'G', y: 5, color: 'orange' }
    ]}
  />`);
              return (
                <code dangerouslySetInnerHTML={{ __html: escapeHTML(html) }} />
              );
            })()}
            </pre>

            <BarChart
              data={[
                { x: 'A', y: 20 },
                { x: 'B', y: 30, color: '#f00' },
                { x: 'C', y: 40 },
                { x: 'D', y: 20 },
                { x: 'E', y: 40 },
                { x: 'F', y: 25 },
                { x: 'G', y: 5, color: 'orange' }
              ]}
            />

          </section>

          <section id="axes">
            <h2>Axes</h2>

            <p>
              The axes can be turned on by simply passing a boolean flag to true for axes.
            </p>

            <pre>
            {(() => {
              const html = (`
  <BarChart
    axes
    height={250}
    width={650}
    data={[
      {
        x: 'A',
        y: 46
      },
      {
        x: 'B',
        y: 26
      } ...
    ]}
  />`);
              return (
                <code dangerouslySetInnerHTML={{ __html: escapeHTML(html) }} />
              );
            })()}
            </pre>

            <BarChart
              height={250}
              width={650}
              axes
              data={this.defaultData}
            />

          </section>

          <section id="axesLabels">
            <h2>Axes Labels</h2>

            <p>
              The axes labels can be overridden by simply passing <b>axisLabels</b> object with
              both a x and y y.
            </p>

            <pre>
            {(() => {
              const html = (`
  <BarChart
    axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
    axes
    data={[
      {
        x: 'A',
        y: 46
      },
      {
        x: 'B',
        y: 26
      } ...
    ]}
  />`);
              return (
                <code dangerouslySetInnerHTML={{ __html: escapeHTML(html) }} />
              );
            })()}
            </pre>

            <BarChart
              axisLabels={{ x: 'My x Axis', y: 'My y Axis' }}
              axes
              height={250}
              width={650}
              data={this.defaultData}
            />

          </section>

          <section id="yaxesorientation">
            <h2>Y Axis orientation</h2>

            <p>
              The Y axis can be placed on the right hand side by passing a boolean flag to true
              for yAxisOrientRight.
            </p>

            <pre>
            {(() => {
              const html = (`
  <BarChart
    axes
    axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
    yAxisOrientRight
    height={250}
    width={650}
    data={[
      {
        x: 'A',
        y: 46
      },
      {
        x: 'B',
        y: 26
      } ...
    ]}
  />`);
              return (
                <code dangerouslySetInnerHTML={{ __html: escapeHTML(html) }} />
              );
            })()}
            </pre>

            <BarChart
              height={250}
              width={650}
              axes
              axisLabels={{ x: 'My x Axis', y: 'My y Axis' }}
              yAxisOrientRight
              data={this.defaultData}
            />

          </section>

          <section id="axesType">
            <h2>Axes type</h2>

            <p>
              The data passed associated to the particular axes can be in numeric, date (the
              default format is for example 1-Jan-15 but can be overridden) or textual
              formats (used for labelling).
            </p>

            <p>
              By default the xType is text (or ordinal in d3) and so allows text labelling.
              The example below passes 'linear' as the xType and the data x is numeric.
            </p>

            <pre>
            {(() => {
              const html = (`
  <BarChart
    axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
    axes
    height={250}
    width={650}
    xType={'linear'}
    data={[
      { x: 10, y: 20 },
      { x: 12, y: 20 },
      { x: 30, y: 30, color: '#f00' },
      { x: 40, y: 40 }
    ]}
  />`);
              return (
                <code dangerouslySetInnerHTML={{ __html: escapeHTML(html) }} />
              );
            })()}
            </pre>

            <BarChart
              axisLabels={{ x: 'My x Axis', y: 'My y Axis' }}
              axes
              height={250}
              width={650}
              xType={'linear'}
              data={[
                { x: 10, y: 20 },
                { x: 12, y: 20 },
                { x: 30, y: 30, color: '#f00' },
                { x: 40, y: 40 }
              ]}
            />

            <p>
              The xType can also be a time based y. The default format for the date data is for
              example 1-Jan-15 but can be overridden.
            </p>

            <pre>
            {(() => {
              const html = (`
  <BarChart
    axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
    axes
    height={250}
    width={650}
    colorBars
    xType={'time'}
    data={[
      { x: '1-Jan-15', y: 20 },
      { x: '2-Jan-15', y: 10 },
      { x: '3-Jan-15', y: 33 }
    ]}
  />`);
              return (
                <code dangerouslySetInnerHTML={{ __html: escapeHTML(html) }} />
              );
            })()}
            </pre>

            <BarChart
              axisLabels={{ x: 'My x Axis', y: 'My y Axis' }}
              axes
              height={250}
              width={650}
              colorBars
              xType={'time'}
              data={[
                { x: '1-Jan-15', y: 20 },
                { x: '2-Jan-15', y: 10 },
                { x: '3-Jan-15', y: 33 }
              ]}
            />

          </section>

          <section id="datePattern">
            <h2>Date Pattern</h2>

            <p>
              The datePattern can be overridden to allow any textual representation of the date to
              be parsed.
            </p>

            <p>
              The datePattern is passed in as a string param and uses for example <b>%d-%b-%y</b>
              to pass a value such as 15-Jan-15. More information on the d3 patterns can be found
              <a href="https://github.com/mbostock/d3/wiki/Time-Formatting">here</a>.
            </p>

            <pre>
            {(() => {
              const html = (`
  <BarChart
    axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
    axes
    height={250}
    width={650}
    datePattern="%d-%b-%y %H:%M"
    colorBars
    xType={'time'}
    data={[
      { x: '1-Jan-15 13:00', y: 20 },
      { x: '1-Jan-15 14:00', y: 10 },
      { x: '1-Jan-15 15:00', y: 33 }
    ]}
  />`);
              return (
                <code dangerouslySetInnerHTML={{ __html: escapeHTML(html) }} />
              );
            })()}
            </pre>

            <BarChart
              axisLabels={{ x: 'My x Axis', y: 'My y Axis' }}
              axes
              height={250}
              width={650}
              datePattern="%d-%b-%y %H:%M"
              colorBars
              xType={'time'}
              data={[
                { x: '1-Jan-15 13:00', y: 20 },
                { x: '1-Jan-15 14:00', y: 10 },
                { x: '1-Jan-15 15:00', y: 33 }
              ]}
            />

          </section>

          <section id="barWidth">
            <h2>Bar Width</h2>

            <p>
              The bar width can also be overridden. The default is 10px. This will only affect
              linear or time based x axis.
            </p>

            <pre>
            {(() => {
              const html = (`
  <BarChart
    axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
    axes
    height={250}
    width={650}
    margin={{top: 50, right: 100, bottom: 50, left: 100}}
    colorBars
    barWidth={40}
    xType={'time'}
    data={[
      { x: '1-Jan-15', y: 20 },
      { x: '2-Jan-15', y: 10 },
      { x: '3-Jan-15', y: 33 }
    ]}
  />`);
              return (
                <code dangerouslySetInnerHTML={{ __html: escapeHTML(html) }} />
              );
            })()}
            </pre>

            <BarChart
              axisLabels={{ x: 'My x Axis', y: 'My y Axis' }}
              axes
              height={250}
              width={650}
              margin={{ top: 50, right: 100, bottom: 50, left: 100 }}
              colorBars
              barWidth={40}
              xType={'time'}
              data={[
                { x: '1-Jan-15', y: 20 },
                { x: '2-Jan-15', y: 10 },
                { x: '3-Jan-15', y: 33 }
              ]}
            />

          </section>

          <section id="domainRange">
            <h2>Domain range</h2>

            <p>
              By default the axis ranges are automatically calculated based on the smallest and
              the largest ys.
            </p>

            <p>
              The range can be fixed by passing an array param of 2 numbers for the particular
              axis. The first number is the bottom of the range the second is the higher point
              of the range.
            </p>

            <pre>
            {(() => {
              const html = (`
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
    data={[
      { x: '10-Jan-15', y: 20 },
      { x: '12-Jan-15', y: 10 },
      { x: '15-Jan-15', y: 33 }
    ]}
  />`);
              return (
                <code dangerouslySetInnerHTML={{ __html: escapeHTML(html) }} />
              );
            })()}
            </pre>

            <BarChart
              axisLabels={{ x: 'My x Axis', y: 'My y Axis' }}
              axes
              colorBars
              height={250}
              width={650}
              barWidth={20}
              xType={'time'}
              xDomainRange={['5-Jan-15', '18-Jan-15']}
              yDomainRange={[5, 50]}
              data={[
                { x: '10-Jan-15', y: 20 },
                { x: '12-Jan-15', y: 10 },
                { x: '15-Jan-15', y: 33 }
              ]}
            />

          </section>

          <section id="tickDisplay">
            <h2>Tick display format</h2>

            <p>
              If the x or y axis  has an xType of time then a display for the axis can be overridden
              by setting the tickTimeDisplayFormat.
            </p>

            <p>
              The options are very flexible and can be seen here
              <a href="https://github.com/mbostock/d3/wiki/Time-Formatting">Time Formatting.</a>
            </p>

            <pre>
            {(() => {
              const html = (`
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
    data={[
      { x: '10-Jan-15', y: 20 },
      { x: '12-Jan-15', y: 10 },
      { x: '15-Jan-15', y: 33 }
    ]}
  />`);
              return (
                <code dangerouslySetInnerHTML={{ __html: escapeHTML(html) }} />
              );
            })()}
            </pre>

            <BarChart
              axisLabels={{ x: 'My x Axis', y: 'My y Axis' }}
              axes
              colorBars
              height={250}
              width={650}
              barWidth={20}
              xType={'time'}
              tickTimeDisplayFormat={'%a'}
              xDomainRange={['1-Jan-15', '20-Jan-15']}
              data={[
                { x: '10-Jan-15', y: 20 },
                { x: '12-Jan-15', y: 10 },
                { x: '15-Jan-15', y: 33 }
              ]}
            />

          </section>

          <section id="numberOfTicks">
            <h2>Number of ticks</h2>

            <p>
              The number of ticks of the x and y axis can be overridden by setting the xTickNumber
              or yTickNumber.
            </p>

            <pre>
            {(() => {
              const html = (`
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
    data={[
      { x: '10-Jan-15', y: 20 },
      { x: '12-Jan-15', y: 10 },
      { x: '15-Jan-15', y: 33 }
    ]}
  />`);
              return (
                <code dangerouslySetInnerHTML={{ __html: escapeHTML(html) }} />
              );
            })()}
            </pre>

            <BarChart
              axisLabels={{ x: 'My x Axis', y: 'My y Axis' }}
              axes
              colorBars
              height={250}
              width={650}
              barWidth={20}
              xTickNumber={5}
              yTickNumber={3}
              xType={'time'}
              xDomainRange={['1-Jan-15', '20-Jan-15']}
              data={[
                { x: '10-Jan-15', y: 20 },
                { x: '12-Jan-15', y: 10 },
                { x: '15-Jan-15', y: 33 }
              ]}
            />

          </section>

          <section id="grid">
            <h2>Grid</h2>
            <p>A grid can be added to the graph by just passing in a boolean.</p>
            <pre>
            {(() => {
              const html = (`
  <BarChart
    axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
    axes
    grid
    colorBars
    height={250}
    width={650}
    data={[
     {
       x: 'A',
       y: 46
     },
     {
       x: 'B',
       y: 26
     } ...
    ]}
  />`);
              return (
                <code dangerouslySetInnerHTML={{ __html: escapeHTML(html) }} />
              );
            })()}
            </pre>

            <BarChart
              axisLabels={{ x: 'My x Axis', y: 'My y Axis' }}
              axes
              grid
              colorBars
              height={250}
              width={650}
              data={this.defaultData}
            />

          </section>

          <section id="bar_and_line">
            <h2>Bar and Line</h2>

            <p>
              It is possible to add a line chart to the bar chart. This will automatically place
              a y-axis to the right hand side (or left if the data y has been assigned).
              This can have a different Y scale. The X axis though has to be shared and have the
              same range of values. The component also takes in a interpolate value (please see
              the line graph documentation). It can also take in a 3rd value into the labels to
              provide the label for the second y axis. A y2Type can also be set to change the y
              axis type.
            </p>

            <pre>
            {(() => {
              const html = (`
  <BarChart
    axisLabels={{x: 'My x Axis', y: 'My y Axis', y2: 'My second y Axis'}}
    axes
    grid
    colorBars
    height={450}
    width={650}
    interpolate={'cardinal'}
    y2Type="linear"
    lineData={[
      {
        x: 'A',
        y: 1000
      },
      {
        x: 'B',
        y: 2000
      } ...
    ]}
    data={[
      {
        x: 'A',
        y: 46
      },
      {
        x: 'B',
        y: 26
      } ...
    ]}
  />`);
              return (
                <code dangerouslySetInnerHTML={{ __html: escapeHTML(html) }} />
              );
            })()}
            </pre>

            <BarChart
              axisLabels={{ x: 'My x Axis', y: 'My y Axis', y2: 'My second y Axis' }}
              axes
              grid
              colorBars
              interpolate={'cardinal'}
              height={450}
              width={650}
              lineData={this.defaultLineData}
              data={this.defaultData}
            />

          </section>

          <section id="mouseHandlers">
            <h2>Mouse handlers</h2>

            <p>
              The chart will send out a mouseOver event, mouseMove and mouseOut event. This can be
              used by your react application in anyway you would require. The event handlers
              provides the mouse event and the bar data. The mouse event can for instance provide
              the x and y coordinates which can be used for a tool tip. The data is related to the
              bar currently moused over.
            </p>

            <pre>
            {(() => {
              const html = (`
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
        x: 'A',
        y: 46
      },
      {
        x: 'B',
        y: 26
      } ...
    ]}
    mouseOverHandler={this.mouseOverHandler}
    mouseOutHandler={this.mouseOutHandler}
    mouseMoveHandler={this.mouseMoveHandler}
    yDomainRange={[0, 100]}
  />`);
              return (
                <code dangerouslySetInnerHTML={{ __html: escapeHTML(html) }} />
              );
            })()}
            </pre>

            <BarChart
              axisLabels={{ x: 'My x Axis', y: 'My y Axis' }}
              axes
              grid
              colorBars
              height={250}
              width={650}
              data={this.defaultData}
              mouseOverHandler={this.mouseOverHandler}
              mouseOutHandler={this.mouseOutHandler}
              mouseMoveHandler={this.mouseMoveHandler}
              yDomainRange={[0, 100]}
            />

          </section>

          <section id="clickHandler">
            <h2>Click Handler</h2>

            <p>
              The chart will send out a click event. The event will pass the data and the event.
              This allows the data to be presented from the clicking of a segment in any way the
              react developer requires.
            </p>

            <pre>
            {(() => {
              const html = (`
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
            x: 'A',
            y: 46
          },
          {
            x: 'B',
            y: 26
          } ...
        ]}
        clickHandler={(d) => this.setState({dataDisplay: \`The value on the \${d.x} is \${d.y}\`})}
        yDomainRange={[0, 100]}
      />
    </div>
    <div style={{display: 'inline-block', verticalAlign: 'top', paddingLeft: '20px'}}>
      {this.state.dataDisplay ? this.state.dataDisplay : 'Click on a bar to show the value'}
    </div>
  </div>`);
              return (
                <code dangerouslySetInnerHTML={{ __html: escapeHTML(html) }} />
              );
            })()}
            </pre>
            <div>
              <div style={{ display: 'inline-block' }}>

                <BarChart
                  axisLabels={{ x: 'My x Axis', y: 'My y Axis' }}
                  axes
                  grid
                  colorBars
                  height={250}
                  width={650}
                  data={this.defaultData}
                  clickHandler={(d) => this.setState({
                    dataDisplay: `The value on the ${d.x} is ${d.y}`
                  })}
                  yDomainRange={[0, 100]}
                />

              </div>
              <div
                style={{
                  display: 'inline-block',
                  verticalAlign: 'top',
                  paddingLeft: '20px'
                }}
              >
                {(this.state.dataDisplay)
                  ? this.state.dataDisplay
                  : 'Click on a bar to show the value'}
              </div>
            </div>
          </section>

          <section id="updateData">
            <h2>Updating the data</h2>

            <p>
              By selecting the button below to start the random data you can see a simulation of
              the performance if a data feed is passed in. React provides the functionality to
              only update the elements of the dom when required so should just change the line
              attributes. The data is passed in as a react param only and as soon as that data
              changes the chart will reflect that change automatically.
            </p>

            {(this.state.randomDataIntervalId)
              ? <input type="button" value="Stop random data" onClick={this.turnOffRandomData} />
              : <input type="button" value="Start random data" onClick={this.turnOnRandomData} />}

            <BarChart
              axisLabels={{ x: 'My x Axis', y: 'My y Axis' }}
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

          </section>

          <section id="fluid">
            <h2>Fluid</h2>

            <p>
              Because the width and height of the chart can be passed in by a param then changes
              to the size of a window or container can change the chart dynamically. If you shrink
              your browser window width you will see the charts below change in a fluid manor.
              You can also introduce basic break points such as removing the axes if below a certain
              width.
            </p>

            <pre>
            {(() => {
              const html = (`
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
  </div>`);
              return (
                <code dangerouslySetInnerHTML={{ __html: escapeHTML(html) }} />
              );
            })()}
            </pre>
            <div style={{ display: 'inline-block' }}>
              <h4>2013</h4>

              <BarChart
                axisLabels={{ x: 'My x Axis', y: 'My y Axis' }}
                axes={(this.state.componentWidth) > 400}
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
          </section>
          <br />
          <br />

          {this.createTooltip()}

        </div>
      </div>
    );
  }
}

ReactDOM.render(<BarChartContainer />, document.getElementById('root'));
