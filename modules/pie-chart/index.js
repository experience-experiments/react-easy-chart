import React from 'react';
// import { select, selectAll, svg, layout, scale, interpolate} from 'd3';
// import { select, layout } from 'd3';
import d3 from 'd3';
import { createElement } from 'react-faux-dom';
import { Style } from 'radium';
// import merge from 'lodash.merge';

export default class PieChart extends React.Component {
  static get propTypes() {
    return {
      data: React.PropTypes.array.isRequired
    };
  }

  constructor(props) {
    super(props);
    this.width = 960;
    this.height = 500;
    this.radius = Math.min(this.width, this.height) / 2;
    this.color = d3.scale.category20();
    this.svg = createElement('svg');
    this.path = null;
    this.pie = d3.layout.pie().value((d) => d.value).sort(null);
    this.arc = d3.svg.arc().innerRadius(this.radius - 100).outerRadius(this.radius - 20);
    this.current = [];
  }

  componentDidMount() {
    this.draw();
  }

  componentDidUpdate() {
    this.update();
  }

  draw() {
    this.path = d3.select('#pie')
      .datum(this.props.data)
      .selectAll('path')
      .data(this.pie)
      .enter()
      .append('path')
      .attr('fill', (d, i) => this.color(i))
      .attr('d', this.arc)
      .each((d) => {
        this.current.push(d);
      });
  }

  update() {
    this.path
      .data(this.pie(this.props.data))
      .transition()
      .duration(750)
      .attrTween('d', this.tween.bind(this));
  }

  tween(a, index) {
    const cur = this.current[index];
    const i = d3.interpolate(cur, a);
    this.current[index] = a;
    return (t) => {
      const aa = d3.svg.arc().innerRadius(this.radius - 100).outerRadius(this.radius - 20);
      return aa(i(t));
    };
  }

  render() {
    const node = createElement('svg');
    d3.select(node)
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr('id', 'pie')
      .attr('transform', `translate(${this.width / 2}, ${this.height / 2})`);
    const uid = Math.floor(Math.random() * new Date().getTime());
    return (
      <div className={`pie_chart${uid}`}>
        <Style scopeSelector={`.pie_chart${uid}`} />
        {node.toReact()}
      </div>
    );
  }
}
