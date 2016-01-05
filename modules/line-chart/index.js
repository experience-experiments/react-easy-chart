import React from 'react';
import {createElement} from 'react-faux-dom';
import {line} from 'd3-shape';
import {linear, ordinal} from 'd3-scale';
import {extent} from 'd3-array';
import {select, svg} from 'd3';
import {Style} from 'radium';
import merge from 'lodash.merge';
import {time} from 'd3';
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
  }
};

export default class LineChart extends React.Component {

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

  getValueFunction(scale, type) {
    const dataIndex = scale === 'x' ? 'key' : 'value';
    switch (type) {
      case 'time':
        const parseDate = format(this.props.datePattern).parse;
        return (d) => parseDate(d[dataIndex]);
      default:
        return (d) => d[dataIndex];
    }
  }

  setXDomainAndRange(d3Axis, xDomainRange, data, type, width) {
    switch (type) {
      case 'text':
        d3Axis.domain(data[0].map((d) => d.key));
        d3Axis.rangePoints([0, width], 0);
        break;
      case 'linear':
        d3Axis.domain(xDomainRange ?
          this.calcDefaultDomain(xDomainRange, type)
          :
          this.findLargestExtent(data, this.getValueFunction('x', type)));
        d3Axis.range([0, width]);
        break;
      case 'time':
        d3Axis.domain(xDomainRange ?
          this.calcDefaultDomain(xDomainRange, type)
          :
          this.findLargestExtent(data, this.getValueFunction('x', type)));
        d3Axis.range([0, width]);
        break;
      default:
        d3Axis.domain();
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

  calcDefaultDomain(domainRange, type) {
    if (!domainRange) return null;
    switch (type) {
      case 'time':
        const parseDate = format(this.props.datePattern).parse;
        return [parseDate(domainRange[0]), parseDate(domainRange[1])];
      default:
        return domainRange;
    }
  }

  calcMargin(axes) {
    return axes ? {top: 10, right: 20, bottom: 30, left: 50} : {top: 0, right: 0, bottom: 0, left: 0};
  }

  render() {
    const {data, xType, yType, style, axes, axisLabels, xDomainRange} = this.props;
    let {margin, yDomainRange} = this.props;
    let {width, height} = this.props;
    margin = margin ? margin : this.calcMargin(axes);
    width = width - (margin.left + margin.right);
    height = height - (margin.top + margin.bottom);

    const yValue = this.getValueFunction('y', yType);
    const xValue = this.getValueFunction('x', xType);

    const x = this.getScale(xType);
    const y = this.getScale(yType).range([height, 0]);

    yDomainRange = this.calcDefaultDomain(yDomainRange, yType);
    this.setXDomainAndRange(x, xDomainRange, data, xType, width);

    y.domain(yDomainRange ? yDomainRange : this.findLargestExtent(data, yValue));

    const linePath = line().x((d) => x(xValue(d))).y((d) => y(yValue(d)));

    const svgNode = createElement('svg');
    select(svgNode).attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom);
    const root = select(svgNode).append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    if (axes) {
      const xAxis = svg.axis().scale(x).ticks(time.month, 1).tickFormat(format('%B')).orient('bottom');
      const yAxis = svg.axis().scale(y).orient('left');
      root.append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis)
        .append('text')
        .attr('class', 'label')
        .attr('y', margin.bottom - 0.9)
        .attr('x', (width - margin.left) / 2)
        .text(axisLabels.x);

      root.append('g')
        .attr('class', 'y axis')
        .call(yAxis)
        .append('text')
        .attr('class', 'label')
        .attr('transform', 'rotate(-90)')
        .attr('x', (0 - height) / 2)
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

LineChart.propTypes = {
  data: React.PropTypes.array.isRequired,
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  xType: React.PropTypes.string,
  yType: React.PropTypes.string,
  datePattern: React.PropTypes.string,
  style: React.PropTypes.object,
  margin: React.PropTypes.object,
  axes: React.PropTypes.bool,
  xDomainRange: React.PropTypes.array,
  yDomainRange: React.PropTypes.array,
  axisLabels: React.PropTypes.object
};

LineChart.defaultProps = {
  width: 200,
  height: 150,
  datePattern: '%d-%b-%y',
  axes: false,
  xType: 'linear',
  yType: 'linear',
  axisLabels: {x: 'x axis', y: 'y axis'}
};
