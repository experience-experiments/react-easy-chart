import React from 'react';
import { createElement } from 'react-faux-dom';
import {
  getRandomId,
  reduce,
  getValueFunction,
  calcMargin,
  setLineDomainAndRange,
  defaultStyle,
  getAxisStyles,
  createCircularTicks,
  rmaColorPalet as defaultColors
} from '../shared';
import {
  event as lastEvent,
  select,
  svg,
  time } from 'd3';
import { Style } from 'radium';
import merge from 'lodash.merge';
import { timeParse as parse } from 'd3-time-format';

export default class AreaChart extends React.Component {
  static get propTypes() {
    return {
      data: React.PropTypes.array.isRequired,
      width: React.PropTypes.number,
      height: React.PropTypes.number,
      xType: React.PropTypes.string,
      yType: React.PropTypes.string,
      datePattern: React.PropTypes.string,
      interpolate: React.PropTypes.string,
      style: React.PropTypes.object,
      margin: React.PropTypes.object,
      axes: React.PropTypes.bool,
      grid: React.PropTypes.bool,
      verticalGrid: React.PropTypes.bool,
      xDomainRange: React.PropTypes.array,
      yDomainRange: React.PropTypes.array,
      areaColors: React.PropTypes.array,
      noAreaGradient: React.PropTypes.bool,
      tickTimeDisplayFormat: React.PropTypes.string,
      yTicks: React.PropTypes.number,
      xTicks: React.PropTypes.number,
      dataPoints: React.PropTypes.bool,
      axisLabels: React.PropTypes.shape({
        x: React.PropTypes.string,
        y: React.PropTypes.string
      }),
      yAxisOrientRight: React.PropTypes.bool,
      mouseOverHandler: React.PropTypes.func,
      mouseOutHandler: React.PropTypes.func,
      mouseMoveHandler: React.PropTypes.func,
      clickHandler: React.PropTypes.func
    };
  }

  static get defaultProps() {
    return {
      width: 200,
      height: 150,
      datePattern: '%d-%b-%y',
      interpolate: 'linear',
      axes: false,
      areaColors: [],
      xType: 'linear',
      yType: 'linear',
      axisLabels: {
        x: '',
        y: ''
      },
      mouseOverHandler: () => {},
      mouseOutHandler: () => {},
      mouseMoveHandler: () => {},
      clickHandler: () => {}
    };
  }

  constructor(props) {
    super(props);
    this.parseDate = parse(props.datePattern);
    this.uid = getRandomId();
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
      xType,
      axisLabels,
      xTicks,
      grid,
      verticalGrid,
      tickTimeDisplayFormat,
      yAxisOrientRight
    } = this.props;

    const axis = svg.axis()
      .scale(x)
      .orient('bottom');

    if (xType === 'time' && tickTimeDisplayFormat) {
      axis
        .tickFormat(time.format(tickTimeDisplayFormat));
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
      yType,
      axisLabels,
      yTicks,
      grid,
      tickTimeDisplayFormat,
      yAxisOrientRight
    } = this.props;

    const axis = svg.axis()
      .scale(y)
      .orient(yAxisOrientRight ? 'right' : 'left');

    if (yType === 'time' && tickTimeDisplayFormat) {
      axis
        .tickFormat(time.format(tickTimeDisplayFormat));
    }

    if (grid) {
      axis
        .tickSize(-w, 6)
        .tickPadding(12);
    } else {
      axis
        .tickPadding(10);
    }

    if (yTicks) {
      axis
        .ticks(yTicks);
    }

    root.append('g')
      .attr('class', 'y axis')
      .call(axis)
      .attr('transform', yAxisOrientRight ? `translate(${w}, 0)` : 'translate(0, 0)')
      .append('text')
      .attr('class', 'label')
      .attr('transform', 'rotate(-90)')
      .attr('x', 0)
      .attr('y', yAxisOrientRight ? -20 + m.right : 0 - m.left)
      .attr('dy', '.9em')
      .style('text-anchor', 'end')
      .text(axisLabels.y);

