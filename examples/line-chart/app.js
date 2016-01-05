import React from 'react';
import ReactDom from 'react-dom';
import ToolTip from '../ToolTip';
import {LineChart} from 'rc-d3';

// const style = {
//   '.line': {
//     stroke: 'green'
//   }
// };

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
      const keys = ['1-Jan-15', '1-Feb-15', '1-Mar-15', '1-Apr-15', '1-Jun-15', '1-Jul-15'];

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

    escapeHTML(jsx) {
      return jsx.replace(/&/g, '&amp;')
      .replace(/</g, '&#60;')
      .replace(/>/g, '&gt;')
      .replace(/\"/g, '&quot;')
      .replace(/\'/g, '&#39;');
    }

    // {this.state.showToolTip ? <ToolTip top={this.state.top} left={this.state.left}>The value of {this.state.key} is {this.state.value}</ToolTip> : null}
    // <h2>The R2-D3 Line chart</h2>
    // <h3>Data</h3>
    // <p>At the most basic the line chart can just take a single data file supplied in a JSON format and will render a
    //  simple line chart.</p>
    // <p>The format of the data is an array of arrays which allows multiple lines to be generated.
    // The key field represents the x axis and the value the y axis. This is to unify the data accross R2-D3 charts.</p>
    // <pre><code>
    // var data=&#123;[[&#123; key: 1, value: 20&#125;, &#123;key: 2, value: 10&#125;, &#123;key: 3, value: 25&#125;]]&#125;<br/>
    // &lt;LineChart data=&#123;data&#125; /&gt;
    // </code></pre>
    // <LineChart
    //   data={[[{key: 1, value: 20}, {key: 2, value: 10}, {key: 3, value: 25}]]}
    // />
    // <p>If a second line is needed then this is easily added by adding a new data array.</p>
    // <pre><code>
    // var data=&#123;[[&#123; key: 1, value: 20&#125;, &#123;key: 2, value: 10&#125;, &#123;key: 3, value: 25&#125;], [&#123; key: 1, value: 10&#125;, &#123;key: 2, value: 12&#125;, &#123;key: 3, value: 4&#125;]]&#125;<br/>
    // &lt;LineChart data=&#123;data&#125; /&gt;
    // </code></pre>
    // <LineChart
    //   data={[[{key: 1, value: 20}, {key: 2, value: 10}, {key: 3, value: 25}], [{key: 1, value: 10}, {key: 2, value: 12}, {key: 3, value: 4}]]}
    // />
    // <p>The data passed to the axes can be in numeric, date (the default format is for example 1-Jan-15 but can be overridden)
    //  or textual formats (used for labelling). The axis range is automatically calculated based on the smallest and the largest values</p>
    // <p>For the example below the axes have been turned on and a width and height simply passed in as props and the x axis changed to textual labels.</p>
    //

    // <h4>The API</h4>
    //
    // <LineChart
    //   data={this.data}
    //   datePattern={'%d-%b-%y'}
    //   xType={'time'}
    //   width={500}
    //   height={200}
    //   yDomainRange={[0, 100]}
    //   xDomainRange={['1-Jan-15', '1-Aug-15']}
    //   axes
    //   style={style}
    // />
    // {
    //   this.state.randomDataIntervalId ? <input type="button" value="Stop random data" onClick={this.turnOffRandomData.bind(this)}></input>
    //   :
    //   <input type="button" value="Start random data" onClick={this.turnOnRandomData.bind(this)}></input>
    // }
    // <LineChart
    //   data={this.data}
    //   datePattern={'%d-%b-%y'}
    //   xType={'time'}
    //   width={500}
    //   height={200}
    //   axes
    // />
    // {this.state.dataDisplay}

    render() {
      return (<div>
        {this.state.showToolTip ? <ToolTip top={this.state.top} left={this.state.left}>The value of {this.state.key} is {this.state.value}</ToolTip> : null}
        <h2>The R2-D3 Line chart</h2>
        <h3>Data</h3>
        <p>At the most basic the line chart can just take a single data file supplied in a JSON format and will render a
         simple line chart.</p>
        <p>The format of the data is an array of arrays which allows multiple lines to be generated.
        The key field represents the x axis and the value the y axis. This is to unify the data accross R2-D3 charts.</p>

        <pre>
        <code dangerouslySetInnerHTML={{__html: this.escapeHTML(`
<LineChart
  data={[[{key: 1, value: 20}, {key: 2, value: 10}, {key: 3, value: 25}]]}/>
        `)}}
        />
        </pre>

        <LineChart
          data={[[{key: 1, value: 20}, {key: 2, value: 10}, {key: 3, value: 25}]]}
        />
        <p>If a second line is needed then this is easily added by adding a new data array to the existing array.</p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: this.escapeHTML(`
<LineChart
  data={[[{key: 1, value: 20}, {key: 2, value: 10}, {key: 3, value: 25}], [{key: 1, value: 10}, {key: 2, value: 12}, {key: 3, value: 4}]]}/>
        `)}}
        />
        </pre>
        <LineChart
          data={[[{key: 1, value: 20}, {key: 2, value: 10}, {key: 3, value: 25}], [{key: 1, value: 10}, {key: 2, value: 12}, {key: 3, value: 4}]]}
        />
        <h3>axes</h3>
        <p>The axes can be turned on by simply passing a boolean flag to true for <b>axes</b>.</p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: this.escapeHTML(`
<LineChart
  axes
  data={[[{key: 1, value: 20}, {key: 2, value: 10}, {key: 3, value: 25}], [{key: 1, value: 10}, {key: 2, value: 12}, {key: 3, value: 4}]]}/>
        `)}}
        />
        </pre>
        <LineChart
          axes
          data={[[{key: 1, value: 20}, {key: 2, value: 10}, {key: 3, value: 25}], [{key: 1, value: 10}, {key: 2, value: 12}, {key: 3, value: 4}]]}
        />
        <h3>xType or yType</h3>
        <p>The axes can be turned on by simply passing a boolean flag to true for <b>axes</b>.</p>
        <p>The data passed associated to the axes can be in numeric, date (the default format is for example 1-Jan-15 but can be overridden)
         or textual formats (used for labelling). The axis range is automatically calculated based on the smallest and the largest values</p>
        <p>For the example below the axes have been turned on and a width and height simply passed in as props and the x axis changed to textual labels.</p>
        <p>The x axis in the example needs to be defined as text in this case using the xType prop.</p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: this.escapeHTML(`
<LineChart
  xType={'text'}
  axes
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
          data={[
            [{key: 'Mon', value: 20}, {key: 'Tue', value: 10}, {key: 'Wed', value: 33}, {key: 'Thu', value: 45}, {key: 'Fri', value: 15}],
            [{key: 'Mon', value: 10}, {key: 'Tue', value: 15}, {key: 'Wed', value: 13}, {key: 'Thu', value: 15}, {key: 'Fri', value: 10}]
          ]}
        />
        <p>An example of the use of dates as part of the axis can be seen below by specifying the xType as time.</p>
        <LineChart
          xType={'text'}
          axes
          datePattern={'%d-%b-%y'}
          xType={'time'}
          width={800}
          height={300}
          data={[
            [{key: '1-Jan-15', value: 20}, {key: '1-Feb-15', value: 10}, {key: '1-Mar-15', value: 33}, {key: '1-Apr-15', value: 45}, {key: '1-May-15', value: 15}],
            [{key: '1-Jan-15', value: 10}, {key: '1-Feb-15', value: 15}, {key: '1-Mar-15', value: 13}, {key: '1-Apr-15', value: 15}, {key: '1-May-15', value: 10}]
          ]}
        />
        {
          this.state.randomDataIntervalId ? <input type="button" value="Stop random data" onClick={this.turnOffRandomData.bind(this)}></input>
          :
          <input type="button" value="Start random data" onClick={this.turnOnRandomData.bind(this)}></input>
        }
        <pre>
        <code dangerouslySetInnerHTML={{__html: this.escapeHTML(`
<LineChart
  xType={'text'}
  axes
  datePattern={'%d-%b-%y'}
  xType={'time'}
  width={800}
  height={300}
  data={[
    [{key: '1-Jan-15', value: 20}, {key: '1-Feb-15', value: 10}, {key: '1-Mar-15', value: 33}, {key: '1-Apr-15', value: 45}, {key: '1-May-15', value: 15}],
    [{key: '1-Jan-15', value: 10}, {key: '1-Feb-15', value: 15}, {key: '1-Mar-15', value: 13}, {key: '1-Apr-15', value: 15}, {key: '1-May-15', value: 10}]
  ]}
/>
        `)}}
        />
        </pre>
        </div>
      );
    }
}


ReactDom.render(<LineChartContainer/>, document.getElementById('root'));
