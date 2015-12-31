import React from 'react';
import {createElement} from 'react-faux-dom';
import {line} from 'd3-shape';
import {linear} from 'd3-scale';
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
        return time.scale;
      default:
        return linear;
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

  calcDefaultDomain(domainRange, type) {
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
    const {data, xType, yType, style, axes} = this.props;
    let {margin, yDomainRange, xDomainRange} = this.props;
    const xScale = this.getScale(xType);
    const yScale = this.getScale(yType);
    const yValue = this.getValueFunction('y', yType);
    const xValue = this.getValueFunction('x', xType);

    margin = margin ? margin : this.calcMargin(axes);
    yDomainRange = yDomainRange ? this.calcDefaultDomain(yDomainRange, yType) : null;
    xDomainRange = xDomainRange ? this.calcDefaultDomain(xDomainRange, xType) : null;

    let {width, height} = this.props;
    width = width - (margin.left + margin.right);
    height = height - (margin.top + margin.bottom);

    const x = xScale().range([0, width]);
    const y = yScale().range([height, 0]);

    const linePath = line().x((d) => x(xValue(d))).y((d) => y(yValue(d)));

    const svgNode = createElement('svg');
    select(svgNode).attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom);
    const root = select(svgNode).append('g').attr('transform', `translate(${margin.left},${margin.top})`);


    x.domain(xDomainRange ? xDomainRange : extent(data[0], xValue));
    y.domain(yDomainRange ? yDomainRange : extent(data[0], yValue));

    if (axes) {
      const xAxis = svg.axis().scale(x).orient('bottom');
      const yAxis = svg.axis().scale(y).orient('left');
      root.append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis);

      root.append('g')
        .attr('class', 'y axis')
        .call(yAxis);
        // .append('text')
        // .attr('transform', 'rotate(-90)')
        // .attr('y', 6)
        // .attr('dy', '.71em')
        // .style('text-anchor', 'end')
        // .text('Price ($)');
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
  yDomainRange: React.PropTypes.array
};

LineChart.defaultProps = {
  width: 960,
  height: 500,
  datePattern: '%d-%b-%y',
  axes: false
};
