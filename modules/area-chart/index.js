import React from 'react';
import {createElement} from 'react-faux-dom';
import {reduce, getValueFunction, getRandomId, calcMargin, setLineDomainAndRange} from '../shared';
import {select, svg, time, event as d3LastEvent} from 'd3';
import {Style} from 'radium';
import merge from 'lodash.merge';
import {format} from 'd3-time-format';

const defaultStyle = {
  '.area': {
    stroke: 'black',
    strokeWidth: 0
  },
  '.dot': {
    strokeWidth: 0
  },
  'circle': {
    r: 4
  },
  'circle:hover': {
    r: 8,
    opacity: 0.6
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
  '.tick line': {
    stroke: 'lightgrey',
    opacity: '0.7'
  }
};


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
      xDomainRange: React.PropTypes.array,
      yDomainRange: React.PropTypes.array,
      areaColors: React.PropTypes.array,
      axisLabels: React.PropTypes.object,
      tickTimeDisplayFormat: React.PropTypes.string,
      yTicks: React.PropTypes.number,
      xTicks: React.PropTypes.number,
      dataPoints: React.PropTypes.bool,
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
      tickTimeDisplayFormat,
      mouseOverHandler,
      mouseOutHandler,
      mouseMoveHandler,
      clickHandler,
      dataPoints,
      areaColors} = this.props;
    const margin = calcMargin(axes, this.props.margin);
    const width = reduce(this.props.width, margin.left, margin.right);

    const height = reduce(this.props.height, margin.top, margin.bottom);

    const x = setLineDomainAndRange('x', xDomainRange, data, xType, width, this.parseDate);
    const y = setLineDomainAndRange('y', yDomainRange, data, yType, height, this.parseDate);

    const yValue = getValueFunction('y', yType, this.parseDate);
    const xValue = getValueFunction('x', xType, this.parseDate);
    const area = svg.area().interpolate(interpolate).x((d) => x(xValue(d))).y0(height).y1((d) => y(yValue(d)));

    const svgNode = createElement('svg');
    select(svgNode).attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom);
    const root = select(svgNode).append('g').attr('transform', `translate(${margin.left},${margin.top})`);
    areaColors.concat(['steelblue', 'orange', 'yellow', 'red']).map((fillCol, i) => {
      const gradient = select(svgNode).append('defs')
        .append('linearGradient')
        .attr('id', `gradient-${i}-${this.uid}`)
        .attr('x1', '0%')
        .attr('x2', '0%')
        .attr('y1', '0%')
        .attr('y2', '100%');

      defaultStyle[`.dot${i}`] = {fill: fillCol};
      gradient.append('stop')
        .attr('offset', '0%')
        .attr('style', `stop-color:${fillCol};stop-opacity:0.8`);

      gradient.append('stop')
        .attr('offset', '100%')
        .attr('style', `stop-color:${fillCol};stop-opacity:0.2`);
    });

    if (axes) {
      const xAxis = svg.axis().scale(x).orient('bottom');
      if (xType === 'time' && tickTimeDisplayFormat) {
        xAxis.tickFormat(time.format(tickTimeDisplayFormat));
      }
      if (grid) xAxis.tickSize(-height, 6).tickPadding(12);
      if (xTicks) xAxis.ticks(xTicks);
      root.append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis)
        .append('text')
        .attr('class', 'label')
        .attr('y', margin.bottom - 3)
        .attr('x', (width))
        .style('text-anchor', 'end')
        .text(axisLabels.x);

      const yAxis = svg.axis().scale(y).orient('left');
      if (yType === 'time' && tickTimeDisplayFormat) {
        yAxis.tickFormat(time.format(tickTimeDisplayFormat));
      }
      if (grid) yAxis.tickSize(-width, 6).tickPadding(12);
      if (yTicks) yAxis.ticks(yTicks);
      root.append('g')
        .attr('class', 'y axis')
        .call(yAxis)
        .append('text')
        .attr('class', 'label')
        .attr('transform', 'rotate(-90)')
        .attr('x', 0)
        .attr('y', -margin.left)
        .attr('dy', '.9em')
        .style('text-anchor', 'end')
        .text(axisLabels.y);
    }
    data.map((dataElelment, i) => {
      root.append('path')
        .datum(dataElelment)
        .attr('d', area)
        .style('fill', `url(#gradient-${i}-${this.uid})`);
    });
    if (dataPoints) {
      data.map((dataElelment, i) => {
        dataElelment.map((dotData) => {
          root
          .append('circle')
          .attr('class', `dot dot${i}`)
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
      <div className={`area-chart${this.uid}`}>
        <Style scopeSelector={`.area-chart${this.uid}`} rules={merge({}, defaultStyle, style)}/>
        {svgNode.toReact()}
      </div>
    );
  }
}
