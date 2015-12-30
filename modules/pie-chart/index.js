import React from 'react';
import { event as d3LastEvent, select, svg, layout, scale} from 'd3';
import { createElement } from 'react-faux-dom';
import { Style } from 'radium';
import merge from 'lodash.merge';

const defaultStyles = {
  '.pie-chart-lines': {
    stroke: '#fff'
  },
  '.pie-chart-text': {
    fontFamily: 'sans-serif',
    fontSize: '10px',
    textAnchor: 'middle'
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
      innerHoleHeight,
      height,
      padding,
      hasLabels } = this.props;
    const outerRadius = height / 2;
    const arc = svg.arc()
      .outerRadius(outerRadius - padding)
      .innerRadius((innerHoleHeight / 2) - padding);

    const labelArc = svg.arc()
      .outerRadius(outerRadius - padding - ((20 * outerRadius) / 100))
      .innerRadius(outerRadius - padding - ((20 * outerRadius) / 100));

    const color = scale.ordinal()
        .range(['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00']);

    const node = createElement('svg');

    const svgNode = select(node)
      .attr('width', height)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${ outerRadius }, ${ outerRadius })`);

    const g = svgNode.selectAll('.arc')
      .data(layout.pie().value((d) => d.value)(this.props.data))
      .enter().append('g');

    g.append('path')
      .attr('d', arc)
      .style('fill', (d) => d.data.color ? d.data.color : color(d.data.value))
      .attr('class', 'pie-chart-lines')
      .on('mouseover', (d) => mouseOverHandler(d, d3LastEvent))
      .on('mouseout', (d) => mouseOutHandler(d, d3LastEvent))
      .on('mousemove', () => mouseMoveHandler(d3LastEvent))
      .on('click', (d) => clickHandler(d, d3LastEvent));

    if (hasLabels === true) {
      g.append('text')
        .attr('transform', (d) => `translate(${labelArc.centroid(d)})`)
        .text((d) => d.data.label)
        .attr('class', 'pie-chart-text');
    }

    return (
      <div className="pie-chart">
        <Style scopeSelector=".pie-chart" rules={merge(defaultStyles, styles)}/>
        {node.toReact()}
      </div>
    );
  }
}

PieChart.propTypes = {
  data: React.PropTypes.array.isRequired,
  innerHoleHeight: React.PropTypes.number,
  height: React.PropTypes.number,
  padding: React.PropTypes.number,
  hasLabels: React.PropTypes.bool,
  styles: React.PropTypes.object,
  mouseOverHandler: React.PropTypes.func,
  mouseOutHandler: React.PropTypes.func,
  mouseMoveHandler: React.PropTypes.func,
  clickHandler: React.PropTypes.func
};

PieChart.defaultProps = {
  height: 200,
  innerHoleHeight: 0,
  padding: 2,
  hasLabels: false,
  styles: {},
  mouseOverHandler: () => {},
  mouseOutHandler: () => {},
  mouseMoveHandler: () => {},
  clickHandler: () => {}
};
