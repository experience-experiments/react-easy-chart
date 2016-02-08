import React from 'react';
import {linear, ordinal} from 'd3-scale';
import {event as d3LastEvent, min, max, scale, select, svg, time} from 'd3';
import {format} from 'd3-time-format';
import {extent} from 'd3-array';
import { createElement } from 'react-faux-dom';
import {Style} from 'radium';
import merge from 'lodash.merge';
import {calcDefaultDomain} from '../shared';

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
const axisMargin = 18;

export default class ScatterplotChart extends React.Component {
  static get propTypes() {
    return {
      axes: React.PropTypes.bool,
      axisLabels: React.PropTypes.object,
      clickHandler: React.PropTypes.func,
      config: React.PropTypes.array,
      data: React.PropTypes.array.isRequired,
      datePattern: React.PropTypes.string,
      yAxisOrientRight: React.PropTypes.bool,
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
  }

  static get defaultProps() {
    return {
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
  }

  constructor(props) {
    super(props);
    this.color = scale.category20();
    this.margin = 0;
    this.width = 0;
    this.height = 0;
    this.innerWidth = 0;
    this.innerHeight = 0;
    this.xDomainRange = null;
    this.yDomainRange = null;
    this.x = null;
    this.y = null;
    this.axisX = null;
    this.axisY = null;
    this.xAxis = null;
    this.yAxis = null;
    this.chart = null;
    this.uid = Math.floor(Math.random() * new Date().getTime());
  }

  componentWillMount() {
    parseDate = format(this.props.datePattern).parse;
    this.width = this.props.width;
    this.height = this.props.height;
    this.setMargin();
    this.setWidthAndHeight();
    this.setDomainRange();
    this.setXandY();
    this.setXaxis();
    this.setYaxis();
  }

  componentDidMount() {
    this.drawAxisX();
    this.drawAxisY();
    this.drawChart();
  }

  componentDidUpdate() {
    this.setWidthAndHeight();
    this.setDomainRange();
    this.setXandY();
    this.setXaxis();
    this.setYaxis();
    this.updateAxisX();
    this.updateAxisY();
    this.updateChart();
  }

  setMargin() {
    this.margin = this.props.margin ? this.props.margin :
    this.calcMargin(
      this.props.axes,
      this.props.dotRadius * 2, this.props.yAxisOrientRight
    );
  }

  setWidthAndHeight() {
    this.width = this.props.width;
    this.height = this.props.height + (this.props.dotRadius * 3);
    this.innerWidth = this.props.width - (this.margin.left + this.margin.right);
    this.innerHeight =
      this.props.height - (this.margin.top +
        this.margin.bottom + (this.props.dotRadius * 2));
  }

  setDomainRange() {
    this.yDomainRange = this.props.yDomainRange ?
      calcDefaultDomain(this.props.yDomainRange, this.props.yType, parseDate) :
        null;
    this.xDomainRange = this.props.xDomainRange ?
      calcDefaultDomain(this.props.xDomainRange, this.props.xType, parseDate) :
        null;
  }

  setXandY() {
    const w = this.props.width - (this.margin.left + this.margin.right);
    const h = this.props.height - (this.margin.top + this.margin.bottom + (this.props.dotRadius * 2));
    this.x = this.setDomainAndRange(
      'x',
      this.xDomainRange,
      this.props.data,
      this.props.xType,
      w,
      this.props.yAxisOrientRight
    );
    this.y = this.setDomainAndRange(
      'y',
      this.yDomainRange,
      this.props.data,
      this.props.yType,
      h,
      this.props.yAxisOrientRight);
  }

  setXaxis() {
    this.xAxis = svg.axis()
      .scale(this.x)
      .orient('bottom');
    if (this.props.xType === 'time' && this.props.tickTimeDisplayFormat) {
      this.xAxis.tickFormat(time.format(this.props.tickTimeDisplayFormat));
    }
    if (this.props.xTickNumber) this.xAxis.ticks(this.props.xTickNumber);
    if (this.props.grid) this.xAxis.tickSize(-this.innerHeight, 6).tickPadding(12);
    if (this.props.xTicks) this.xAxis.ticks(this.props.xTicks);
  }

  setYaxis() {
    this.yAxis = svg.axis()
      .scale(this.y)
      .orient(this.props.yAxisOrientRight ? 'right' : 'left');
    if (this.props.grid) this.yAxis.tickSize(-this.innerWidth, 6).tickPadding(12);
    if (this.props.yTicks) this.yAxis.ticks(this.props.yTicks);
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

  setDomainAndRange(axesType, domainRange, data, type, length, yAxisOrientRight) {
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
        let maxAmount = max(data, (d) => d[dataIndex]);
        d3Axis = linear();
        if (domainRange) {
          d3Axis.domain(calcDefaultDomain(domainRange, type, parseDate));
        } else {
          // set initial domain
          d3Axis.domain([minAmount, maxAmount]);
          // calculate 1 tick offset
          const ticks = d3Axis.ticks();
          minAmount = yAxisOrientRight && axesType === 'x' ? minAmount : minAmount - (ticks[1] - ticks[0]);
          maxAmount = yAxisOrientRight && axesType === 'x' ? maxAmount + (ticks[1] - ticks[0]) : maxAmount;
          d3Axis.domain([minAmount, maxAmount]);
        }
        d3Axis.range(axesType === 'x' ? [0, length] : [length, 0]);
        break;
      case 'time':
        d3Axis = time.scale();
        if (domainRange) {
          d3Axis.domain(calcDefaultDomain(domainRange));
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
    const index = this.props.config.findIndex((item) => item.type === type);
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

  drawAxisX() {
    if (this.props.axes) {
      this.axisX = select(`#axis-x-${this.uid}`)
        .attr('class', 'x axis')
        .attr('transform', `translate(0, ${this.innerHeight})`)
        .call(this.xAxis)
        .append('text')
        .attr('id', 'label-x')
        .attr('class', 'label')
        .attr('x', this.props.yAxisOrientRight ? 0 : this.innerWidth)
        .attr('y', this.margin.bottom + axisMargin)
        .style('text-anchor', this.props.yAxisOrientRight ? 'start' : 'end')
        .text(this.props.axisLabels.x);
    }
  }

  drawAxisY() {
    if (this.props.axes) {
      this.axisY = select(`#axis-y-${this.uid}`)
        .attr('class', 'y axis')
        .call(this.yAxis)
        .attr(
          'transform', this.props.yAxisOrientRight ?
          `translate(${this.innerWidth}, 0)` : `translate(0, 0)`
        )
        .append('text')
        .attr('class', 'label')
        .attr('transform', 'rotate(-90)')
        .attr('y', this.props.yAxisOrientRight ?
          -25 + this.margin.right : 10 - this.margin.left
        )
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .text(this.props.axisLabels.y);
    }
  }

  drawChart() {
    this.chart = select(`#dots-${this.uid}`)
      .selectAll('.dot')
      .data(this.props.data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('r', (d) => this.getRadius(this.props.data, d, this.props.dotRadius))
      .attr('cx', (d) => {
        switch (this.props.xType) {
          case ('time'):
            return this.x(parseDate(d.x));
          default:
            return this.x(d.x);
        }
      })
      .attr('cy', (d) => { return this.y(d.y); })
      .style('fill', (d) => this.getFill(d))
      .style('stroke', (d) => this.getStroke(d))
      .on('mouseover', (d) => this.props.mouseOverHandler(d, d3LastEvent))
      .on('mouseout', (d) => this.props.mouseOutHandler(d, d3LastEvent))
      .on('mousemove', () => this.props.mouseMoveHandler(d3LastEvent))
      .on('click', (d) => this.props.clickHandler(d, d3LastEvent));
  }

  updateAxisX() {
    if (this.props.axes) {
      this.axisX = select(`#axis-x-${this.uid}`)
        .attr('transform', `translate(0, ${this.innerHeight})`)
        .transition()
        .duration(750)
        .call(this.xAxis)
        .select('#label-x')
        .attr('x', this.props.yAxisOrientRight ? 0 : this.innerWidth);
    }
  }

  updateAxisY() {
    if (this.props.axes) {
      this.axisY = select(`#axis-y-${this.uid}`)
        .transition()
        .duration(750)
        .call(this.yAxis);
    }
  }

  updateChart() {
    this.chart
      .data(this.props.data)
      .transition()
      .duration(750)
      .attr('cx', (d) => {
        switch (this.props.xType) {
          case ('time'):
            return this.x(parseDate(d.x));
          default:
            return this.x(d.x);
        }
      })
      .attr('cy', (d) => { return this.y(d.y); });
  }

  calcMargin(axes, spacer, yAxisOrientRight) {
    let defaultMargins = axes ?
    {top: 24, right: 24, bottom: 24, left: 48} :
    {top: spacer, right: spacer, bottom: spacer, left: spacer};
    if (yAxisOrientRight) {
      defaultMargins = axes ? {top: 24, right: 48, bottom: 24, left: 24} : {top: spacer, right: spacer, bottom: spacer, left: spacer};
    }
    return defaultMargins;
  }

  render() {
    this.setWidthAndHeight();
    const node = createElement('svg');
    const chart = select(node)
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr('id', `area-${this.uid}`)
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    chart.append('g')
      .attr('id', `axis-x-${this.uid}`);
    chart.append('g')
      .attr('id', `axis-y-${this.uid}`);
    chart.append('g')
      .attr('id', `dots-${this.uid}`);

    const uid = Math.floor(Math.random() * new Date().getTime());

    return (
      <div className={`scatterplot_chart${uid}`}>
        <Style scopeSelector={`.scatterplot_chart${uid}`} rules={merge({}, defaultStyle, this.props.style)}/>
        {node.toReact()}
      </div>
    );
  }
}
