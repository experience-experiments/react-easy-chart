import React, { PureComponent } from 'react';
import {
  scaleLinear as linear,
  scalePoint as point
} from 'd3-scale';
import {
  event as lastEvent,
  min,
  max,
  scaleOrdinal,
  schemeCategory20,
  range,
  select,
  scaleTime,
  axisBottom,
  axisLeft,
  axisRight,
  timeFormat
} from 'd3';
import { timeParse as parse } from 'd3-time-format';
import { extent } from 'd3-array';
import ReactFauxDOM from 'react-faux-dom';
import PropTypes from 'prop-types';
import { Style } from 'radium';
import merge from 'lodash.merge';
import {
  createUniqueID,
  calculateDomainRange,
  defaultStyles,
  getAxisStyles,
  createCircularTicks
} from '../../shared';

const dateParser = {};

const color = scaleOrdinal(schemeCategory20).domain(range(0, 20));

const axisMargin = 18;

export default class ScatterplotChart extends PureComponent {
  static get propTypes() {
    return {
      axes: PropTypes.bool,
      axisLabels: PropTypes.shape({
        x: PropTypes.string,
        y: PropTypes.string
      }),
      clickHandler: PropTypes.func,
      config: PropTypes.array,
      data: PropTypes.array.isRequired,
      datePattern: PropTypes.string,
      yAxisOrientRight: PropTypes.bool,
      dotRadius: PropTypes.number,
      verticalGrid: PropTypes.bool,
      grid: PropTypes.bool,
      height: PropTypes.number,
      useLegend: PropTypes.bool,
      margin: PropTypes.object,
      mouseOverHandler: PropTypes.func,
      mouseOutHandler: PropTypes.func,
      mouseMoveHandler: PropTypes.func,
      style: PropTypes.object,
      tickTimeDisplayFormat: PropTypes.string,
      width: PropTypes.number,
      xDomainRange: PropTypes.array,
      yDomainRange: PropTypes.array,
      xTickNumber: PropTypes.number,
      yTickNumber: PropTypes.number,
      xTicks: PropTypes.number,
      yTicks: PropTypes.number,
      xType: PropTypes.string,
      yType: PropTypes.string
    };
  }

