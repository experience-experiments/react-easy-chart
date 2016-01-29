import React from 'react';
// import { select, selectAll, svg, layout, scale, interpolate} from 'd3';
// import { select, layout } from 'd3';
import d3 from 'd3';
import { event as d3LastEvent } from 'd3';
import { createElement } from 'react-faux-dom';
import { Style } from 'radium';
import merge from 'lodash.merge';

const defaultStyles = {
  '.chart_lines': {
    stroke: '#fff',
    strokeWidth: 1
  },
  '.chart_text': {
    fontFamily: 'sans-serif',
    fontSize: '12px',
    textAnchor: 'middle',
    fill: '#000'
  }
};

export default class PieChart extends React.Component {
  static get propTypes() {
    return {
      data: React.PropTypes.array.isRequired,
      innerHoleSize: React.PropTypes.number,
      size: React.PropTypes.number,
      padding: React.PropTypes.number,
      labels: React.PropTypes.bool,
      styles: React.PropTypes.object,
      mouseOverHandler: React.PropTypes.func,
      mouseOutHandler: React.PropTypes.func,
      mouseMoveHandler: React.PropTypes.func,
      clickHandler: React.PropTypes.func
    };
  }

  static get defaultProps() {
    return {
      size: 400,
      innerHoleSize: 0,
      padding: 2,
      labels: false,
      styles: {},
      mouseOverHandler: () => {},
      mouseOutHandler: () => {},
      mouseMoveHandler: () => {},
      clickHandler: () => {}
    };
  }

  constructor(props) {
    super(props);
    this.uid = Math.floor(Math.random() * new Date().getTime());
    this.color = d3.scale.category20();
    this.path = null;
    this.text = null;
    this.pie = d3.layout.pie().value((d) => d.value).sort(null);
    this.current = [];
    this.currentTxt = [];
  }

  componentDidMount() {
    this.draw();
  }

  componentDidUpdate() {
    this.update();
  }

  getArc() {
    return d3.svg.arc()
    .innerRadius(this.getInnerRadius() - this.props.padding)
    .outerRadius(this.getRadius() - this.props.padding);
  }

  getLabelArc() {
    return d3.svg.arc()
    .outerRadius(this.getRadius() - this.props.padding - ((20 * this.getRadius()) / 100))
    .innerRadius(this.getRadius() - this.props.padding - ((20 * this.getRadius()) / 100));
  }

  getRadius() {
    return this.props.size * 0.5;
  }

  getInnerRadius() {
    return this.props.innerHoleSize * 0.5;
  }

  draw() {
    this.path = d3.select(`#pie_${this.uid}`)
      .selectAll('path')
      .data(this.pie(this.props.data))
      .enter()
      .append('path')
      .attr('fill', (d, i) => d.data.color ? d.data.color : this.color(i))
      .attr('d', this.getArc())
      .attr('class', 'chart_lines')
      .on('mouseover', (d) => this.props.mouseOverHandler(d, d3LastEvent))
      .on('mouseout', (d) => this.props.mouseOutHandler(d, d3LastEvent))
      .on('mousemove', () => this.props.mouseMoveHandler(d3LastEvent))
      .on('click', (d) => this.props.clickHandler(d, d3LastEvent))
      .each((d) => {
        this.current.push(d);
      });
    if (this.props.labels) {
      this.text = d3.select(`#labels_${this.uid}`)
        .selectAll('text')
        .data(this.pie(this.props.data))
        .enter()
        .append('text')
        .attr('transform', (d) => `translate(${this.getLabelArc().centroid(d)})`)
        .attr('dy', '.35em')
        .attr('class', 'chart_text')
        .text((d) => d.data.key)
        .each((d) => {
          this.currentTxt.push(d);
        });
    }
  }

  update() {
    this.path
      .data(this.pie(this.props.data))
      .transition()
      .duration(750)
      .attrTween('d', this.tween.bind(this));
    if (this.props.labels) {
      this.text
        .data(this.pie(this.props.data))
        .transition()
        .duration(750)
        .attr('transform', (d) => `translate(${this.getLabelArc().centroid(d)})`);
    }
  }

  tween(a, index) {
    const cur = this.current[index];
    const i = d3.interpolate(cur, a);
    this.current[index] = a;
    return (t) => this.getArc()(i(t));
  }

  render() {
    const node = createElement('svg');
    d3.select(node)
      .attr('width', this.props.size)
      .attr('height', this.props.size)
      .append('g')
      .attr('id', `pie_${this.uid}`)
      .attr('transform', `translate(${this.getRadius()}, ${this.getRadius()})`);
    d3.select(node)
      .attr('width', this.props.size)
      .attr('height', this.props.size)
      .append('g')
      .attr('id', `labels_${this.uid}`)
      .attr('transform', `translate(${this.getRadius()}, ${this.getRadius()})`);

    const uid = Math.floor(Math.random() * new Date().getTime());

    return (
      <div className={`pie_chart${uid}`}>
        <Style
          scopeSelector={`.pie_chart${uid}`}
          rules={merge({}, defaultStyles, this.props.styles)}
        />
        {node.toReact()}
      </div>
    );
  }
}
