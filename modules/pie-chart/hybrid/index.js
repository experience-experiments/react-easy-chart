import React, { PureComponent } from 'react';
import {
  scaleOrdinal,
  schemeCategory20,
  range,
  pie as layout,
  arc,
  select,
  event as lastEvent,
  interpolate
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
    this.currentSlices = [];
    this.currentLabels = [];
    this.tweenSlice = (slice, index) => {
      const currentSlice = this.currentSlices[index];
      const i = interpolate(currentSlice, slice);
      this.currentSlices[index] = slice;
      return (t) => this.getSliceArc()(i(t));
    };
  }

  componentDidMount() {
    this.initialise();
  }

  componentDidUpdate() {
    this.transition();
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

  getSlices() {
    const {
      data
    } = this.props;

    const uid = this.uid;

    return select(`#slices-${uid}`)
      .datum(data)
      .selectAll('path');
  }

  getLabels() {
    const {
      data
    } = this.props;

    const uid = this.uid;

    return select(`#labels-${uid}`)
      .datum(data)
      .selectAll('text');
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

  initialiseLabels() {
    const text = this.getLabels()
      .data(pie);

    const getLabelArcTransform = (d) => {
      const [labelX, labelY] = this.getLabelArc().centroid(d);
      return `translate(${labelX}, ${labelY})`;
    };

    const currentLabels = this.currentLabels;

    text
      .enter()
      .append('text')
      .attr('dy', '.35em')
      .attr('class', 'pie-chart-label')
      .attr('transform', getLabelArcTransform)
      .text(getLabelText)
      .each((d) => currentLabels.push(d));
  }

  initialiseSlices() {
    const {
      mouseOverHandler,
      mouseOutHandler,
      mouseMoveHandler,
      clickHandler
    } = this.props;

    const mouseover = (d) => mouseOverHandler(d, lastEvent);
    const mouseout = (d) => mouseOutHandler(d, lastEvent);
    const mousemove = (d) => mouseMoveHandler(d, lastEvent);
    const click = (d) => clickHandler(d, lastEvent);

    const currentSlices = this.currentSlices;

    const path = this.getSlices()
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
      .on('click', click)
      .each((d) => currentSlices.push(d));
  }

  initialise() {
    const {
      labels
    } = this.props;

    this.initialiseSlices();

    if (labels) {
      this.initialiseLabels();
    }
  }

  transitionSlices() {
    const {
      data,
      mouseOverHandler,
      mouseOutHandler,
      mouseMoveHandler,
      clickHandler
    } = this.props;

    const mouseover = (d) => mouseOverHandler(d, lastEvent);
    const mouseout = (d) => mouseOutHandler(d, lastEvent);
    const mousemove = (d) => mouseMoveHandler(d, lastEvent);
    const click = (d) => clickHandler(d, lastEvent);

    const n = data.length;
    const currentSlices = this.currentSlices;

    const path = this.getSlices()
      .data(pie);

    if (n) { // we don't need to do this, but it's fun
      /*
       * Change current slices
       * Transition current slice dimensions
       */
      path
        .attr('fill', getSliceFill)
        .on('mouseover', mouseover)
        .on('mouseout', mouseout)
        .on('mousemove', mousemove)
        .on('click', click)
        .transition()
        .duration(750)
        .attrTween('d', this.tweenSlice);

      /*
       * Add new slices
       */
      path
        .enter()
        .append('path')
        .attr('class', 'pie-chart-slice')
        .attr('fill', getSliceFill)
        .on('mouseover', mouseover)
        .on('mouseout', mouseout)
        .on('mousemove', mousemove)
        .on('click', click)
        .each((d, i) => currentSlices.splice(i, 1, d))
        .transition()
        .duration(750)
        .attrTween('d', this.tweenSlice);
    }

    /*
     * Remove old slices
     */
    path
      .exit()
      .remove();

    currentSlices.length = n; // = this.currentSlices.slice(0, n)
  }

  transitionLabels() {
    const {
      data
    } = this.props;

    const getLabelArcTransform = (d) => {
      const [labelX, labelY] = this.getLabelArc().centroid(d);
      return `translate(${labelX}, ${labelY})`;
    };

    const n = data.length;
    const currentLabels = this.currentLabels;
    const text = this.getLabels()
      .data(pie);

    if (n) { // we don't need to do this, but it's fun
      /*
       * Change current labels
       */
      text
        .transition()
        .duration(750)
        .attr('transform', getLabelArcTransform)
        .text(getLabelText);

      /*
       * Add new labels
       */
      text
        .enter()
        .append('text')
        .attr('dy', '.35em')
        .attr('class', 'pie-chart-label')
        .attr('transform', getLabelArcTransform)
        .text(getLabelText)
        .each((d, i) => currentLabels.splice(i, 1, d))
        .transition()
        .duration(750);
    }

    /*
     * Remove old labels
     */
    text
      .exit()
      .remove();

    currentLabels.length = n;
  }

  transition() {
    const {
      labels
    } = this.props;

    this.transitionSlices();

    if (labels) {
      this.transitionLabels();
    }
  }

  createSlices({ root }) {
    const uid = this.uid;
    const radius = this.getOuterRadius();

    root
      .append('g')
      .attr('id', `slices-${uid}`)
      .attr('transform', `translate(${radius}, ${radius})`);
  }

  createLabels({ root }) {
    const uid = this.uid;
    const radius = this.getOuterRadius();

    root
      .append('g')
      .attr('id', `labels-${uid}`)
      .attr('transform', `translate(${radius}, ${radius})`);
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
