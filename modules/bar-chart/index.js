import React from 'react';
import { ordinal, linear } from 'd3-scale';
import { event as d3LastEvent, select, time, svg, scale, max} from 'd3';
import { reduce, calcMargin, calcDefaultDomain, defaultStyle, createCircularTicks, getAxisStyles, getValueFunction } from '../shared';
import { extent} from 'd3-array';
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
      axisLabels: React.PropTypes.object,
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
      axisLabels: {x: '', y: ''}
    };
  }

  constructor(props) {
    super(props);
    this.parseDate = parse(props.datePattern);
    this.uid = Math.floor(Math.random() * new Date().getTime());
  }

  componentDidMount() {
    createCircularTicks(this.refs[this.uid]);
  }

  componentDidUpdate(prevProps) {
    if (this.props.width !== prevProps.width) {
      createCircularTicks(this.refs[this.uid]);
    }
  }

  setScaleDomainRange(axesType, domainRange, data, type, length) {
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
          calcDefaultDomain(domainRange, type, this.parseDate)
          :
          [0, max(data, (d) => d[dataIndex])]
        );
        d3Axis.range(axesType === 'x' ? [0, length] : [length, 0]);
        break;
      case 'time':
        d3Axis = time.scale();
        d3Axis.domain(domainRange ?
          calcDefaultDomain(domainRange, type, this.parseDate)
          :
          extent(data, (d) => this.parseDate(d[dataIndex]))
        );
        d3Axis.range(axesType === 'x' ? [0, length] : [length, 0]);
        break;
      default:
        break;
    }
    return d3Axis;
  }

  defineColor(i, d, colorBars) {
    if (d.color) return d.color;
    if (colorBars) return colorScale(i);
    return null;
  }

  render() {
    const {
      data,
      lineData,
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
      y2Type,
      interpolate,
      barWidth,
      tickTimeDisplayFormat,
      xTickNumber,
      yTickNumber,
      yAxisOrientRight,
      grid,
      xDomainRange,
      yDomainRange} = this.props;
    const margin = calcMargin(axes, this.props.margin, yAxisOrientRight, lineData.length > 0);
    const width = reduce(this.props.width, margin.left, margin.right);
    const height = reduce(this.props.height, margin.top, margin.bottom);

    const x = this.setScaleDomainRange('x', xDomainRange, data, xType, width);
    const y = this.setScaleDomainRange('y', yDomainRange, data, yType, height);

    let y2 = null;
    if (lineData.length > 0) y2 = this.setScaleDomainRange('y', yDomainRange, lineData, y2Type, height);

    const svgNode = createElement('svg');
    select(svgNode).attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom);
    const root = select(svgNode).append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    if (axes) {
      const xAxis = svg.axis()
          .scale(x)
          .orient('bottom');
      if (xType === 'time' && tickTimeDisplayFormat) {
        xAxis.tickFormat(time.format(tickTimeDisplayFormat));
      }
      xAxis.tickSize(0).tickPadding(15);
      if (xTickNumber) xAxis.ticks(xTickNumber);
      root.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)
        .append('text')
        .attr('class', 'label')
        .attr('y', margin.bottom - 10)
        .attr('x', yAxisOrientRight ? 0 : width)
        .style('text-anchor', yAxisOrientRight ? 'start' : 'end')
        .text(axisLabels.x);

      const yAxis = svg.axis()
          .scale(y)
          .orient(yAxisOrientRight ? 'right' : 'left');
      if (yTickNumber) yAxis.ticks(yTickNumber);
      if (grid) { yAxis.tickSize(-width, 6).tickPadding(12); } else { yAxis.tickPadding(10); }
      root.append('g')
        .attr('class', 'y axis')
        .call(yAxis)
        .attr('transform', yAxisOrientRight ? `translate(${width}, 0)` : `translate(0, 0)`)
        .append('text')
        .attr('class', 'label')
        .attr('transform', 'rotate(-90)')
        .attr('x', 0)
        .attr('y', yAxisOrientRight ? -25 + margin.right : 10 - margin.left)
        .attr('dy', '.9em')
        .style('text-anchor', 'end')
        .text(axisLabels.y);

      if (y2) {
        const yAxis2 = svg.axis()
            .scale(y2)
            .orient(yAxisOrientRight ? 'left' : 'right');
        if (yTickNumber) yAxis.ticks(yTickNumber);
        if (grid) { yAxis.tickSize(-width, 6).tickPadding(12); } else { yAxis.tickPadding(10); }
        root.append('g')
            .attr('class', 'y axis')
            .call(yAxis2)
            .attr('transform', yAxisOrientRight ? `translate(0, 0)` : `translate(${width}, 0)`)
            .append('text')
            .attr('class', 'label')
            .attr('transform', 'rotate(-90)')
            .attr('x', 0)
            .attr('y', yAxisOrientRight ? 10 - margin.left : -25 + margin.right)
            .attr('dy', '.9em')
            .style('text-anchor', 'end')
            .text(axisLabels.y2);
      }
    }

    data.map(() => {
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

    if (y2) {
      const yValue = getValueFunction('y', y2Type, this.parseDate);
      const xValue = getValueFunction('x', xType, this.parseDate);
      const myLinePath = svg.line().interpolate(interpolate).x((d) => x(xValue(d))).y((d) => y2(yValue(d)));

      root.append('path')
        .datum(lineData)
        .attr('class', `line`)
        .attr('style', `stroke: red`)
        .attr('d', myLinePath);
    }

    return (
      <div ref={this.uid} className={`bar-chart${this.uid}`}>
        <Style scopeSelector={`.bar-chart${this.uid}`} rules={merge({}, defaultStyle, style, getAxisStyles(grid, false, yAxisOrientRight))}/>
        {svgNode.toReact()}
      </div>
    );
  }
}