    return axis;
  }

  createFill({ node, colors }) {
    const uid = this.uid;

    colors.forEach((color, i) => {
      const gradient = select(node)
        .append('defs')
        .append('linearGradient')
        .attr('id', `gradient-${i}-${uid}`)
        .attr('x1', '0%')
        .attr('x2', '0%')
        .attr('y1', '40%')
        .attr('y2', '100%');

      defaultStyle[`.dot${i}`] = { fill: color };

      gradient.append('stop')
          .attr('offset', '0%')
          .attr('style', `stop-color:${color}; stop-opacity:0.6`);

      gradient.append('stop')
          .attr('offset', '100%')
          .attr('style', `stop-color:${color}; stop-opacity:0.4`);
    });
  }

  createAreaPathChart({ root, h, x, y, xValue, yValue, colors }) {
    const {
      data,
      interpolate,
      noAreaGradient
    } = this.props;

    const areaPath = svg.area()
      .interpolate(interpolate)
      .x((d) => x(xValue(d)))
      .y0(h)
      .y1((d) => y(yValue(d)));

    const linePath = svg.line()
      .interpolate(interpolate)
      .x((d) => x(xValue(d)))
      .y((d) => y(yValue(d)));

    const uid = this.uid;

    data.forEach((lineItem, i) => {
      const color = colors[i];

      root.append('path')
        .datum(lineItem)
        .attr('class', 'area')
        .style('fill', noAreaGradient ? color : `url(#gradient-${i}-${uid})`)
        .attr('d', areaPath);

      root.append('path')
        .datum(lineItem)
        .attr('class', 'line')
        .attr('style', `stroke: ${color}`)
        .attr('d', linePath);
    });
  }

  createPoints({ root, x, y, colors }) {
    const {
      data,
      xType,
      yType,
      mouseOverHandler,
      mouseOutHandler,
      mouseMoveHandler,
      clickHandler
    } = this.props;

    data.forEach((lineItem, i) => {
      lineItem.forEach((dataPoint) => {
        root.append('circle')
        .attr('class', 'data-point')
        .style('strokeWidth', '2px')
        .style('stroke', colors[i])
        .style('fill', 'white')
        .attr('cx', () => {
          switch (xType) {
            case ('time'):
              return x(this.parseDate(dataPoint.x));
            default:
              return x(dataPoint.x);
          }
        })
        .attr('cy', () => {
          switch (yType) {
            case ('time'):
              return y(this.parseDate(dataPoint.y));
            default:
              return y(dataPoint.y);
          }
        })
        .on('mouseover', () => mouseOverHandler(dataPoint, lastEvent))
        .on('mouseout', () => mouseOutHandler(dataPoint, lastEvent))
        .on('mousemove', () => mouseMoveHandler(lastEvent))
        .on('click', () => clickHandler(dataPoint, lastEvent));
      });
    });
  }

  createStyle() {
    const {
      style,
      grid,
      verticalGrid,
      yAxisOrientRight,
    } = this.props;

    const uid = this.uid;
    const scope = `.area-chart-${uid}`;
    const axisStyles = getAxisStyles(grid, verticalGrid, yAxisOrientRight);
    const rules = merge({}, defaultStyle, style, axisStyles);

    return (
      <Style
        scopeSelector={scope}
        rules={rules}
      />
    );
  }

  calculateChartParameters() {
    const {
      data,
      xType,
      yType,
      axes,
      xDomainRange,
      yDomainRange,
      yAxisOrientRight,
      areaColors,
      margin,
      width,
      height
    } = this.props;

    const m = calcMargin(axes, margin, yAxisOrientRight);
    const w = reduce(width, m.left, m.right);
    const h = reduce(height, m.top, m.bottom);

    const x = setLineDomainAndRange('x', xDomainRange, data, xType, w, this.parseDate);
    const y = setLineDomainAndRange('y', yDomainRange, data, yType, h, this.parseDate);

    const xValue = getValueFunction('x', xType, this.parseDate);
    const yValue = getValueFunction('y', yType, this.parseDate);

    const colors = areaColors.concat(defaultColors);

    const node = this.createSvgNode({ m, w, h });
    const root = this.createSvgRoot({ node, m });

    return {
      m,
      w,
      h,
      x,
      y,
      xValue,
      yValue,
      colors,
      node,
      root
    };
  }

  render() {
    const {
      axes,
      dataPoints,
      noAreaGradient
    } = this.props;

    const hasFill = !noAreaGradient;
    const p = this.calculateChartParameters();

    if (axes) {
      this.createXAxis(p);

      this.createYAxis(p);
    }

    if (hasFill) {
      this.createFill(p);
    }

    this.createAreaPathChart(p);

    if (dataPoints) {
      this.createPoints(p);
    }

    const uid = this.uid;
    const className = `area-chart-${uid}`;
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
