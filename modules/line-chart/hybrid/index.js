import React from 'react';
import {
  createUniqueID,
  defaultStyles,
  getDefaultAxisStyles
} from './LineChart/common';
import { Style } from 'radium';
import merge from 'lodash.merge';

import lineChart from './LineChart';

export default class LineChart extends React.Component {
  constructor(props) {
    super(props);
    this.uid = createUniqueID();
  }

  componentDidMount() {
    const {
      chart
    } = this.refs;

    const props = this.props;

    lineChart.initialise(chart, props);
  }

  componentDidUpdate() {
    const {
      chart
    } = this.refs;

    const props = this.props;

    lineChart.transition(chart, props);
  }

  createStyle() {
    const {
      style,
      grid,
      vGrid,
      hGrid,
      orient
    } = this.props;

    const uid = this.uid;
    const scope = `.line-chart-${uid}`;
    const defaultAxisStyles = getDefaultAxisStyles(vGrid || grid, hGrid || grid, orient);
    const rules = merge({}, defaultStyles, style, defaultAxisStyles);

    return (
      <Style
        scopeSelector={scope}
        rules={rules}
      />
    );
  }

  render() {
    const {
      width,
      height
    } = this.props;

    const uid = this.uid;
    const className = `line-chart-${uid}`;

    return (
      <div ref="lineChart" className={className}>
        {this.createStyle()}
        <svg ref="chart" width={width} height={height} />
      </div>
    );
  }
}

LineChart.propTypes = {
  data: React.PropTypes.array.isRequired,
  axes: React.PropTypes.bool,
  grid: React.PropTypes.bool,
  hGrid: React.PropTypes.bool,
  vGrid: React.PropTypes.bool,
  type: React.PropTypes.string,
  xType: React.PropTypes.string,
  yType: React.PropTypes.string,
  interpolate: React.PropTypes.string,
  margin: React.PropTypes.shape({
    top: React.PropTypes.number,
    right: React.PropTypes.number,
    bottom: React.PropTypes.number,
    left: React.PropTypes.number
  }),
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  orient: React.PropTypes.string,
  colors: React.PropTypes.array,
  strokeWidth: React.PropTypes.number,
  stroke: React.PropTypes.object,
  style: React.PropTypes.object,
  xLabel: React.PropTypes.string,
  yLabel: React.PropTypes.string,
  xDomain: React.PropTypes.array,
  yDomain: React.PropTypes.array,
  pattern: React.PropTypes.string,
  xPattern: React.PropTypes.string,
  yPattern: React.PropTypes.string
};

LineChart.defaultProps = {
  type: 'linear',
  xType: 'linear',
  yType: 'linear',
  interpolate: 'linear',
  margin: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  orient: 'left',
  colors: [],
  strokeWidth: 2,
  style: {}
};
