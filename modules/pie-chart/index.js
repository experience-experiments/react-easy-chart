import React from 'react';
import d3 from 'd3';
import ReactFauxDOM from 'react-faux-dom';

export default class PieChart extends React.Component {

  getValue(d) {
    return d.value;
  }

  getColor(d) {
    return d.data.color;
  }

  onMouseOver(e) {
    console.log('mouseover', e);
  }

  render() {
    let { outerRadius, innerRadius } = this.props.settings;
    let w = outerRadius * 2;
    let h = outerRadius * 2;

    let arc = d3.svg.arc()
      .outerRadius(outerRadius)
      .innerRadius(innerRadius);

    let node = ReactFauxDOM.createElement('svg');
    let svg = d3.select(node)
      .attr('width', w)
      .attr('height', h)
      .append('g')
      .attr('transform', `translate(${ outerRadius }, ${ outerRadius })`);

    let g = svg.selectAll(".arc")
      .data(d3.layout.pie().value(this.getValue.bind(this))(this.props.data))
      .enter().append("g")
      .attr("class", "arc")
      .append("path")
      .attr("d", arc)
      .on('mouseover', this.onMouseOver.bind(this))
      .style("fill", this.getColor.bind(this));


    return node.toReact();
  }
}

PieChart.propTypes = {
  data: React.PropTypes.array.isRequired,
  settings: React.PropTypes.object.isRequired
};