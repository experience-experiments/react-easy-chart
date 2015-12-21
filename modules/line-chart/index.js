import React from 'react';
import {line} from 'd3-shape';
import {linear} from 'd3-scale';
import {extent} from 'd3-array';

const merge = (...args) => Object.assign({}, ...args);

const defaultLineStyle = {
  fill: 'none',
  strokeWidth: 1,
  stroke: 'black'
};

export default class LineChart extends React.Component {

  render() {
    const {data, xValue, yValue, width, height, lineStyle, xScale, yScale} = this.props;

    const x = xScale().domain(extent(data, xValue)).range([0, width]);
    const y = yScale().domain(extent(data, yValue)).range([height, 0]);
    const linePath = line().x((d) => x(xValue(d))).y((d) => y(yValue(d)));
    const pathStyle = merge(defaultLineStyle, lineStyle);
    const baseTranslate = `translate(0,0)`;

    return (
      <svg width={width} height={height}>
        <g transform={baseTranslate}>
        <path style={pathStyle} d={linePath(data)}/>
        </g>
      </svg>
    );
  }
}

LineChart.propTypes = {
  width: React.PropTypes.number.isRequired,
  height: React.PropTypes.number.isRequired,
  data: React.PropTypes.array.isRequired,
  xValue: React.PropTypes.func.isRequired,
  yValue: React.PropTypes.func.isRequired,
  lineStyle: React.PropTypes.object,
  xScale: React.PropTypes.func,
  yScale: React.PropTypes.func
};

LineChart.defaultProps = {
  lineStyle: defaultLineStyle,
  xScale: linear,
  yScale: linear
};
