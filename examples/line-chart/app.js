import React from 'react';
import ReactDom from 'react-dom';
import {escapeHTML} from '../util';
import ToolTip from '../ToolTip';
import {LineChart} from 'react-easy-chart';
import moment from 'moment';
import {format} from 'd3-time-format';

class LineChartContainer extends React.Component {
    constructor(props) {
      super(props);
      // Generate multiple lines of data
      this.data = [this.generateData(), this.generateData(), this.generateData(), this.generateData()];
      const initialWidth = window.innerWidth > 0 ? window.innerWidth : 500;
      this.state = {showToolTip: false, windowWidth: initialWidth - 100};
    }

    componentDidMount() {
      window.addEventListener('resize', this.handleResize.bind(this));
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.handleResize);
    }

    getRandomArbitrary(min, max) {
      return Math.random() * (max - min) + min;
    }

    handleResize() {
      this.setState({windowWidth: window.innerWidth - 100});
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

    generateData() {
      const data = [];
      const xs = [];

      let date = moment('2015-1-1 00:00', 'YYYY-MM-DD HH:mm');
      for (let i = 1; i <= 12; i++) {
        xs.push(date.format('D-MMM-YY HH:mm'));
        date = date.add(1, 'hour');
      }
      xs.map((x) => {
        data.push({x: x, y: this.getRandomArbitrary(0, 100)});
      });
      return data;
    }

    turnOnRandomData() {
      this.setState({randomDataIntervalId: setInterval(this.updateData.bind(this), 200)});
    }

    turnOffRandomData() {
      clearInterval(this.state.randomDataIntervalId);
      this.setState({randomDataIntervalId: null});
    }

    updateData() {
      const parseDate = format('%d-%b-%y %H:%M').parse;
      this.data.map((data) => {
        data.shift();
        let y = this.getRandomArbitrary(
          data[data.length - 1].y - 20,
           data[data.length - 1].y + 20);
        if (y < 0 || y > 100) y = data[data.length - 1].y;
        const date = moment(parseDate(data[data.length - 1].x));
        date.add(1, 'hour');
        data.push({x: date.format('D-MMM-YY HH:mm'), y: y});
      });

      this.forceUpdate();
    }

    render() {
      return (<div>
        <h2>The React Easy Line chart</h2>
        <h3>Data</h3>
        <p>At the most basic the line chart can just take a single data file supplied in a JSON format and will render a
         simple line chart.</p>
        <p>The format of the data is an array of arrays which allows multiple lines to be generated.
        The x field represents the x axis and the y the y axis. This is to unify the data accross R2-D3 charts.</p>

        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<LineChart
  data={[[{x: 1, y: 20}, {x: 2, y: 10}, {x: 3, y: 25}]]}/>
        `)}}
        />
        </pre>

        <LineChart
          data={[[{x: 1, y: 20}, {x: 2, y: 10}, {x: 3, y: 25}]]}
        />
        <p>If a second line is needed then this is easily added by adding a new data array to the existing array. The number of lines drawn is infinite but only coloured up to 4 lines.</p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<LineChart
  data={[[{x: 1, y: 20}, {x: 2, y: 10}, {x: 3, y: 25}], [{x: 1, y: 10}, {x: 2, y: 12}, {x: 3, y: 4}]]}/>
        `)}}
        />
        </pre>
        <LineChart
          data={[[{x: 1, y: 20}, {x: 2, y: 10}, {x: 3, y: 25}], [{x: 1, y: 10}, {x: 2, y: 12}, {x: 3, y: 4}]]}
        />
        <h3>Height and Width</h3>
        <p>The height and width can be easily set by passing in a numeric y in as a prop.</p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<LineChart
