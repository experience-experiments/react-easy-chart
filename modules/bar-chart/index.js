import React from 'react';
import { ordinal, linear } from 'd3-scale';
import { event as d3LastEvent, select, svg, scale, max} from 'd3';
import {extent} from 'd3-array';
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

  getValueFunction(axesType, type) {
    const dataIndex = axesType === 'x' ? 0 : 1;
    switch (type) {
      case 'time':
        const parseDate = format(this.props.datePattern).parse;
        return (d) => parseDate(d[dataIndex]);
      default:
        return (d) => d[dataIndex];
    }
  }

  setYDomainAndRange(axesType, domainRange, data, type, length) {
    const dataIndex = axesType === 'x' ? 'key' : 'value';
    const barPadding = (length / data.length) > 40 ? 0.02 : 0.04;
    let d3Axis;
    switch (type) {
      case 'text':
        d3Axis = ordinal();
        d3Axis.domain(data.map((d) => d[dataIndex]));
        d3Axis.rangeBands([0, length], barPadding);
        break;
      case 'linear':
        d3Axis = linear();
        d3Axis.domain([0, max(data, (d) => d[dataIndex])]);
        d3Axis.range([length, 0]);
        const exR = extent(data, (d) => d[dataIndex]);
        console.log(exR);
        // d3Axis.domain(extent(data, (d) => d[dataIndex]));
        // d3Axis.rangePoints([0, length], barPadding);
        // d3Axis.domain([20, 30]);
        // d3Axis.rangeRound([0, length]);
        break;
      case 'time':
        d3Axis.domain(domainRange ?
          this.calcDefaultDomain(domainRange, type)
          :
          this.findLargestExtent(data, this.getValueFunction(scale, type)));
        d3Axis.range(scale === 'x' ? [0, length] : [length, 0]);
        break;
      default:
        break;
    }
    return d3Axis;
  }


  setDomainAndRange(axesType, domainRange, data, type, length) {
    const dataIndex = axesType === 'x' ? 'key' : 'value';
    const barPadding = (length / data.length) > 40 ? 0.02 : 0.04;
    let d3Axis;
    switch (type) {
      case 'text':
        d3Axis = ordinal();
        d3Axis.domain(data.map((d) => d[dataIndex]));
        d3Axis.rangeBands([0, length], barPadding);
        break;
      case 'linear':
        d3Axis = linear();
        d3Axis.domain(domainRange ?
          this.calcDefaultDomain(domainRange, type)
          :
          [0, max(data, (d) => d[dataIndex])]
        );
        d3Axis.range(axesType === 'x' ? [0, length] : [length, 0]);
        break;
      case 'time':
        d3Axis.domain(domainRange ?
          this.calcDefaultDomain(domainRange, type)
          :
          this.findLargestExtent(data, this.getValueFunction(scale, type)));
        d3Axis.range(axesType === 'x' ? [0, length] : [length, 0]);
        break;
      default:
        break;
    }
    return d3Axis;
  }

  findLargestExtent(data, value) {
    let low;
    let high;
    data.map((dataElement) => {
      const calcDomainRange = extent(dataElement, value);
      low = low < calcDomainRange[0] ? low : calcDomainRange[0];
      high = high > calcDomainRange[1] ? high : calcDomainRange[1];
    });
    return [low, high];
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

    const x = this.setDomainAndRange('x', xDomainRange, data, xType, width);

    const y = this.setYDomainAndRange('y', yDomainRange, data, yType, height);

    const svgNode = createElement('svg');
    const selection = select(svgNode);

    select(svgNode).attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom);
    const root = select(svgNode).append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    selection.attr({
      width: width + margin.left + margin.right,
      height: height + margin.top + margin.bottom
    });

    if (axes) {
      const xAxis = svg.axis()
          .scale(x)
          .ticks(10)
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
          .attr('width', () => {
            switch (xType) {
              case ('text'):
                return x.rangeBand();
              case ('linear'):
                return 10;
              default:
                return () => {};
            }
          })
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
  xType: 'text',
  yType: 'linear',
  mouseOverHandler: () => {},
  mouseOutHandler: () => {},
  mouseMoveHandler: () => {},
  clickHandler: () => {},
  datePattern: '%d-%b-%y',
  axisLabels: {x: 'x axis', y: 'y axis'}
};
