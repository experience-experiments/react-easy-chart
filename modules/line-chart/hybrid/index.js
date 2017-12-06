import React, { PureComponent } from 'react';
import {
  createUniqueID,
  defaultStyles,
  getDefaultAxisStyles
} from './LineChart/common';
import PropTypes from 'prop-types';
import { Style } from 'radium';
import merge from 'lodash.merge';

import lineChart from './LineChart';

export default class LineChart extends PureComponent {
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
  data: PropTypes.array.isRequired,
  axes: PropTypes.bool,
  grid: PropTypes.bool,
  hGrid: PropTypes.bool,
  vGrid: PropTypes.bool,
  type: PropTypes.string,
  xType: PropTypes.string,
  yType: PropTypes.string,
  interpolate: PropTypes.string,
  margin: PropTypes.shape({
    top: PropTypes.number,
    right: PropTypes.number,
    bottom: PropTypes.number,
    left: PropTypes.number
  }),
  width: PropTypes.number,
  height: PropTypes.number,
  orient: PropTypes.string,
  colors: PropTypes.array,
  strokeWidth: PropTypes.number,
  stroke: PropTypes.object,
  style: PropTypes.object,
  xLabel: PropTypes.string,
  yLabel: PropTypes.string,
  xDomain: PropTypes.array,
  yDomain: PropTypes.array,
  pattern: PropTypes.string,
  xPattern: PropTypes.string,
  yPattern: PropTypes.string
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
