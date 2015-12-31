import React from 'react';
import {createElement} from 'react-faux-dom';
import {line} from 'd3-shape';
import {linear} from 'd3-scale';
import {extent} from 'd3-array';
import {select, svg} from 'd3';
import {Style} from 'radium';
import merge from 'lodash.merge';
import {time} from 'd3';
import {format} from 'd3-time-format';

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

export default class LineChart extends React.Component {
  getScale(type) {
    switch (type) {
      case 'time':
        return time.scale;
      default:
        return linear;
    }
  }

  getValue(scale, type) {
    const dataIndex = scale === 'x' ? 0 : 1;
    switch (type) {
      case 'time':
        const parseDate = format(this.props.datePattern).parse;
        return (d) => parseDate(d[dataIndex]);
      default:
        return (d) => d[dataIndex];
    }
  }

  calcMargin(axes) {
    return axes ? {top: 0, right: 0, bottom: 30, left: 50} : {top: 0, right: 0, bottom: 0, left: 0};
  }

  render() {
    const {data, xType, yType, style, axes} = this.props;
    let {margin} = this.props;
    const xScale = this.getScale(xType);
    const yScale = this.getScale(yType);
    const yValue = this.getValue('y', yType);
    const xValue = this.getValue('x', xType);

    margin = margin ? margin : this.calcMargin(axes);

    let {width, height} = this.props;
    width = width - (margin.left + margin.right);
    height = height - (margin.top + margin.bottom);

    const x = xScale().range([0, width]);
    const y = yScale().range([height, 0]);

    const linePath = line().x((d) => x(xValue(d))).y((d) => y(yValue(d)));

    const svgNode = createElement('svg');
    select(svgNode).attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom);
    const root = select(svgNode).append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    x.domain(extent(data, xValue));
    y.domain(extent(data, yValue));

    if (axes) {
      const xAxis = svg.axis().scale(x).orient('bottom');
      const yAxis = svg.axis().scale(y).orient('left');
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
    }

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
  xType: React.PropTypes.string,
  yType: React.PropTypes.string,
  datePattern: React.PropTypes.string,
  style: React.PropTypes.object,
  margin: React.PropTypes.object,
  axes: React.PropTypes.bool
};

LineChart.defaultProps = {
  width: 960,
  height: 500,
  datePattern: '%d-%b-%y',
  xType: 'default',
  yType: 'default',
  axes: false
};
