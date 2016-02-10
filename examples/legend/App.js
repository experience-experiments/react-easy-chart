import React from 'react';
import ReactDOM from 'react-dom';
import {Legend} from 'react-easy-chart';
import {PieChart} from 'react-easy-chart';
import ScatterplotChart from 'react-easy-chart/scatterplot-chart';
import {escapeHTML} from '../util';
import Scrollspy from 'react-scrollspy';

const pieData = [
  {key: 'Cats', value: 100},
  {key: 'Dogs', value: 200},
  {key: 'Other', value: 50}
];

const pieDataCustom = [
  {key: 'Cats', value: 100, color: '#aaac84'},
  {key: 'Dogs', value: 200, color: '#dce7c5'},
  {key: 'Other', value: 50, color: '#e3a51a'}
];

const config = [
  {color: '#aaac84'},
  {color: '#dce7c5'},
  {color: '#e3a51a'}
];

const customStyle = {
  '.legend': {
    backgroundColor: '#f9f9f9',
    border: '1px solid #e5e5e5',
    borderRadius: '12px',
    fontSize: '0.8em',
    maxWidth: '300px',
    padding: '12px'
  }
};

const scatterStyle = {
  '.legend': {
    backgroundColor: '#f9f9f9',
    border: '1px solid #e5e5e5',
    borderRadius: '12px',
    fontSize: '0.8em',
    maxWidth: '480px',
    padding: '12px'
  }
};

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

export default class LegendContainer extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        active: false
      };
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
                  'basic',
                  'horizontal',
                  'config',
                  'styles',
                  'scatterplot'
                  ]
                }
                currentClassName="active"
              >
                <li><a href="#introduction">Introduction</a></li>
                <li><a href="#basic">Basic</a></li>
                <li><a href="#horizontal">Horizontal</a></li>
                <li><a href="#config">Config</a></li>
                <li><a href="#styles">Styles</a></li>
                <li><a href="#scatterplot">Scatterplot</a></li>
              </Scrollspy>
            </nav>
          </aside>
          <div className="content">
            <h1>The React Easy Chart Legend</h1>
            <h2 id="introduction">Introduction</h2>
            <p>The legend component provides a key to the data and is designed to work with the Pie and Scatter plot charts. The legend component is easily cusomised via css</p>
            <h2 id="basic">Basic</h2>
            <p>Simply pass the same data used for the chart and provide a data id (dataId) for the label.</p>
            <pre>
            <code dangerouslySetInnerHTML={{__html: escapeHTML(`
const pieData = [
  {key: 'Cats', value: 100},
  {key: 'Dogs', value: 200},
  {key: 'Other', value: 50}
];

<PieChart data={pieData} size={300} />

<Legend data={pieData} dataId={'key'} />
            `)}}
            />
            </pre>
            <div>
              <PieChart data={pieData} size={300} />
              <Legend data={pieData} dataId={'key'} />
              <pre>
              <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<Legend data={pieData} dataId={'value'} />
              `)}}
              />
              </pre>
              <Legend data={pieData} dataId={'value'} />
            </div>
            <h2 id="horizontal">Horizontal</h2>
            <p>Pass `horizontal` as a parameter to switch the list items from block to inline-block</p>
            <pre>
            <code dangerouslySetInnerHTML={{__html: escapeHTML(`
<Legend data={pieData} dataId={'key'} horizontal />
            `)}}
            />
            </pre>
            <div>
              <PieChart data={pieData} size={300} />
              <Legend data={pieData} dataId={'key'} horizontal />
            </div>
            <h2 id="config">Config</h2>
            <p>React Easy Charts use <a href="https://github.com/mbostock/d3/wiki/Ordinal-Scales#category20">d3.scale.category20</a> to generate a list of default colours. If your chart has a custom colour scheme, pass this colour array to the config property.</p>
            <pre>
            <code dangerouslySetInnerHTML={{__html: escapeHTML(`
const pieDataCustom = [
  {key: 'Cats', value: 100, color: '#aaac84'},
  {key: 'Dogs', value: 200, color: '#dce7c5'},
  {key: 'Other', value: 50, color: '#e3a51a'}
];

const config = [
  {color: '#aaac84'},
  {color: '#dce7c5'},
  {color: '#e3a51a'}
];

<PieChart data={pieDataCustom} size={300} />

<Legend data={pieDataCustom} dataId={'key'} config={config}/>
            `)}}
            />
            </pre>
            <div>
              <PieChart data={pieDataCustom} size={300} padding={20}/>
              <Legend data={pieDataCustom} dataId={'key'} config={config} horizontal/>
            </div>
            <h2 id="styles">Styles</h2>
            <p>Legend is a styled unordered list and can be easily customised by overriding (all or parts of) the default styles. Simply create a javascript based style object and pass this in through the styles parameter</p>
            <pre>
            <code dangerouslySetInnerHTML={{__html: escapeHTML(`
/* default component styles */
const defaultStyles = {
  '.legend': {
    'list-style': 'none',
    margin: 0,
    padding: 0
  },
  '.legend li': {
    display: 'block',
    lineHeight: '24px',
    marginRight: '24px',
    marginBottom: '6px',
    paddingLeft: '24px',
    position: 'relative'
  },
  '.legend li.horizontal': {
    display: 'inline-block'
  },
  '.legend .icon': {
    width: '12px',
    height: '12px',
    background: 'red',
    borderRadius: '6px',
    position: 'absolute',
    left: '0',
    top: '50%',
    marginTop: '-6px'
  }
};

/* example override */
const customStyle = {
  '.legend': {
    backgroundColor: '#f9f9f9',
    border: '1px solid #e5e5e5',
    borderRadius: '12px',
    fontSize: '0.8em',
    maxWidth: '300px',
    padding: '12px'
  }
};

<Legend
  data={pieDataCustom}
  dataId={'key'}
  config={config}
  styles={customStyle}
  horizontal
/>
            `)}}
            />
            </pre>
            <div>
              <PieChart
                data={pieDataCustom}
                size={300}
                padding={20}
                innerHoleSize={150}
              />
              <Legend
                data={pieDataCustom}
                dataId={'key'}
                config={config}
                styles={customStyle}
                horizontal
              />
            </div>
            <h2 id="scatterplot">Scatterplot</h2>
            <p>A scatterplot example</p>
            <pre>
            <code dangerouslySetInnerHTML={{__html: escapeHTML(`
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

const scatterStyle = {
  '.legend': {
    backgroundColor: '#f9f9f9',
    border: '1px solid #e5e5e5',
    borderRadius: '12px',
    fontSize: '0.8em',
    maxWidth: '480px',
    padding: '12px'
  }
};

<ScatterplotChart
  data={bigData}
  width={480}
  height={270}
  axes
/>
<Legend
  data={bigData}
  dataId={'type'}
  config={config}
  styles={scatterStyle}
  horizontal
/>
            `)}}
            />
            </pre>
            <ScatterplotChart
              data={bigData}
              width={480}
              height={270}
              axes
            />
            <Legend
              data={bigData}
              dataId={'type'}
              config={config}
              styles={scatterStyle}
              horizontal
            />
          </div>
        </div>
      );
    }
}

ReactDOM.render(
  <LegendContainer />, document.getElementById('root'));
