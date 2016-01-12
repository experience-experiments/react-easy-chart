import React from 'react';
import ReactDOM from 'react-dom';
import ScatterplotChart from 'rc-d3/scatterplot-chart';
import {escapeHTML} from '../util';

const exampleOne = [
  {
    type: 1,
    y: 5.1,
    x: 3.5
  },
  {
    type: 1,
    y: 5.0,
    x: 3.6
  },
  {
    type: 2,
    y: 4.7,
    x: 3.2
  },
  {
    type: 3,
    y: 6.3,
    x: 3.0
  }
];

const config = [
  {
    type: 1,
    color: '#ff0000',
    stroke: 'blue'
  },
  {
    type: 2,
    color: '#00ff00',
    stroke: 'blue'
  },
  {
    type: 3,
    color: '#0000ff',
    stroke: 'blue'
  }
];

export default class ScatterplotContainer extends React.Component {
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
    type: 1,
    y: 5.1,
    x: 3.5,
  },
  {
    type: 1,
    y: 5.0,
    x: 3.6
  },
  {
    type: 2,
    y: 4.7,
    x: 3.2
  },
  {
    type: 3,
    y: 6.3,
    x: 3.0
  }
];

<ScatterplotChart data={data} />
       `)}}
          />
       </pre>
       <ScatterplotChart data={exampleOne} />
       <h3>Height and Width</h3>
       <p>The height and width can be easily set by passing in a numeric value in as a prop.</p>
       <pre>
       <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<ScatterplotChart data={data} width={160} height={90} />
       `)}}
       />
       </pre>
       <ScatterplotChart data={exampleOne} width={160} height={90} />
       <h3>Margin</h3>
       <p>The Margin can be overridden by passing in a margin object. The margin object must define the following: top, right, bottom and left</p>
       <p>This can be particulary useful if a label is cut off.</p>
       <pre>
       <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<ScatterplotChart
  data={data}
  margin={{top: 0, right: 10, bottom: 30, left: 100}} />
       `)}}
       />
       </pre>
       <ScatterplotChart data={exampleOne} margin={{top: 0, right: 10, bottom: 30, left: 100}} />
       <h3>Axes</h3>
       <p>The axes can be turned on by simply passing a boolean flag to true for axes.</p>
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
       <ScatterplotChart data={exampleOne} axes width={480} height={270} />
       <h3>Axes labels</h3>
       <p>The axes labels can be passed in for the x and y value.</p>
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
         data={exampleOne}
         axes
         axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
         width={480}
         height={270}
       />
       <h3>Dot radius</h3>
       <p>The default size of the dot can be changed via the dotRadius parameter</p>
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
         data={exampleOne}
         axes
         axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
         dotRadius={10}
         width={480}
         height={270}
       />
       <h3>Config</h3>
       <p>The config property allows for greater control over the look and feel</p>
       <pre>
       <code dangerouslySetInnerHTML={{__html: escapeHTML(`
 const config = [
   {
     type: 1,
     color: '#ff0000',
     stroke: 'blue'
   },
   {
     type: 2,
     color: '#00ff00',
     stroke: 'blue'
   },
   {
     type: 3,
     color: '#0000ff',
     stroke: 'blue'
   }
 ];
       `)}}
       />
       </pre>
       <ScatterplotChart
         data={exampleOne}
         axes
         axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
         dotRadius={10}
         width={480}
         height={270}
         config={config}
       />
      </div>
    );
  }
}

ReactDOM.render(
  <ScatterplotContainer />, document.getElementById('root'));
