import React from 'react';
import d3 from 'd3';
import {linear, ordinal} from 'd3-scale';
import {time} from 'd3';
import {format} from 'd3-time-format';
import {extent} from 'd3-array';
import { createElement } from 'react-faux-dom';
import {Style} from 'radium';
import merge from 'lodash.merge';

const defaultStyle = {
  '.line': {
    fill: 'none',
    strokeWidth: 1.5
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
  '.dot': {
    stroke: '#000'
  }
};

export default class ScatterplotChart extends React.Component {
  constructor(props) {
    super(props);
    this.color = d3.scale.category10();
  }

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

  setDomainAndRange(scale, d3Axis, domainRange, data, type, length) {
    const dataIndex = scale === 'x' ? 'key' : 'value';
    switch (type) {
      case 'text':
        d3Axis.domain(domainRange ?
          this.calcDefaultDomain(domainRange, type)
          :
          data[0].map((d) => d[dataIndex])
        );

        d3Axis.rangePoints([0, length], 0);
        break;
      case 'linear':
        d3Axis.domain(domainRange ?
          this.calcDefaultDomain(domainRange, type)
          :
          this.findLargestExtent(data, this.getValueFunction(scale, type))
        );
        d3Axis.range(scale === 'x' ? [0, length] : [length, 0]);
        break;
      case 'time':
        d3Axis.domain(domainRange ?
          this.calcDefaultDomain(domainRange, type)
          :
          this.findLargestExtent(data, this.getValueFunction(scale, type)));
        d3Axis.range(scale === 'x' ? [0, length] : [length, 0]);
        break;
      default:
        break;
    }
  }

  getDataConfig(type) {
    const index = this.props.config.findIndex((item) => {
      return item.type === type;
    });
    return this.props.config[index];
  }

  getFill(data) {
    const configItem = this.getDataConfig(data.type);
    return typeof configItem !== 'undefined' ? configItem.color : this.color(data.type);
  }

  getStroke(data) {
    const configItem = this.getDataConfig(data.type);
    return typeof configItem !== 'undefined' ? configItem.stroke : 'none';
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

  calcMargin(axes, spacer) {
    return axes ?
    {top: 20, right: 20, bottom: 30, left: 40} :
    {top: spacer, right: spacer, bottom: spacer, left: spacer};
  }

  render() {
    const {axes, axisLabels, data, dotRadius, style, xDomainRange, xTicks, yTicks, xType, yType} = this.props;
    let {width, height, margin, yDomainRange} = this.props;

    margin = margin ? margin : this.calcMargin(axes, dotRadius * 2);
    width = width - (margin.left + margin.right);
    height = height - (margin.top + margin.bottom + dotRadius);
    /*
    const x = d3.scale.linear().range([0, width]);
    const y = d3.scale.linear().range([height, 0]);
    */
    const x = this.getScale(xType);
    const y = this.getScale(yType);

    yDomainRange = this.calcDefaultDomain(yDomainRange, yType);
    this.setDomainAndRange('x', x, xDomainRange, data, xType, width);
    this.setDomainAndRange('y', y, yDomainRange, data, yType, height);


    const node = createElement('svg');

    const svg = d3.select(node)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    data.forEach((d) => {
      d.y = +d.y;
      d.x = +d.x;
    });

    x.domain(d3.extent(data, (d) => { return d.x; })).nice();
    y.domain(d3.extent(data, (d) => { return d.y; })).nice();

    if (axes) {
      const xAxis = d3.svg.axis()
        .scale(x)
        .orient('bottom');

      const yAxis = d3.svg.axis()
        .scale(y)
        .orient('left');
      if (xTicks) xAxis.ticks(xTicks);
      if (yTicks) yAxis.ticks(yTicks);
      svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0, ${height})`)
        .call(xAxis)
        .append('text')
        .attr('class', 'label')
        .attr('x', width)
        .attr('y', -6)
        .style('text-anchor', 'end')
        .text(axisLabels.x);

      svg.append('g')
        .attr('class', 'y axis')
        .call(yAxis)
        .append('text')
        .attr('class', 'label')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .text(axisLabels.y);
    }

    svg.selectAll('.dot')
      .data(data)
      .enter().append('circle')
      .attr('class', 'dot')
      .attr('r', dotRadius)
      .attr('cx', (d) => { return x(d.x); })
      .attr('cy', (d) => { return y(d.y); })
      .style('fill', (d) => this.getFill(d))
      .style('stroke', (d) => this.getStroke(d));
    /*
    if (useLegend) {
      const legend = svg.selectAll('.legend')
        .data(this.color.domain())
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', (d, i) => { return `translate(0, ${i * 20})`; });

      legend.append('rect')
        .attr('x', width - 18)
        .attr('width', 18)
        .attr('height', 18)
        .style('fill', this.color);

      legend.append('text')
        .attr('x', width - 24)
        .attr('y', 9)
        .attr('dy', '.35em')
        .style('text-anchor', 'end')
        .text((d) => d);
    }*/

    const uid = Math.floor(Math.random() * new Date().getTime());

    return (
      <div className={`scatterplot_chart${uid}`}>
        <h1>Scatterplot Chart</h1>
        <Style scopeSelector={`.scatterplot_chart${uid}`} rules={merge({}, defaultStyle, style)}/>
        {node.toReact()}
      </div>
    );
  }
}

ScatterplotChart.propTypes = {
  axes: React.PropTypes.bool,
  axisLabels: React.PropTypes.object,
  config: React.PropTypes.array.isRequired,
  data: React.PropTypes.array.isRequired,
  datePattern: React.PropTypes.string,
  dotRadius: React.PropTypes.number,
  height: React.PropTypes.number,
  useLegend: React.PropTypes.bool,
  margin: React.PropTypes.object,
  style: React.PropTypes.object,
  width: React.PropTypes.number,
  xDomainRange: React.PropTypes.array,
  yDomainRange: React.PropTypes.array,
  yTicks: React.PropTypes.number,
  xTicks: React.PropTypes.number,
  xType: React.PropTypes.string,
  yType: React.PropTypes.string
};

ScatterplotChart.defaultProps = {
  axes: false,
  clickHandler: () => {},
  datePattern: '%d-%b-%y',
  dotRadius: 5,
  axisLabels: {},
  mouseOverHandler: () => {},
  mouseOutHandler: () => {},
  mouseMoveHandler: () => {},
  width: 320,
  height: 180,
  xType: 'linear',
  yType: 'linear'
};
