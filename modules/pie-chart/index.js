import React from 'react';
import { select, selectAll, svg, layout, scale, interpolate} from 'd3';
// import { select, layout } from 'd3';
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
    fill: '#fff'
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
      size: 200,
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
    this.color = scale.category20();
  }

  componentDidMount() {
    this.drawArc(this.props.data);
  }

  componentDidUpdate() {
    // this.drawArc(this.props.data);
    selectAll('.chart_lines')
    .data(layout.pie().value((d) => d.value)(this.props.data))
    .transition()
    .duration(500)
    .attr('d', this.arc);
  }

  arcTween(a) {
    var i = interpolate(this._current, a);
    this._current = i(0);
    return (t) => {
      return this.arc(i(t));
    };
  }

  drawArc(data) {
    // console.log(select('g'));
    select('.svg-g-container')
      .selectAll('.arcs')
      .data(layout.pie().value((d) => d.value)(data))
      .enter()
      // .append('g')
      .append('path')
      .attr('d', this.arc)
      .attr('class', 'chart_lines')
      .style('fill', (d, i) => d.data.color ? d.data.color : this.color(i));

    // .attr('d', this.arc);
    // const g = svgNode.selectAll('.arc')
    //   .data(layout.pie().value((d) => d.value)(this.props.data))
    //   .enter().append('g');
    // .datum(data)
    // .transition()
    // .duration(500)
    // .attr('d', this.arc);
  }

  render() {
    const {
      // mouseOverHandler,
      // mouseOutHandler,
      // mouseMoveHandler,
      // clickHandler,
      styles,
      innerHoleSize,
      size,
      padding
      // , labels
    } = this.props;
    const outerRadius = size / 2;
    this.arc = svg.arc()
      .outerRadius(outerRadius - padding)
      .innerRadius((innerHoleSize / 2) - padding);

    // const labelArc = svg.arc()
    //   .outerRadius(outerRadius - padding - ((20 * outerRadius) / 100))
    //   .innerRadius(outerRadius - padding - ((20 * outerRadius) / 100));

    // const color = scale.category20();
    const node = createElement('svg');

    // const svgNode =
    select(node)
      .attr('width', size)
      .attr('height', size)
      .append('g')
      .attr('class', 'svg-g-container')
      .attr('transform', `translate(${ outerRadius }, ${ outerRadius })`);

    // svgNode
    //   .selectAll('.arcs')
    //   .data(layout.pie().value((d) => d.value)(this.props.data))
    //   .enter().append('g')
    //   .append('path')
    //   .attr('d', this.arc)
    //   .attr('class', 'chart_lines')
    //   .style('fill', (d, i) => d.data.color ? d.data.color : color(i));


    // console.log(g);
      // .on('mouseover', (d) => mouseOverHandler(d, d3LastEvent))
      // .on('mouseout', (d) => mouseOutHandler(d, d3LastEvent))
      // .on('mousemove', () => mouseMoveHandler(d3LastEvent))
      // .on('click', (d) => clickHandler(d, d3LastEvent));

    // if (labels) {
    //   g.append('text')
    //     .attr('transform', (d) => `translate(${labelArc.centroid(d)})`)
    //     .text((d) => d.data.key)
    //     .attr('class', 'chart_text')
    //     .on('click', (d) => clickHandler(d, d3LastEvent));
    // }
    const uid = Math.floor(Math.random() * new Date().getTime());

    return (
      <div className={`pie_chart${uid}`}>
        <Style scopeSelector={`.pie_chart${uid}`} rules={merge({}, defaultStyles, styles)}/>
        {node.toReact()}
      </div>
    );
  }
}
