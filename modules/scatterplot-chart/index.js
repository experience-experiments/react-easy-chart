import React from 'react';
import d3 from 'd3';
import { createElement } from 'react-faux-dom';
import {Style} from 'radium';
import merge from 'lodash.merge';

const defaultStyle = {
  '.line': {
    fill: 'none',
    strokeWidth: 1.5
  },
  '.axis': {
    font: '10px arial'
  },
  '.axis .label': {
    font: '14px arial'
  },
  '.axis path,.axis line': {
    fill: 'none',
    stroke: '#000',
    'shape-rendering': 'crispEdges'
  },
  'x.axis path': {
    display: 'none'
  },
  '.dot': {
    stroke: '#000'
  }
};

export default class ScatterplotChart extends React.Component {

  render() {
    const {data} = this.props;
    const margin = {top: 20, right: 20, bottom: 30, left: 40};
    const width = 960 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
    const x = d3.scale.linear().range([0, width]);
    const y = d3.scale.linear().range([height, 0]);
    const color = d3.scale.category10();

    const xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom');

    const yAxis = d3.svg.axis()
      .scale(y)
      .orient('left');

    const node = createElement('svg');

    const svg = d3.select(node)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    data.forEach((d) => {
      d.sepalLength = +d.sepalLength;
      d.sepalWidth = +d.sepalWidth;
    });

    x.domain(d3.extent(data, (d) => { return d.sepalWidth; })).nice();
    y.domain(d3.extent(data, (d) => { return d.sepalLength; })).nice();

    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis)
      .append('text')
      .attr('class', 'label')
      .attr('x', width)
      .attr('y', -6)
      .style('text-anchor', 'end')
      .text('Sepal Width (cm)');

    svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis)
      .append('text')
      .attr('class', 'label')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text('Sepal Length (cm)');

    svg.selectAll('.dot')
      .data(data)
      .enter().append('circle')
      .attr('class', 'dot')
      .attr('r', 3.5)
      .attr('cx', (d) => { return x(d.sepalWidth); })
      .attr('cy', (d) => { return y(d.sepalLength); })
      .style('fill', (d) => { return color(d.species); });

    const legend = svg.selectAll('.legend')
      .data(color.domain())
      .enter().append('g')
      .attr('class', 'legend')
      .attr('transform', (d, i) => { return `translate(0, ${i * 20})`; });

    legend.append('rect')
      .attr('x', width - 18)
      .attr('width', 18)
      .attr('height', 18)
      .style('fill', color);

    legend.append('text')
      .attr('x', width - 24)
      .attr('y', 9)
      .attr('dy', '.35em')
      .style('text-anchor', 'end')
      .text((d) => { return d; });

    const uid = Math.floor(Math.random() * new Date().getTime());

    return (
      <div className={`scatterplot_chart${uid}`}>
        <h1>Scatterplot Chart</h1>
        <Style scopeSelector={`.scatterplot_chart${uid}`} rules={merge({}, defaultStyle)}/>
        {node.toReact()}
      </div>
    );
  }
}

ScatterplotChart.propTypes = {
  data: React.PropTypes.array.isRequired
};

ScatterplotChart.defaultProps = {
  mouseOverHandler: () => {},
  mouseOutHandler: () => {},
  mouseMoveHandler: () => {},
  clickHandler: () => {}
};
