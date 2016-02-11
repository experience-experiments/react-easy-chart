import React from 'react';
import ReactDOM from 'react-dom';
import ToolTip from '../ToolTip';
import {escapeHTML} from '../util';
import {PieChart} from 'react-easy-chart';
import Scrollspy from 'react-scrollspy';

const brandColors = {
  greyBlueOne: '#1e313c',
  greyBlueTwo: '#3f4c55',
  greyBlueThree: '#667178',
  yellow: '#f4e956',
  orange: '#e3a51a',
  green: '#aaac84',
  lightGreen: '#dce7c5',
  lightGrey: '#e4e8ec'
};

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
      const colors = [
        '#1e313c',
        '#3f4c55',
        '#667178',
        '#f4e956',
        '#e3a51a',
        '#aaac84',
        '#dce7c5'
      ];
      keys.map((key, index) => {
        data.push({
          key: key,
          value: this.getRandomArbitrary(1, 1000),
          color: colors[index]
        });
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
                'updatingData'
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
        <section id="introduction">
        <h2>Introduction</h2>
        <p>A pie chart (or a circle chart) is a circular statistical graphic, which is divided into slices to illustrate numerical proportion.<sup>(<a href="https://en.wikipedia.org/wiki/Pie_chart">ref</a>)</sup></p>
        </section>

        <section id="data">
        <h2>data</h2>
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
  data={[
    {key: 'A', value: 100, color: '#aaac84'},
    {key: 'B', value: 200, color: '#dce7c5'},
    {key: 'C', value: 50, color: '#e3a51a'}
  ]}
/>
       `)}}
        />
        </pre>
       <PieChart
         data={[
           {key: 'A', value: 100, color: brandColors.green},
           {key: 'B', value: 200, color: brandColors.lightGreen},
           {key: 'C', value: 50, color: brandColors.orange}
         ]}
       />
       </section>

       <section id="size">
       <h2>Size</h2>
       <p>The size of the pie chart can be set easily by passing in a size param number.</p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<PieChart
  size={100}
  data={[
    {key: 'A', value: 100, color: '#aaac84'},
    {key: 'B', value: 200, color: '#dce7c5'},
    {key: 'C', value: 50, color: '#e3a51a'}
  ]}
/>
`)}}
        />
       </pre>
       <PieChart
         size={100}
         data={[
           {key: 'A', value: 100, color: brandColors.green},
           {key: 'B', value: 200, color: brandColors.lightGreen},
           {key: 'C', value: 50, color: brandColors.orange}
         ]}
       />
       </section>

       <section id="donut">
       <h2>donut</h2>
       <p>A donut can be produced by passing in a innerHoleSize prop. This should be less than the size prop.</p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<PieChart
  size={400}
  innerHoleSize={200}
  data={[
    {key: 'A', value: 100, color: '#aaac84'},
    {key: 'B', value: 200, color: '#dce7c5'},
    {key: 'C', value: 50, color: '#e3a51a'}
  ]}
/>
       `)}}
        />
       </pre>
       <PieChart
         size={400}
         innerHoleSize={200}
         data={[
           {key: 'A', value: 100, color: brandColors.green},
           {key: 'B', value: 200, color: brandColors.lightGreen},
           {key: 'C', value: 50, color: brandColors.orange}
         ]}
       />
       </section>

       <section id="padding">
       <h2>padding</h2>
       <p>padding can be set by passing in a padding prop.</p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<PieChart
  padding={50}
  data={[
    {key: 'A', value: 100, color: '#aaac84'},
    {key: 'B', value: 200, color: '#dce7c5'},
    {key: 'C', value: 50, color: '#e3a51a'}
  ]}
/>
       `)}}
        />
       </pre>
       <PieChart
         padding={50}
         data={[
           {key: 'A', value: 100, color: brandColors.green},
           {key: 'B', value: 200, color: brandColors.lightGreen},
           {key: 'C', value: 50, color: brandColors.orange}
         ]}
       />
       </section>

       <section id="labels">
       <h2>labels</h2>
       <p>Labels can be added by passing in a labels boolean prop. The labels will be the key value passed in with the data. The example below passes a custom style object to set the text colour to white</p>
        <pre>
        <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<PieChart
  labels
  data={[
    {key: 'A', value: 100, color: '#aaac84'},
    {key: 'B', value: 200, color: '#dce7c5'},
    {key: 'C', value: 50, color: '#e3a51a'}
  ]}
  styles={{
    '.chart_text': {
      fontSize: '1em',
      fill: '#fff'
    }
  }}