width={50}
height={50}
data={[[{x: 1, y: 20}, {x: 2, y: 10}, {x: 3, y: 25}], [{x: 1, y: 10}, {x: 2, y: 12}, {x: 3, y: 4}]]}/>
        `)}}
        />
        </pre>
        <LineChart
          width={50}
          height={50}
          data={[[{x: 1, y: 20}, {x: 2, y: 10}, {x: 3, y: 25}], [{x: 1, y: 10}, {x: 2, y: 12}, {x: 3, y: 4}]]}
        />

        <h3>Margin</h3>
        <p>The Margin can be overridden by passing in a margin object. The margin object must define the following: top, right, bottom and left</p>
        <p>This can be particulary useful if a label is cut off.</p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<LineChart
margin={{top: 0, right: 0, bottom: 30, left: 100}}
width={250}
height={250}
data={[[{x: 1, y: 20}, {x: 2, y: 10}, {x: 3, y: 25}], [{x: 1, y: 10}, {x: 2, y: 12}, {x: 3, y: 4}]]}/>
        `)}}
        />
        </pre>
        <LineChart
          margin={{top: 0, right: 0, bottom: 30, left: 100}}
          width={350}
          height={250}
          data={[[{x: 1, y: 20}, {x: 2, y: 10}, {x: 3, y: 25}], [{x: 1, y: 10}, {x: 2, y: 12}, {x: 3, y: 4}]]}
        />

        <h3>Axes</h3>
        <p>The axes can be turned on by simply passing a boolean flag to true for <b>axes</b>.</p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<LineChart
  axes
  width={250}
  height={250}
  data={[[{x: 1, y: 20}, {x: 2, y: 10}, {x: 3, y: 25}], [{x: 1, y: 10}, {x: 2, y: 12}, {x: 3, y: 4}]]}/>
        `)}}
        />
        </pre>
        <LineChart
          axes
          width={350}
          height={250}
          data={[[{x: 1, y: 20}, {x: 2, y: 10}, {x: 3, y: 25}], [{x: 1, y: 10}, {x: 2, y: 12}, {x: 3, y: 4}]]}
        />

        <h3>Axes labels</h3>
        <p>The axisLabels can be overridden by simply passing <b>axisLabels</b> object with both a x and y y.</p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<LineChart
  axes
  margin={{top: 10, right: 10, bottom: 50, left: 50}}
  axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
  width={250}
  height={250}
  data={[[{x: 1, y: 20}, {x: 2, y: 10}, {x: 3, y: 25}], [{x: 1, y: 10}, {x: 2, y: 12}, {x: 3, y: 4}]]}/>
        `)}}
        />
        </pre>
        <LineChart
          axes
          margin={{top: 10, right: 10, bottom: 50, left: 50}}
          axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
          width={350}
          height={250}
          data={[[{x: 1, y: 20}, {x: 2, y: 10}, {x: 3, y: 25}], [{x: 1, y: 10}, {x: 2, y: 12}, {x: 3, y: 4}]]}
        />

        <h3>Interpolate (Making the lines smooth)</h3>
        <p>The Lines drawn can be set to be interpolated by passing in an interpolated param. By default this is set to linear.
        We can though override this for instance to make a cardinal line. The options that can be chosen can be found <a href="https://github.com/mbostock/d3/wiki/SVG-Shapes">here</a> under the interpolate section.</p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<LineChart
  axes
  margin={{top: 10, right: 10, bottom: 50, left: 50}}
  axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
  width={250}
  interpolate={'cardinal'}
  height={250}
  data={[[{x: 1, y: 20}, {x: 2, y: 10}, {x: 3, y: 25}], [{x: 1, y: 10}, {x: 2, y: 12}, {x: 3, y: 4}]]}/>
        `)}}
        />
        </pre>
        <LineChart
          interpolate={'cardinal'}
          axes
          margin={{top: 10, right: 10, bottom: 50, left: 50}}
          axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
          width={350}
          height={250}
          data={[[{x: 1, y: 20}, {x: 2, y: 10}, {x: 3, y: 25}], [{x: 1, y: 10}, {x: 2, y: 12}, {x: 3, y: 4}]]}
        />

        <h3>xType / yType</h3>
        <p>The data passed associated to the particular axes can be in numeric, date (the default
           format is for example 1-Jan-15 but can be overridden)
         or textual formats (used for labelling). </p>
        <p>For the example below the data for the x is text and so the <b>xType</b> needs to be changed to <b>text</b>.</p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<LineChart
  xType={'text'}
  axes
  width={350}
  height={250}
  interpolate={'cardinal'}
  data={[
    [{x: 'Mon', y: 20}, {x: 'Tue', y: 10}, {x: 'Wed', y: 33}, {x: 'Thu', y: 45}, {x: 'Fri', y: 15}],
    [{x: 'Mon', y: 10}, {x: 'Tue', y: 15}, {x: 'Wed', y: 13}, {x: 'Thu', y: 15}, {x: 'Fri', y: 10}]
  ]}
/>
        `)}}
        />
        </pre>
        <LineChart
          xType={'text'}
          axes
          interpolate={'cardinal'}
          width={350}
          height={250}
          data={[
            [{x: 'Mon', y: 20}, {x: 'Tue', y: 10}, {x: 'Wed', y: 33}, {x: 'Thu', y: 45}, {x: 'Fri', y: 15}],
            [{x: 'Mon', y: 10}, {x: 'Tue', y: 15}, {x: 'Wed', y: 13}, {x: 'Thu', y: 15}, {x: 'Fri', y: 10}]
          ]}
        />
        <p>Setting the <b>xType</b> to be <b>time</b></p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<LineChart
  xType={'time'}
  axes
  interpolate={'cardinal'}
  width={750}
  height={250}
  data={[
    [{x: '1-Jan-15', y: 20}, {x: '1-Feb-15', y: 10}, {x: '1-Mar-15', y: 33}, {x: '1-Apr-15', y: 45}, {x: '1-May-15', y: 15}],
    [{x: '1-Jan-15', y: 10}, {x: '1-Feb-15', y: 15}, {x: '1-Mar-15', y: 13}, {x: '1-Apr-15', y: 15}, {x: '1-May-15', y: 10}]
  ]}
