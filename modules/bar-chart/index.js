import React from 'react';
import { scaleBand as band, scaleLinear as linear } from 'd3-scale';
import {
  event as lastEvent,
  select,
  svg,
  time,
  scale,
  max
} from 'd3';
import {
  getRandomId,
  reduce,
  calcMargin,
  calcDefaultDomain,
  defaultStyle,
  createCircularTicks,
  getAxisStyles,
  getValueFunction
} from '../shared';
import { extent } from 'd3-array';
import { timeParse as parse } from 'd3-time-format';
import { createElement } from 'react-faux-dom';
import { Style } from 'radium';
import merge from 'lodash.merge';

const colorScale = scale.category20();

export default class BarChart extends React.Component {

  static get propTypes() {
    return {
      data: React.PropTypes.array.isRequired,
      lineData: React.PropTypes.array,
      width: React.PropTypes.number,
      height: React.PropTypes.number,
      margin: React.PropTypes.object,
      mouseOverHandler: React.PropTypes.func,
      mouseOutHandler: React.PropTypes.func,
      mouseMoveHandler: React.PropTypes.func,
      clickHandler: React.PropTypes.func,
      interpolate: React.PropTypes.string,
      style: React.PropTypes.object,
      colorBars: React.PropTypes.bool,
      axes: React.PropTypes.bool,
      grid: React.PropTypes.bool,
      axisLabels: React.PropTypes.shape({
        x: React.PropTypes.string,
        y: React.PropTypes.string
      }),
      xType: React.PropTypes.string,
      yType: React.PropTypes.string,
      y2Type: React.PropTypes.string,
      xDomainRange: React.PropTypes.array,
      yDomainRange: React.PropTypes.array,
      datePattern: React.PropTypes.string,
      tickTimeDisplayFormat: React.PropTypes.string,
      yAxisOrientRight: React.PropTypes.bool,
      barWidth: React.PropTypes.number,
      xTickNumber: React.PropTypes.number,
      yTickNumber: React.PropTypes.number
    };
  }

  static get defaultProps() {
    return {
      lineData: [],
      width: 400,
      height: 200,
      barWidth: 10,
      axes: false,
      xType: 'text',
      yType: 'linear',
      y2Type: 'linear',
      interpolate: 'linear',
      mouseOverHandler: () => {},
      mouseOutHandler: () => {},
      mouseMoveHandler: () => {},
      clickHandler: () => {},
      datePattern: '%d-%b-%y',
      axisLabels: {
        x: '',
        y: ''
      }
    };
  }

  constructor(props) {
    super(props);
    this.parseDate = parse(props.datePattern);
    this.uid = getRandomId(); // Math.floor(Math.random() * new Date().getTime());
  }

  componentDidMount() {
    const uid = this.uid;
    const ref = this.refs[uid];
    createCircularTicks(ref);
  }

  componentDidUpdate() {
    const uid = this.uid;
    const ref = this.refs[uid];
    createCircularTicks(ref);
  }

  setScaleDomainRange(axesType, domainRange, data, type, length) {
    const dataIndex = axesType === 'x' ? 'x' : 'y';
    const barPadding = (length / data.length) > 40 ? 0.02 : 0.04;
    let axis;
    switch (type) {
      case 'text':
        axis = band();
        axis
          .domain(data.map((d) => d[dataIndex]))
          .range([0, length])
          .padding(barPadding);
        break;
      case 'linear':
        axis = linear();
        axis
          .domain(
            (domainRange)
              ? calcDefaultDomain(domainRange, type, this.parseDate)
              : [0, max(data, (d) => d[dataIndex])])
          .range(
            (axesType === 'x')
              ? [0, length]
              : [length, 0]
          );
        break;
      case 'time':
        axis = time.scale();
        axis
          .domain(
            (domainRange)
              ? calcDefaultDomain(domainRange, type, this.parseDate)
              : extent(data, (d) => this.parseDate(d[dataIndex])))
          .range(
            (axesType === 'x')
              ? [0, length]
              : [length, 0]);
        break;
      default:
        break;
    }
    return axis;
  }

