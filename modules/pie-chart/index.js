import React from 'react';
import {
  scale,
  layout,
  svg,
  select,
  event as
  lastEvent,
  interpolate
} from 'd3';
import {
  getRandomId,
  defaultStyle
} from '../shared';
import { createElement } from 'react-faux-dom';
import { Style } from 'radium';
import merge from 'lodash.merge';

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
    this.uid = getRandomId(); // Math.floor(Math.random() * new Date().getTime());
    this.color = scale.category20();
    this.pie = layout.pie()
      .value((d) => d.value)
      .sort(null);
    this.currentPieCharts = [];
    this.currentLabels = [];
  }

  componentDidMount() {
    this.initialise();
  }

  componentDidUpdate() {
    this.transition();
  }

  getArc() {
    const {
      padding
    } = this.props;

    return svg.arc()
      .innerRadius(this.getInnerRadius() - padding)
      .outerRadius(this.getRadius() - padding);
  }

  getLabelArc() {
    const {
      padding
    } = this.props;

    const radius = this.getRadius();

    return svg.arc()
      .outerRadius(radius - padding - ((20 * radius) / 100))
      .innerRadius(radius - padding - ((20 * radius) / 100));
  }

  getInnerRadius() {
    return this.props.innerHoleSize * 0.5;
  }

  getRadius() {
    return this.props.size * 0.5;
  }

  tween(a, index) {
    const currentPieChart = this.currentPieCharts[index];
    const i = interpolate(currentPieChart, a);
    this.currentPieCharts[index] = a;
    return (t) => this.getArc()(i(t));
  }

  createSvgNode({ size }) {
    const node = createElement('svg');
    select(node)
      .attr('width', size)
      .attr('height', size);
    return node;
  }

  createSvgRoot({ node }) {
    return select(node)
      .append('g')
      .attr('transform', 'translate(0, 0)');
  }

  initialiseLabels() {
    const {
      data
    } = this.props;

    const uid = this.uid;

    const text = select(`#labels-${uid}`)
      .selectAll('text')
      .data(this.pie(data))
      .enter()
      .append('text')
      .attr('transform', (d) => `translate(${this.getLabelArc().centroid(d)})`)
      .attr('dy', '.35em')
      .attr('class', 'pie_chart_text')
      .text((d) => d.data.key)
      .each((d) => {
        this.currentLabels.push(d);
      });

    this.text = text;
  }

  initialisePieChart() {
    const {
      data,
      mouseOverHandler,
      mouseOutHandler,
      mouseMoveHandler,
      clickHandler
    } = this.props;

    const uid = this.uid;
    const calculateFill = (d, i) => (
      (d.data.color)
        ? d.data.color
        : this.color(i));

    const path = select(`#pie-${uid}`)
      .selectAll('path')
      .data(this.pie(data))
      .enter()
      .append('path')
      .attr('fill', calculateFill)
      .attr('d', this.getArc())
      .attr('class', 'pie_chart_lines')
      .on('mouseover', (d) => mouseOverHandler(d, lastEvent))
      .on('mouseout', (d) => mouseOutHandler(d, lastEvent))
      .on('mousemove', (d) => mouseMoveHandler(d, lastEvent))
      .on('click', (d) => clickHandler(d, lastEvent))
      .each((d) => {
        this.currentPieCharts.push(d);
      });

    this.path = path;
  }

  initialise() {
    const {
      labels
    } = this.props;

    this.initialisePieChart();

    if (labels) {
      this.initialiseLabels();
    }
  }

  transitionPieChart() {
    const {
      data
    } = this.props;

    this.path
      .data(this.pie(data))
      .transition()
      .duration(750)
      .attrTween('d', this.tween.bind(this));
  }

  transitionLabels() {
    const {
      data
    } = this.props;

    this.text
      .data(this.pie(data))
      .transition()
      .duration(750)
      .attr('transform', (d) => `translate(${this.getLabelArc().centroid(d)})`);
  }

  transition() {
    const {
      labels
    } = this.props;

    this.transitionPieChart();

    if (labels) {
      if (this.text) {
        this.transitionLabels();
      } else {
        this.initialiseLabels();
      }
    } else {
      if (this.text) {
        delete this.text;
      }
    }
  }

  createPieChart({ node, root }) {
    const {
      size
    } = this.props;

    const uid = this.uid;
    const radius = this.getRadius();

    select(node)
      .attr('width', size)
      .attr('height', size);

    root
      .append('g')
      .attr('id', `pie-${uid}`)
      .attr('transform', `translate(${radius}, ${radius})`);
  }

  createLabels({ node, root }) {
    const {
      size
    } = this.props;

    const uid = this.uid;
    const radius = this.getRadius();

    select(node)
      .attr('width', size)
      .attr('height', size);

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
    const rules = merge({}, defaultStyle, styles);

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

    this.createPieChart(p);

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