/>
        `)}}
        />
        </pre>
        <LineChart
          xType={'time'}
          axes
          interpolate={'cardinal'}
          width={750}
          height={250}
          data={[
            [{x: '1-Jan-15', y: 20}, {x: '1-Feb-15', y: 10}, {x: '1-Mar-15', y: 33}, {x: '1-Apr-15', y: 45}, {x: '1-May-15', y: 15}],
            [{x: '1-Jan-15', y: 10}, {x: '1-Feb-15', y: 15}, {x: '1-Mar-15', y: 13}, {x: '1-Apr-15', y: 15}, {x: '1-May-15', y: 10}]
          ]}
        />

        <p>Setting the <b>yType</b> to be <b>text</b>. (The yDomainRange has also been set to keep the range order.)</p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<LineChart
  yType={'text'}
  xType={'text'}
  axes
  margin={{top: 0, right: 0, bottom: 100, left: 100}}
  yDomainRange={['Allot', 'Middle', 'Less']}
  interpolate={'cardinal'}
  width={350}
  height={250}
  data={[
    [{x: 'Mon', y: 'Less'}, {x: 'Tue', y: 'Middle'}, {x: 'Wed', y: 'Middle'}, {x: 'Thu', y: 'Less'}, {x: 'Fri', y: 'Middle'}]
  ]}
/>
        `)}}
        />
        </pre>
        <LineChart
          yType={'text'}
          xType={'text'}
          axisLabels={{x: 'Day', y: 'How much did I eat'}}
          axes
          interpolate={'cardinal'}
          margin={{top: 10, right: 30, bottom: 50, left: 70}}
          width={350}
          height={250}
          yDomainRange={['Allot', 'Perfect', 'Little']}
          data={[
            [{x: 'Mon', y: 'Little'}, {x: 'Tue', y: 'Perfect'}, {x: 'Wed', y: 'Allot'}, {x: 'Thu', y: 'Little'}, {x: 'Fri', y: 'Perfect'}]
          ]}
        />
        <p>Setting the <b>yType</b> to be <b>time</b></p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<LineChart
  axisLabels={{x: 'Total Revenue', y: 'January'}}
  margin={{top: 10, right: 30, bottom: 50, left: 70}}
  yType={'time'}
  axes
  width={500}
  height={500}
  data={[
    [{x: 10, y: '1-Jan-15'}, {x: 20, y: '10-Jan-15'}, {x: 40, y: '21-Jan-15'}, {x: 80, y: '31-Jan-15'}],
    [{x: 0, y: '1-Jan-15'}, {x: 15, y: '10-Jan-15'}, {x: 20, y: '21-Jan-15'}, {x: 25, y: '31-Jan-15'}]
  ]}
