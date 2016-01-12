import React from 'react';
import ReactDom from 'react-dom';
import {escapeHTML} from '../util';
import {LineChart} from 'rc-d3';
import moment from 'moment';
import {format} from 'd3-time-format';

class LineChartContainer extends React.Component {
    constructor(props) {
      super(props);
      // Generate multiple lines of data
      this.data = [this.generateData(), this.generateData(), this.generateData(), this.generateData()];
      this.state = {};
    }

    getRandomArbitrary(min, max) {
      return Math.random() * (max - min) + min;
    }

    generateData() {
      const data = [];
      const keys = [];

      let date = moment('2015-1-1 00:00');
      for (let i = 1; i <= 12; i++) {
        keys.push(date.format('D-MMM-YY'));
        date = date.add('day', 1);
      }
      keys.map((key) => {
        data.push({key: key, value: this.getRandomArbitrary(0, 100)});
      });
      return data;
    }

    turnOnRandomData() {
      this.setState({randomDataIntervalId: setInterval(this.updateData.bind(this), 400)});
    }

    turnOffRandomData() {
      clearInterval(this.state.randomDataIntervalId);
      this.setState({randomDataIntervalId: null});
    }

    updateData() {
      const parseDate = format('%d-%b-%y').parse;
      this.data.map((data) => {
        data.shift();
        const date = moment(parseDate(data[data.length - 1].key));
        date.add('days', 1);
        data.push({key: date.format('D-MMM-YY'), value: this.getRandomArbitrary(0, 100)});
      });

      this.forceUpdate();
    }

    render() {
      return (<div>
        <h2>The R2-D3 Line chart</h2>
        <h3>Data</h3>
        <p>At the most basic the line chart can just take a single data file supplied in a JSON format and will render a
         simple line chart.</p>
        <p>The format of the data is an array of arrays which allows multiple lines to be generated.
        The key field represents the x axis and the value the y axis. This is to unify the data accross R2-D3 charts.</p>

        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<LineChart
  data={[[{key: 1, value: 20}, {key: 2, value: 10}, {key: 3, value: 25}]]}/>
        `)}}
        />
        </pre>

        <LineChart
          data={[[{key: 1, value: 20}, {key: 2, value: 10}, {key: 3, value: 25}]]}
        />
        <p>If a second line is needed then this is easily added by adding a new data array to the existing array. The number of lines drawn is infinite but only coloured up to 4 lines.</p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<LineChart
  data={[[{key: 1, value: 20}, {key: 2, value: 10}, {key: 3, value: 25}], [{key: 1, value: 10}, {key: 2, value: 12}, {key: 3, value: 4}]]}/>
        `)}}
        />
        </pre>
        <LineChart
          data={[[{key: 1, value: 20}, {key: 2, value: 10}, {key: 3, value: 25}], [{key: 1, value: 10}, {key: 2, value: 12}, {key: 3, value: 4}]]}
        />
        <h3>Height and Width</h3>
        <p>The height and width can be easily set by passing in a numeric value in as a prop.</p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<LineChart