  defineColor(i, d, colorBars) {
    if (d.color) return d.color;
    if (colorBars) return colorScale(i);
    return null;
  }

  createSvgNode({ m, w, h }) {
    const node = createElement('svg');
    select(node)
      .attr('width', w + m.left + m.right)
      .attr('height', h + m.top + m.bottom);
    return node;
  }

  createSvgRoot({ node, m }) {
    return select(node)
      .append('g')
      .attr('transform', `translate(${m.left}, ${m.top})`);
  }

  createXAxis({ root, m, w, h, x }) {
    const {
      axisLabels,
      xType,
      tickTimeDisplayFormat,
      xTickNumber,
      yAxisOrientRight
    } = this.props;

    const axis = svg.axis()
        .scale(x)
        .orient('bottom');

    if (xType === 'time' && tickTimeDisplayFormat) {
      axis
        .tickFormat(time.format(tickTimeDisplayFormat));
    }

    axis
      .tickSize(0)
      .tickPadding(15);

    if (xTickNumber) {
      axis
        .ticks(xTickNumber);
    }

    root.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${h})`)
      .call(axis)
      .append('text')
      .attr('class', 'label')
      .attr('y', m.bottom - 10)
      .attr('x', yAxisOrientRight ? 0 : w)
      .style('text-anchor', yAxisOrientRight ? 'start' : 'end')
      .text(axisLabels.x);

    return axis;
  }

  createYAxis({ root, m, w, y }) {
    const {
      axisLabels,
      yTickNumber,
      yAxisOrientRight,
      grid
    } = this.props;

    const axis = svg.axis()
        .scale(y)
        .orient(yAxisOrientRight ? 'right' : 'left');

    if (yTickNumber) {
      axis
        .ticks(yTickNumber);
    }

    if (grid) {
      axis
        .tickSize(-w, 6)
        .tickPadding(12);
    } else {
      axis
        .tickPadding(10);
    }

    root.append('g')
      .attr('class', 'y axis')
      .call(axis)
      .attr('transform', yAxisOrientRight ? `translate(${w}, 0)` : 'translate(0, 0)')
      .append('text')
      .attr('class', 'label')
      .attr('transform', 'rotate(-90)')
      .attr('x', 0)
      .attr('y', yAxisOrientRight ? -25 + m.right : 10 - m.left)
      .attr('dy', '.9em')
      .style('text-anchor', 'end')
      .text(axisLabels.y);

    return axis;
  }

  createYAxis2({ root, m, w, h }) {
    const {
      lineData,
      axisLabels,
      y2Type,
      yTickNumber,
      yAxisOrientRight,
      grid,
      yDomainRange
    } = this.props;

    const y = this.setScaleDomainRange('y', yDomainRange, lineData, y2Type, h);

    const axis = svg.axis()
        .scale(y)
        .orient(yAxisOrientRight ? 'left' : 'right');

    if (yTickNumber) {
      axis // is this supposed to be yAxis 1 or yAxis 2? (WAS yAxis 1)
        .ticks(yTickNumber);
    }

    if (grid) {
      axis // is this supposed to be yAxis 1 or yAxis 2? (WAS yAxis 1)
        .tickSize(-w, 6)
        .tickPadding(12);
    } else {
      axis // is this supposed to be yAxis 1 or yAxis 2? (WAS yAxis 1)
        .tickPadding(10);
    }

    root.append('g')
        .attr('class', 'y axis')
        .call(axis)
        .attr('transform', yAxisOrientRight ? 'translate(0, 0)' : `translate(${w}, 0)`)
        .append('text')
        .attr('class', 'label')
        .attr('transform', 'rotate(-90)')
        .attr('x', 0)
        .attr('y', yAxisOrientRight ? 10 - m.left : -25 + m.right)
        .attr('dy', '.9em')
        .style('text-anchor', 'end')
        .text(axisLabels.y2);

    return axis;
  }

  createBarChart({ root, h, x, y }) {
    const {
      data,
      mouseOverHandler,
      mouseOutHandler,
      mouseMoveHandler,
      clickHandler,
      colorBars,
      xType,
      barWidth
    } = this.props;

    data.forEach(() => {
      root.selectAll('.bar')
          .data(data)
          .enter()
          .append('rect')
          .attr('class', 'bar')
          .style('fill', (d, i) => this.defineColor(i, d, colorBars))
          .attr('x', (d) => {
            switch (xType) {
              case ('time'):
                return x(this.parseDate(d.x));
              default:
                return x(d.x);
            }
          })
          .attr('width', () => {
            switch (xType) {
              case ('text'):
                return x.bandwidth();
              default:
                return barWidth;
            }
          })
          .attr('y', (d) => y(d.y))
          .attr('height', (d) => h - y(d.y))
          .on('mouseover', (d) => mouseOverHandler(d, lastEvent))
          .on('mouseout', (d) => mouseOutHandler(d, lastEvent))
          .on('mousemove', () => mouseMoveHandler(lastEvent))
          .on('click', (d) => clickHandler(d, lastEvent));
    });
  }

  createLinePath({ root, h, x }) {
    const {
      lineData,
      xType,
      y2Type,
      interpolate,
      yDomainRange
    } = this.props;

    const y = this.setScaleDomainRange('y', yDomainRange, lineData, y2Type, h);

    const yValue = getValueFunction('y', y2Type, this.parseDate);
    const xValue = getValueFunction('x', xType, this.parseDate);

    const linePath = svg.line()
      .interpolate(interpolate)
      .x((d) => x(xValue(d)))
      .y((d) => y(yValue(d)));

    root.append('path')
      .datum(lineData)
      .attr('class', 'line')
      .attr('style', 'stroke: red')
      .attr('d', linePath);

    return linePath;
  }

  createStyle() {
    const {
      style,
      yAxisOrientRight,
      grid
    } = this.props;

    const uid = this.uid;
    const scope = `.bar-chart-${uid}`;
    const axisStyles = getAxisStyles(grid, false, yAxisOrientRight);
    const rules = merge({}, defaultStyle, style, axisStyles);

    return (
      <Style
        scopeSelector={scope}
        rules={rules}
      />
    );
  }

  hasLineData() {
    const {
      lineData
    } = this.props;

    return (lineData.length > 0);
  }

  calculateChartParameters() {
    const {
      data,
      axes,
      xType,
      yType,
      yAxisOrientRight,
      xDomainRange,
      yDomainRange,
      margin,
      width,
      height
    } = this.props;

    const hasLineData = this.hasLineData();
    const m = calcMargin(axes, margin, yAxisOrientRight, hasLineData);
    const w = reduce(width, m.left, m.right);
    const h = reduce(height, m.top, m.bottom);
    const x = this.setScaleDomainRange('x', xDomainRange, data, xType, w);
    const y = this.setScaleDomainRange('y', yDomainRange, data, yType, h);

    const node = this.createSvgNode({ m, w, h });
    const root = this.createSvgRoot({ node, m });

    return {
      m,
      w,
      h,
      x,
      y,
      node,
      root
    };
  }

  render() {
    const {
      axes
    } = this.props;

    const hasLineData = this.hasLineData();
    const p = this.calculateChartParameters();

    if (axes) {
      this.createXAxis(p);

      this.createYAxis(p); // const yAxis = this.createYAxis(p);

      if (hasLineData) {
        this.createYAxis2(p); // { ...p, yAxis });
      }
    }

    this.createBarChart(p);

    if (hasLineData) {
      this.createLinePath(p);
    }

    const uid = this.uid;
    const className = `bar-chart-${uid}`;
    const {
      node
    } = p;

    return (
      <div ref={uid} className={className}>
        {this.createStyle()}
        {node.toReact()}
      </div>
    );
  }
}