/>
        `)}}
        />
        </pre>
        <LineChart
          axisLabels={{x: 'Total Revenue', y: 'January'}}
          margin={{top: 10, right: 30, bottom: 50, left: 70}}
          yType={'time'}
          interpolate={'cardinal'}
          axes
          width={500}
          height={500}
          data={[
            [{x: 10, y: '1-Jan-15'}, {x: 20, y: '10-Jan-15'}, {x: 40, y: '21-Jan-15'}, {x: 80, y: '31-Jan-15'}],
            [{x: 0, y: '1-Jan-15'}, {x: 15, y: '10-Jan-15'}, {x: 20, y: '21-Jan-15'}, {x: 25, y: '31-Jan-15'}]
          ]}
        />

        <h3>Grid</h3>
        <p>A grid can be added to the graph by just passing in a boolean.</p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<LineChart
  axisLabels={{x: 'Total Revenue', y: 'January'}}
  margin={{top: 10, right: 30, bottom: 50, left: 70}}
  yType={'time'}
  axes
  grid
  width={500}
  height={500}
  data={[
    [{x: 10, y: '1-Jan-15'}, {x: 20, y: '10-Jan-15'}, {x: 40, y: '21-Jan-15'}, {x: 80, y: '31-Jan-15'}],
    [{x: 0, y: '1-Jan-15'}, {x: 15, y: '10-Jan-15'}, {x: 20, y: '21-Jan-15'}, {x: 25, y: '31-Jan-15'}]
  ]}
/>
        `)}}
        />
        </pre>
        <LineChart
          axisLabels={{x: 'Total Revenue', y: 'January'}}
          margin={{top: 10, right: 30, bottom: 50, left: 70}}
          yType={'time'}
          interpolate={'cardinal'}
          axes
          grid
          width={500}
          height={500}
          data={[
            [{x: 10, y: '1-Jan-15'}, {x: 20, y: '10-Jan-15'}, {x: 40, y: '21-Jan-15'}, {x: 80, y: '31-Jan-15'}],
            [{x: 0, y: '1-Jan-15'}, {x: 15, y: '10-Jan-15'}, {x: 20, y: '21-Jan-15'}, {x: 25, y: '31-Jan-15'}]
          ]}
        />

        <h3>range yDomainRange, xDomainRange</h3>
        <p>By default the axis ranges are automatically calculated based on the smallest and the largest ys.</p>
        <p>The range can be fixed by passing an array param of 2 numbers for the particular axis.
        The first number is the bottom of the range the second is the higher point of the range.</p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<LineChart
  axes
  xDomainRange={[0, 100]}
  yDomainRange={[0, 100]}
  margin={{top: 0, right: 0, bottom: 100, left: 100}}
  width={250}
  height={250}
  interpolate={'cardinal'}
  data={[
    [{x: 10, y: 25}, {x: 20, y: 10}, {x: 30, y: 25}, {x: 40, y: 10}, {x: 50, y: 12}, {x: 60, y: 4}],
    [{x: 10, y: 40}, {x: 20, y: 30}, {x: 30, y: 25}, {x: 40, y: 60}, {x: 50, y: 22}, {x: 60, y: 9}]
  ]}
