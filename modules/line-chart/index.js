import React from 'react';
import {line} from 'd3-shape';
import {linear} from 'd3-scale';
import {extent} from 'd3-array';
import {format} from 'd3-time-format';

const parseDate = format('%d-%b-%y').parse;
const merge = (...args) => Object.assign({}, ...args);

export default class LineChart extends React.Component {
  render() {
    const x = linear().domain(extent(this.props.data, (d) => parseDate(d[0]))).range([0, this.props.width]);
    const y = linear().domain(extent(this.props.data, (d) => d[1])).range([this.props.height, 0]);
    const baseTranslate = `translate(${this.props.marginLeft},${this.props.marginTop})`;
    const plots = line().x((d) => x(parseDate(d[0]))).y((d) => y(d[1]));

    const lineStyle = merge({
      fill: 'none',
      strokeWidth: 1,
      stroke: 'black'
    }, this.props.lineStyle);

    return (<svg width={this.props.width} height={this.props.height}>
        <g transform={baseTranslate}>
        <path style={lineStyle} d={plots(this.props.data)}/>
        </g>
      </svg>);
  }
}
LineChart.propTypes = {
  data: React.PropTypes.array.isRequired,
  lineStyle: React.PropTypes.any.isOptional,
  width: React.PropTypes.number.isRequired,
  height: React.PropTypes.number.isRequired,
  marginLeft: React.PropTypes.number.isRequired,
  marginTop: React.PropTypes.number.isRequired
};
