import React from 'react';
import {
  scale,
  layout,
  svg,
  select,
  event as lastEvent
} from 'd3';
import {
  createUniqueID,
  defaultStyles
} from '../../shared';
import { createElement } from 'react-faux-dom';
import { Style } from 'radium';
import merge from 'lodash.merge';

const color = scale.category20();
const pie = layout.pie()
  .value((d) => d.value)
  .sort(null);

const getSliceFill = (d, i) => (
  (d.data.color)
    ? d.data.color
    : color(i));

const getLabelText = (d) => d.data.key;

export default class PieChart extends React.Component {
  static get propTypes() {
    return {
      data: React.PropTypes.array.isRequired,
      innerHoleSize: React.PropTypes.number,
      size: React.PropTypes.number,
      padding: React.PropTypes.number,
      labels: React.PropTypes.bool,
      styles: React.PropTypes.object,
      mouseOverHandler: React.PropTypes.func,
      mouseOutHandler: React.PropTypes.func,
      mouseMoveHandler: React.PropTypes.func,
      clickHandler: React.PropTypes.func
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

    return svg.arc()
      .innerRadius(innerRadius - padding)
      .outerRadius(outerRadius - padding);
  }

  getLabelArc() {
    const {
      padding
    } = this.props;

    const outerRadius = this.getOuterRadius();
    const radius = outerRadius - padding - ((20 * outerRadius) / 100);

    return svg.arc()
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
    const node = createElement('svg');
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