/>
        `)}}
        />
        </pre>
        <LineChart
          axes
          xDomainRange={[0, 100]}
          yDomainRange={[0, 100]}
          width={500}
          height={250}
          interpolate={'cardinal'}
          data={[
            [{x: 10, y: 25}, {x: 20, y: 10}, {x: 30, y: 25}, {x: 40, y: 10}, {x: 50, y: 12}, {x: 60, y: 25}],
            [{x: 10, y: 40}, {x: 20, y: 30}, {x: 30, y: 25}, {x: 40, y: 60}, {x: 50, y: 22}, {x: 60, y: 9}]
          ]}
        />
        <h3>Tick display format</h3>
        <p>If the x or y axis  has an xType/yType of time then a display for the axis can be overridden by setting the tickTimeDisplayFormat.</p>
        <p>The options are very flexible and can be seen here <a href="https://github.com/mbostock/d3/wiki/Time-Formatting">Time Formatting</a></p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<LineChart
  axisLabels={{x: 'Total Revenue', y: 'January'}}
  margin={{top: 10, right: 30, bottom: 50, left: 70}}
  yType={'time'}
  axes
  interpolate={'cardinal'}
  tickTimeDisplayFormat={'%a'}
  width={500}
  height={500}
  data={[
    [{x: 10, y: '1-Jan-15'}, {x: 20, y: '10-Jan-15'}, {x: 40, y: '21-Jan-15'}, {x: 80, y: '31-Jan-15'}],
    [{x: 0, y: '1-Jan-15'}, {x: 15, y: '10-Jan-15'}, {x: 20, y: '21-Jan-15'}, {x: 25, y: '31-Jan-15'}]
  ]}
/>
        `)}}
        />
        </pre>
        <LineChart
          axisLabels={{x: 'Total Revenue', y: 'January'}}
          margin={{top: 10, right: 30, bottom: 50, left: 70}}
          yType={'time'}
          axes
          interpolate={'cardinal'}
          tickTimeDisplayFormat={'%a'}
          width={500}
          height={500}
          data={[
            [{x: 10, y: '1-Jan-15'}, {x: 20, y: '10-Jan-15'}, {x: 40, y: '21-Jan-15'}, {x: 80, y: '31-Jan-15'}],
            [{x: 0, y: '1-Jan-15'}, {x: 15, y: '10-Jan-15'}, {x: 20, y: '21-Jan-15'}, {x: 25, y: '31-Jan-15'}]
          ]}
        />

        <h3>Setting the tick numbers</h3>
        <p>The number of ticks on the x and y axis can be set by passing in a number to xTicks or yTicks.
        This can make the axis easier to read.</p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<LineChart
  axes
  xTicks={5}
  yTicks={5}
  xDomainRange={[0, 100]}
  yDomainRange={[0, 100]}
  width={500}
  height={250}
  interpolate={'cardinal'}
  data={[
    [{x: 10, y: 25}, {x: 20, y: 10}, {x: 30, y: 25}, {x: 40, y: 10}, {x: 50, y: 12}, {x: 60, y: 25}],
    [{x: 10, y: 40}, {x: 20, y: 30}, {x: 30, y: 25}, {x: 40, y: 60}, {x: 50, y: 22}, {x: 60, y: 9}]
  ]}
