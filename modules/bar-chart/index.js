import React from 'react';
import { ordinal, linear } from 'd3-scale';
import { event as d3LastEvent, select, time, svg, scale, max} from 'd3';
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
let parseDate = null;

export default class BarChart extends React.Component {

  setDomainAndRange(axesType, domainRange, data, type, length) {
    const dataIndex = axesType === 'x' ? 'x' : 'y';
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
        d3Axis = time.scale();
        d3Axis.domain(domainRange ?
          this.calcDefaultDomain(domainRange, axesType)
          :
          extent(data, (d) => parseDate(d[dataIndex]))
        );
        d3Axis.range(axesType === 'x' ? [0, length] : [length, 0]);
        break;
      default:
        break;
    }
    return d3Axis;
  }

  calcMargin(axes) {
    return axes ? {top: 10, right: 20, bottom: 50, left: 50} : {top: 0, right: 0, bottom: 0, left: 0};
  }

  calcDefaultDomain(domainRange, type) {
    switch (type) {
      case 'time':
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
      yType,
      barWidth,
      tickTimeDisplayFormat,
      xTickNumber,
      yTickNumber} = this.props;
    parseDate = format(this.props.datePattern).parse;
    let {margin} = this.props;

    let {width, height, yDomainRange, xDomainRange} = this.props;

    margin = margin ? margin : this.calcMargin(axes);
    width = width - margin.left - margin.right;
    height = height - margin.top - margin.bottom;
    yDomainRange = yDomainRange ? this.calcDefaultDomain(yDomainRange, yType) : null;
    xDomainRange = xDomainRange ? this.calcDefaultDomain(xDomainRange, xType) : null;

    const x = this.setDomainAndRange('x', xDomainRange, data, xType, width);

    const y = this.setDomainAndRange('y', yDomainRange, data, yType, height);

    const svgNode = createElement('svg');
    const selection = select(svgNode);
    selection.attr({
      width: width + margin.left + margin.right,
      height: height + margin.top + margin.bottom
    });

    select(svgNode).attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom);
    const root = select(svgNode).append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    if (axes) {
      const xAxis = svg.axis()
          .scale(x)
          .orient('bottom');
      if (xType === 'time' && tickTimeDisplayFormat) {
        xAxis.tickFormat(time.format(tickTimeDisplayFormat));
      }
      if (xTickNumber) xAxis.ticks(xTickNumber);

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
          .orient('left');
      if (yTickNumber) yAxis.ticks(yTickNumber);

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
          .attr('x', (d) => {
            switch (xType) {
              case ('time'):
                return x(parseDate(d.x));
              default:
                return x(d.x);
            }
          })
          .attr('width', () => {
            switch (xType) {
              case ('text'):
                return x.rangeBand();
              default:
                return barWidth;
            }
          })
          .attr('y', (d) => y(d.y))
          .attr('height', (d) => height - y(d.y))
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
  datePattern: React.PropTypes.string,
  tickTimeDisplayFormat: React.PropTypes.string,
  barWidth: React.PropTypes.number,
  xTickNumber: React.PropTypes.number,
  yTickNumber: React.PropTypes.number
};

BarChart.defaultProps = {
  width: 400,
  height: 200,
  barWidth: 10,
  xType: 'text',
  yType: 'linear',
  mouseOverHandler: () => {},
  mouseOutHandler: () => {},
  mouseMoveHandler: () => {},
  clickHandler: () => {},
  datePattern: '%d-%b-%y',
  axisLabels: {x: 'x axis', y: 'y axis'}
};
