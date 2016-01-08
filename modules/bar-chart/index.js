import React from 'react';
import { ordinal, linear } from 'd3-scale';
import { event as d3LastEvent, select, svg, max, scale} from 'd3';
import {format} from 'd3-time-format';
import { createElement } from 'react-faux-dom';
import { Style } from 'radium';
import merge from 'lodash.merge';

const defaultStyle = {
  '.bar': {
    fill: 'blue'
  },
  '.bar:hover': {
    opacity: 0.5
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
  }
};
const colorScale = scale.category20();
export default class BarChart extends React.Component {

  getValueFunction(axis, type) {
    const dataIndex = axis === 'x' ? 0 : 1;
    switch (type) {
      case 'time':
        const parseDate = format(this.props.datePattern).parse;
        return (d) => parseDate(d[dataIndex]);
      default:
        return (d) => d[dataIndex];
    }
  }

  calcMargin(axes) {
    return axes ? {top: 10, right: 20, bottom: 50, left: 50} : {top: 0, right: 0, bottom: 0, left: 0};
  }

  calcDefaultDomain(domainRange, type) {
    switch (type) {
      case 'time':
        const parseDate = format(this.props.datePattern).parse;
        return [parseDate(domainRange[0]), parseDate(domainRange[1])];
      default:
        return domainRange;
    }
  }

  defineColor(i, d, colorBars) {
    if (d.color) return d.color;
    if (colorBars) return colorScale(i);
    return null;
  }

  render() {
    const {
      data,
      mouseOverHandler,
      mouseOutHandler,
      mouseMoveHandler,
      clickHandler,
      style,
      axes,
      axisLabels,
      colorBars,
      xType,
      yType} = this.props;
    let {margin} = this.props;

    let {width, height, yDomainRange, xDomainRange} = this.props;
    margin = margin ? margin : this.calcMargin(axes);
    width = width - margin.left - margin.right;
    height = height - margin.top - margin.bottom;
    yDomainRange = yDomainRange ? this.calcDefaultDomain(yDomainRange, yType) : null;
    xDomainRange = xDomainRange ? this.calcDefaultDomain(xDomainRange, xType) : null;

    const barPadding = (width / data.length) > 40 ? 0.02 : 0.04;

    const x = ordinal();
    x.rangeBands([0, width], barPadding);
    x.domain(data.map((d) => d.key));

    const y = linear()
        .range([height, 0]);

    const svgNode = createElement('svg');
    const selection = select(svgNode);

    select(svgNode).attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom);
    const root = select(svgNode).append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    selection.attr({
      width: width + margin.left + margin.right,
      height: height + margin.top + margin.bottom
    });

    // const svgContainer = selection.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    y.domain(yDomainRange ? yDomainRange : [0, max(data, (d) => d.value)]);

    if (axes) {
      const xAxis = svg.axis()
          .scale(x)
          .orient('bottom');

      root.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)
        .append('text')
        .attr('class', 'label')
        .attr('y', margin.bottom - 4)
        .attr('x', (width))
        .style('text-anchor', 'end')
        .text(axisLabels.x);

      const yAxis = svg.axis()
          .scale(y)
          .orient('left')
          .ticks(10);
      root.append('g')
        .attr('class', 'y axis')
        .call(yAxis)
        .append('text')
        .attr('class', 'label')
        .attr('transform', 'rotate(-90)')
        .attr('x', 0)
        .attr('y', 0 - margin.left)
        .attr('dy', '.9em')
        .style('text-anchor', 'end')
        .text(axisLabels.y);
    }

    data.map(() => {
      root.selectAll('.bar')
          .data(data)
          .enter().append('rect')
          .attr('class', 'bar')
          .style('fill', (d, i) => this.defineColor(i, d, colorBars))
          .attr('x', (d) => x(d.key))
          .attr('width', x.rangeBand())
          .attr('y', (d) => y(d.value))
          .attr('height', (d) => height - y(d.value))
          .on('mouseover', (d) => mouseOverHandler(d, d3LastEvent))
          .on('mouseout', (d) => mouseOutHandler(d, d3LastEvent))
          .on('mousemove', () => mouseMoveHandler(d3LastEvent))
          .on('click', (d) => clickHandler(d, d3LastEvent));
    });

    const uid = Math.floor(Math.random() * new Date().getTime());

    return (
      <div className={`bar-chart${uid}`}>
        <Style scopeSelector={`.bar-chart${uid}`} rules={merge({}, defaultStyle, style)}/>
        {svgNode.toReact()}
      </div>
    );
  }
}

BarChart.propTypes = {
  data: React.PropTypes.array.isRequired,
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  margin: React.PropTypes.object,
  mouseOverHandler: React.PropTypes.func,
  mouseOutHandler: React.PropTypes.func,
  mouseMoveHandler: React.PropTypes.func,
  clickHandler: React.PropTypes.func,
  style: React.PropTypes.object,
  colorBars: React.PropTypes.bool,
  axes: React.PropTypes.bool,
  axisLabels: React.PropTypes.object,
  xType: React.PropTypes.string,
  yType: React.PropTypes.string,
  xDomainRange: React.PropTypes.array,
  yDomainRange: React.PropTypes.array,
  datePattern: React.PropTypes.string
};

BarChart.defaultProps = {
  width: 400,
  height: 200,
  mouseOverHandler: () => {},
  mouseOutHandler: () => {},
  mouseMoveHandler: () => {},
  clickHandler: () => {},
  datePattern: '%d-%b-%y',
  axisLabels: {x: 'x axis', y: 'y axis'}
};
