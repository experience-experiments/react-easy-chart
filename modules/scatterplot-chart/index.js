import React from 'react';
import {linear, ordinal} from 'd3-scale';
import {event as d3LastEvent, min, max, scale, select, svg, time} from 'd3';
import {format} from 'd3-time-format';
import {extent} from 'd3-array';
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
    stroke: '#000',
    opacity: 0.85
  },
  '.tick line': {
    stroke: 'lightgrey',
    opacity: '0.7'
  }
};

let parseDate = null;

export default class ScatterplotChart extends React.Component {
  constructor(props) {
    super(props);
    this.color = scale.category20();
  }

  getScale(type) {
    switch (type) {
      case 'time':
        return time.scale();
      case 'text':
        return ordinal();
      default:
        return linear();
    }
  }

  setDomainAndRange(axesType, domainRange, data, type, length) {
    const dataIndex = axesType === 'x' ? 'x' : 'y';
    let d3Axis;
    switch (type) {
      case 'text':
        d3Axis = ordinal();
        d3Axis.domain(data.map((d) => d[dataIndex]), 1);
        d3Axis.rangePoints([0, length], 1);
        break;
      case 'linear':
        let minAmount = min(data, (d) => d[dataIndex]);
        const maxAmount = max(data, (d) => d[dataIndex]);
        d3Axis = linear();
        if (domainRange) {
          d3Axis.domain(this.calcDefaultDomain(domainRange, type));
        } else {
          // set initial domain
          d3Axis.domain([minAmount, maxAmount]);
          // calculate 1 tick offset
          const ticks = d3Axis.ticks();
          minAmount = minAmount - (ticks[1] - ticks[0]);
          d3Axis.domain([minAmount, maxAmount]);
        }
        d3Axis.range(axesType === 'x' ? [0, length] : [length, 0]);
        break;
      case 'time':
        d3Axis = time.scale();
        if (domainRange) {
          d3Axis.domain(this.calcDefaultDomain(domainRange));
        } else {
          d3Axis.domain(extent(data, (d) => parseDate(d[dataIndex])));
        }
        d3Axis.range(axesType === 'x' ? [0, length] : [length, 0], 1);
        break;
      default:
        break;
    }
    return d3Axis;
  }

  getDataConfig(type) {
    const index = this.props.config.findIndex((item) => {
      return item.type === type;
    });
    return this.props.config[index];
  }

  getFill(data) {
    const configItem = this.getDataConfig(data.type);
    return typeof configItem !== 'undefined' ? configItem.color : this.color(data.type);
  }

  getRadius(data, dataItem, dotRadius) {
    if (typeof data[0].z !== 'undefined') {
      const range = extent(data, (d) => d.z);
      const mn = range[0];
      const mx = range[1];
      const p = ((dataItem.z - mn) / (mx - mn));
      const minRad = 5;
      const maxRad = 20;
      const rad = minRad + ((maxRad - minRad) * p);
      return rad;
    }
    return dotRadius;
  }

  getStroke(data) {
    const configItem = this.getDataConfig(data.type);
    return typeof configItem !== 'undefined' ? configItem.stroke : 'none';
  }

  calcDefaultDomain(domainRange, type) {
    switch (type) {
      case 'time':
        const arr = [parseDate(domainRange[0]), parseDate(domainRange[1])];
        return arr;
      default:
        return domainRange;
    }
  }

  findLargestExtent(data, value) {
    let low;
    let high;
    data.map((dataElelment) => {
      const calcDomainRange = extent(dataElelment, value);
      low = low < calcDomainRange[0] ? low : calcDomainRange[0];
      high = high > calcDomainRange[1] ? high : calcDomainRange[1];
    });
    return [low, high];
  }

  calcMargin(axes, spacer) {
    return axes ?
    {top: 24, right: 24, bottom: 24, left: 48} :
    {top: spacer, right: spacer, bottom: spacer, left: spacer};
  }

