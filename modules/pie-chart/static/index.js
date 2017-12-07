import React, { PureComponent } from 'react';
import {
  scaleOrdinal,
  schemeCategory20,
  range,
  pie as layout,
  arc,
  select,
  event as lastEvent
} from 'd3';
import {
  createUniqueID,
  defaultStyles
} from '../../shared';
import ReactFauxDOM from 'react-faux-dom';
import PropTypes from 'prop-types';
import { Style } from 'radium';
import merge from 'lodash.merge';

const color = scaleOrdinal(schemeCategory20).domain(range(0, 20));
const pie = layout()
  .value((d) => d.value)
  .sort(null);

const getSliceFill = (d, i) => (
  (d.data.color)
    ? d.data.color
    : color(i));

const getLabelText = (d) => d.data.key;

export default class PieChart extends PureComponent {
  static get propTypes() {
    return {
      data: PropTypes.array.isRequired,
      innerHoleSize: PropTypes.number,
      size: PropTypes.number,
      padding: PropTypes.number,
      labels: PropTypes.bool,
      styles: PropTypes.object,
      mouseOverHandler: PropTypes.func,
      mouseOutHandler: PropTypes.func,
      mouseMoveHandler: PropTypes.func,
      clickHandler: PropTypes.func
    };
  }

  static get defaultProps() {
    return {
      size: 400,
      innerHoleSize: 0,
      padding: 2,
      labels: false,
      styles: {},
      mouseOverHandler: () => {},
      mouseOutHandler: () => {},
      mouseMoveHandler: () => {},
      clickHandler: () => {}
    };
  }

  constructor(props) {
    super(props);
    this.uid = createUniqueID(props);
  }

  getSliceArc() {
    const {
      padding
    } = this.props;

    const innerRadius = this.getInnerRadius();
    const outerRadius = this.getOuterRadius();

    return arc()
      .innerRadius(innerRadius - padding)
      .outerRadius(outerRadius - padding);
  }

  getLabelArc() {
    const {
      padding
    } = this.props;

    const outerRadius = this.getOuterRadius();
    const radius = outerRadius - padding - ((20 * outerRadius) / 100);

    return arc()
      .outerRadius(radius)
      .innerRadius(radius);
  }

  getOuterRadius() {
    return this.props.size * 0.5;
  }

  getInnerRadius() {
    return this.props.innerHoleSize * 0.5;
  }

  createSvgNode({ size }) {
    const node = new ReactFauxDOM.Element('svg');
    node.setAttribute('width', size);
    node.setAttribute('height', size);
    return node;
  }

  createSvgRoot({ node }) {
    return select(node);
  }

  createSlices({ root }) {
    const {
      data,
      mouseOverHandler,
      mouseOutHandler,
      mouseMoveHandler,
      clickHandler
    } = this.props;

    const radius = this.getOuterRadius();

    const mouseover = (d) => mouseOverHandler(d, lastEvent);
    const mouseout = (d) => mouseOutHandler(d, lastEvent);
    const mousemove = (d) => mouseMoveHandler(d, lastEvent);
    const click = (d) => clickHandler(d, lastEvent);

    const path = root
      .append('g')
      .attr('transform', `translate(${radius}, ${radius})`)
      .datum(data)
      .selectAll('path')
      .data(pie);

    path
      .enter()
      .append('path')
      .attr('class', 'pie-chart-slice')
      .attr('fill', getSliceFill)
      .attr('d', this.getSliceArc())
      .on('mouseover', mouseover)
      .on('mouseout', mouseout)
      .on('mousemove', mousemove)
      .on('click', click);
  }

  createLabels({ root }) {
    const {
      data
    } = this.props;

    const radius = this.getOuterRadius();

    const getLabelArcTransform = (d) => {
      const [labelX, labelY] = this.getLabelArc().centroid(d);
      return `translate(${labelX}, ${labelY})`;
    };

    const text = root
      .append('g')
      .attr('transform', `translate(${radius}, ${radius})`)
      .datum(data)
      .selectAll('text')
      .data(pie);
    text
      .enter()
      .append('text')
      .attr('class', 'pie-chart-label')
      .attr('dy', '.35em')
      .attr('transform', getLabelArcTransform)
      .text(getLabelText);
  }

  createStyle() {
    const {
      styles
    } = this.props;

    const uid = this.uid;
    const scope = `.pie-chart-${uid}`;
    const rules = merge({}, defaultStyles, styles);

    return (
      <Style
        scopeSelector={scope}
        rules={rules}
      />
    );
  }

  calculateChartParameters() {
    const {
      size
    } = this.props;

    const node = this.createSvgNode({ size });
    const root = this.createSvgRoot({ node });

    return {
      node,
      root
    };
  }

  render() {
    const {
      labels
    } = this.props;

    const p = this.calculateChartParameters();

    this.createSlices(p);

    if (labels) {
      this.createLabels(p);
    }

    const uid = this.uid;
    const className = `pie-chart-${uid}`;
    const {
      node
    } = p;

    return (
      <div className={className}>
        {this.createStyle()}
        {node.toReact()}
      </div>
    );
  }
}