width={50}
height={50}
data={[[{key: 1, value: 20}, {key: 2, value: 10}, {key: 3, value: 25}], [{key: 1, value: 10}, {key: 2, value: 12}, {key: 3, value: 4}]]}/>
        `)}}
        />
        </pre>
        <LineChart
          width={50}
          height={50}
          data={[[{key: 1, value: 20}, {key: 2, value: 10}, {key: 3, value: 25}], [{key: 1, value: 10}, {key: 2, value: 12}, {key: 3, value: 4}]]}
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
data={[[{key: 1, value: 20}, {key: 2, value: 10}, {key: 3, value: 25}], [{key: 1, value: 10}, {key: 2, value: 12}, {key: 3, value: 4}]]}/>
        `)}}
        />
        </pre>
        <LineChart
          margin={{top: 0, right: 0, bottom: 30, left: 100}}
          width={350}
          height={250}
          data={[[{key: 1, value: 20}, {key: 2, value: 10}, {key: 3, value: 25}], [{key: 1, value: 10}, {key: 2, value: 12}, {key: 3, value: 4}]]}
        />

        <h3>Axes</h3>
        <p>The axes can be turned on by simply passing a boolean flag to true for <b>axes</b>.</p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<LineChart
  axes
  width={250}
  height={250}
  data={[[{key: 1, value: 20}, {key: 2, value: 10}, {key: 3, value: 25}], [{key: 1, value: 10}, {key: 2, value: 12}, {key: 3, value: 4}]]}/>
        `)}}
        />
        </pre>
        <LineChart
          axes
          width={350}
          height={250}
          data={[[{key: 1, value: 20}, {key: 2, value: 10}, {key: 3, value: 25}], [{key: 1, value: 10}, {key: 2, value: 12}, {key: 3, value: 4}]]}
        />

        <h3>Axes labels</h3>
        <p>The axes labels can be overridden by simply passing <b>axisLabels</b> object with both a x and y value.</p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<LineChart
  axes
  margin={{top: 10, right: 10, bottom: 50, left: 50}}
  axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
  width={250}
  height={250}
  data={[[{key: 1, value: 20}, {key: 2, value: 10}, {key: 3, value: 25}], [{key: 1, value: 10}, {key: 2, value: 12}, {key: 3, value: 4}]]}/>
        `)}}
        />
        </pre>
        <LineChart
          axes
          margin={{top: 10, right: 10, bottom: 50, left: 50}}
          axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
          width={350}
          height={250}
          data={[[{key: 1, value: 20}, {key: 2, value: 10}, {key: 3, value: 25}], [{key: 1, value: 10}, {key: 2, value: 12}, {key: 3, value: 4}]]}
        />


        <h3>xType / yType</h3>
        <p>The data passed associated to the particular axes can be in numeric, date (the default
           format is for example 1-Jan-15 but can be overridden)
         or textual formats (used for labelling). </p>
        <p>For the example below the data for the key is text and so the <b>xType</b> needs to be changed to <b>text</b>.</p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<LineChart
  xType={'text'}
  axes
  width={350}
  height={250}
  data={[
    [{key: 'Mon', value: 20}, {key: 'Tue', value: 10}, {key: 'Wed', value: 33}, {key: 'Thu', value: 45}, {key: 'Fri', value: 15}],
    [{key: 'Mon', value: 10}, {key: 'Tue', value: 15}, {key: 'Wed', value: 13}, {key: 'Thu', value: 15}, {key: 'Fri', value: 10}]
  ]}