/>
        `)}}
        />
        </pre>
        <LineChart
          axes
          xTicks={5}
          yTicks={5}
          xDomainRange={[0, 100]}
          yDomainRange={[0, 100]}
          width={500}
          height={250}
          interpolate={'cardinal'}
          data={[
            [{x: 10, y: 25}, {x: 20, y: 10}, {x: 30, y: 25}, {x: 40, y: 10}, {x: 50, y: 12}, {x: 60, y: 25}],
            [{x: 10, y: 40}, {x: 20, y: 30}, {x: 30, y: 25}, {x: 40, y: 60}, {x: 50, y: 22}, {x: 60, y: 9}]
          ]}
        />

        <h3>style</h3>
        <p>The styles can be overridden easily either partially or globally. To allow this we use Radium.</p>
        <p>The following example would be to change the color of a the line.</p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<LineChart
  axes
  xDomainRange={[0, 100]}
  yDomainRange={[100, 0]}
  style={{
    '.line0': {
      stroke: 'red'
    },
    '.line1': {
      stroke: 'purple'
    }
  }}
  margin={{top: 0, right: 0, bottom: 100, left: 100}}
  width={250}
  height={250}
  interpolate={'cardinal'}
  data={[
    [{x: 10, y: 25}, {x: 20, y: 10}, {x: 30, y: 25}, {x: 40, y: 10}, {x: 50, y: 12}, {x: 60, y: 4}],
    [{x: 10, y: 40}, {x: 20, y: 30}, {x: 30, y: 25}, {x: 40, y: 60}, {x: 50, y: 22}, {x: 60, y: 9}]
  ]}
/>
        `)}}
        />
        </pre>
        <LineChart
          axes
          xDomainRange={[0, 100]}
          yDomainRange={[0, 100]}
          style={{
            '.line0': {
              stroke: 'red'
            },
            '.line1': {
              stroke: 'purple'
            }
          }}
          width={500}
          height={250}
          interpolate={'cardinal'}
          data={[
            [{x: 10, y: 25}, {x: 20, y: 10}, {x: 30, y: 25}, {x: 40, y: 10}, {x: 50, y: 12}, {x: 60, y: 25}],
            [{x: 10, y: 40}, {x: 20, y: 30}, {x: 30, y: 25}, {x: 40, y: 60}, {x: 50, y: 22}, {x: 60, y: 9}]
          ]}
        />

        <h3>Data Points</h3>
        <p>Data points can be added to the line chart by simply passing a dataPoints boolean.</p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<LineChart
  axes
  dataPoints
  xDomainRange={[0, 100]}
  yDomainRange={[0, 100]}
  width={500}
  height={250}
  interpolate={'cardinal'}
  data={[
    [{x: 10, y: 25}, {x: 20, y: 10}, {x: 30, y: 25}, {x: 40, y: 10}, {x: 50, y: 12}, {x: 60, y: 25}],
    [{x: 10, y: 40}, {x: 20, y: 30}, {x: 30, y: 25}, {x: 40, y: 60}, {x: 50, y: 22}, {x: 60, y: 9}]
  ]}
