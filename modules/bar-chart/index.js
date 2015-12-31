import React from 'react';
import { ordinal, linear } from 'd3-scale';
import { event as d3LastEvent, select, svg, max} from 'd3';
import {format} from 'd3-time-format';
// import {extent} from 'd3-array';
import { createElement } from 'react-faux-dom';
import { Style } from 'radium';
import merge from 'lodash.merge';

const defaultStyle = {
  '.bar': {
    fill: 'blue'
  },
  '.bar:hover': {
    fill: 'brown'
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


export default class BarChart extends React.Component {

  getValueFunction(scale, type) {
    const dataIndex = scale === 'x' ? 0 : 1;
    switch (type) {
      case 'time':
        const parseDate = format(this.props.datePattern).parse;
        return (d) => parseDate(d[dataIndex]);
      default:
        return (d) => d[dataIndex];
    }
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

  render() {
    const {
      data,
      margin,
      mouseOverHandler,
      mouseOutHandler,
      clickHandler,
      mouseMoveHandler,
      style,
      axes,
      axisLabels,
      xType,
      yType} = this.props;
    // const yValue = this.getValueFunction('y', yType);
    // const xValue = this.getValueFunction('x', xType);

    let {width, height, yDomainRange, xDomainRange} = this.props;
    width = width - margin.left - margin.right;
    height = height - margin.top - margin.bottom;
    yDomainRange = yDomainRange ? this.calcDefaultDomain(yDomainRange, yType) : null;
    xDomainRange = xDomainRange ? this.calcDefaultDomain(xDomainRange, xType) : null;

    const x = ordinal()
        .rangeRoundBands([0, width], 0.1);
    const y = linear()
        .range([height, 0]);

    const node = createElement('svg');
    const selection = select(node);

    selection.attr({
      width: width + margin.left + margin.right,
      height: height + margin.top + margin.bottom
    });

    const svgContainer = selection.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // x.domain(xDomainRange ? xDomainRange : extent(data, xValue));
    // y.domain(yDomainRange ? yDomainRange : extent(data, yValue));

    x.domain(data.map((d) => d.key));
    // y.domain([0, max(data, (d) => d.value)]);
    y.domain(yDomainRange ? yDomainRange : [0, max(data, (d) => d.value)]);

    data.map(() => {
      if (axes) {
        const xAxis = svg.axis()
            .scale(x)
            .orient('bottom');

        const yAxis = svg.axis()
            .scale(y)
            .orient('left')
            .ticks(10);

        svgContainer.append('g')
          .attr('class', 'x axis')
          .attr('transform', 'translate(0,' + height + ')')
          .call(xAxis)
          .append('text')
          .attr('class', 'label')
          .attr('y', margin.bottom - 0.9)
          .attr('x', (width - margin.left) / 2)
          .text(axisLabels.x);

        svgContainer.append('g')
          .attr('class', 'y axis')
          .call(yAxis)
          .append('text')
          .attr('class', 'label')
          .attr('transform', 'rotate(-90)')
          .attr('x', (0 - height) / 2)
          .attr('y', 0 - margin.left)
          .attr('dy', '.9em')
          .style('text-anchor', 'end')
          .text(axisLabels.y);
      }

      svgContainer.selectAll('.bar')
          .data(data)
          .enter().append('rect')
          .attr('class', 'bar')
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
        {node.toReact()}
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
  axes: React.PropTypes.bool,
  axisLabels: React.PropTypes.object,
  xType: React.PropTypes.string,
  yType: React.PropTypes.string,
  xDomainRange: React.PropTypes.array,
  yDomainRange: React.PropTypes.array,
  datePattern: React.PropTypes.string
};

BarChart.defaultProps = {
  margin: {top: 20, right: 20, bottom: 30, left: 40},
  width: 960,
  height: 500,
  mouseOverHandler: () => {},
  mouseOutHandler: () => {},
  mouseMoveHandler: () => {},
  clickHandler: () => {},
  axes: true,
  datePattern: '%d-%b-%y',
  axisLabels: {x: 'x axis', y: 'y axis'}
};
