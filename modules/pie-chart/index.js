import React from 'react';
import { event as d3LastEvent, select, svg, layout} from 'd3';
import { createElement } from 'react-faux-dom';
import { Style } from 'radium';
import {merge} from 'lodash';

const defaultStyles = {
  '.arc path': {
    stroke: '#fff'
  },
  '.arc text': {
    fontFamily: 'sans-serif',
    fontSize: '10px',
    textAnchor: 'middle'
  }
};

function noop() {}

export default class PieChart extends React.Component {

  render() {
    const { outerRadius, innerRadius, labelRadius, padding } = this.props.settings;
    const { styles, mouseOverHandler, mouseOutHandler, clickHandler } = this.props.styles;
    const w = outerRadius * 2;
    const h = outerRadius * 2;

    const arc = svg.arc()
      .outerRadius(outerRadius - padding)
      .innerRadius(innerRadius - padding);

    const labelArc = svg.arc()
      .outerRadius(labelRadius - padding)
      .innerRadius(labelRadius - padding);

    const node = createElement('svg');

    const svgNode = select(node)
      .attr('width', w)
      .attr('height', h)
      .append('g')
      .attr('transform', `translate(${ outerRadius }, ${ outerRadius })`);

    const g = svgNode.selectAll('.arc')
      .data(layout.pie().value((d) => d.value)(this.props.data))
      .enter().append('g')
      .attr('class', 'arc');

    g.append('path')
      .attr('d', arc)
      .style('fill', (d) => d.data.color)
      .on('mouseover', (d) => mouseOverHandler(d, d3LastEvent))
      .on('mouseout', (d) => mouseOutHandler(d, d3LastEvent))
      .on('click', (d) => clickHandler(d, d3LastEvent));

    g.append('text')
      .attr('transform', (d) => `translate(${labelArc.centroid(d)})`)

      .text((d) => d.data.label);
    merge(defaultStyles, styles);

    return (
      <div className="pie-chart">
        <Style scopeSelector=".pie-chart" rules={defaultStyles}/>
        {node.toReact()}
      </div>
    );
  }
}

PieChart.propTypes = {
  data: React.PropTypes.array.isRequired,
  settings: React.PropTypes.object,
  styles: React.PropTypes.object
};

PieChart.defaultProps = {
  settings: {
    innerRadius: 0,
    outerRadius: 300,
    labelRadius: 200,
    padding: 20
  },
  styles: {},
  mouseOverHandler: noop,
  mouseOutHandler: noop,
  clickHandler: noop
};
