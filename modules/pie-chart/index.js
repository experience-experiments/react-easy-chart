import React from 'react';
import d3 from 'd3';

export default class PieChart extends React.Component {

  componentDidMount() {
    this.getPie();
  }

  getPie() {
    let {outerRadius, innerRadius } = this.props.settings;
    let svg = d3.select('g');
    let arc = d3.svg.arc()
      .outerRadius(outerRadius)
      .innerRadius(innerRadius);
    let g = svg.selectAll(".arc")
      .data(d3.layout.pie().value(this.getValue.bind(this))(this.props.data))
      .enter().append("g")
      .attr("class", "arc");
    g.append("path")
      .attr("d", arc)
      .style("fill", this.getColor.bind(this));
  }

  getValue(d) {
    return d.value;
  }

  getColor(d) {
    return d.data.color;
  }



  render() {
    let { outerRadius } = this.props.settings;
    let w = outerRadius * 2;
    let h = outerRadius * 2;
    return (
      <div>
        <h1>Pie Chart</h1>
        <svg className="chart" width={w} height={h}>
          <g transform={ `translate(${ outerRadius }, ${ outerRadius })` }></g>
        </svg>
      </div>
    )
  }
}

PieChart.propTypes = {
  data: React.PropTypes.array.isRequired,
  settings: React.PropTypes.object.isRequired
};
