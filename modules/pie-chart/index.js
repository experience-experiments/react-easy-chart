import React from 'react';
import { scale, layout, svg, select, event as d3LastEvent, interpolate } from 'd3';
import {defaultStyle} from '../shared';
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
    this.uid = Math.floor(Math.random() * new Date().getTime());
    this.color = scale.category20();
    this.pie = layout.pie()
      .value((d) => d.value)
      .sort(null);
    this.current = [];
    this.currentTxt = [];
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

  getRadius() {
    return this.props.size * 0.5;
  }

  getInnerRadius() {
    return this.props.innerHoleSize * 0.5;
  }

  initialiseLabels() {
    const {
      data
    } = this.props;

    const uid = this.uid;

    const text = select(`#labels_${uid}`)
      .selectAll('text')
      .data(this.pie(data))
      .enter()
      .append('text')
      .attr('transform', (d) => `translate(${this.getLabelArc().centroid(d)})`)
      .attr('dy', '.35em')
      .attr('class', 'pie_chart_text')
      .text((d) => d.data.key)
      .each((d) => {
        this.currentTxt.push(d);
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

    const path = select(`#pie_${uid}`)
      .selectAll('path')
      .data(this.pie(data))
      .enter()
      .append('path')
      .attr('fill', (d, i) => d.data.color ? d.data.color : this.color(i))
      .attr('d', this.getArc())
      .attr('class', 'pie_chart_lines')
      .on('mouseover', (d) => mouseOverHandler(d, d3LastEvent))
      .on('mouseout', (d) => mouseOutHandler(d, d3LastEvent))
      .on('mousemove', () => mouseMoveHandler(d3LastEvent))
      .on('click', (d) => clickHandler(d, d3LastEvent))
      .each((d) => {
        this.current.push(d);
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

  tween(a, index) {
    const cur = this.current[index];
    const i = interpolate(cur, a);
    this.current[index] = a;
    return (t) => this.getArc()(i(t));
  }

  createPieChart(node) {
    const {
      size
    } = this.props;

    const uid = this.uid;
    const radius = this.getRadius();

    select(node)
      .attr('width', size)
      .attr('height', size)
      .append('g')
      .attr('id', `pie_${uid}`)
      .attr('transform', `translate(${radius}, ${radius})`);
  }

  createLabels(node) {
    const {
      size
    } = this.props;

    const uid = this.uid;
    const radius = this.getRadius();

    select(node)
      .attr('width', size)
      .attr('height', size)
      .append('g')
      .attr('id', `labels_${uid}`)
      .attr('transform', `translate(${radius}, ${radius})`);
  }

  createStyle() {
    const uid = this.uid;
    const {
      styles
    } = this.props;
    const rules = merge({}, defaultStyle, styles);

    return (
      <Style
        scopeSelector={`.pie_chart${uid}`}
        rules={rules}
      />
    );
  }

  render() {
    const {
      labels
    } = this.props;

    const node = createElement('svg');

    this.createPieChart(node);

    if (labels) {
      this.createLabels(node);
    }

    const uid = this.uid;

    return (
      <div className={`pie_chart${uid}`}>
        {this.createStyle()}
        {node.toReact()}
      </div>
    );
  }
}
