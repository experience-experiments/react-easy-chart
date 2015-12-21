import React from 'react';
import {line} from 'd3-shape';
import {linear} from 'd3-scale';

export default class LineChart extends React.Component {
  render() {
    const y = linear().range([this.props.width, 0]);
    const x = linear().range([this.props.width, 0]);
    const baseTranslate = `translate(${this.props.marginLeft},${this.props.marginTop})`;
    const plots = line().x((d, i) => x(i)).y((d, i) => y(i));
    return (<svg width={this.props.width} height={this.props.height}>
        <g transform={baseTranslate}>
        <path d={plots}/>
        </g>
      </svg>);
  }
}
LineChart.propTypes = {
  data: React.PropTypes.array.isRequired,
  width: React.PropTypes.number.isRequired,
  height: React.PropTypes.number.isRequired,
  marginLeft: React.PropTypes.number.isRequired,
  marginTop: React.PropTypes.number.isRequired
};