  render() {
    const {
      axes,
      axisLabels,
      clickHandler,
      data,
      dotRadius,
      grid,
      mouseOverHandler,
      mouseOutHandler,
      mouseMoveHandler,
      style,
      tickTimeDisplayFormat,
      xTickNumber,
      xTicks,
      yTicks,
      xType,
      yType
      } = this.props;
    let {width, height, margin, xDomainRange, yDomainRange} = this.props;

    parseDate = format(this.props.datePattern).parse;

    margin = margin ? margin : this.calcMargin(axes, dotRadius * 2);

    width = width - (margin.left + margin.right);
    height = height - (margin.top + margin.bottom + (dotRadius * 2));

    yDomainRange = yDomainRange ? this.calcDefaultDomain(yDomainRange, yType) : null;
    xDomainRange = xDomainRange ? this.calcDefaultDomain(xDomainRange, xType) : null;

    const x = this.setDomainAndRange('x', xDomainRange, data, xType, width, dotRadius);
    const y = this.setDomainAndRange('y', yDomainRange, data, yType, height, dotRadius);
    const axisMargin = 18;

    const node = createElement('svg');
    const chart = select(node)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom + axisMargin + 6)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    if (axes) {
      const xAxis = svg.axis()
        .scale(x)
        .orient('bottom');
      if (xType === 'time' && tickTimeDisplayFormat) {
        xAxis.tickFormat(time.format(tickTimeDisplayFormat));
      }
      if (xTickNumber) xAxis.ticks(xTickNumber);

      const yAxis = svg.axis()
        .scale(y)
        .orient('left');

      if (grid) xAxis.tickSize(-height, 6).tickPadding(12);
      if (grid) yAxis.tickSize(-width, 6).tickPadding(12);
      if (xTicks) xAxis.ticks(xTicks);
      if (yTicks) yAxis.ticks(yTicks);

      chart.append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0, ${height})`)
        .call(xAxis)
        .append('text')
        .attr('class', 'label')
        .attr('x', width)
        .attr('y', margin.bottom + axisMargin)
        .style('text-anchor', 'end')
        .text(axisLabels.x);

      chart.append('g')
        .attr('class', 'y axis')
        .call(yAxis)
        .append('text')
        .attr('class', 'label')
        .attr('transform', 'rotate(-90)')
        .attr('y', -margin.left + 2)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .text(axisLabels.y);
    }

    chart.selectAll('.dot')
      .data(data)
      .enter().append('circle')
      .attr('class', 'dot')
      .attr('r', (d) => this.getRadius(data, d, dotRadius))
      .attr('cx', (d) => {
        switch (xType) {
          case ('time'):
            return x(parseDate(d.x));
          default:
            return x(d.x);
        }
      })
      .attr('cy', (d) => { return y(d.y); })
      .style('fill', (d) => this.getFill(d))
      .style('stroke', (d) => this.getStroke(d))
      .on('mouseover', (d) => mouseOverHandler(d, d3LastEvent))
      .on('mouseout', (d) => mouseOutHandler(d, d3LastEvent))
      .on('mousemove', () => mouseMoveHandler(d3LastEvent))
      .on('click', (d) => clickHandler(d, d3LastEvent));

    const uid = Math.floor(Math.random() * new Date().getTime());

    return (
      <div className={`scatterplot_chart${uid}`}>
        <Style scopeSelector={`.scatterplot_chart${uid}`} rules={merge({}, defaultStyle, style)}/>
        {node.toReact()}
      </div>
    );
  }
}

ScatterplotChart.propTypes = {
  axes: React.PropTypes.bool,
  axisLabels: React.PropTypes.object,
  clickHandler: React.PropTypes.func,
  config: React.PropTypes.array,
  data: React.PropTypes.array.isRequired,
  datePattern: React.PropTypes.string,
  dotRadius: React.PropTypes.number,
  grid: React.PropTypes.bool,
  height: React.PropTypes.number,
  useLegend: React.PropTypes.bool,
  margin: React.PropTypes.object,
  mouseOverHandler: React.PropTypes.func,
  mouseOutHandler: React.PropTypes.func,
  mouseMoveHandler: React.PropTypes.func,
  style: React.PropTypes.object,
  tickTimeDisplayFormat: React.PropTypes.string,
  width: React.PropTypes.number,
  xDomainRange: React.PropTypes.array,
  yDomainRange: React.PropTypes.array,
  xTickNumber: React.PropTypes.number,
  yTickNumber: React.PropTypes.number,
  yTicks: React.PropTypes.number,
  xTicks: React.PropTypes.number,
  xType: React.PropTypes.string,
  yType: React.PropTypes.string
};

ScatterplotChart.defaultProps = {
  axes: false,
  axisLabels: {},
  clickHandler: () => {},
  config: [],
  datePattern: '%d-%b-%y',
  dotRadius: 5,
  grid: false,
  mouseOverHandler: () => {},
  mouseOutHandler: () => {},
  mouseMoveHandler: () => {},
  width: 320,
  height: 180,
  xType: 'linear',
  yType: 'linear'
};
