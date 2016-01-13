import React from 'react';
import {createElement} from 'react-faux-dom';
import {linear, ordinal} from 'd3-scale';
import {extent} from 'd3-array';
import {select, svg, time} from 'd3';
import {Style} from 'radium';
import merge from 'lodash.merge';
import {format} from 'd3-time-format';

const defaultStyle = {
  '.line': {
    fill: 'none',
    strokeWidth: 1.5
  },
  '.line0': {
    stroke: 'steelblue'
  },
  '.line1': {
    stroke: 'orange'
  },
  '.line2': {
    stroke: 'red'
  },
  '.line3': {
    stroke: 'darkblue'
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


export default class LineChart extends React.Component {
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
      axisLabels: React.PropTypes.object,
      tickTimeDisplayFormat: React.PropTypes.string,
      yTicks: React.PropTypes.number,
      xTicks: React.PropTypes.number
    };
  }

  static get defaultProps() {
    return {
      width: 200,
      height: 150,
      datePattern: '%d-%b-%y',
      interpolate: 'linear',
      axes: false,
      xType: 'linear',
      yType: 'linear',
      axisLabels: {x: '', y: ''}
    };
  }

  constructor(props) {
    super(props);
    this.parseDate = format(props.datePattern).parse;
  }

  getValueFunction(scale, type) {
    const dataIndex = scale === 'x' ? 'x' : 'y';
    switch (type) {
      case 'time':
        return (d) => this.parseDate(d[dataIndex]);
      default:
        return (d) => d[dataIndex];
    }
  }

  setDomainAndRange(scale, domainRange, data, type, length) {
    const dataIndex = scale === 'x' ? 'x' : 'y';
    let d3Axis;
    switch (type) {
      case 'text':
        d3Axis = ordinal();
        d3Axis.domain(domainRange ?
          this.calcDefaultDomain(domainRange, type)
          :
          data[0].map((d) => d[dataIndex])
        );

        d3Axis.rangePoints([0, length], 0);
        break;
      case 'linear':
        d3Axis = linear();
        d3Axis.domain(domainRange ?
          this.calcDefaultDomain(domainRange, type)
          :
          this.findLargestExtent(data, this.getValueFunction(scale, type))
        );
        d3Axis.range(scale === 'x' ? [0, length] : [length, 0]);
        break;
      case 'time':
        d3Axis = time.scale();
        d3Axis.domain(domainRange ?
          this.calcDefaultDomain(domainRange, type)
          :
          this.findLargestExtent(data, this.getValueFunction(scale, type))
        );
        d3Axis.range(scale === 'x' ? [0, length] : [length, 0]);
        break;
      default:
        break;
    }
    return d3Axis;
  }

  findLargestExtent(data, y) {
    let low;
    let high;
    data.map((dataElement) => {
      const calcDomainRange = extent(dataElement, y);
      low = low < calcDomainRange[0] ? low : calcDomainRange[0];
      high = high > calcDomainRange[1] ? high : calcDomainRange[1];
    });
    return [low, high];
  }

  calcDefaultDomain(domainRange, type) {
    if (!domainRange) return null;
    switch (type) {
      case 'time':
        return [this.parseDate(domainRange[0]), this.parseDate(domainRange[1])];
      default:
        return domainRange;
    }
  }

  calcMargin(axes) {
    return axes ? {top: 10, right: 20, bottom: 50, left: 50} : {top: 0, right: 0, bottom: 0, left: 0};
  }

  render() {
    const {data,
      xType,
      yType,
      style,
      axes,
      axisLabels,
      xDomainRange,
      xTicks,
      yTicks,
      interpolate,
      grid,
      tickTimeDisplayFormat} = this.props;
    let {margin, yDomainRange} = this.props;
    let {width, height} = this.props;
    margin = margin ? margin : this.calcMargin(axes);
    width = width - (margin.left + margin.right);
    height = height - (margin.top + margin.bottom);

    const yValue = this.getValueFunction('y', yType);
    const xValue = this.getValueFunction('x', xType);

    yDomainRange = this.calcDefaultDomain(yDomainRange, yType);
    const x = this.setDomainAndRange('x', xDomainRange, data, xType, width);
    const y = this.setDomainAndRange('y', yDomainRange, data, yType, height);

    const linePath = svg.line().interpolate(interpolate).x((d) => x(xValue(d))).y((d) => y(yValue(d)));

    const svgNode = createElement('svg');
    select(svgNode).attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom);
    const root = select(svgNode).append('g').attr('transform', `translate(${margin.left},${margin.top})`);

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
        .attr('y', 0 - margin.left)
        .attr('dy', '.9em')
        .style('text-anchor', 'end')
        .text(axisLabels.y);
    }
    data.map((dataElelment, i) => {
      root.append('path')
        .datum(dataElelment)
        .attr('class', `line line${i}`)
        .attr('d', linePath);
    });

    const uid = Math.floor(Math.random() * new Date().getTime());

    return (
      <div className={`line-chart${uid}`}>
        <Style scopeSelector={`.line-chart${uid}`} rules={merge({}, defaultStyle, style)}/>
        {svgNode.toReact()}
      </div>
    );
  }
}
