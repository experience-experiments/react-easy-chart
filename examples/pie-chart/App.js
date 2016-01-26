import React from 'react';
import ReactDOM from 'react-dom';
import ToolTip from '../ToolTip';
import {escapeHTML} from '../util';
import PieChart from 'react-easy-chart/pie-chart';
import Scrollspy from 'react-scrollspy';

export default class PieChartContainer extends React.Component {
    constructor(props) {
      super(props);
      this.data = this.generateData();
      this.state = {
        showToolTip: false,
        componentWidth: 300
      };
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
      const keys = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

      keys.map((key) => {
        data.push({key: key, value: this.getRandomArbitrary(1, 1000)});
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
        value: d.value,
        key: d.data.key});
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

    toggleState() {
      this.setState({
        active: !this.state.active
      });
    }

    render() {
      const cn = this.state.active ? 'menu active' : 'menu';
      return (<div>
        {this.state.showToolTip ? <ToolTip top={this.state.top} left={this.state.left}>The value of {this.state.key} is {this.state.value}</ToolTip> : null}
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
                'size',
                'donut',
                'padding',
                'labels',
                'style',
                'mouseHandlers',
                'clickHandler',
                'updateData'
                ]
              }
              currentClassName="active"
            >
              <li><a href="#introduction">Introduction</a></li>
              <li><a href="#data">Data</a></li>
              <li><a href="#size">Size</a></li>
              <li><a href="#donut">Donut</a></li>
              <li><a href="#padding">Padding</a></li>
              <li><a href="#labels">Labels</a></li>
              <li><a href="#style">Style</a></li>
              <li><a href="#mouseHandlers">Mouse handlers</a></li>
              <li><a href="#clickHandler">Click handler</a></li>
              <li><a href="#updatingData">Updating the data</a></li>
            </Scrollspy>
          </nav>
        </aside>
        <div className="content">
        <h1>The React Easy Pie chart</h1>
        <h2 id="introduction">Introduction</h2>
        <p>Text for the introduction</p>
        <h2 id="data">data</h2>
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
        <p>By default the color is automatically assigned. The color can be overwritten for each section of the pie by providing an extra color hex value to the object.</p>
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

       <h2 id="size">Size</h2>
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

       <h2 id="donut">donut</h2>
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

       <h2 id="padding">padding</h2>
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

       <h2 id="labels">labels</h2>
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

       <h2 id="style">style</h2>
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


       <h2 id="mouseHandlers">Mouse handlers</h2>
       <p>The chart will send out a mouseOver event, mouseMove and mouseOut event. This can be used by your react application in anyway you would require.
        The event handlers provides the mouse event and the segment data. The mouse event can for instance provide the x and y coordinates which can be used for a tool tip.
         The data can be segment related to the pie chart.</p>
       <pre>
       <code dangerouslySetInnerHTML={{__html: escapeHTML(`
mouseOverHandler(d, e) {
 this.setState({
   showToolTip: true,
   top: e.y,
   left: e.x,
   value: d.value,
   key: d.data.key});
}

mouseMoveHandler(e) {
 if (this.state.showToolTip) {
   this.setState({top: e.y, left: e.x});
 }
}

mouseOutHandler() {
 this.setState({showToolTip: false});
}

{this.state.showToolTip ? <ToolTip top={this.state.top} left={this.state.left}>The value of {this.state.key} is {this.state.value}</ToolTip> : null}

<PieChart
 data={[{key: 'A', value: 100, color: '#ff0000'}, {key: 'B', value: 200, color: 'green'}, {key: 'C', value: 50, color: 'grey'}]}
 mouseOverHandler={this.mouseOverHandler.bind(this)}
 mouseOutHandler={this.mouseOutHandler.bind(this)}
 mouseMoveHandler={this.mouseMoveHandler.bind(this)}
 size={200}
 padding={10}
 styles={this.styles}
/>
       `)}}
       />
       </pre>
       <PieChart
         data={[{key: 'A', value: 100, color: '#ff0000'}, {key: 'B', value: 200, color: 'green'}, {key: 'C', value: 50, color: 'grey'}]}
         mouseOverHandler={this.mouseOverHandler.bind(this)}
         mouseOutHandler={this.mouseOutHandler.bind(this)}
         mouseMoveHandler={this.mouseMoveHandler.bind(this)}
         size={200}
         padding={10}
         styles={this.styles}
       />

       <h2 id="clickHandler">Click Handler</h2>
       <p>The chart will send out a click event. The event will pass the data and the event.
        This allows the data to be presented from the clicking of a segment in any way the react developer requires.</p>
       <pre>
       <code dangerouslySetInnerHTML={{__html: escapeHTML(`
 <div>
   <div style={{display: 'inline-block'}}>
     <PieChart
       data={[{key: 'A', value: 100, color: '#ff0000'}, {key: 'B', value: 200, color: 'green'}, {key: 'C', value: 50, color: 'grey'}]}
       clickHandler={(d) => this.setState({dataDisplay: \`The value of \${d.data.key} is \${d.value}\`})}
     />
   </div>
   <div style={{display: 'inline-block', verticalAlign: 'top'}}>
   {this.state.dataDisplay ? this.state.dataDisplay : 'Click on a segment to show the value'}
   </div>
 </div>
     `)}}
       />
       </pre>
       <div>
         <div style={{display: 'inline-block'}}>
           <PieChart
             data={[{key: 'A', value: 100, color: '#ff0000'}, {key: 'B', value: 200, color: 'green'}, {key: 'C', value: 50, color: 'grey'}]}
             clickHandler={(d) => this.setState({dataDisplay: `The value of ${d.data.key} is ${d.value}`})}
           />
         </div>
         <div style={{display: 'inline-block', verticalAlign: 'top'}}>
         {this.state.dataDisplay ? this.state.dataDisplay : 'Click on a segment to show the value'}
         </div>
       </div>

       <h2 id="updateData">Updating the data</h2>
       <p>By selecting the button below to start the random data you can see a simulation of the performance if a data feed is passed in.
       React provides the functionality to only update the elements of the dom when required so will just change the path attributes.
       The data is passed in as a react param only and as soon as that data changes the chart will reflect that change automatically.</p>
       <br/>
       {
         this.state.randomDataIntervalId ? <input type="button" value="Stop random data" onClick={this.turnOffRandomData.bind(this)}></input>
         :
         <input type="button" value="Start random data" onClick={this.turnOnRandomData.bind(this)}></input>
       }
       <pre>
       <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<PieChart
 labels
 data={this.data}
/>
      `)}}
       />
      </pre>
      <PieChart
        labels
        data={this.data}
      />
  </div></div>
      );
    }
}


ReactDOM.render(
  <PieChartContainer />, document.getElementById('root'));
