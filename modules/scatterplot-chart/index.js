import React from 'react';
import { scaleLinear as linear, scalePoint as point } from 'd3-scale';
import {
  event as lastEvent,
  min,
  max,
  scale,
  select,
  svg,
  time
} from 'd3';
import { timeParse as parse } from 'd3-time-format';
import { extent } from 'd3-array';
import { createElement } from 'react-faux-dom';
import { Style } from 'radium';
import merge from 'lodash.merge';
import {
  getRandomId,
  calcDefaultDomain,
  defaultStyle,
  getAxisStyles,
  createCircularTicks
} from '../shared';

const axisMargin = 18;

export default class ScatterplotChart extends React.Component {
  static get propTypes() {
    return {
      axes: React.PropTypes.bool,
      axisLabels: React.PropTypes.shape({
        x: React.PropTypes.string,
        y: React.PropTypes.string
      }),
      clickHandler: React.PropTypes.func,
      config: React.PropTypes.array,
      data: React.PropTypes.array.isRequired,
      datePattern: React.PropTypes.string,
      yAxisOrientRight: React.PropTypes.bool,
      dotRadius: React.PropTypes.number,
      verticalGrid: React.PropTypes.bool,
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

    const {
      datePattern
    } = this.props;

    this.parseDate = parse(datePattern);
    this.uid = getRandomId(); // Math.floor(Math.random() * new Date().getTime());
    this.color = scale.category20();
  }

  componentDidMount() {
    const p = this.calculateChartParameters();
    this.initialiseXAxis(p);
    this.initialiseYAxis(p);
    this.initialiseChart(p);
    const uid = this.uid;
    const ref = this.refs[uid];
    createCircularTicks(ref);
  }

  componentDidUpdate() {
    const p = this.calculateChartParameters();
    this.transitionXAxis(p);
    this.transitionYAxis(p);
    this.transitionChart(p);
    const uid = this.uid;
    const ref = this.refs[uid];
    createCircularTicks(ref);
  }

  getScale(type) {
    switch (type) {
      case 'time':
        return time.scale();
      case 'text':
        return point();
      default:
        return linear();
    }
  }

  setDomainAndRange(axesType, domainRange, data, type, length, yAxisOrientRight) {
    const dataIndex =
      (axesType === 'x')
        ? 'x'
        : 'y';
    let axis;
    let minAmount;
    let maxAmount;
    switch (type) {
      case 'text':
        axis = point();
        axis
          .domain(data.map((d) => d[dataIndex]), 1)
          .range([0, length])
          .padding(1);
        break;
      case 'linear':
        axis = linear();
        minAmount = min(data, (d) => d[dataIndex]);
        maxAmount = max(data, (d) => d[dataIndex]);
        if (domainRange) {
          axis
            .domain(calcDefaultDomain(domainRange, type, this.parseDate));
        } else {
          // set initial domain
          axis
            .domain([minAmount, maxAmount]);
          // calculate 1 tick offset
          const ticks = axis.ticks();

          minAmount = (yAxisOrientRight && axesType === 'x')
            ? minAmount
            : minAmount - (ticks[1] - ticks[0]);

          maxAmount = (yAxisOrientRight && axesType === 'x')
            ? maxAmount + (ticks[1] - ticks[0])
            : maxAmount;

          axis
            .domain([minAmount, maxAmount]);
        }
        axis
          .range(
            (axesType === 'x')
              ? [0, length]
              : [length, 0]);
        break;
      case 'time':
        axis = time.scale();
        axis
          .domain(
            (domainRange)
              ? calcDefaultDomain(domainRange)
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

  getDataConfig(type) {
    const {
      config
    } = this.props;

    const index = config.findIndex((item) => item.type === type);
    return config[index];
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

  calculateMargin(axes, spacer, yAxisOrientRight) {
    let defaultMargins =
      (axes)
        ? { top: 24, right: 24, bottom: 24, left: 48 }
        : { top: spacer, right: spacer, bottom: spacer, left: spacer };
    if (yAxisOrientRight) {
      defaultMargins =
        (axes)
          ? { top: 24, right: 48, bottom: 24, left: 24 }
          : { top: spacer, right: spacer, bottom: spacer, left: spacer };
    }
    return defaultMargins;
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

  initialiseXAxis({ innerW, innerH, m }) {
    const {
      axes,
      yAxisOrientRight,
      axisLabels
    } = this.props;

    const uid = this.uid;

    if (axes) {
      this.axisX = select(`#axis-x-${uid}`)
        .attr('class', 'x axis')
        .attr('transform', `translate(0, ${innerH})`)
        .call(this.xAxis)
        .append('text')
        .attr('id', 'label-x')
        .attr('class', 'label')
        .attr('x', yAxisOrientRight ? 0 : innerW)
        .attr('y', m.bottom + axisMargin)
        .style('text-anchor', yAxisOrientRight ? 'start' : 'end')
        .text(axisLabels.x);
    }
  }

  initialiseYAxis({ innerW, m }) {
    const {
      axes,
      yAxisOrientRight,
      axisLabels
    } = this.props;

    const uid = this.uid;

    if (axes) {
      this.axisY = select(`#axis-y-${uid}`)
        .attr('class', 'y axis')
        .call(this.yAxis)
        .attr(
          'transform', yAxisOrientRight ?
          `translate(${innerW}, 0)` : 'translate(0, 0)'
        )
        .append('text')
        .attr('class', 'label')
        .attr('transform', 'rotate(-90)')
        .attr('y', (yAxisOrientRight)
            ? -25 + m.right
            : 10 - m.left
        )
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .text(axisLabels.y);
    }
  }

  initialiseChart({ x, y }) {
    const {
      data,
      dotRadius,
      xType,
      mouseOverHandler,
      mouseOutHandler,
      mouseMoveHandler,
      clickHandler
    } = this.props;

    const uid = this.uid;

    this.chart = select(`#dots-${uid}`)
      .selectAll('.dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('r', (d) => this.getRadius(data, d, dotRadius))
      .attr('cx', (d) => {
        switch (xType) {
          case ('time'):
            return x(this.parseDate(d.x));
          default:
            return x(d.x);
        }
      })
      .attr('cy', (d) => y(d.y))
      .style('fill', (d) => this.getFill(d))
      .style('stroke', (d) => this.getStroke(d))
      .on('mouseover', (d) => mouseOverHandler(d, lastEvent))
      .on('mouseout', (d) => mouseOutHandler(d, lastEvent))
      .on('mousemove', () => mouseMoveHandler(lastEvent))
      .on('click', (d) => clickHandler(d, lastEvent));
  }

  transitionXAxis({ innerH, innerW }) {
    const {
      axes,
      yAxisOrientRight
    } = this.props;

    const uid = this.uid;

    if (axes) {
      this.axisX = select(`#axis-x-${uid}`)
        .attr('transform', `translate(0, ${innerH})`)
        .transition()
        .duration(750)
        .call(this.xAxis)
        .select('#label-x')
        .attr('x', yAxisOrientRight ? 0 : innerW);
    }
  }

  transitionYAxis() {
    const {
      axes
    } = this.props;

    const uid = this.uid;

    if (axes) {
      this.axisY = select(`#axis-y-${uid}`)
        .transition()
        .duration(750)
        .call(this.yAxis);
    }
  }

  transitionChart({ x, y }) {
    const {
      data,
      xType
    } = this.props;

    this.chart
      .data(data)
      .transition()
      .duration(750)
      .attr('cx', (d) => {
        switch (xType) {
          case ('time'):
            return x(this.parseDate(d.x));
          default:
            return x(d.x);
        }
      })
      .attr('cy', (d) => y(d.y));
  }

  createXAxis({ h, x }) {
    const {
      xType,
      tickTimeDisplayFormat,
      xTickNumber,
      grid,
      verticalGrid,
      xTicks
    } = this.props;

    const axis = svg.axis()
      .scale(x)
      .orient('bottom');

    if (xType === 'time' && tickTimeDisplayFormat) {
      axis
        .tickFormat(time.format(tickTimeDisplayFormat));
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

  createYAxis({ innerW, y }) {
    const {
      grid,
      yTicks,
      yAxisOrientRight
    } = this.props;

    const axis = svg.axis()
      .scale(y)
      .orient(yAxisOrientRight ? 'right' : 'left');

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

  createScatterplotChart({ w, h, node, root }) {
    const uid = this.uid;

    select(node)
      .attr('width', w)
      .attr('height', h);

    root
      .append('g')
      .attr('id', `area-${uid}`);

    root.append('g')
      .attr('id', `axis-x-${uid}`);

    root.append('g')
      .attr('id', `axis-y-${uid}`);

    root.append('g')
      .attr('id', `dots-${uid}`);
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
    const rules = merge({}, defaultStyle, style, axisStyles);

    return (
      <Style
        scopeSelector={scope}
        rules={rules}
      />
    );
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

    const m = margin || this.calculateMargin(axes, dotRadius * 2, yAxisOrientRight);
    const w = width;
    const h = height + (dotRadius * 3);

    const innerW = this.calculateInnerW(width, m);
    const innerH = this.calculateInnerH(height, m);

    const defaultXDomain =
      (xDomainRange)
        ? calcDefaultDomain(xDomainRange, xType, this.parseDate)
        : null;

    const defaultYDomain =
      (yDomainRange)
        ? calcDefaultDomain(yDomainRange, yType, this.parseDate)
        : null;

    const x = this.setDomainAndRange('x', defaultXDomain, data, xType, innerW, yAxisOrientRight);
    const y = this.setDomainAndRange('y', defaultYDomain, data, yType, innerH, yAxisOrientRight);

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
      node,
      root
    };
  }

  render() {
    const p = this.calculateChartParameters();

    this.xAxis = this.createXAxis(p);
    this.yAxis = this.createYAxis(p);

    this.createScatterplotChart(p);

    const uid = this.uid; // Math.floor(Math.random() * new Date().getTime());
    const className = `scatterplot-chart-${uid}`;
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