  static get defaultProps() {
    return {
      axes: false,
      axisLabels: {
        x: '',
        y: ''
      },
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
    this.uid = createUniqueID(props);
  }

  componentDidMount() {
    const ref = this.refs.scatterplotChart;
    createCircularTicks(ref);
  }

  componentDidUpdate() {
    const ref = this.refs.scatterplotChart;
    createCircularTicks(ref);
  }

  getScale(type) {
    switch (type) {
      case 'time':
        return scaleTime();
      case 'text':
        return point();
      default:
        return linear();
    }
  }

  getDataConfig(type) {
    const {
      config
    } = this.props;

    const index = config.findIndex((item) => item.type === type);
    return config[index];
  }

  getFill(data) {
    const configItem = this.getDataConfig(data.type);
    return (configItem)
      ? configItem.color
      : color(data.type);
  }

  getRadius(data, dataItem, dotRadius) {
    if (typeof data[0].z !== 'undefined') {
      const rangeRadius = extent(data, (d) => d.z);
      const mn = rangeRadius[0];
      const mx = rangeRadius[1];
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
    return (configItem)
      ? configItem.stroke
      : 'none'; // typeof configItem !== 'undefined' ? configItem.stroke : 'none';
  }

  createDomainRangeGenerator(axisType, domainRange, data, type, length, yAxisOrientRight) {
    const dataIndex =
      (axisType === 'x')
        ? 'x'
        : 'y';

    let axis;
    let minAmount;
    let maxAmount;

    const parseDate = (v) => this.parseDate(v);

    switch (type) {
      case 'text':
        axis = point();
        axis
          .domain(data.map((d) => d[dataIndex])) // , 1)
          .range([0, length])
          .padding(1);
        break;
      case 'linear':
        axis = linear();
        minAmount = min(data, (d) => d[dataIndex]);
        maxAmount = max(data, (d) => d[dataIndex]);
        if (domainRange) {
          axis
            .domain(domainRange); // calculateDomainRange(domainRange, type, parseDate));
        } else {
          // set initial domain
          axis
            .domain([minAmount, maxAmount]);
          // calculate 1 tick offset
          const ticks = axis.ticks();

          minAmount =
            (yAxisOrientRight && axisType === 'x')
              ? minAmount
              : minAmount - (ticks[1] - ticks[0]);

          maxAmount =
            (yAxisOrientRight && axisType === 'x')
              ? maxAmount + (ticks[1] - ticks[0])
              : maxAmount;

          axis
            .domain([minAmount, maxAmount]);
        }
        axis
          .range(
            (axisType === 'x')
              ? [0, length]
              : [length, 0]);
        break;
      case 'time':
        axis = scaleTime();
        axis
          .domain(
            (domainRange)
              ? calculateDomainRange(domainRange)
              : extent(data, (d) => parseDate(d[dataIndex])))
          .range(
            (axisType === 'x')
              ? [0, length]
              : [length, 0]);
        break;
      default:
        break;
    }
    return axis;
  }

  calculateMargin(axes, spacer, yAxisOrientRight) {
    if (yAxisOrientRight) {
      return (axes)
        ? { top: 24, right: 48, bottom: 24, left: 24 }
        : { top: spacer, right: spacer, bottom: spacer, left: spacer };
    }
    return (axes)
      ? { top: 24, right: 24, bottom: 24, left: 48 }
      : { top: spacer, right: spacer, bottom: spacer, left: spacer };
  }

  calculateInnerW(w, m) {
    return (w - (m.left + m.right));
  }

  calculateInnerH(h, m) {
    const {
      dotRadius
    } = this.props;

    return (h - (m.top + m.bottom + (dotRadius * 2)));
  }

  calculateXAxis({ h, x }) {
    const {
      xType,
      tickTimeDisplayFormat,
      xTickNumber,
      grid,
      verticalGrid,
      xTicks
    } = this.props;

    const axis = axisBottom(x);

    if (xType === 'time' && tickTimeDisplayFormat) {
      axis
        .tickFormat(timeFormat(tickTimeDisplayFormat));
    }

    if (xTickNumber) {
      axis
        .ticks(xTickNumber);
    }

    if (grid && verticalGrid) {
      axis
        .tickSize(-h, 6)
        .tickPadding(15);
    } else {
      axis
        .tickSize(0)
        .tickPadding(15);
    }

    if (xTicks) {
      axis
        .ticks(xTicks);
    }

    return axis;
  }

  calculateYAxis({ y, innerW }) {
    const {
      grid,
      yTicks,
      yAxisOrientRight
    } = this.props;

    const axis = yAxisOrientRight ? axisRight(y) : axisLeft(y);

    if (grid) {
      axis
        .tickSize(-innerW, 6)
        .tickPadding(12);
    } else {
      axis
        .tickPadding(10);
    }

    if (yTicks) {
      axis
        .ticks(yTicks);
    }

    return axis;
  }

  createSvgNode({ m, w, h }) {
    const node = new ReactFauxDOM.Element('svg');
    node.setAttribute('width', w + m.left + m.right);
    node.setAttribute('height', h + m.top + m.bottom);
    return node;
  }

  createSvgRoot({ node, m }) {
    return select(node)
      .append('g')
      .attr('transform', `translate(${m.left}, ${m.top})`);
  }

  createXAxis({ m, innerW, innerH, xAxis, root }) {
    const {
      yAxisOrientRight,
      axisLabels: { x: label }
    } = this.props;

    const group = root
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${innerH})`);

    group
      .call(xAxis);

    if (label) {
      group
        .append('text')
        .attr('class', 'label')
        .attr('x',
            (yAxisOrientRight)
              ? 0
              : innerW)
        .attr('y', m.bottom + axisMargin)
        .style('text-anchor',
            (yAxisOrientRight)
              ? 'start'
              : 'end')
        .text(label);
    }
  }

  createYAxis({ m, innerW, yAxis, root }) {
    const {
      yAxisOrientRight,
      axisLabels: { y: label }
    } = this.props;

    const group = root
      .append('g')
      .attr('class', 'y axis')
      .attr('transform',
        (yAxisOrientRight)
          ? `translate(${innerW}, 0)`
          : 'translate(0, 0)');

    group
      .call(yAxis);

    if (label) {
      group
        .append('text')
        .attr('class', 'label')
        .attr('transform', 'rotate(-90)')
        .attr('y',
          (yAxisOrientRight)
            ? -25 + m.right
            : 10 - m.left
        )
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .text(label);
    }
  }

  createScatterplotChart({ x, y, root }) {
    const {
      data,
      dotRadius,
      xType,
      mouseOverHandler,
      mouseOutHandler,
      mouseMoveHandler,
      clickHandler
    } = this.props;

    const calculateDate = (v) => this.parseDate(v);

    const calculateR = (d) => this.getRadius(data, d, dotRadius);
    const calculateCX = (d) => (
        (xType === 'time')
          ? x(calculateDate(d.x))
          : x(d.x));
    const calculateCY = (d) => y(d.y);

    const getFill = (d) => this.getFill(d);
    const getStroke = (d) => this.getStroke(d);

    const mouseOver = (d) => mouseOverHandler(d, lastEvent);
    const mouseOut = (d) => mouseOutHandler(d, lastEvent);
    const mouseMove = (d) => mouseMoveHandler(d, lastEvent);
    const click = (d) => clickHandler(d, lastEvent);

    const circle = root
      .append('g')
      .selectAll('circle') // '.dot'
      .data(data);

    circle
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('r', calculateR)
      .attr('cx', calculateCX)
      .attr('cy', calculateCY)
      .style('fill', getFill)
      .style('stroke', getStroke)
      .on('mouseover', mouseOver)
      .on('mouseout', mouseOut)
      .on('mousemove', mouseMove)
      .on('click', click);

    circle
      .exit()
      .remove();
  }

  createStyle() {
    const {
      style,
      grid,
      verticalGrid,
      yAxisOrientRight
    } = this.props;

    const uid = this.uid;
    const scope = `.scatterplot-chart-${uid}`;
    const axisStyles = getAxisStyles(grid, verticalGrid, yAxisOrientRight);
    const rules = merge({}, defaultStyles, style, axisStyles);

    return (
      <Style
        scopeSelector={scope}
        rules={rules}
      />
    );
  }

  parseDate(v) {
    const {
      datePattern
    } = this.props;

    const datePatternParser = (
      dateParser[datePattern] || (
      dateParser[datePattern] = parse(datePattern)));

    return datePatternParser(v);
  }

  calculateChartParameters() {
    const {
      axes,
      data,
      margin,
      width,
      height,
      dotRadius,
      xType,
      yType,
      xDomainRange,
      yDomainRange,
      yAxisOrientRight
    } = this.props;

    /*
     * We could "bind"!
     */
    const parseDate = (v) => this.parseDate(v);

    const m = margin || this.calculateMargin(axes, dotRadius * 2, yAxisOrientRight);
    const w = width;
    const h = height + (dotRadius * 3);

    const innerW = this.calculateInnerW(width, m);
    const innerH = this.calculateInnerH(height, m);

    const defaultXDomainRange = calculateDomainRange(xDomainRange, xType, parseDate);
    const defaultYDomainRange = calculateDomainRange(yDomainRange, yType, parseDate);

    const x = this.createDomainRangeGenerator(
      'x', defaultXDomainRange, data, xType, innerW, yAxisOrientRight);
    const y = this.createDomainRangeGenerator(
      'y', defaultYDomainRange, data, yType, innerH, yAxisOrientRight);

    const xAxis = this.calculateXAxis({ m, h, x, innerW });
    const yAxis = this.calculateYAxis({ m, y, innerW });

    const node = this.createSvgNode({ m, w, h });
    const root = this.createSvgRoot({ node, m });

    return {
      m,
      w,
      h,
      innerW,
      innerH,
      x,
      y,
      xAxis,
      yAxis,
      node,
      root
    };
  }

  render() {
    const {
      axes
    } = this.props;

    const p = this.calculateChartParameters();

    if (axes) {
      this.createXAxis(p);

      this.createYAxis(p);
    }

    this.createScatterplotChart(p);

    const uid = this.uid;
    const className = `scatterplot-chart-${uid}`;
    const {
      node
    } = p;

    return (
      <div ref="scatterplotChart" className={className}>
        {this.createStyle()}
        {node.toReact()}
      </div>
    );
  }
}
