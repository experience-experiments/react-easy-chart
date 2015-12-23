import React from 'react';
import d3 from 'd3';
import ReactFauxDOM from 'react-faux-dom';

export default class PieChart extends React.Component {

  onMouseOver(e) {
    console.log('mouseover', e);
  }

  render() {
    const styles = {
      path: {
        stroke: '#fff'
      }
    };

    const { outerRadius, innerRadius } = this.props.settings;
    const w = outerRadius * 2;
    const h = outerRadius * 2;

    const arc = d3.svg.arc()
      .outerRadius(outerRadius)
      .innerRadius(innerRadius);

    const node = ReactFauxDOM.createElement('svg');
    const svg = d3.select(node)
      .attr('width', w)
      .attr('height', h)
      .append('g')
      .attr('transform', `translate(${ outerRadius }, ${ outerRadius })`)
      .selectAll('.arc')
      .data(d3.layout.pie().value((d) => d.value)(this.props.data))
      .enter().append('g')
      .attr('class', 'arc')
      .append('path')
      .attr('d', arc)
      .on('mouseover', this.onMouseOver.bind(this))
      .style('fill', (d) => d.data.color);

    return (
      <div style={styles}>
        {node.toReact()}
      </div>
    )
  }
}

PieChart.propTypes = {
  data: React.PropTypes.array.isRequired,
  settings: React.PropTypes.object.isRequired
};