/>
       `)}}
        />
       </pre>
       <PieChart
         labels
         data={[
           {key: 'A', value: 100, color: brandColors.green},
           {key: 'B', value: 200, color: brandColors.lightGreen},
           {key: 'C', value: 50, color: brandColors.orange}
         ]}
         styles={{
           '.chart_text': {
             fontSize: '1em',
             fill: '#fff'
           }
         }}
       />
       </section>

       <section id="style">
       <h2>style</h2>
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
      fontFamily: 'serif',
      fontSize: '1.25em',
      fill: '#333'
    }
  }}
  data={[
    {key: 'A', value: 100, color: '#aaac84'},
    {key: 'B', value: 200, color: '#dce7c5'},
    {key: 'C', value: 50, color: '#e3a51a'}
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
             fontFamily: 'serif',
             fontSize: '1.25em',
             fill: '#333'
           }
         }}
         data={[
           {key: 'A', value: 100, color: brandColors.green},
           {key: 'B', value: 200, color: brandColors.lightGreen},
           {key: 'C', value: 50, color: brandColors.orange}
         ]}
       />
       </section>

       <section id="mouseHandlers">
       <h2>Mouse handlers</h2>
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
 data={[
   {key: 'A', value: 100, color: '#aaac84'},
   {key: 'B', value: 200, color: '#dce7c5'},
   {key: 'C', value: 50, color: '#e3a51a'}
 ]}
 innerHoleSize={200}
 mouseOverHandler={this.mouseOverHandler.bind(this)}
 mouseOutHandler={this.mouseOutHandler.bind(this)}
 mouseMoveHandler={this.mouseMoveHandler.bind(this)}
 padding={10}
 styles={this.styles}
/>
       `)}}
       />
       </pre>
       <PieChart
         data={[
           {key: 'A', value: 100, color: brandColors.green},
           {key: 'B', value: 200, color: brandColors.lightGreen},
           {key: 'C', value: 50, color: brandColors.orange}
         ]}
         innerHoleSize={200}
         mouseOverHandler={this.mouseOverHandler.bind(this)}
         mouseOutHandler={this.mouseOutHandler.bind(this)}
         mouseMoveHandler={this.mouseMoveHandler.bind(this)}
         padding={10}
         styles={this.styles}
       />
       </section>

       <section id="clickHandler">
       <h2>Click Handler</h2>
       <p>The chart will send out a click event. The event will pass the data and the event.
        This allows the data to be presented from the clicking of a segment in any way the react developer requires.</p>
       <pre>
       <code dangerouslySetInnerHTML={{__html: escapeHTML(`
 <div>
   <div>
     <PieChart
       data={[
         {key: 'A', value: 100, color: '#aaac84'},
         {key: 'B', value: 200, color: '#dce7c5'},
         {key: 'C', value: 50, color: '#e3a51a'}
       ]}
       clickHandler={
         (d) => this.setState({
           dataDisplay: \`The value of \${d.data.key} is \${d.value}\`
         })
       }
     />
   </div>
   <div>
   {this.state.dataDisplay ? this.state.dataDisplay : 'Click on a segment to show the value'}
   </div>
 </div>
     `)}}
       />
       </pre>
       <div>
         <div>
           <PieChart
             data={[
               {key: 'A', value: 100, color: brandColors.green},
               {key: 'B', value: 200, color: brandColors.lightGreen},
               {key: 'C', value: 50, color: brandColors.orange}
             ]}
             clickHandler={
               (d) => this.setState({
                 dataDisplay: `The value of ${d.data.key} is ${d.value}`
               })
             }
           />
         </div>
         <div>
         {this.state.dataDisplay ? this.state.dataDisplay : 'Click on a segment to show the value'}
         </div>
       </div>
       </section>

       <section id="updatingData">
       <h2>Updating the data</h2>
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
        padding={10}
        styles={{
          '.chart_lines': {
            strokeWidth: 0
          },
          '.chart_text': {
            fontSize: '1em',
            fill: '#fff'
          }
        }}
      />
      </section>
  </div></div>
      );
    }
}


ReactDOM.render(
  <PieChartContainer />, document.getElementById('root'));
