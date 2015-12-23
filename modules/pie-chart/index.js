import React from 'react';
import d3 from 'd3';
import ReactFauxDOM from 'react-faux-dom';
import { Style } from 'radium';
import objectAssignDeep from 'object-assign-deep';

const styles = {
  '.arc path': {
    stroke: '#fff'
  },
  '.arc text': {
    font: '10px sans-serif',
    textAnchor: 'middle'
  }
};

export default class PieChart extends React.Component {

  onMouseOver(e) {
    console.log('mouseover', e);
  }

  render() {
    const { outerRadius, innerRadius } = this.props.settings;
    const w = outerRadius * 2;
    const h = outerRadius * 2;

    const arc = d3.svg.arc()
      .outerRadius(outerRadius)
      .innerRadius(innerRadius);

    const labelArc = d3.svg.arc()
      .outerRadius(outerRadius - 40)
      .innerRadius(outerRadius - 40);

    const node = ReactFauxDOM.createElement('svg');

    const svg = d3.select(node)
      .attr('width', w)
      .attr('height', h)
      .append('g')
      .attr('transform', `translate(${ outerRadius }, ${ outerRadius })`);

    const g = svg.selectAll('.arc')
      .data(d3.layout.pie().value((d) => d.value)(this.props.data))
      .enter().append('g')
      .attr('class', 'arc');

    g.append('path')
      .attr('d', arc)
      .on('mouseover', this.onMouseOver.bind(this))
      .style('fill', (d) => d.data.color);

    g.append('text')
      .attr('transform', (d) => `translate(${labelArc.centroid(d)})`)
      .attr('dy', '.35em')
      .text((d) => d.data.label);
    objectAssignDeep(styles, this.props.styles);

    return (
      <div className="pie-chart">
        <Style scopeSelector=".pie-chart" rules={styles}/>
        {node.toReact()}
      </div>
    );
  }
}

PieChart.propTypes = {
  data: React.PropTypes.array.isRequired,
  settings: React.PropTypes.object.isRequired,
  styles: React.PropTypes.object
};
