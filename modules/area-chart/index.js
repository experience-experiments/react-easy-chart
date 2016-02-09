import React from 'react';
import {createElement} from 'react-faux-dom';
import {reduce, getValueFunction, getRandomId, calcMargin, setLineDomainAndRange, defaultStyle, getAxisStyles, createCircularTicks, rmaColorPalet} from '../shared';
import {select, svg, time, event as d3LastEvent} from 'd3';
import {Style} from 'radium';
import merge from 'lodash.merge';
import {format} from 'd3-time-format';

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
      axisLabels: React.PropTypes.object,
      tickTimeDisplayFormat: React.PropTypes.string,
      yTicks: React.PropTypes.number,
      xTicks: React.PropTypes.number,
      dataPoints: React.PropTypes.bool,
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
      axisLabels: {x: '', y: ''},
      mouseOverHandler: () => {},
      mouseOutHandler: () => {},
      mouseMoveHandler: () => {},
      clickHandler: () => {}
    };
  }

  constructor(props) {
    super(props);
    this.parseDate = format(props.datePattern).parse;
    this.uid = getRandomId();
  }

  componentDidMount() {
    createCircularTicks(this.refs[this.uid]);
  }

  componentDidUpdate(prevProps) {
    if (this.props.width !== prevProps.width) {
      createCircularTicks(this.refs[this.uid]);
    }
  }

  render() {
    const {data,
      xType,
      yType,
      style,
      axes,
      axisLabels,
      xDomainRange,
      yDomainRange,
      xTicks,
      yTicks,
      interpolate,
      grid,
      verticalGrid,
      tickTimeDisplayFormat,
      mouseOverHandler,
      mouseOutHandler,
      mouseMoveHandler,
      clickHandler,
      dataPoints,
      areaColors,
      noAreaGradient,
      yAxisOrientRight} = this.props;
    const margin = calcMargin(axes, this.props.margin, yAxisOrientRight);
    const defaultColours = areaColors.concat(rmaColorPalet);
    const width = reduce(this.props.width, margin.left, margin.right);

    const height = reduce(this.props.height, margin.top, margin.bottom);

    const x = setLineDomainAndRange('x', xDomainRange, data, xType, width, this.parseDate);
    const y = setLineDomainAndRange('y', yDomainRange, data, yType, height, this.parseDate);

    const yValue = getValueFunction('y', yType, this.parseDate);
    const xValue = getValueFunction('x', xType, this.parseDate);
    const area = svg.area().interpolate(interpolate).x((d) => x(xValue(d))).y0(height).y1((d) => y(yValue(d)));
    const linePath = svg.line().interpolate(interpolate).x((d) => x(xValue(d))).y((d) => y(yValue(d)));

    const svgNode = createElement('svg');
    select(svgNode).attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom);
    const root = select(svgNode).append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    if (axes) {
      const xAxis = svg.axis().scale(x).orient('bottom');
      if (xType === 'time' && tickTimeDisplayFormat) {
        xAxis.tickFormat(time.format(tickTimeDisplayFormat));
      }
      if (grid && verticalGrid) { xAxis.tickSize(-height, 6).tickPadding(15); } else { xAxis.tickSize(0).tickPadding(15);}
      if (xTicks) xAxis.ticks(xTicks);
      root.append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis)
        .append('text')
        .attr('class', 'label')
        .attr('y', margin.bottom - 10)
        .attr('x', yAxisOrientRight ? 0 : width)
        .style('text-anchor', yAxisOrientRight ? 'start' : 'end')
        .text(axisLabels.x);

      const yAxis = svg.axis().scale(y)
        .orient(yAxisOrientRight ? 'right' : 'left');
      if (yType === 'time' && tickTimeDisplayFormat) {
        yAxis.tickFormat(time.format(tickTimeDisplayFormat));
      }
      if (grid) { yAxis.tickSize(-width, 6).tickPadding(12); } else { yAxis.tickPadding(10); }
      if (yTicks) yAxis.ticks(yTicks);
      root.append('g')
        .attr('class', 'y axis')
        .call(yAxis)
        .attr('transform', yAxisOrientRight ? `translate(${width}, 0)` : `translate(0, 0)`)
        .append('text')
        .attr('class', 'label')
        .attr('transform', 'rotate(-90)')
        .attr('x', 0)
        .attr('y', yAxisOrientRight ? -20 + margin.right : 0 - margin.left)
        .attr('dy', '.9em')
        .style('text-anchor', 'end')
        .text(axisLabels.y);
    }

    defaultColours.map((fillCol, i) => {
      if (!noAreaGradient) {
        const gradient = select(svgNode).append('defs')
            .append('linearGradient')
            .attr('id', `gradient-${i}-${this.uid}`)
            .attr('x1', '0%')
            .attr('x2', '0%')
            .attr('y1', '20%')
            .attr('y2', '80%');

        defaultStyle[`.dot${i}`] = {fill: fillCol};
        gradient.append('stop')
            .attr('offset', '0%')
            .attr('style', `stop-color:${fillCol};stop-opacity:0.6`);

        gradient.append('stop')
            .attr('offset', '100%')
            .attr('style', `stop-color:${fillCol};stop-opacity:0.4`);
      }
    });

    data.map((dataElelment, i) => {
      root.append('path')
        .datum(dataElelment)
        .attr('class', 'line')
        .attr('style', `stroke: ${defaultColours[i]}`)
        .attr('d', linePath);
      root.append('path')
        .datum(dataElelment)
        .attr('d', area)
        .style('fill', noAreaGradient ? defaultColours[i] : `url(#gradient-${i}-${this.uid})`);
    });

    if (dataPoints) {
      data.map((dataElelment, i) => {
        dataElelment.map((dotData) => {
          root.append('circle')
          .attr('class', 'data-point')
          .style('strokeWidth', '2px')
          .style('stroke', defaultColours[i])
          .style('fill', 'white')
          .attr('cx', () => {
            switch (xType) {
              case ('time'):
                return x(this.parseDate(dotData.x));
              default:
                return x(dotData.x);
            }
          })
          .attr('cy', () => {
            switch (yType) {
              case ('time'):
                return y(this.parseDate(dotData.y));
              default:
                return y(dotData.y);
            }
          })
          .on('mouseover', () => mouseOverHandler(dotData, d3LastEvent))
          .on('mouseout', () => mouseOutHandler(dotData, d3LastEvent))
          .on('mousemove', () => mouseMoveHandler(d3LastEvent))
          .on('click', () => clickHandler(dotData, d3LastEvent));
        });
      });
    }
    return (
      <div ref={this.uid} className={`area-chart${this.uid}`}>
        <Style scopeSelector={`.area-chart${this.uid}`} rules={merge({}, defaultStyle, style, getAxisStyles(grid, verticalGrid, yAxisOrientRight))}/>
        {svgNode.toReact()}
      </div>
    );
  }
}
