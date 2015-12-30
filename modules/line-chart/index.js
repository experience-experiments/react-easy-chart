import React from 'react';
import {createElement} from 'react-faux-dom';
import {line} from 'd3-shape';
import {linear} from 'd3-scale';
import {extent} from 'd3-array';
import {select, svg} from 'd3';
import {Style} from 'radium';
import merge from 'lodash.merge';

const defaultStyle = {
  '.line': {
    fill: 'none',
    stroke: 'steelblue',
    strokeWidth: 1.5
  },
  '.axis path, .axis line': {
    fill: 'none',
    stroke: '#000',
    shapeRendering: 'crispEdges'
  },
  '.x.axis path': {
    display: 'none'
  }
};

const defaultMargin = {top: 20, right: 20, bottom: 30, left: 50};

export default class LineChart extends React.Component {

  render() {
    const {data, xValue, yValue, xScale, yScale, margin, style} = this.props;
    let {width, height} = this.props;
    width = width - (margin.left + margin.right);
    height = height - (margin.top + margin.bottom);

    const x = xScale().range([0, width]);
    const y = yScale().range([height, 0]);

    const xAxis = svg.axis().scale(x).orient('bottom');
    const yAxis = svg.axis().scale(y).orient('left');

    const linePath = line().x((d) => x(xValue(d))).y((d) => y(yValue(d)));

    const svgNode = createElement('svg');
    select(svgNode).attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom);
    const root = select(svgNode).append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    x.domain(extent(data, xValue));
    y.domain(extent(data, yValue));

    root.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);

    root.append('g')
      .attr('class', 'y axis')
      .call(yAxis)
    .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text('Price ($)');

    root.append('path')
      .datum(data)
      .attr('class', 'line')
      .attr('d', linePath);

    return (
      <div className="line-chart">
        <Style scopeSelector=".line-chart" rules={merge(defaultStyle, style)}/>
        {svgNode.toReact()}
      </div>
    );
  }
}

LineChart.propTypes = {
  data: React.PropTypes.array.isRequired,
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  xValue: React.PropTypes.func,
  yValue: React.PropTypes.func,
  style: React.PropTypes.object,
  margin: React.PropTypes.object,
  xScale: React.PropTypes.func,
  yScale: React.PropTypes.func
};

LineChart.defaultProps = {
  width: 960,
  height: 500,
  margin: defaultMargin,
  xScale: linear,
  yScale: linear,
  xValue: (d) => d[0],
  yValue: (d) => d[1]
};