/>
        `)}}
        />
        </pre>
        <LineChart
          xType={'text'}
          axes
          width={350}
          height={250}
          data={[
            [{key: 'Mon', value: 20}, {key: 'Tue', value: 10}, {key: 'Wed', value: 33}, {key: 'Thu', value: 45}, {key: 'Fri', value: 15}],
            [{key: 'Mon', value: 10}, {key: 'Tue', value: 15}, {key: 'Wed', value: 13}, {key: 'Thu', value: 15}, {key: 'Fri', value: 10}]
          ]}
        />
        <p>Setting the <b>yType</b> to be <b>time</b></p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<LineChart
  xType={'time'}
  axes
  width={750}
  height={250}
  data={[
    [{key: '1-Jan-15', value: 20}, {key: '1-Feb-15', value: 10}, {key: '1-Mar-15', value: 33}, {key: '1-Apr-15', value: 45}, {key: '1-May-15', value: 15}],
    [{key: '1-Jan-15', value: 10}, {key: '1-Feb-15', value: 15}, {key: '1-Mar-15', value: 13}, {key: '1-Apr-15', value: 15}, {key: '1-May-15', value: 10}]
  ]}
/>
        `)}}
        />
        </pre>
        <LineChart
          xType={'time'}
          axes
          width={750}
          height={250}
          data={[
            [{key: '1-Jan-15', value: 20}, {key: '1-Feb-15', value: 10}, {key: '1-Mar-15', value: 33}, {key: '1-Apr-15', value: 45}, {key: '1-May-15', value: 15}],
            [{key: '1-Jan-15', value: 10}, {key: '1-Feb-15', value: 15}, {key: '1-Mar-15', value: 13}, {key: '1-Apr-15', value: 15}, {key: '1-May-15', value: 10}]
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
  width={350}
  height={250}
  data={[
    [{key: 'Mon', value: 'Less'}, {key: 'Tue', value: 'Middle'}, {key: 'Wed', value: 'Middle'}, {key: 'Thu', value: 'Less'}, {key: 'Fri', value: 'Middle'}]
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
          margin={{top: 10, right: 30, bottom: 50, left: 70}}
          width={350}
          height={250}
          yDomainRange={['Allot', 'Perfect', 'Little']}
          data={[
            [{key: 'Mon', value: 'Little'}, {key: 'Tue', value: 'Perfect'}, {key: 'Wed', value: 'Allot'}, {key: 'Thu', value: 'Little'}, {key: 'Fri', value: 'Perfect'}]
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
    [{key: 10, value: '1-Jan-15'}, {key: 20, value: '10-Jan-15'}, {key: 40, value: '21-Jan-15'}, {key: 80, value: '31-Jan-15'}],
    [{key: 0, value: '1-Jan-15'}, {key: 15, value: '10-Jan-15'}, {key: 20, value: '21-Jan-15'}, {key: 25, value: '31-Jan-15'}]
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
          width={500}
          height={500}
          data={[
            [{key: 10, value: '1-Jan-15'}, {key: 20, value: '10-Jan-15'}, {key: 40, value: '21-Jan-15'}, {key: 80, value: '31-Jan-15'}],
            [{key: 0, value: '1-Jan-15'}, {key: 15, value: '10-Jan-15'}, {key: 20, value: '21-Jan-15'}, {key: 25, value: '31-Jan-15'}]
          ]}
        />


        <h3>range yDomainRange, xDomainRange</h3>
        <p>By default the axis ranges are automatically calculated based on the smallest and the largest values.</p>
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
  data={[
    [{key: 10, value: 25}, {key: 20, value: 10}, {key: 30, value: 25}, {key: 40, value: 10}, {key: 50, value: 12}, {key: 60, value: 4}],
    [{key: 10, value: 40}, {key: 20, value: 30}, {key: 30, value: 25}, {key: 40, value: 60}, {key: 50, value: 22}, {key: 60, value: 9}]
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
          data={[
            [{key: 10, value: 25}, {key: 20, value: 10}, {key: 30, value: 25}, {key: 40, value: 10}, {key: 50, value: 12}, {key: 60, value: 25}],
            [{key: 10, value: 40}, {key: 20, value: 30}, {key: 30, value: 25}, {key: 40, value: 60}, {key: 50, value: 22}, {key: 60, value: 9}]
          ]}
        />
        <h3>Setting the tick values</h3>
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
  data={[
    [{key: 10, value: 25}, {key: 20, value: 10}, {key: 30, value: 25}, {key: 40, value: 10}, {key: 50, value: 12}, {key: 60, value: 25}],
    [{key: 10, value: 40}, {key: 20, value: 30}, {key: 30, value: 25}, {key: 40, value: 60}, {key: 50, value: 22}, {key: 60, value: 9}]
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
          data={[
            [{key: 10, value: 25}, {key: 20, value: 10}, {key: 30, value: 25}, {key: 40, value: 10}, {key: 50, value: 12}, {key: 60, value: 25}],
            [{key: 10, value: 40}, {key: 20, value: 30}, {key: 30, value: 25}, {key: 40, value: 60}, {key: 50, value: 22}, {key: 60, value: 9}]
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
  data={[
    [{key: 10, value: 25}, {key: 20, value: 10}, {key: 30, value: 25}, {key: 40, value: 10}, {key: 50, value: 12}, {key: 60, value: 4}],
    [{key: 10, value: 40}, {key: 20, value: 30}, {key: 30, value: 25}, {key: 40, value: 60}, {key: 50, value: 22}, {key: 60, value: 9}]
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
          data={[
            [{key: 10, value: 25}, {key: 20, value: 10}, {key: 30, value: 25}, {key: 40, value: 10}, {key: 50, value: 12}, {key: 60, value: 25}],
            [{key: 10, value: 40}, {key: 20, value: 30}, {key: 30, value: 25}, {key: 40, value: 60}, {key: 50, value: 22}, {key: 60, value: 9}]
          ]}
        />

        <h3>Updating the data</h3>
        <p>By selecting the button below to start the random data you can see a simulation of the performance if a data feed is passed in.
        React provides the functionality to only update the elements of the dom when required so should just change the line attributes.
        The data is passed in as a react param only and as soon as that data changes the chart will reflect that change automatically.</p>
        <br/>
        {
          this.state.randomDataIntervalId ? <input type="button" value="Stop random data" onClick={this.turnOffRandomData.bind(this)}></input>
          :
          <input type="button" value="Start random data" onClick={this.turnOnRandomData.bind(this)}></input>
        }
        <br/><br/>
        <LineChart
          data={this.data}
          datePattern={'%d-%b-%y'}
          xType={'time'}
          width={800}
          height={400}
          axes
          style={{'.line':
          {
            stroke: 'green'
          }}}
        />
        <br/>
        <br/>
        </div>
      );
    }
}


ReactDom.render(<LineChartContainer/>, document.getElementById('root'));
