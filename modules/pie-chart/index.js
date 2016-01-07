import React from 'react';
import { event as d3LastEvent, select, svg, layout, scale} from 'd3';
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

  render() {
    const {
      mouseOverHandler,
      mouseOutHandler,
      mouseMoveHandler,
      clickHandler,
      styles,
      innerHoleSize,
      size,
      padding,
      labels } = this.props;
    const outerRadius = size / 2;
    const arc = svg.arc()
      .outerRadius(outerRadius - padding)
      .innerRadius((innerHoleSize / 2) - padding);

    const labelArc = svg.arc()
      .outerRadius(outerRadius - padding - ((20 * outerRadius) / 100))
      .innerRadius(outerRadius - padding - ((20 * outerRadius) / 100));

    const color = scale.category20();
    const node = createElement('svg');

    const svgNode = select(node)
      .attr('width', size)
      .attr('height', size)
      .append('g')
      .attr('transform', `translate(${ outerRadius }, ${ outerRadius })`);

    const g = svgNode.selectAll('.arc')
      .data(layout.pie().value((d) => d.value)(this.props.data))
      .enter().append('g');

    g.append('path')
      .attr('d', arc)
      .attr('class', 'chart_lines')
      .style('fill', (d, i) => d.data.color ? d.data.color : color(i))
      .on('mouseover', (d) => mouseOverHandler(d, d3LastEvent))
      .on('mouseout', (d) => mouseOutHandler(d, d3LastEvent))
      .on('mousemove', () => mouseMoveHandler(d3LastEvent))
      .on('click', (d) => clickHandler(d, d3LastEvent));

    if (labels) {
      g.append('text')
        .attr('transform', (d) => `translate(${labelArc.centroid(d)})`)
        .text((d) => d.data.key)
        .attr('class', 'chart_text')
        .on('click', (d) => clickHandler(d, d3LastEvent));
    }
    const uid = Math.floor(Math.random() * new Date().getTime());

    return (
      <div className={`pie_chart${uid}`}>
        <Style scopeSelector={`.pie_chart${uid}`} rules={merge({}, defaultStyles, styles)}/>
        {node.toReact()}
      </div>
    );
  }
}

PieChart.propTypes = {
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

PieChart.defaultProps = {
  size: 200,
  innerHoleSize: 0,
  padding: 2,
  styles: {},
  mouseOverHandler: () => {},
  mouseOutHandler: () => {},
  mouseMoveHandler: () => {},
  clickHandler: () => {}
};
