import React from 'react';
import {createElement} from 'react-faux-dom';
import {line} from 'd3-shape';
import {linear} from 'd3-scale';
import {extent} from 'd3-array';
import {select, svg} from 'd3';
import {Style} from 'radium';

const merge = (...args) => Object.assign({}, ...args);

const defaultStyle = {
  '.line': {
    fill: 'none',
    stroke: 'black',
    strokeWidth: 1.5
  },
  '.axis path, .axis line': {
    fill: 'none',
    stroke: '#000',
    shapeRendering: 'crispEdges'
  },
  '.x.axis path': {
    display: 'none'
  }
};

const defaultMargin = {
  top: 20,
  right: 0,
  bottom: 0,
  left: 50
};

export default class LineChart extends React.Component {

  renderAxises(xAxisFunction, yAxisFunction, height, margin) {
    const g = createElement('g');
    const selection = select(g);
    selection.append('g').attr('class', 'x axis').attr('transform', `translate(${margin.left}, ${height})`).call(xAxisFunction);
    selection.append('g').attr('class', 'y axis').attr('transform', `translate(${margin.left}, ${margin.top})`).call(yAxisFunction);
    return g.toReact();
  }

  render() {
    const {data, xValue, yValue, width, height, xScale, yScale, margin} = this.props;

    const chartMargin = merge(defaultMargin, margin);
    const x = xScale().range([0, (width - chartMargin.left - chartMargin.right)]);
    const y = yScale().range([(height - chartMargin.top - chartMargin.bottom), 0]);
    x.domain(extent(data, xValue));
    y.domain(extent(data, yValue));
    const xAxis = svg.axis().scale(x).orient('bottom');
    const yAxis = svg.axis().scale(y).orient('left');

    const linePath = line().x((d) => x(xValue(d))).y((d) => y(yValue(d)));

    const baseTranslate = `translate(${chartMargin.left},${chartMargin.top})`;
    return (
      <div className="line-chart">
        <Style scopeSelector=".line-chart" rules={defaultStyle}/>
        <svg width={width + chartMargin.left + chartMargin.right} height={height + chartMargin.top + chartMargin.bottom}>
          {this.renderAxises(xAxis, yAxis, height, margin)}
          <g transform={baseTranslate}>
          <path className="line" d={linePath(data)}/>
          </g>
        </svg>
      </div>
    );
  }
}

LineChart.propTypes = {
  width: React.PropTypes.number.isRequired,
  height: React.PropTypes.number.isRequired,
  data: React.PropTypes.array.isRequired,
  xValue: React.PropTypes.func.isRequired,
  yValue: React.PropTypes.func.isRequired,
  style: React.PropTypes.object,
  margin: React.PropTypes.object,
  xScale: React.PropTypes.func,
  yScale: React.PropTypes.func
};

LineChart.defaultProps = {
  margin: defaultMargin,
  xScale: linear,
  yScale: linear
};