/>
        `)}}
        />
        </pre>
        <LineChart
          axes
          dataPoints
          xDomainRange={[0, 100]}
          yDomainRange={[0, 100]}
          width={500}
          height={250}
          interpolate={'cardinal'}
          data={[
            [{x: 10, y: 25}, {x: 20, y: 10}, {x: 30, y: 25}, {x: 40, y: 10}, {x: 50, y: 12}, {x: 60, y: 25}],
            [{x: 10, y: 40}, {x: 20, y: 30}, {x: 30, y: 25}, {x: 40, y: 60}, {x: 50, y: 22}, {x: 60, y: 9}]
          ]}
        />

        <h3>mouseOverHandler, mouseOverHandler, mouseMoveHandler</h3>
        <p>The chart will send out a mouseOver event, mouseMove and mouseOut event from the dataPoints (see above). The dataPoints will need to be set. This can be used by your react application in anyway you would require.
         The event handlers provides the mouse event and the point data. The mouse event can for instance provide the x and y coordinates which can be used for a tool tip.
          The data is related to the point currently moused over.</p>
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

{this.state.showToolTip ? <ToolTip top={this.state.top} left={this.state.left}>The value of x is {this.state.x} and the value of y is {this.state.y}</ToolTip> : null}

<LineChart
  axes
  dataPoints
  grid
  xDomainRange={[0, 100]}
  yDomainRange={[0, 100]}
  mouseOverHandler={this.mouseOverHandler.bind(this)}
  mouseOutHandler={this.mouseOutHandler.bind(this)}
  mouseMoveHandler={this.mouseMoveHandler.bind(this)}
  width={700}
  height={350}
  interpolate={'cardinal'}
  data={[
    [{x: 10, y: 25}, {x: 20, y: 10}, {x: 30, y: 25}, {x: 40, y: 10}, {x: 50, y: 12}, {x: 60, y: 25}],
    [{x: 10, y: 40}, {x: 20, y: 30}, {x: 30, y: 25}, {x: 40, y: 60}, {x: 50, y: 22}, {x: 60, y: 9}]
  ]}
/>
          `)}}
          />
        </pre>
        <LineChart
          axes
          dataPoints
          grid
          xDomainRange={[0, 100]}
          yDomainRange={[0, 100]}
          mouseOverHandler={this.mouseOverHandler.bind(this)}
          mouseOutHandler={this.mouseOutHandler.bind(this)}
          mouseMoveHandler={this.mouseMoveHandler.bind(this)}
          width={700}
          height={350}
          interpolate={'cardinal'}
          data={[
            [{x: 10, y: 25}, {x: 20, y: 10}, {x: 30, y: 25}, {x: 40, y: 10}, {x: 50, y: 12}, {x: 60, y: 25}],
            [{x: 10, y: 40}, {x: 20, y: 30}, {x: 30, y: 25}, {x: 40, y: 60}, {x: 50, y: 22}, {x: 60, y: 9}]
          ]}
        />

        <h3>Click Handler</h3>
        <p>The chart will send out a clickHandler event from the dataPoints (see above). The dataPoints will need to be set. This can be used by your react application in anyway you would require.
         The event handler provides the point data.</p>
         <div>
           <div style={{display: 'inline-block'}}>
           <LineChart
             axes
             dataPoints
             grid
             xDomainRange={[0, 100]}
             yDomainRange={[0, 100]}
             clickHandler={(d) => this.setState({dataDisplay: `The value of x is ${d.x} and y is ${d.y}`})}
             width={500}
             height={350}
             interpolate={'cardinal'}
             data={[
               [{x: 10, y: 25}, {x: 20, y: 10}, {x: 30, y: 25}, {x: 40, y: 10}, {x: 50, y: 12}, {x: 60, y: 25}],
               [{x: 10, y: 40}, {x: 20, y: 30}, {x: 30, y: 25}, {x: 40, y: 60}, {x: 50, y: 22}, {x: 60, y: 9}]
             ]}
           />
           </div>
           <div style={{display: 'inline-block', verticalAlign: 'top', paddingLeft: '20px'}}>
             {this.state.dataDisplay ? this.state.dataDisplay : 'Click on a point to show the value'}
           </div>
         </div>

        <h3>Updating the data</h3>
        <p>By selecting the button below to start the random data you can see a simulation of the performance if a data feed is passed in.
        React provides the functionality to only update the elements of the dom when required so should just change the line attributes.
        The data is passed in as a react param only and as soon as that data changes the chart will reflect that change automatically.</p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<LineChart
  data={this.data} // this is generated randomly and updated randomly within a range of -20 to + 20
  datePattern={'%d-%b-%y %H:%M'}
  xType={'time'}
  width={800}
  height={400}
  axisLabels={{x: 'Hour', y: 'Percentage'}}
  interpolate={'cardinal'}
  yDomainRange={[0, 100]}
  axes
  grid
  style={{'.line0':
  {
    stroke: 'green'
  }}}
/>
        `)}}
        />
        </pre>
        {
          this.state.randomDataIntervalId ? <input type="button" value="Stop random data" onClick={this.turnOffRandomData.bind(this)}></input>
          :
          <input type="button" value="Start random data" onClick={this.turnOnRandomData.bind(this)}></input>
        }
        <LineChart
          data={this.data}
          datePattern={'%d-%b-%y %H:%M'}
          xType={'time'}
          width={800}
          height={400}
          interpolate={'cardinal'}
          yDomainRange={[0, 100]}
          axisLabels={{x: 'Hour', y: 'Percentage'}}
          axes
          grid
          style={{'.line0':
          {
            stroke: 'green'
          }}}
        />


        <h3>Fluid</h3>
        <p>Because the width and height of the chart can be passed in by a param then changes to the size of a window or container can change the chart dynamically.
        If you shrink your browser window width you will see the charts below change in a fluid manor. You can also introduce basic break points such as removing the axes if below a certain width.</p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
constructor(props) {
  const initialWidth = window.innerWidth > 0 ? window.innerWidth : 500;
  this.state = {showToolTip: false, windowWidth: initialWidth - 100};
}

componentDidMount() {
  window.addEventListener('resize', this.handleResize.bind(this));
}

componentWillUnmount() {
  window.removeEventListener('resize', this.handleResize);
}

handleResize() {
  this.setState({windowWidth: window.innerWidth - 100});
}
<LineChart
  xType={'time'}
  axes={(this.state.windowWidth / 3) > 400 ? true : false}
  xTicks={5}
  yTicks={3}
  grid
  width={this.state.windowWidth / 3}
  height={this.state.windowWidth / 6}
  tickTimeDisplayFormat={'%d %m'}
  interpolate={'cardinal'}
  data={[
    [{x: '1-Jan-13', y: 8}, {x: '1-Feb-13', y: 17}, {x: '1-Mar-13', y: 17}, {x: '1-Apr-13', y: 25}, {x: '1-May-13', y: 20}],
    [{x: '1-Jan-13', y: 5}, {x: '1-Feb-13', y: 13}, {x: '1-Mar-13', y: 10}, {x: '1-Apr-13', y: 25}, {x: '1-May-13', y: 30}]
  ]}
/>
          `)}}
        />
        </pre>
        <div style={{display: 'inline-block'}}>
        <h4>2013</h4>
        <LineChart
          xType={'time'}
          axes={(this.state.windowWidth / 3) > 400 ? true : false}
          xTicks={5}
          yTicks={3}
          grid
          width={this.state.windowWidth / 3}
          height={this.state.windowWidth / 6}
          tickTimeDisplayFormat={'%d %m'}
          interpolate={'cardinal'}
          data={[
            [{x: '1-Jan-13', y: 8}, {x: '1-Feb-13', y: 17}, {x: '1-Mar-13', y: 17}, {x: '1-Apr-13', y: 25}, {x: '1-May-13', y: 20}],
            [{x: '1-Jan-13', y: 5}, {x: '1-Feb-13', y: 13}, {x: '1-Mar-13', y: 10}, {x: '1-Apr-13', y: 25}, {x: '1-May-13', y: 30}]
          ]}
        />
        </div>
        <div style={{display: 'inline-block', padding: '0 10px'}}>
        <h4>2014</h4>
        <LineChart
          xType={'time'}
          axes={(this.state.windowWidth / 3) > 400 ? true : false}
          xTicks={5}
          yTicks={3}
          grid
          width={this.state.windowWidth / 3}
          height={this.state.windowWidth / 6}
          tickTimeDisplayFormat={'%d %m'}
          interpolate={'cardinal'}
          data={[
            [{x: '1-Jan-14', y: 20}, {x: '1-Feb-14', y: 10}, {x: '1-Mar-14', y: 33}, {x: '1-Apr-14', y: 45}, {x: '1-May-14', y: 14}],
            [{x: '1-Jan-14', y: 7}, {x: '1-Feb-14', y: 88}, {x: '1-Mar-14', y: 10}, {x: '1-Apr-14', y: 15}, {x: '1-May-14', y: 55}]
          ]}
        />
        </div>
        <div style={{display: 'inline-block'}}>
        <h4>2015</h4>
        <LineChart
          xType={'time'}
          axes={(this.state.windowWidth / 3) > 400 ? true : false}
          xTicks={5}
          yTicks={3}
          grid
          width={this.state.windowWidth / 3}
          height={this.state.windowWidth / 6}
          tickTimeDisplayFormat={'%d %m'}
          interpolate={'cardinal'}
          data={[
            [{x: '1-Jan-15', y: 20}, {x: '1-Feb-15', y: 10}, {x: '1-Mar-15', y: 33}, {x: '1-Apr-15', y: 45}, {x: '1-May-15', y: 15}],
            [{x: '1-Jan-15', y: 10}, {x: '1-Feb-15', y: 15}, {x: '1-Mar-15', y: 13}, {x: '1-Apr-15', y: 15}, {x: '1-May-15', y: 10}]
          ]}
        />
          </div>

        <br/>
        <br/>
        {this.state.showToolTip ? <ToolTip top={this.state.top} left={this.state.left}>The value of x is {this.state.x} and the value of y is {this.state.y}</ToolTip> : null}
        </div>
      );
    }
}


ReactDom.render(<LineChartContainer/>, document.getElementById('root'));
